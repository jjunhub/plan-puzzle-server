module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', {
        content:{
            type:DataTypes.STRING,
            allowNull:false
        }
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci',
        tableName: 'Comment',
        timestamps: true,
    });

    Comment.associate = models => {
        Comment.belongsTo(models.Recruit, {
            onDelete: 'CASCADE'
        });
        Comment.belongsTo(models.User, {
            onDelete:'CASCADE'
        });
    }
    return Comment;
};