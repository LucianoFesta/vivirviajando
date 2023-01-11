const path = require('path');
const { body } = require('express-validator');

const validationsUsers = {

    createUser: [
        body('name').notEmpty().withMessage('El nombre es obligatorio'),
        body('lastName').notEmpty().withMessage('El apellido es obligatorio'),
        body('yearsOld').notEmpty().withMessage('Debes completar la fecha de nacimiento'),
        body('document').notEmpty().withMessage('Documento obligatorio'),
        body('address').notEmpty().withMessage('Ingresá tu dirección'),
        body('genre').notEmpty().withMessage('Ingresá el género'),
        body('city').notEmpty().withMessage('Indicá tu ciudad'),
        body('state').notEmpty().withMessage('Elegí tu provincia'),
        body('terminos').notEmpty().withMessage('Debes aceptar términos y condiciones'),
        body('email')
            .notEmpty().withMessage('El Email es obligatorio').bail()
            .isEmail().withMessage('Lo ingresado no es un Email'),
        body('password')
            .notEmpty().withMessage('Ingresá una contraseña').bail()
            .isLength({ min:8 }).withMessage('Debes ingresar al menos 8 caracteres'),
        body('passwordConfirm').notEmpty().withMessage('Debes confirmar tu contraseña'),
        body('perfilPhoto').custom((value, {req}) => {
            let file = req.file;
            let extPermitidas = ['.png', '.jpg', '.JPG', '.PNG'];
            if(!file){
                throw new Error('Debes subir una foto de perfil');
            }else{
                let ext = path.extname(file.originalname);
                if(!extPermitidas.includes(ext)){
                    throw new Error(`Las extensiones permitidas son: ${extPermitidas.join(', ')}`);
                }
            }
            return true;
        } )
    ],

    editUser: [
        body('name').notEmpty().withMessage('El nombre es obligatorio'),
        body('lastName').notEmpty().withMessage('El apellido es obligatorio'),
        body('yearsOld').notEmpty().withMessage('Debes completar la fecha de nacimiento'),
        body('document').notEmpty().withMessage('Documento obligatorio'),
        body('address').notEmpty().withMessage('Ingresá tu dirección'),
        body('genre').notEmpty().withMessage('Ingresá el género'),
        body('userType').notEmpty().withMessage('Elegí el tipo de usuario'),
        body('city').notEmpty().withMessage('Indicá tu ciudad'),
        body('state').notEmpty().withMessage('Elegí tu provincia'),
        body('terminos').notEmpty().withMessage('Debes aceptar términos y condiciones'),
        body('email')
            .notEmpty().withMessage('El Email es obligatorio').bail()
            .isEmail().withMessage('Lo ingresado no es un Email'),
        body('perfilPhoto').custom((value, {req}) => {
            if(req.file != undefined){
                let extPermitidas = ['.png', '.jpg', '.JPG', '.PNG'];
                let ext = path.extname(req.file.originalname);
                if(!extPermitidas.includes(ext)){
                    throw new Error(`Las extensiones permitidas son: ${extPermitidas.join(', ')}`);
                }
            }
            return true;
        } )
    ],

    editPassword: [
        body('password')
            .notEmpty().withMessage('Ingresá tu contraseña actual').bail()
            .isLength({ min:8 }).withMessage('Debes ingresar al menos 8 caracteres'),
        body('passwordNew')
            .notEmpty().withMessage('Ingresá una contraseña nueva').bail()
            .isLength({ min:8 }).withMessage('Debes ingresar al menos 8 caracteres'),
        body('passwordNewConfirm')
            .notEmpty().withMessage('Ingresá la contraseña nueva').bail()
            .isLength({ min:8 }).withMessage('Debes ingresar al menos 8 caracteres'),
    ],

    login: [
        body('email')
            .notEmpty().withMessage('El Email es obligatorio').bail()
            .isEmail().withMessage('Lo ingresado no es un Email'),
        body('password')
            .notEmpty().withMessage('Ingresá una contraseña').bail()
            .isLength({ min:8 }).withMessage('Debes ingresar al menos 8 caracteres')
    ],

    forgotPassword: [
        body('email')
            .notEmpty().withMessage('El Email es obligatorio').bail()
            .isEmail().withMessage('Lo ingresado no es un Email')
    ],

    newPasswordForget: [
        body('passwordNew')
            .notEmpty().withMessage('Ingresá una contraseña nueva').bail()
            .isLength({ min:8 }).withMessage('Debes ingresar al menos 8 caracteres'),
        body('passwordNewConfirm')
            .notEmpty().withMessage('Ingresá la contraseña nueva').bail()
            .isLength({ min:8 }).withMessage('Debes ingresar al menos 8 caracteres'),
    ]

}

module.exports = validationsUsers;