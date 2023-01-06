module.exports = (sequelize, DataTypes) => {
    const alias = 'compras';
    const cols = {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoincrement: true},
        id_usuario: {type: DataTypes.INTEGER, allowNull: false},
        productosComprados: {type: DataTypes.STRING, allowNull: false}
    };
    const config = {
        tableName: 'compras',
        timestamps: false
    };

    const compras = sequelize.define(alias, cols, config);

    compras.associate = (models) => {
        compras.belongsTo(models.usuarios, {
            as: 'compras',
            foreignKey: 'id_usuario',
            timestamps: false
        });
    }

    return compras;
}