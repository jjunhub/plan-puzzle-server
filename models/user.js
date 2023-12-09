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
            defaultValue: 'uploads/recruits/default.jpg',
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
            onDelete:'CASCADE'
        });
        User.belongsToMany(models.Time, {
            through: 'TimeUser',
            as: 'Times',
            timestamps: false,
            onDelete:'CASCADE'
        });
        User.hasMany(models.Comment, {
            onDelete:'CASCADE'
        });
        User.hasOne(models.Channel,{
            onDelete:'CASCADE',
            foreignKey:'id'
        })
    }

    User.prototype.getId = function () {
        return this.id;
    }

    return User;
};