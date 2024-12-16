const { Notification, User } = require("../models");

// Helper function for error handling
const handleError = (res, error) => res.status(500).json({ error: error.message });

module.exports = {
  createNotification: async (req, res) => {
    try {
      const { title, message, userId, status } = req.body;
      const notification = await Notification.create({ title, message, userId, status });
      res.status(201).json({ message: "Notification created successfully", notification });
    } catch (error) {
      handleError(res, error);
    }
  },

  getNotifications: async (req, res) => {
    try {
      const notifications = await Notification.findAll({ include: User });
      res.status(200).json(notifications);
    } catch (error) {
      handleError(res, error);
    }
  },

  getNotificationById: async (req, res) => {
    try {
      const { id } = req.params;
      const notification = await Notification.findByPk(id, { include: User });
      if (!notification) return res.status(404).json({ message: "Notification not found" });
      res.status(200).json(notification);
    } catch (error) {
      handleError(res, error);
    }
  },

  updateNotification: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, message, status } = req.body;
      await Notification.update({ title, message, status }, { where: { id } });
      res.status(200).json({ message: "Notification updated successfully" });
    } catch (error) {
      handleError(res, error);
    }
  },

  deleteNotification: async (req, res) => {
    try {
      const { id } = req.params;
      await Notification.destroy({ where: { id } });
      res.status(200).json({ message: "Notification deleted successfully" });
    } catch (error) {
      handleError(res, error);
    }
  },
};
