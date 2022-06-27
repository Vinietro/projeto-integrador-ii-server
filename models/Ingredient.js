const {DataTypes} = require('sequelize')
const sequelize = require('../dbConnection')

const Ingredient = sequelize.define('Ingredient',{
    id : {
        type: DataTypes.INTEGER,
        allowNull: false ,
        primaryKey: true,
        autoIncrement: true  
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
})

module.exports = Ingredient