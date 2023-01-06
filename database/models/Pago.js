module.exports = (sequelize, DataTypes) => {
    const alias = 'pagos';
    const cols = {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoincrement: true},
        descripcion: {type: DataTypes.STRING, allwNull:true}
    };
    const config = {
        tableName: 'mediospago',
        timestamps: false
    };

    const pagos = sequelize.define(alias, cols, config);

    pagos.associate = (models) => {
        pagos.hasMany(models.productos, {
            as: 'pagos',
            foreignKey: 'id_mediosPagos',
            timestamps: false
        });

        pagos.hasMany(models.productosEliminados, {
            as: 'pagosEliminados',
            foreignKey: 'id_mediosPagos',
            timestamps: false
        })
    }

    return pagos;
}