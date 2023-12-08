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
            timestamps: false,
            onDelete:'CASCADE'
        })
    }

    Time.prototype.getVote = async function (userId) {
        let state = false;
        const users = await this.getUsers();
        users?.map(user => {
            if (user.getId() === userId) {
                state=true
            }
        });
        return{
            num:users.length || 0,
            state:state
        }
    }

    return Time;
};