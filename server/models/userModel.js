const { DataTypes } = require('sequelize');
const sequelize = require('../db/db');

const User = sequelize.define(
  'User', 
  { // Model attributes are defined here
    username: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        primaryKey: true
    },
    fname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        // allowNull defaults to true
        //email has to be unique different from others
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'customer',
      },
}, 
{   // Other model options go here
    tableName: 'users'
});

module.exports = User
