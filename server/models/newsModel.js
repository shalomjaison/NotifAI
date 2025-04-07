const { DataTypes } = require('sequelize');
const sequelize = require('../db/db');

const NewsNotification = sequelize.define(
    'NewsNotification', {
    notification_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: { model: 'Notifications', key: 'id' },
    },
    expiration_date: DataTypes.DATE,
    type: DataTypes.STRING,
    details: DataTypes.TEXT,
},
{   // Other model options go here
    tableName: 'newsnotifications'
});

module.exports = NewsNotification;