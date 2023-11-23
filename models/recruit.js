module.exports = (sequelize, DataTypes) => {
    const Recruit = sequelize.define('Recruit', {
        title: {
            type: DataTypes.STRING(30),
            allowNULL: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNULL: false
        },
        peopleNum: {
            type: DataTypes.INTEGER,
            allowNULL: false
        },
        regionFirst: { //region 저장하는 거에 따라 수정
            type: DataTypes.STRING(10),
            allowNULL: false
        },
        regionSecond: {
            type: DataTypes.STRING(10),
            allowNULL: false
        },
        startDate: {
            type: DataTypes.DATEONLY,
            allowNULL: false
        },
        endDate: {
            type: DataTypes.DATEONLY,
            allowNULL: true
        },
        timeCategory: {
            type: DataTypes.ENUM('D', 'TBD'),
            allowNULL: false
        },
        startTime: {
            type: DataTypes.TIME,
            allowNULL: true
        },
        endTime: {
            type: DataTypes.TIME,
            allowNULL: true
        },
        state: {
            type: DataTypes.ENUM('Recruiting', 'Closed', 'Completed'),
            allowNULL: false,
            defaultValue: 'Recruiting'
        },
        color: {
            type: DataTypes.STRING(10),
            allowNULL: false
        },
        imagePath: {
            type: DataTypes.STRING,
            allowNULL: true,
            defaultValue: 'uploads/recruits/default.jpg'
        },
        owner: {
            type: DataTypes.ENUM('User', 'Chanel'),
            allowNULL: false
        }
        // userId: {
        //     type: DataTypes.STRING(30),
        //     allowNULL: false
        // }
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci',
        tableName: 'Recruit',
        timestamps: true,
    });

    Recruit.associate = models => {
        Recruit.belongsToMany(models.User, {
            through: 'RecruitUser'
        });
    };
    return Recruit;
};