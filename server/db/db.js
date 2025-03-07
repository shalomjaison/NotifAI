// Importing node-postgres library. 
// The pg library is the bridge that allows your Node.js code to "talk" to the PostgreSQL server
// It sends commands to the database and receives results back.
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '256325',
    database: 'users',
    logging: false,
})

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection to database established wahoo!');
    } catch (error) {
        console.log('Unable to connect to the database womp womp', error);
    }
}

testConnection();

module.exports = sequelize;