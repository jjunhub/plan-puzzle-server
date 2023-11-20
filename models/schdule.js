module.exports = (sequelize, DataTypes) => {
    const Schedule = sequelize.define('Schedule', {
        userId:{
            type:DataTypes.STRING(30),
            allowNULL:false,
        },
        title: {
            type: DataTypes.STRING(30),
            allowNULL: false,
        },
        content: {
            type: DataTypes.STRING(1000),
            allowNULL: true
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNULL: false
        },
        startTime: {
            type: DataTypes.TIME,
            allowNULL: false
        },
        endTime: {
            type: DataTypes.TIME,
            allowNULL: false
        }
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci',
        tableName: 'Schedule',
        timestamps: false,
    });

    Schedule.associate = models => {
        Schedule.belongsTo(models.User, {
            foreignKey: 'userId',
            onDelete: 'CASCADE'
        })
    }
    return Schedule;
};