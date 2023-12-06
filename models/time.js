module.exports = (sequelize, DataTypes) => {
    const Time = sequelize.define('Time', {
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
        num: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci',
        tableName: 'Time',
        timestamps: false,
    });

    Time.associate = models => {
        Time.belongsTo(models.Recruit, {
            onDelete: 'CASCADE'
        });
        Time.belongsToMany(models.User, {
            through: 'TimeUser',
            as: 'Users',
            timestamps: false
        })
    }

    Time.prototype.getVoteState = function (userId) {
        this.Users.map(user => {
            if(user.getId() === userId){
                return true;
            }
        });
        return false;
    }

    return Time;
};