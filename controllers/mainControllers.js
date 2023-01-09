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
                products,
                user: req.session.loggedUser
            });     

        } catch (error) {
            console.log(error)
        }

    },

    about: (req,res) => {
        return res.render('about', {
            title: 'Nosotros',
            user: req.session.loggedUser
        })
    }

}

module.exports = mainControllers;