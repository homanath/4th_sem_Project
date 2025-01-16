const { Notification } = require('../models');
const sendEmail = require('./emailService');

const sendNotification = async ({ type, data }) => {
  try {
    // Create notification record
    const notification = await Notification.create({
      title: data.title,
      message: data.message,
      type: type,
      userId: data.userId,
      caseId: data.caseId,
      status: 'sent'
    });

    // Send email notification if email is provided
    if (data.email) {
      await sendEmail({
        to: data.email,
        subject: data.title,
        text: data.message,
      });
    }

    return notification;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};

const getUserNotifications = async (userId) => {
  try {
    return await Notification.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });
  } catch (error) {
    console.error('Error getting notifications:', error);
    throw error;
  }
};

const markNotificationAsRead = async (notificationId, userId) => {
  try {
    const notification = await Notification.findOne({
      where: { id: notificationId, userId }
    });
    
    if (!notification) {
      throw new Error('Notification not found');
    }

    await notification.update({ status: 'read' });
    return notification;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

module.exports = {
  sendNotification,
  getUserNotifications,
  markNotificationAsRead
}; 