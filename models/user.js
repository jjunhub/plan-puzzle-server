module.exports = (sequelize,DataTypes)=>{
    const User = sequelize.define('User',{
        userId:{
            type:DataTypes.STRING(30),
            primaryKey:true,
            allowNULL:false,
            unique:true
        },
        userPw:{
            type:DataTypes.STRING(30),
            allowNULL:false
        },
        name: {
            type: DataTypes.STRING(30),
            allowNULL: false,
        },
        nickname:{
            type: DataTypes.STRING(30),
            allowNULL: false,
            unique:true
        },
        email:{
            type:DataTypes.STRING(30),
            allowNULL:true,
            unique:true,
            validate:{
                isEmail:true
            }
        }
    },{
        charset:'utf8',
        collate:'utf8_general_ci',
        tableName:'User',
        timestamps:false,
    });

    // User.associate = models =>{
    //     User.hasOne(models.UserImage,{
    //         foreignKey:"userId",
    //         onDelete: 'CASCADE'
    //     })
    // }
    return User;
};