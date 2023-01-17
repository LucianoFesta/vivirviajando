module.exports = (sequelize, DataTypes) => {
    const alias = 'itemsCompra';
    const cols = {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoincrement: true},
        id_compra: {type: DataTypes.INTEGER, allowNull: false},
        id_producto: {type: DataTypes.INTEGER, allowNull: false},
        nombre: {type: DataTypes.STRING, allowNull: false},
        precio: {type: DataTypes.DECIMAL, allowNull: false},
        cantidad: {type: DataTypes.INTEGER, allowNull: false}
    };
    const config = {
        tableName: 'itemscompra',
        timestamps: false
    };

    const itemsCompra = sequelize.define(alias, cols, config);

    itemsCompra.associate = (models) => {
        itemsCompra.belongsTo(models.compras, {
            as: 'itemsCompras',
            foreignKey: 'id_compra',
            timestamps: false
        });
    }

    return itemsCompra;
}