const { Sequelize } = require('sequelize');


const sequelize = new Sequelize({ 
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '256325',
    database: 'users',
    logging: false,
});


async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection to database established wahoo!');
    } catch (error) {
        console.error('Unable to connect to the database womp womp:', error);
    }
}

testConnection();

module.exports = sequelize;