const { validationResult } = require('express-validator');
const db = require('../database/models');
const { Op, or } = require('sequelize');
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
                                        .catch(error => res.redirect('/error404'));
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
                                        .catch(error => res.redirect('/error404'));
    
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
                    errors: validationsResult.mapped(),
                    user: req.session.loggedUser
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

            const shoppings = await db.compras.findAll({
                raw: true,
                where: {id_usuario: req.session.loggedUser.id},
                include: [{association: 'itemsCompra'}]
            });

            shoppings.forEach(shopping => {
                shopping.itemNombre = shopping['itemsCompra.nombre'];
                shopping.itemServicio = shopping['itemsCompra.servicio'];
                shopping.itemPrecio = shopping['itemsCompra.precio'];
                shopping.itemCantidad = shopping['itemsCompra.cantidad'];
            })

            res.render('profile', {
                title: 'Hola ' + req.session.loggedUser.nombre,
                user: req.session.loggedUser,
                shoppings: shoppings

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
                                        .catch(error => res.redirect('/error404'))    
            
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
                                        .catch(error => res.redirect('/error404'))   
    
            if(validationsResult.errors.length > 0){
                res.render('userEdit', {
                    title: 'Editar Perfil',
                    errors: validationsResult.mapped(),
                    provinces,
                    genres,
                    userType,
                    user: userEdit

                })
            }else{

                console.log(userEdit);

                let profilePhoto;
                if(req.file == undefined){
                    profilePhoto = userEdit.fotoPerfil;
                }else{
                    profilePhoto = '/images/users/' + req.file.filename;
                }

                if(userEdit.id_tipoUsuario === 1){
                    await db.usuarios.update({
                        nombre: req.body.name,
                        apellido: req.body.lastName,
                        id_tipoUsuario: req.body.userType,
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
                }else{
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
                }
                console.log(req.body)


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

    /****************************************************/
    /***************RECUPERAR PASSWORD*******************/
    /****************************************************/

    /****************FORMULARIO EMAIL********************/

    /**********************GET***************************/

    forgotPassword: (req,res) => {
        res.render('forgotPassword', {
            title: 'Recuperar Contraseña',
            user: req.session.loggedUser
        })
    },
    
    /**********************POST**************************/

    processForgotPassword: async (req, res) =>{
        try {
            const email = req.body.email;
            const validationsResult = validationResult(req);

            if(validationsResult.errors.length > 0){
                res.render('forgotPassword', {
                    title: 'Recuperar Contraseña',
                    user: req.session.loggedUser,
                    oldData: req.body,
                    errors: validationsResult.mapped()
                })

            }else{
                const user = await db.usuarios.findOne({
                    raw: true,
                    where: {email: email}
                })

                if(!user){
                    res.render('forgotPassword', {
                        title: 'Recuperar Contraseña',
                        user: req.session.loggedUser,
                        oldData: req.body,
                        errors: {
                            email: {
                                msg: 'Este mail no se encuentra registrado.'
                            }
                        }
                    })

                }else{

                    const DOMAIN = process.env.DOMAIN_MAILGUN;
                    const mg = mailgun({apiKey: process.env.MAILGUN_APIKEY, domain: DOMAIN});
                    const token = jwt.sign({user}, process.env.JWT_FORGOT_PASSWORD, {expiresIn: '20m'});

                    const data = {
                        from: 'noreply@vivirviajando.com',
                        to: user.email,
                        subject: 'Recuperar Contraseña',
                        html:`
                        <html>
                        <body>
                        <h3>Por favor, hacé click en el siguiente link para recuperar tu contraseña</h3>
                        <p>Al hacer click, serás redirigido al formulario de creación de contraseña para que puedas seguir disfrutando de VivirViajando!</p>
                        <a href="http://localhost:3000/users/forgotPassword/${token}">Recuperar Contraseña</a>
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
            }


        } catch (error) {
            console.log(error);
        }
    },

    /*********FORMULARIO NUEVA CONTRASEÑA****************/
    /**********************GET***************************/

    newPasswordForget: (req,res) => {
        const token = req.params.token;

        res.render('editForgotPassword', {
            title: 'Nueva Contraseña',
            token,
            user: req.session.loggedUser
        })
    },

    /**********************POST**************************/

    processNewPasswordForget: async (req,res) => {
        const token = req.params.token;
        const validationsResult = validationResult(req);
                
        if(validationsResult.errors.length > 0){

            res.render('editForgotPassword', {
                title: 'Nueva Contraseña',
                errors: validationsResult.mapped(),
                token,
                user: req.session.loggedUser
            })
        }else{
            if(token){
                jwt.verify(token, process.env.JWT_FORGOT_PASSWORD, async function(err,decodedToken){
                    if(err){
                        console.log('Token inexistente o expirado')
                    }else{
                        const {user} = decodedToken;
    
                        const newUser = {
                            nombre: user.nombre,
                            apellido: user.apellido,
                            id_tipoUsuario: user.id_tipoUsuario,
                            nacimiento: user.nacimiento,
                            documento: user.documento,
                            domicilio: user.domicilio,
                            id_genero: user.id_genero,
                            provincia: user.provincia,
                            ciudad: user.ciudad,
                            fotoPerfil: user.fotoPerfil,
                            password: bcryptjs.hashSync(req.body.passwordNew, 10),
                            confirmarPassword: bcryptjs.hashSync(req.body.passwordNewConfirm, 10),
                            email: user.email,
                            condiciones: user.condiciones,
                        }
    
                        const passwordOld = bcryptjs.compareSync(req.body.passwordNew, user.password);

                        if(passwordOld){
                            res.render('editForgotPassword', {
                                title: 'Nueva Contraseña',
                                errors: {
                                    passwordNew: {
                                        msg: 'Debes ingresar otra contraseña'
                                    }
                                },
                                token,
                                user: req.session.loggedUser
                            })

                        }else if(req.body.passwordNew !== req.body.passwordNewConfirm){
                            res.render('editForgotPassword', {
                                title: 'Nueva Contraseña',
                                errors: {
                                    passwordNewConfirm: {
                                        msg: 'La contraseña debe coincidir con la ingresada.'
                                    }
                                },
                                token,
                                user: req.session.loggedUser
                            })

                        }else{
                            await db.usuarios.update(newUser, { where: {id: user.id}});
        
                            const DOMAIN = process.env.DOMAIN_MAILGUN;
                            const mg = mailgun({apiKey: process.env.MAILGUN_APIKEY, domain: DOMAIN});
                            const data = {
                                from: 'noreply@vivirviajando.com',
                                to: newUser.email,
                                subject: 'Contraseña Reestablecida con éxito',
                                html:`
                                    <html>
                                        <body>
                                            <h2>Contraseña generada con éxito</h2>
                                            <p>Ya puede seguir disfrutando nuevamente de VivirViajando.</p>
                                            <p>Saludos Cordiales.-</p>
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
                    }
                })
            }
        }
    },

/****************************************************/
/***************CARRITO DE COMPRAS*******************/
/****************************************************/

    cart: (req,res) => {

        res.render('cart', {
            title: 'Carrito',
            user: req.session.loggedUser
        })
    },

/****************************************************/
/**********************BUSCADOR**********************/
/****************************************************/

    search: async (req,res) => {

        try {
            const key = req.query.key;

            const searchProducts = await db.productos.findAll({
                raw: true,
                where: {
                    [Op.or] : [
                        {servicio: {
                            [Op.like]: `%${key}%`
                        }}, 
                        {nombre: {
                            [Op.like]: `%${key}%`
                        }}, 
                        {descripcion: {
                            [Op.like]: `%${key}%`
                        }}]
                },
                include: [
                    { association: 'categorias'},
                    { association: 'pagos' }
                ]
            })
            
            searchProducts.forEach(product => {
                product.categoriaNombre = product['categorias.nombre'];
                product.pagosDescripcion = product['pagos.descripcion'];
                product.idModal = product.nombre.replaceAll(' ','') + product.id;
            });

            return res.render('searchView', {
                title: 'Resultado de Búsqueda',
                products: searchProducts,
                user: req.session.loggedUser
            })

        } catch (error) {
            console.log(error);

        }
    }

}

module.exports = usersControllers;