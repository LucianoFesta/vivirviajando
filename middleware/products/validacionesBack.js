const path = require('path');
const { body } = require('express-validator');

const validationsProducts = {

    createProduct: [
        body('name').notEmpty().withMessage('El nombre del producto es obligatorio'),
        body('category').notEmpty().withMessage('Elije una categoría'),
        body('info').notEmpty().withMessage('Agregue información'),
        body('service').notEmpty().withMessage('Completa el servicio'),
        body('price').notEmpty().withMessage('Ingresá un precio'),
        body('pay').notEmpty().withMessage('Ingresá los medios de pago'),
        body('description').notEmpty().withMessage('Agregá una descripción'),
        body('image').custom((value, {req}) => {
            let file = req.file;
            let extPermitidas = ['.png', '.jpg', '.PNG', '.JPG'];
            if(!file){
                throw new Error('Debes subir una imágen');
            }else{
                let ext = path.extname(file.originalname);
                if(!extPermitidas.includes(ext)){
                    throw new Error(`Las extensiones permitidas son: ${extPermitidas.join(', ')}`);
                }
            }
            return true;
        } )
    ],

    editProduct: [
        body('name').notEmpty().withMessage('El nombre del producto es obligatorio'),
        body('category').notEmpty().withMessage('Elije una categoría'),
        body('info').notEmpty().withMessage('Agregue información'),
        body('service').notEmpty().withMessage('Completa el servicio'),
        body('price').notEmpty().withMessage('Ingresá un precio'),
        body('pay').notEmpty().withMessage('Ingresá los medios de pago'),
        body('description').notEmpty().withMessage('Agregá una descripción'),
        body('image').custom((value, {req}) => {
            if(req.file != undefined){
                let extPermitidas = ['.png', '.jpg', '.JPG', '.PNG'];
                let ext = path.extname(req.file.originalname);
                if(!extPermitidas.includes(ext)){
                    throw new Error(`Las extensiones permitidas son: ${extPermitidas.join(', ')}`);
                }
            }
            return true;
        })
    ]

}

module.exports = validationsProducts;