const { DataTypes } = require('sequelize')
const sequelize = require('../db/db'); 



const User = sequelize.define(
    'User',
    {
      // Model attributes are defined here
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique:true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull:false,
        unique:true,
        // allowNull defaults to true
        //email has to be unique different from others
      },
    },
    { 
      // Other model options go here
      tablename: 'users',
    },
  );

  module.exports = User

