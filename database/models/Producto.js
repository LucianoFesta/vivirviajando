module.exports = (sequelize, DataTypes) => {
    const alias = 'productos';
    const cols = {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoincrement: true},
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
        tableName: 'productos',
        timestamps:false
    };

    const productos = sequelize.define(alias, cols, config);

    productos.associate = (models) => {
        productos.belongsTo(models.categorias, {
            as: 'categorias',
            foreignKey: 'id_categoria',
            timestamps: false
        });

        productos.belongsTo(models.pagos, {
            as: 'pagos',
            foreignKey: 'id_mediosPagos',
            timestamps: false
        })
    }

    return productos;
}