const { Sequelize } = require('sequelize');
require('dotenv').config();

const DB_NAME = process.env.DB_NAME || 'users';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASS = process.env.DB_PASS || '256325';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 5432;

const host = (process.env.BACKEND_USES_DOCKER == 1) ? ("host.docker.internal") : (DB_HOST);

const sequelize = new Sequelize({ 
    dialect: 'postgres',
    host: host,
    port: DB_PORT,
    username: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
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