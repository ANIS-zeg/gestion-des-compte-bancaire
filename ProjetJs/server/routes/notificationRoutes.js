const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const NotificationController = require('../controllers/notificationController');

// Route pour récupérer les notifications
router.get('/notifications', authMiddleware, NotificationController.getNotifications);

// Route pour supprimer une notification
router.delete('/notifications/:notificationId', authMiddleware, NotificationController.deleteNotification);

module.exports = router;
