const { Notification, User, Case } = require("../models");
const notificationService = require("../services/notificationService");

module.exports = {
  createNotification: async (req, res) => {
    try {
      const { title, message, userId, caseId, type } = req.body;
      
      // Only lawyers can create notifications for their clients
      if (req.user.role === 'lawyer') {
        const client = await User.findByPk(userId);
        if (!client || client.lawyerId !== req.user.id) {
          return res.status(403).json({ error: 'Not authorized to send notifications to this client' });
        }
      }

      await notificationService.sendNotification(type, {
        title,
        message,
        userId,
        caseId,
        email: client.email
      });

      res.status(201).json({ message: "Notification queued successfully" });
    } catch (error) {
      console.error("Error creating notification:", error);
      res.status(500).json({ error: error.message });
    }
  },

  getNotifications: async (req, res) => {
    try {
      const notifications = await Notification.findAll({
        where: { userId: req.user.id },
        include: [
          {
            model: User,
            as: 'recipient',
            attributes: ['id', 'name', 'email']
          },
          {
            model: Case,
            as: 'case',
            attributes: ['id', 'title', 'status']
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      res.json(notifications);
    } catch (error) {
      console.error('Error getting notifications:', error);
      res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  },

  markAsRead: async (req, res) => {
    try {
      const { id } = req.params;
      await notificationService.markAsRead(id, req.user.id);
      res.status(200).json({ message: "Notification marked as read" });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ error: error.message });
    }
  }
};
