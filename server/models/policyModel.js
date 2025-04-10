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
    changestopremium: DataTypes.TEXT,
    billingreminderdate: DataTypes.DATE,
  },
  {
    tableName: 'policynotifications',
    timestamps: false,
  }
);

module.exports = PolicyNotification;
               
