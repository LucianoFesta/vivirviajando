module.exports = (sequelize, DataTypes) => {
    const alias = 'usuarios';
    const cols = {
        id: {type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4},
        nombre: {type: DataTypes.STRING, allowNull: false},
        apellido: {type: DataTypes.STRING, allowNull: false},
        id_tipoUsuario: {type: DataTypes.INTEGER, allowNull: false},
        id_genero: {type: DataTypes.INTEGER, allowNull: false},
        nacimiento: {type: DataTypes.DATE, allowNull: false},
        documento: {type: DataTypes.INTEGER, allowNull: false},
        domicilio: {type: DataTypes.STRING, allowNull: false},
        ciudad: {type: DataTypes.STRING, allowNull: false}, 
        provincia: {type: DataTypes.STRING, allowNull: false},
        fotoPerfil: {type: DataTypes.STRING, allowNull: false},
        email: {type: DataTypes.STRING, allowNull: false},
        password: {type: DataTypes.STRING, allowNull: false},
        confirmarPassword: {type: DataTypes.STRING, allowNull: false},
        condiciones: {type:DataTypes.STRING, allowNull: false}
    };
    const config = {
        tableName: 'usuarios',
        timestamps: false
    };

    const usuarios = sequelize.define(alias, cols, config);

    usuarios.associate = (models) => {
        usuarios.belongsTo(models.generos, {
            as: 'generos',
            foreignKey: 'id_genero',
            timestamps: false
        });

        usuarios.belongsTo(models.tipoUsuario, {
            as: 'tipoUsuario',
            foreignKey: 'id_tipoUsuario',
            timestamps: false
        });

        usuarios.hasMany(models.compras, {
            as: 'compras',
            foreignKey: 'id_usuario',
            timestamps: false
        });
    }

    return usuarios;
}