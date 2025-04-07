const { DataTypes } = require('sequelize');
const sequelize = require('../db/db');

const User = sequelize.define(
  'User',
  {
    username: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      primaryKey: true,
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
  {
    tableName: 'users',
  }
);

// Import Notification and NotificationRecipient AFTER User is defined (prevents circular dependency)
const Notification = require('./notificationModel');
const NotificationRecipient = require('./notificationRecipientModel');


User.belongsToMany(Notification, {
  through: NotificationRecipient,
  foreignKey: 'recipient_id',
  otherKey: 'notification_id',
});

module.exports = User;





