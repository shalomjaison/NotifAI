const { DataTypes } = require('sequelize');
const sequelize = require('../db/db');

const PolicyNotification = sequelize.define(
    'PolicyNotification', {
    notification_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: { model: 'Notifications', key: 'id' },
    },
    policy_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    changes_to_premium: DataTypes.TEXT,
    billing_reminder_date: DataTypes.DATE,
},
{   // Other model options go here
    tableName: 'policynotifications'
});

module.exports = PolicyNotification;