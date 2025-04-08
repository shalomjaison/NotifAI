const { DataTypes } = require('sequelize');
const sequelize = require('../db/db');

const NewsNotification = sequelize.define(
  'NewsNotification',
  {
    notificationid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: { model: 'notifications', key: 'id' },
    },
    expirationdate: DataTypes.DATE,
    type: DataTypes.STRING,
    details: DataTypes.TEXT,
  },
  {
    tableName: 'newsnotifications',
    timestamps: false,
  }
);

module.exports = NewsNotification;



