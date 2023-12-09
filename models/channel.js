module.exports = (sequelize, DataTypes) => {
    const Channel = sequelize.define('Channel', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        nickname: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        followerNum:{
            type:DataTypes.INTEGER,
            allowNull:false,
            defaultValue:0
        },
        iconImgPath: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'uploads/channels/default.jpg'
        },
        thumbnailImgPath: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'uploads/channels/default.jpg'
        },
        recruitUpdatedAt:{
            type:DataTypes.DATE,
            allowNull:true
        }
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci',
        tableName: 'Channel',
        timestamps: false,
    });

    Channel.associate = models => {
        Channel.belongsTo(models.User, {
            foreignKey: 'id',
            onDelete: 'CASCADE'
        });
        Channel.hasMany(models.Notice, {
            onDelete: 'CASCADE'
        });
        Channel.belongsToMany(models.User,{
            through: 'Subscription',
            as: 'Users',
            timestamps: false,
            onDelete:'CASCADE'
        });
    }

    Channel.prototype.updateIconImg = function (newIconImgPath) {
        const oldIconImgPath = this.iconImgPath;
        this.iconImgPath = newIconImgPath;
        return oldIconImgPath;
    }

    Channel.prototype.updateThumbnailImg = function (newThumbnailImgPath) {
        const oldThumbnailImgPath = this.thumbnailImgPath;
        this.thumbnailImgPath = newThumbnailImgPath;
        return oldThumbnailImgPath;
    }

    Channel.prototype.findUserExist = async function (userId) {
        let state = false;
        const users = await this.getUsers();
        users?.map(user => {
            if (user.getId() === userId) {
                state=true
            }
        });
        return state;
    }

    Channel.prototype.increaseFollowerNum = function () {
        this.followerNum += 1;
    }

    Channel.prototype.decreaseFollowerNum = function () {
        this.followerNum -= 1;
    }

    Channel.prototype.updateRecruitDate = function () {
        this.recruitUpdatedAt = new Date();
    }

    Channel.prototype.getIconImg = function () {
        return this.iconImgPath;
    }

    Channel.prototype.getThumbnailImg = function () {
        return this.thumbnailImgPath;
    }

    return Channel;
};