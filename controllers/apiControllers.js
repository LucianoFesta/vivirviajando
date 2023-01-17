const db = require('../database/models');

module.exports = {
    //Búsqueda de productos para el carrito de compras a travez del localStorage
    product: async(req,res) => {
        try {
            let product = await db.productos.findByPk(req.params.id);
            return res.json(product);

        } catch (error) {
            console.log(error);
        }
    },

    checkoutCart: async(req,res) => {

        try {
            let order = await db.compras.create(
                { ...req.body, id_usuario: req.session.loggedUser.id},
                {
                    include: db.compras.itemscompra
                }
            );

            res.json({ok: true, status: 200, order: order});

        } catch (error) {
            console.log(error)
        }
    }
}