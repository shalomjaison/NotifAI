/**
 * Team Data Baes
 * 4/5/2025
 * 
 * Defines routes for notifications
 * 
 */

const express = require('express');

const authMiddleware = require('../middleware/authMiddleware');

const { getNotifications } = require('../controllers/getNotificationsController');


const router = express.Router();

router.post('/', authMiddleware, getNotifications); // auth middleware executed before getNotifications

module.exports = router;