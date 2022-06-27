const {DataTypes} = require('sequelize')
const sequelize = require('../dbConnection')

const User = sequelize.define('User',{
    username:{
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
},{
    timestamps: false
})


module.exports = User