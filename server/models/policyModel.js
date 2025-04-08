const { DataTypes } = require('sequelize');
const sequelize = require('../db/db');

const PolicyNotification = sequelize.define(
  'PolicyNotification',
  {
    notificationid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: { model: 'notifications', key: 'id' },
    },
    policyid: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    changes_to_premium: DataTypes.TEXT,
    billing_reminder_date: DataTypes.DATE,
  },
  {
    tableName: 'policynotifications',
    timestamps: false,
  }
);

module.exports = PolicyNotification;

