let db = require('../database/models');

let mainControllers = {

    index: async (req,res) => {

        try {
            const products = await db.productos.findAll({
                raw:true,
                include: [
                    { association: 'categorias'},
                    { association: 'pagos' }
                ]
            });

            products.forEach(product => {
                product.categoriaNombre = product['categorias.nombre'];
                product.pagosDescripcion = product['pagos.descripcion'];
                product.idModal = product.nombre.replaceAll(' ','') + product.id;
            });
 
            res.render('index', {
                title: 'VivirViajando',
                products
            });     

        } catch (error) {
            console.log(error)
        }

    },

    about: (req,res) => {
        return res.render('about', {
            title: 'Nosotros'
        })
    }

}

module.exports = mainControllers;