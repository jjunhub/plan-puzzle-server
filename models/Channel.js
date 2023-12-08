module.exports = (sequelize, DataTypes) => {
    const Channel = sequelize.define('Channel', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        name:{
            type: DataTypes.STRING(30),
            allowNull: false
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false
        },
        iconImgPath:{
            type: DataTypes.STRING,
            allowNull: false,
            //defaultValue:
        },
        thumbnailImgPath:{
            type: DataTypes.STRING,
            allowNull: false,
            //defaultValue:
        }
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci',
        tableName: 'Channel',
        timestamps: false,
    });

    Channel.associate = models => {
        Channel.belongsTo(models.User, {
            foreignKey:'id',
            onDelete: 'CASCADE'
        });
    }


    return Channel;
};