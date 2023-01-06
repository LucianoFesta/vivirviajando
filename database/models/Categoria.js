module.exports = (sequelize, DataTypes) => {
    const alias = 'categorias';
    const cols = {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoincrement:true},
        nombre: {type: DataTypes.STRING, allowNull: false}
    };
    const config = {
        tableName: 'categoria',
        timestamps: false
    };

    const categorias = sequelize.define(alias, cols, config);

    categorias.associate = (models) => {
        categorias.hasMany(models.productos, {
            as: 'categorias',
            foreignKey: 'id_categoria',
            timestamps: false
        });

        categorias.hasMany(models.productosEliminados, {
            as: 'categoriasEliminados',
            foreignKey: 'id_categoria',
            timestamps: false
        });
    }

    return categorias;
}