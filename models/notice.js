module.exports = (sequelize, DataTypes) => {
    const Notice = sequelize.define('Notice', {
        title: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        imgPath:{
            type:DataTypes.STRING,
            allowNull:true
        }
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci',
        tableName: 'Notice',
        timestamps: false,
    });

    Notice.associate = models => {
        Notice.belongsTo(models.Channel, {
            onDelete: 'CASCADE'
        });
    }

    return Notice;
};