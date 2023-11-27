module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        userId: {
            type: DataTypes.STRING(30),
            allowNULL: false,
            unique: true
        },
        userPw: {
            type: DataTypes.STRING(30),
            allowNULL: false
        },
        name: {
            type: DataTypes.STRING(30),
            allowNULL: false,
        },
        nickname: {
            type: DataTypes.STRING(30),
            allowNULL: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING(30),
            allowNULL: true,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        image: {
            type: DataTypes.STRING,
            allowNULL: true,
            validate: {
                isUrl: true
            }
        }
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci',
        tableName: 'User',
        timestamps: false,
    });

    User.associate = models => {
        User.hasMany(models.Schedule);
        User.hasMany(models.Recruit);
    };
    return User;
};