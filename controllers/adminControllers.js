const db = require('../database/models');
const fetch = require('node-fetch');
const { validationResult } = require('express-validator');

let adminControllers = {


    /****************************************************/
    /******************LISTADO USUARIOS******************/
    /****************************************************/

    /**********************GET***************************/

    listUsers: async (req,res) => {
        try {
            const users = await db.usuarios.findAll({
                raw:true,
                order: ['apellido'],
                include: [{association: 'tipoUsuario'}] 
            });

            const userNoPassword = []
;
            users.forEach(user => {
                delete user.password && delete user.confirmarPassword;

                user.tipoUsuario = user['tipoUsuario.id'];
                user.nombreTipoUsuario = user['tipoUsuario.nombre'];
                user.idModal = 'idModal' + user.id.replaceAll('-','');

                userNoPassword.push(user)
            })

            res.render('listUsers', {
                title: 'Lista de Usuarios',
                user: req.session.loggedUser,
                users: userNoPassword
            })
            
        } catch (error) {
            console.log(error);
        }
    },

    /****************************************************/
    /*****************ELIMINAR USUARIOS******************/
    /****************************************************/

    /**********************POST***************************/

    userDelete: async (req, res) => {
        try {
            const idUser = req.params.id;

            await db.usuarios.destroy({
                where: {id: idUser}
            });

            res.redirect('/admin/listUsers');

        } catch (error) {
            console.log(error);
        }
    },

    /****************************************************/
    /*****************ELIMINAR USUARIOS******************/
    /****************************************************/

    /**********************GET****************************/

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
            
            res.render('adminUserEdit', {
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
    
            if(validationsResult.errors.length > 0){
                res.render('adminUserEdit', {
                    title: 'Editar Perfil',
                    errors: validationsResult.mapped(),
                    provinces,
                    genres,
                    user: userEdit,
                    userType

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
                
                res.redirect('/admin/listUsers')
            }
            
        } catch (error) {
            console.log(error);
        }
    },
};

module.exports = adminControllers;