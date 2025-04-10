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
const { createNotification } = require('../controllers/createNotificationController');


const router = express.Router();

router.post('/', authMiddleware, getNotifications); // auth middleware executed before getNotifications
router.post('/create', authMiddleware, createNotification); // auth middleware executed before createNotification


module.exports = router;