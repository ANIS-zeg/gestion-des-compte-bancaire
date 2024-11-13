const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const NotificationController = require('../controllers/notificationController');

// Route pour récupérer les notifications
router.get('/', authMiddleware, NotificationController.getNotifications);

// Route pour supprimer une notification
router.delete('/:notificationId', authMiddleware, NotificationController.deleteNotification);

module.exports = router;
