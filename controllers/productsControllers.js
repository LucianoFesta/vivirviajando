const { validationResult } = require("express-validator");
const db = require('../database/models');

let productsControllers = {
    /****************************************************/
    /*****************CREACIÓN DE PRODUCTOS**************/
    /****************************************************/


    /**********************GET***************************/

    create: async (req,res) => {
        try {

            const categorys = await db.categorias.findAll({raw:true});
            const pays = await db.pagos.findAll({raw:true});
            
            return res.render('productsCreate', {
                title: 'Crear Producto',
                categorys,
                pays
            })
            
        } catch (error) {
            console.log(error);
        }
    },

    /**********************POST**************************/

    processCreate: async (req,res) => {

        try {
            
            const validationsResult = validationResult(req);
            const categorys = await db.categorias.findAll({raw:true});
            const pays = await db.pagos.findAll({raw:true});
            
            if(validationsResult.errors.length > 0){   
                res.render('productsCreate', {
                    title: 'Crear Producto',
                    errors: validationsResult.mapped(),
                    oldData: req.body,
                    categorys,
                    pays
                })
            }else{
                let productNew = {
                    nombre: req.body.name,
                    id_categoria: req.body.category,
                    imagen: '/images/products/' + req.file.filename,
                    info: req.body.info,
                    servicio: req.body.service,
                    precio: req.body.price,
                    id_mediosPagos: req.body.pay,
                    descripcion: req.body.description
                }

                console.log(productNew)
            
                await db.productos.create(productNew);

                res.redirect('/');
            }          
        } catch (error) {
            console.log(error)
        }
    },

    /****************************************************/
    /******************EDICIÓN DE PRODUCTOS**************/
    /****************************************************/


    /**********************GET***************************/

    edit: async (req,res) => {
        try {
            const categorys = await db.categorias.findAll({raw:true});
            const pays = await db.pagos.findAll({raw:true});

            const idProduct = Number(req.params.id);
            const productEdit = await db.productos.findByPk(idProduct, {raw:true});
            
            res.render('productEdit', {
                title: 'Editar producto',
                productEdit,
                categorys,
                pays
            })

        } catch (error) {
            console.log(error);
        }
    },

    /**********************POST**************************/

    processEdit: async (req,res) => {
        try {
            const validationsResult = validationResult(req);
            const idProduct = Number(req.params.id);

            const categorys = await db.categorias.findAll({raw:true});
            const pays = await db.pagos.findAll({raw:true});
            const productEdit = await db.productos.findByPk(idProduct, {raw:true});
          
            if(validationsResult.errors.length > 0){
    
                res.render('productEdit', {
                    title: 'Editar Producto',
                    errors: validationsResult.mapped(),
                    productEdit,
                    categorys,
                    pays
                });

            }else{
                const idProduct = Number(req.params.id);
                const editedProduct = await db.productos.findByPk(idProduct, {raw:true});

                let imageProduct;
                if(req.file == undefined){
                    imageProduct = editedProduct.imagen;
                }else{
                    imageProduct = '/images/products/' + req.file.filename;
                }

                await db.productos.update({
                    nombre: req.body.name,
                    id_categoria: req.body.category,
                    imagen: imageProduct,
                    info: req.body.info,
                    servicio: req.body.service,
                    precio: req.body.price,
                    id_mediosPagos: req.body.pay,
                    descripcion: req.body.description
                },{
                    where: {id: idProduct}
                });

                const productEdited = await db.productos.findByPk(idProduct, {
                    raw: true,
                    include: [{association: 'categorias'}]
                });

                productEdited.categoriaNombre = productEdited['categorias.nombre'];

                res.redirect(`/#${productEdited.categoriaNombre}`);
            }
            
        } catch (error) {
            console.log(error);
        }
    },

    /****************************************************/
    /******************ELIMINAR PRODUCTOS****************/
    /****************************************************/

    delete: async (req,res) => {
        const idProduct = Number(req.params.id);
        const deletedProduct = await db.productos.findByPk(idProduct, {raw:true});

        await db.productosEliminados.create(deletedProduct);

        await db.productos.destroy({where: {id: idProduct}});

        const productRecycled = await db.productosEliminados.findByPk(idProduct, 
            {
                include: [{association: 'categoriasEliminados'}],
                raw:true
            });

            productRecycled.categoriaNombre = productRecycled['categoriasEliminados.nombre'];

        res.redirect(`/#${productRecycled.categoriaNombre}`);
    },

    /****************************************************/
    /*****************RECUPERAR PRODUCTOS****************/
    /****************************************************/

    /**********************GET***************************/

    recycle: async (req,res) => {

        try {

            const products = await db.productosEliminados.findAll({
                raw:true,
                include: [
                    { association: 'categoriasEliminados'},
                    { association: 'pagosEliminados' }
                ]
            });


            products.forEach(product => {
                product.categoriaNombre = product['categoriasEliminados.nombre'];
                product.pagosDescripcion = product['pagosEliminados.descripcion'];
                product.idModal = product.nombre.replaceAll(' ','') + product.id;
            });
 
            res.render('productsDeleted', {
                title: 'Productos Eliminados',
                products
            });     

        } catch (error) {
            console.log(error)
        }
    },

    /**********************POST**************************/

    processRecycle: async (req,res) => {
        const idProduct = Number(req.params.id);
        const recycledProduct = await db.productosEliminados.findByPk(idProduct, {raw:true});

        await db.productos.create(recycledProduct);

        await db.productosEliminados.destroy({where: {id: idProduct}});

        const productRecycled = await db.productos.findByPk(idProduct, 
            {
                include: [{association: 'categorias'}],
                raw:true
            });

            productRecycled.categoriaNombre = productRecycled['categorias.nombre'];

        res.redirect(`/#${productRecycled.categoriaNombre}`);
    },

}

module.exports = productsControllers;