const { DataTypes } = require('sequelize');
const sequelize = require('../db/db');

const NotificationRecipient = sequelize.define(
  'NotificationRecipient',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    notification_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Notifications', key: 'id' },
    },
    recipient_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: { model: 'Users', key: 'username' },
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    date_sent: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'notificationrecipients',
  }
);

module.exports = NotificationRecipient;

