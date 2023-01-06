module.exports = (sequelize, DataTypes) => {
    const alias = 'generos';
    const cols = {
        id: {type:DataTypes.INTEGER, primaryKey: true, autoincrement: true},
        nombre: {type:DataTypes.STRING, allowNull: false}
    };
    const config = {
        tableName: 'generos',
        timestamps: false
    };

    const generos = sequelize.define(alias, cols, config);

    generos.associate = (models) => {
        generos.hasMany(models.usuarios, {
            as: 'generos',
            foreignKey: 'id_genero',
            timestamps: false
        });
    }

    return generos;
}