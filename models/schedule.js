module.exports = (sequelize, DataTypes) => {
    const Schedule = sequelize.define('Schedule', {
        title: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        content: {
            type: DataTypes.STRING(1000),
            allowNull: true
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        startTime: {
            type: DataTypes.TIME,
            allowNull: false
        },
        endTime: {
            type: DataTypes.TIME,
            allowNull: false
        },
        color: {
            type: DataTypes.STRING(8),
            allowNull: false
        },
        originId: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
        // userId: {
        //     type: DataTypes.STRING(30),
        //     allowNULL: false
        // }
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci',
        tableName: 'Schedule',
        timestamps: false,
    });

    Schedule.associate = models => {
        Schedule.belongsTo(models.User, {
            onDelete: 'CASCADE'
        })
    };

    Schedule.getMaxOriginId = async userId => {
        if (await Schedule.count()) {
            return await Schedule.max('originId', {
                where: {
                    'UserId': userId
                }
            });
        }
        return 0;
    };

    return Schedule;
};