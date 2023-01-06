module.exports = (sequelize, DataTypes) => {
    const alias = 'tipoUsuario';
    const cols = {
        id: {type: DataTypes.INTEGER, primaryKey: true, allowNull: false},
        nombre: {type: DataTypes.STRING, allowNull: false}
    };
    const config = {
        tableName: 'tipousuario',
        timestamps: false
    };

    const tipoUsuario = sequelize.define(alias, cols, config);

    tipoUsuario.associate = models => {
        tipoUsuario.hasMany(models.usuarios, {
            as: 'tipoUsuario',
            foreignKey: 'id_tipoUsuario',
            timestamps: false
        });
    }

    return tipoUsuario;

}