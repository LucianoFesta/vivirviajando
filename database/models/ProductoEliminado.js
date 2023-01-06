module.exports = (sequelize, DataTypes) => {
    const alias = 'productosEliminados';
    const cols = {
        id: {type: DataTypes.INTEGER, primaryKey: true, allowNull:false},
        nombre: {type: DataTypes.STRING, allowNull: false},
        id_categoria: {type: DataTypes.INTEGER, allowNull: false},
        imagen: {type: DataTypes.STRING, allowNull: false},
        info: {type: DataTypes.STRING, allowNull: false},
        servicio: {type: DataTypes.STRING, allowNull: false},
        precio: {type: DataTypes.DECIMAL(10,2), allowNull:false},
        id_mediosPagos: {type: DataTypes.INTEGER, allowNull: false},
        descripcion: {type: DataTypes.STRING, allowNull: false}
    };
    const config = {
        tableName: 'productoseliminados',
        timestamps:false
    };

    const productosEliminados = sequelize.define(alias, cols, config);

    productosEliminados.associate = (models) => {
        productosEliminados.belongsTo(models.categorias, {
            as: 'categoriasEliminados',
            foreignKey: 'id_categoria',
            timestamps: false
        });

        productosEliminados.belongsTo(models.pagos, {
            as: 'pagosEliminados',
            foreignKey: 'id_mediosPagos',
            timestamps: false
        })
    }

    return productosEliminados;
}