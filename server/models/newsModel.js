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
  },
  {
    tableName: 'newsnotifications',
    timestamps: false,
  }
);

module.exports = NewsNotification;



