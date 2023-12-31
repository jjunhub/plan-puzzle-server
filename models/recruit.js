const {defaultRecruitImgPath} = require('../constants/defaultImgPath')

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
            allowNull: false
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
        imagePath: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: defaultRecruitImgPath
        },
        owner: {
            type: DataTypes.ENUM('User', 'Channel'),
            allowNull: false
        },
        vote: {
            type: DataTypes.ENUM('Before', 'During', 'End'),
            allowNull: false,
            defaultValue: 'Before'
        }
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci',
        tableName: 'Recruit',
        timestamps: true,
    });

    Recruit.associate = models => {
        Recruit.hasMany(models.Time, {
            onDelete: 'CASCADE'
        });
        Recruit.belongsTo(models.User, {
            onDelete: 'CASCADE',
            foreignKey: 'WriterId'
        });
        Recruit.belongsToMany(models.User, {
            through: 'RecruitUser',
            as: 'Users',
            timestamps: false,
            onDelete: 'CASCADE'
        });
        Recruit.hasMany(models.Comment, {
            onDelete: 'CASCADE'
        });
    }

    Recruit.addHook('afterCreate', async (recruitInstance, options) => {
        if (recruitInstance.owner !== 'Channel') return;
        const channel = await sequelize.models.Channel.findByPk(recruitInstance.WriterId);
        if (channel) {
            channel.updateRecruitDate();
            channel.save();
        }
    });

    Recruit.prototype.increaseParticipateNum = function () {
        this.participateNum += 1;
        if (this.participateNum === this.peopleNum) {
            this.state = 'Closed';
        }
    }
    Recruit.prototype.changeVoteBefore = function () {
        this.vote = 'Before';
    }

    Recruit.prototype.changeVoteStart = function () {
        this.vote = 'During';
    }

    Recruit.prototype.changeVoteEnd = function () {
        this.vote = 'End';
    }

    Recruit.prototype.getParticipantsId = async function () {
        const users = await this.getUsers();
        return users?.map(user => user.getId());
    }

    Recruit.prototype.getImgPath = function () {
        return this.imagePath;
    }

    Recruit.prototype.getTimeCategory = function () {
        return this.timeCategory;
    }

    Recruit.prototype.getTitle = function () {
        return this.title;
    }

    Recruit.prototype.getContent = function () {
        return this.content;
    }

    Recruit.prototype.updateState = function (state) {
        this.state = state;
    }

    Recruit.prototype.updateRecruit = function (recruitData) {
        const {title, content, peopleNum, startDate, endDate, timeCategory, startTime, endTime, imgPath} = recruitData;

        this.title = title;
        this.content = content;
        this.peopleNum = peopleNum;
        this.startDate = startDate;
        this.endDate = endDate;
        this.timeCategory = timeCategory;
        this.startTime = startTime || null;
        this.endTime = endTime || null;
        this.imagePath = imgPath;
    }

    return Recruit;
};