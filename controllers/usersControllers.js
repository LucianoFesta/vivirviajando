const { validationResult } = require('express-validator');
const db = require('../database/models');
const fetch = require('node-fetch');
const bcryptjs = require('bcryptjs');
const mailgun = require("mailgun-js");
const jwt = require('jsonwebtoken');


let usersControllers = {

    /****************************************************/
    /****************REGISTRO DE USUARIOS****************/
    /****************************************************/

    /**********************GET***************************/

    register: async (req,res) => {

        try {
            const genres = await db.generos.findAll({raw:true});
            const provinces = await fetch('https://apis.datos.gob.ar/georef/api/provincias')
                                        .then(response => response.json())
                                        .then(data => {
                                            const provincesList = []
                                            data.provincias.forEach(province => {
                                                provincesList.push(province)
                                            })
                                            return provincesList;
                                        })
                                        .catch(error => console.log(error));
            //En JS de front esta el fetch para elegir ciudades de acuerdo a la provincia elegida.          
            
            res.render('register', {
                title: 'Registro',
                genres,
                provinces,
                user: req.session.loggedUser
            })

        } catch (error) {
            console.log(error);
        }

    },

    /**********************POST**************************/

    processRegister: async (req,res) => {
        try {
            const validationsResult = validationResult(req);
            const genres = await db.generos.findAll({raw:true});
            const provinces = await fetch('https://apis.datos.gob.ar/georef/api/provincias')
                                        .then(response => response.json())
                                        .then(data => {
                                            const provincesList = []
                                            data.provincias.forEach(province => {
                                                provincesList.push(province)
                                            })
                                            return provincesList;
                                        })
                                        .catch(error => console.log(error));
    
            if(validationsResult.errors.length > 0){
                res.render('register', {
                    title: 'Registro',
                    errors: validationsResult.mapped(),
                    oldData: req.body,
                    genres,
                    provinces,
                    user: req.session.loggedUser
                })

            }else{

                let newUser = {
                    nombre: req.body.name,
                    apellido: req.body.lastName,
                    id_tipoUsuario: 2,
                    nacimiento: req.body.yearsOld,
                    documento: req.body.document,
                    domicilio: req.body.address,
                    id_genero: req.body.genre,
                    provincia: req.body.state,
                    ciudad: req.body.city,
                    fotoPerfil: '/images/users/' + req.file.filename,
                    password: bcryptjs.hashSync(req.body.password, 10),
                    confirmarPassword: bcryptjs.hashSync(req.body.passwordConfirm, 10),
                    email: req.body.email,
                    condiciones: req.body.terminos
                };

                let emailConfirm = await db.usuarios.findOne({where: {email: req.body.email}, raw:true});
                
                if(emailConfirm){
                    res.render('register', {
                        title: 'Registro',
                        errors: {
                            email: {
                                msg: 'Este mail ya se encuentra registrado'
                            }
                        },
                        oldData: req.body,
                        genres,
                        provinces,
                        user: req.session.loggedUser
                    })
                }else{

                    const passwordConfirm = bcryptjs.compareSync(req.body.passwordConfirm, newUser.password)

                    if(!passwordConfirm){
                        res.render('register', {
                            title: 'Registro',
                            errors: {
                                passwordConfirm: {
                                    msg: 'La contraseña debe coincidir'
                                }
                            },
                            oldData: req.body,
                            genres,
                            provinces,
                            user: req.session.loggedUser
                        })
                    }else{

                        //Dominio de MAILGUN
                        const DOMAIN = process.env.DOMAIN_MAILGUN;

                        //APIKEY creada en el entorno de desarrollo (.env)
                        const mg = mailgun({apiKey: process.env.MAILGUN_APIKEY, domain: DOMAIN});

                        //Creo un token en base a los datos del usuario a crear. En este caso, quiero guardar todos los datos del req.body, pero podria solo guardar algunos.
                        const token = jwt.sign({newUser}, process.env.JWT_ACC_ACTIVATE, {expiresIn: '20m'});

                        //Configuración del Envío de mail
                        const data = {
                            from: 'noreply@vivirviajando.com',
                            to: newUser.email,
                            subject: 'Link de Verificación para Registro',
                            html:`
                                <html>
                                    <body>
                                        <h3>Por favor, hacé click en el siguiente link para activar tu cuenta</h3>
                                        <p>Al hacer click, serás redirigido a la sección para que puedas loguearte y asi confirmar que ya eres miembro de VivirViajando!</p>
                                        <a href="http://localhost:3000/users/register/verification/${token}">Verificar mi Correo electrónico</a>
                                    </body>
                                </html>
                            `
                        };
                        mg.messages().send(data, function (error, body) {
                            if(error){
                                console.log(error) 
                            }
                            console.log({message: 'El mail ha sido enviado correctamente'})
                        });
        
                        res.redirect('/')
                    }
                }
            }
            
        } catch (error) {
            console.log(error);
            
        }
    },

    accountVerification: async (req,res) => {
        try {
            const token = req.params.token;
            
            if(token){
                jwt.verify(token, process.env.JWT_ACC_ACTIVATE, async function(err, decodedToken){
                    if(err){
                        console.log('Token incorrecto o ha expirado')
                    }else{
                        const {newUser} = decodedToken;
                        console.log(newUser)
                        await db.usuarios.create(newUser);

                        const DOMAIN = process.env.DOMAIN_MAILGUN;
                        const mg = mailgun({apiKey: process.env.MAILGUN_APIKEY, domain: DOMAIN});
                        const data = {
                            from: 'noreply@vivirviajando.com',
                            to: newUser.email,
                            subject: 'Cuenta Confirmada',
                            html:`
                                <html>
                                    <body>
                                        <h2>Cuenta confirmada correctamente</h2>
                                        <p>Gracias por unirte a nuestra a la comunidad de Vivir Viajando.</p>
                                        <p>A disfrutar!!!</p>
                                    </body>
                                </html>
                            `
                        };
                        mg.messages().send(data, function (error, body) {
                            if(error){
                                console.log(error) 
                            }
                            console.log({message: 'El mail ha sido enviado correctamente'})
                        });
    
                        res.redirect('/users/login')
                    }
                })
            }
            
        } catch (error) {
            console.log(error);
        }

    },

    /****************************************************/
    /******************LOGIN DE USUARIOS*****************/
    /****************************************************/

    /**********************GET***************************/

    login: (req,res) => {

        res.render('login', {
            title: 'Ingresar',
            user: req.session.loggedUser
        })
    },

    /**********************POST**************************/

    processLogin: async (req,res) => {
        try {
            const validationsResult = validationResult(req);
    
            if(validationsResult.errors.length > 0){
                res.render('login', {
                    title: 'Ingresá',
                    errors: validationsResult.mapped()
                })
            }else{
                const loggedUser = await db.usuarios.findOne({
                    where: {email: req.body.email},
                    raw: true,
                    include: [{association: 'generos'}]
                });


                if(!loggedUser){
                    res.render('login', {
                        title: 'Ingresá',
                        errors: {
                            email: {
                                msg: 'El mail ingresado no se encuentra registrado'
                            }
                        },
                        oldData: req.body,
                        user: req.session.loggedUser
                    })
                }
                else{
                    const passwordCheck = bcryptjs.compareSync(req.body.password, loggedUser.password);

                    if(!passwordCheck){
                        res.render('login', {
                            title: 'Ingresá',
                            errors: {
                                password: {
                                    msg: 'La contraseña ingresada es incorrecta'
                                }
                            },
                            oldData: req.body,
                            user: req.session.loggedUser
                        })
                    }else{
                        delete loggedUser.password && delete loggedUser.confirmarPassword;
                        loggedUser.categoriaNombre = loggedUser['generos.nombre'];
                        req.session.loggedUser = loggedUser;

                        if(req.body.remindMe != undefined){
                            res.cookie('remindMe', req.session.loggedUser, {
                                maxAge: 1000 * 60 * 60 * 24
                            });
                        }

                        res.redirect(`/users/profile`)
                    }
                }
            }
   
        } catch (error) {
            console.log(error);

        }
    },

    /****************************************************/
    /*****************PERFIL DE USUARIO******************/
    /****************************************************/

    /**********************GET***************************/

    profile: async (req,res) => {
        try {        
            res.render('profile', {
                title: 'Hola ' + req.session.loggedUser.nombre,
                user: req.session.loggedUser

            })
        } catch (error) {
            console.log(error);

        }
    },

    profileViewAdmin: (req, res) => {
        res.send('estas en la vista de edicion del perfil de un usuario')
    },

    /****************************************************/
    /*******************EDITAR USUARIO******************/
    /****************************************************/

    /**********************GET***************************/

    userEdit: async (req,res) => {

        try {
            const userID = req.params.id;
            const userEdit = await db.usuarios.findByPk(userID, {
                raw:true,
                include: [{association: 'generos'}, {association: 'tipoUsuario'}]
            });

            userEdit.nombreGenero = userEdit['generos.nombre'];
            userEdit.tipoUsuario = userEdit['tipoUsuario.id'];
            userEdit.nombreTipoUsuario = userEdit['tipoUsuario.nombre'];
            delete userEdit.confirmarPassword && delete userEdit.password;

            const genres = await db.generos.findAll({raw:true});
            const userType = await db.tipoUsuario.findAll({raw:true});
            const provinces = await fetch('https://apis.datos.gob.ar/georef/api/provincias')
                                        .then(response => response.json())
                                        .then(data => {
                                            const provincesList = []
                                            data.provincias.forEach(province => {
                                                provincesList.push(province)
                                            })
                                            return provincesList;
                                        })       
            
            res.render('userEdit', {
                title: 'Editar Perfil',
                user: userEdit,
                genres,
                userType,
                provinces
            })

        } catch (error) {
            console.log(error);
        }
    },

    /**********************POST**************************/
    /* El mail se puede editar sin verificacion del mismo, ya que mailgun solo permite un subdominio para pruebas */

    processEdit: async (req,res) => {
        try {
            const validationsResult = validationResult(req);
            const userID = req.params.id;
            const userEdit = await db.usuarios.findByPk(userID, {
                raw:true,
                include: [{association: 'generos'}]
            });

            userEdit.nombreGenero = userEdit['generos.nombre'];
            delete userEdit.confirmarPassword && delete userEdit.password;

            const genres = await db.generos.findAll({raw:true});
            const provinces = await fetch('https://apis.datos.gob.ar/georef/api/provincias')
                                        .then(response => response.json())
                                        .then(data => {
                                            const provincesList = []
                                            data.provincias.forEach(province => {
                                                provincesList.push(province)
                                            })
                                            return provincesList;
                                        })       
    
            if(validationsResult.errors.length > 0){
                res.render('userEdit', {
                    title: 'Editar Perfil',
                    errors: validationsResult.mapped(),
                    provinces,
                    genres,
                    user: userEdit

                })
            }else{

                let profilePhoto;
                if(req.file == undefined){
                    profilePhoto = userEdit.fotoPerfil;
                }else{
                    profilePhoto = '/images/users/' + req.file.filename;
                }

                await db.usuarios.update({
                    nombre: req.body.name,
                    apellido: req.body.lastName,
                    id_tipoUsuario: 2,
                    nacimiento: req.body.yearsOld,
                    documento: req.body.document,
                    domicilio: req.body.address,
                    id_genero: req.body.genre,
                    provincia: req.body.state,
                    ciudad: req.body.city,
                    fotoPerfil: profilePhoto,
                    password: userEdit.password,
                    confirmarPassword: userEdit.confirmarPassword,
                    email: req.body.email,
                    condiciones: req.body.terminos
                },
                { 
                    where: {id: userID}
                })

                const editedUser = await db.usuarios.findByPk(userID, {
                    raw:true,
                    include: [{association: 'generos'}]
                })

                editedUser.nombreGenero = editedUser['generos.nombre'];
                delete editedUser.confirmarPassword && delete editedUser.password;

                req.session.loggedUser = editedUser;
                
                res.redirect('/users/profile')
            }
            
        } catch (error) {
            console.log(error);
        }
    },

    /****************************************************/
    /********************LOGOUT USUARIO******************/
    /****************************************************/

    logout: (req,res) => {

        req.session.destroy();
        res.clearCookie('remindMe');
        res.redirect('/users/login');
    },

    /****************************************************/
    /**************EDITAR PASSWORD USUARIO***************/
    /****************************************************/

    /**********************GET***************************/

    editPassword: async (req,res) => {
        try {
            const userId = req.params.id;
            const userEdit = await db.usuarios.findByPk(userId, {raw:true});

            delete userEdit.password && delete userEdit.confirmarPassword;

            res.render('editPassword', {
                title: 'Editar Contraseña',
                user: userEdit
            })
            
        } catch (error) {
            console.log(error);
        }
    },

    /**********************POST**************************/

    processEditPassword: async (req,res) => {
        try {
            const userId = req.params.id;
            const userEdit = await db.usuarios.findByPk(userId, {raw:true});
            const validationsResult = validationResult(req);
    
            if(validationsResult.errors.length > 0){
                res.render('editPassword', {
                    title: 'Editar Contraseña',
                    errors: validationsResult.mapped(),
                    user: userEdit

                })
            }else{
                const oldPassword = bcryptjs.compareSync(req.body.password, userEdit.password);

                if(!oldPassword){
                    res.render('editPassword', {
                        title: 'Editar Contraseña',
                        errors: {
                            password: {
                                msg: 'La contraseña debe coincidir con la actual'
                            }
                        },
                        user: userEdit
    
                    })
                }else{
                    const newPassword = bcryptjs.compareSync(req.body.passwordNew, userEdit.password);

                    if(newPassword){
                        res.render('editPassword', {
                            title: 'Editar Contraseña',
                            errors: {
                                passwordNew: {
                                    msg: 'La contraseña nueva debe ser distinta a la anterior'
                                }
                            },
                            user: userEdit
        
                        })
                    }else{
                        if(req.body.passwordNew !== req.body.passwordNewConfirm){
                            res.render('editPassword', {
                                title: 'Editar Contraseña',
                                errors: {
                                    passwordNewConfirm: {
                                        msg: 'La contraseña debe coincidir con la nueva'
                                    }
                                },
                                user: userEdit
            
                            })
                        }else{
                            const newUser = {
                                nombre: userEdit.nombre,
                                apellido: userEdit.apellido,
                                id_tipoUsuario: userEdit.id_tipoUsuario,
                                nacimiento: userEdit.nacimiento,
                                documento: userEdit.documento,
                                domicilio: userEdit.domicilio,
                                id_genero: userEdit.id_genero,
                                provincia: userEdit.provincia,
                                ciudad: userEdit.ciudad,
                                fotoPerfil: userEdit.fotoPerfil,
                                password: bcryptjs.hashSync(req.body.passwordNew, 10),
                                confirmarPassword: bcryptjs.hashSync(req.body.passwordNewConfirm, 10),
                                email: userEdit.email,
                                condiciones: userEdit.condiciones,
                            }

                            await db.usuarios.update(newUser, {where: {id: userId}});

                            res.redirect('/users/profile/logout');
                        }
                    }
                }
            }
            
        } catch (error) {
            console.log(error);
        }

    },

    /****************************************************/
    /*****************ELIMINAR USUARIO*******************/
    /****************************************************/

    deleteUser: async (req,res) => {
        try {
            const userID = req.params.id;
            await db.usuarios.destroy({
                where: {id: userID}
            });

            await req.session.destroy();

            res.redirect('/');

        } catch (error) {
            console.log(error);
        }
    },

    cart: (req,res) => {
        res.render('cart', {
            title: 'Carrito',
            user: req.session.loggedUser
        })
    },

}

module.exports = usersControllers;