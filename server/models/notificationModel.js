const { DataTypes } = require('sequelize');
const sequelize = require('../db/db');

const Notification = sequelize.define(
  'Notification', 
  { 
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    user_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: { model: 'users', key: 'username'} // linking the sender
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    body: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    is_archived: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    date_created: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
});

module.exports = Notification
