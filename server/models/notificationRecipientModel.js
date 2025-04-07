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
    notificationid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'notifications', key: 'id' },
    },
    recipientid: {
      type: DataTypes.STRING,
      allowNull: false,
      references: { model: 'users', key: 'username' },
    },
    isread: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    datesent: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'notificationrecipients',
  }
);

module.exports = NotificationRecipient;

