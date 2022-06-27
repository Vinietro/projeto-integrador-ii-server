const {Sequelize} = require('sequelize')

const sequelize = new Sequelize('sql10502345',process.env.USER_NAME,process.env.PASSWORD,{
    dialect: 'mysql',
    host: process.env.DB_HOST,
    logging: false,
    port: 3306
});

const checkConnection =async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

checkConnection()

module.exports = sequelize