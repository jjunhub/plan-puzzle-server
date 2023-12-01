module.exports = (sequelize, DataTypes) => {
    const Recruit = sequelize.define('Recruit', {
        title: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        peopleNum: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        participateNum: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        regionFirst: { //region 저장하는 거에 따라 수정
            type: DataTypes.STRING(10),
            allowNull: false
        },
        regionSecond: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        startDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        endDate: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        timeCategory: {
            type: DataTypes.ENUM('D', 'TBD'),
            allowNull: false
        },
        startTime: {
            type: DataTypes.TIME,
            allowNull: true
        },
        endTime: {
            type: DataTypes.TIME,
            allowNull: true
        },
        state: {
            type: DataTypes.ENUM('Recruiting', 'Closed', 'Completed'),
            allowNull: false,
            defaultValue: 'Recruiting'
        },
        color: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        imagePath: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'uploads/recruits/default.jpg'
        },
        owner: {
            type: DataTypes.ENUM('User', 'Chanel'),
            allowNull: false
        }
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci',
        tableName: 'Recruit',
        timestamps: true,
    });

    Recruit.associate = models => {
        Recruit.belongsTo(models.User, {
            onDelete: 'CASCADE',
            foreignKey: 'WriterId'
        });
        Recruit.belongsToMany(models.User, {
            through: 'RecruitUser',
            as: 'Users',
            timestamps: false
        });
    }
    return Recruit;
};