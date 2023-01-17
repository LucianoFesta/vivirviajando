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
                { ...req.body, id_usuario: req.session.loggedUser.id}
                );

            let orderItems = req.body.orderItems;

            for(let i = 0; i < req.body.orderItems.length; i++){
                await db.itemsCompra.create({
                    id_compra: order.null,
                    id_producto: req.body.orderItems[i].id_producto,
                    nombre: req.body.orderItems[i].nombre,
                    servicio: req.body.orderItems[i].servicio,
                    precio: req.body.orderItems[i].precio,
                    cantidad: req.body.orderItems[i].cantidad
                })
            }

            res.json({ok: true, status: 200, order: order, items: orderItems});

        } catch (error) {
            console.log(error)
        }
    }
}