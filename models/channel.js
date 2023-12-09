module.exports = (sequelize, DataTypes) => {
    const Channel = sequelize.define('Channel', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        title:{
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
            defaultValue: 'uploads/channels/default.jpg'
        },
        thumbnailImgPath:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'uploads/channels/default.jpg'
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

    Channel.prototype.updateIconImg = function(newIconImgPath){
        const oldIconImgPath = this.iconImgPath;
        this.iconImgPath = newIconImgPath;
        return oldIconImgPath;
    }

    Channel.prototype.getIconImg = function(){
        return this.iconImgPath;
    }


    return Channel;
};