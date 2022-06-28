const {DataTypes} = require('sequelize')
const sequelize = require('../dbConnection')

const Ingredient = sequelize.define('Ingredient',{
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    }
})

module.exports = Ingredient