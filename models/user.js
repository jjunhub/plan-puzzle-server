module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        userId: {
            type: DataTypes.STRING(30),
            allowNull: false,
            unique: true
        },
        userPw: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        nickname: {
            type: DataTypes.STRING(30),
            allowNull: false,
            unique: true
        },
        statusMessage: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING(30),
            allowNull: true,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        imagePath: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'uploads/users/default.jpg',
            // validate: {
            //     isUrl: true
            // }
        }
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci',
        tableName: 'User',
        timestamps: false,
    });

    User.associate = models => {
        User.hasMany(models.Schedule, {
            onDelete: 'CASCADE'
        });
        User.hasMany(models.Recruit, {
            as: 'MyRecruits',
            foreignKey: 'WriterId',
            onDelete: 'CASCADE'
        });
        User.belongsToMany(models.Recruit, {
            through: 'RecruitUser',
            as: 'Recruits',
            timestamps: false,
            onDelete: 'CASCADE'
        });
        User.belongsToMany(models.Time, {
            through: 'TimeUser',
            as: 'Times',
            timestamps: false,
            onDelete: 'CASCADE'
        });
        User.hasMany(models.Comment, {
            onDelete: 'CASCADE'
        });
        User.hasOne(models.Channel, {
            onDelete: 'CASCADE',
            foreignKey: 'id'
        });
        User.belongsToMany(models.Channel, {
            through: 'Subscription',
            as: 'Channels',
            timestamps: false,
            onDelete: 'CASCADE'
        });
    }

    User.prototype.getId = function () {
        return this.id;
    }

    User.prototype.updateImgPath = function (imgPath) {
        this.imagePath = imgPath;
    }

    User.prototype.updateNickname = function (nickname) {
        this.nickname = nickname;
    }

    User.prototype.updateStatusMessage = function (statusMessage) {
        this.statusMessage = statusMessage;
    }

    User.prototype.checkUser = function (id, password) {
        let status = false;
        if (this.userId === id && this.userPw === password) {
            status = true;
        }
        return status;
    }

    User.prototype.changePw = function(newPassword){
        this.userPw = newPassword;
    }

    return User;
};