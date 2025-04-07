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
      references: { model: 'users', key: 'username' }, // linking the sender
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
  },
  {
    tableName: 'Notifications',
  }
);

// Import the child models AFTER the Notification model is defined (prevents circular depedency)
const NewsNotification = require('./newsModel');
const ClaimNotification = require('./claimModel');
const PolicyNotification = require('./policyModel');

// Define relationships here
Notification.hasOne(NewsNotification, { foreignKey: 'notification_id' });
Notification.hasOne(ClaimNotification, { foreignKey: 'notification_id' });
Notification.hasOne(PolicyNotification, { foreignKey: 'notification_id' });

// Define the belongsTo relationships AFTER the child models are imported (prevents circular dependecy)
NewsNotification.belongsTo(Notification, { foreignKey: 'notification_id' });
ClaimNotification.belongsTo(Notification, { foreignKey: 'notification_id' });
PolicyNotification.belongsTo(Notification, { foreignKey: 'notification_id' });

module.exports = Notification;



