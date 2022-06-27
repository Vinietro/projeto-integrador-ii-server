const {DataTypes} = require('sequelize')
const sequelize = require('../dbConnection')

const Product = sequelize.define('Product',{
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
    image: {
        type: DataTypes.TEXT,
        allowNull: true
  },
})

module.exports = Product