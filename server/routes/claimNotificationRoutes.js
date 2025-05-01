// server/routes/claimNotificationRoutes.js

const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  getHighPriorityClaims,
  markClaimRead
} = require('../controllers/claimNotificationController');

const router = express.Router();

// router.use((req, res, next) => {
//     console.log(`🛣️ [CLAIMS ROUTER] ${req.method} ${req.originalUrl}`);
//     next();
//   }); //debug message to check if the router is working
router.use(authMiddleware);

// GET  /notifications/claims/high-priority
router.get('/high-priority', getHighPriorityClaims);

// POST /notifications/claims/:id/mark-read
router.post('/:id/mark-read', markClaimRead);

module.exports = router;
