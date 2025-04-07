const { DataTypes } = require('sequelize');
const sequelize = require('../db/db');

const ClaimNotification = sequelize.define(
    'ClaimNotification', {
    notification_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: { model: 'Notifications', key: 'id' },
    },
    insured_name: DataTypes.STRING,
    claimant_name: DataTypes.STRING,
    task_type: DataTypes.STRING,
    due_date: DataTypes.DATE,
    line_of_business: DataTypes.STRING,
    description: DataTypes.TEXT,
    priority: DataTypes.STRING,
    is_completed: DataTypes.BOOLEAN,
},
{   // Other model options go here
    tableName: 'claimnotifications'
});

module.exports = ClaimNotification;
