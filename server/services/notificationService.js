const { Notification } = require('../models');
const { addDays, isPast } = require('date-fns');
const nodemailer = require('nodemailer');

class NotificationService {
  constructor() {
    // Use environment variables for email configuration
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async scheduleEventNotification({ event, case_, client, lawyer }) {
    try {
      const notificationDate = addDays(new Date(event.date), -2);
      
      if (!isPast(notificationDate)) {
        // Create notification record
        const notification = await Notification.create({
          title: `Upcoming: ${event.title}`,
          message: `You have an upcoming ${event.type} for case ${case_.caseNumber} on ${event.date}`,
          type: 'case_event',
          userId: client.id,
          caseId: case_.id,
          status: 'unread'
        });

        // Only send email if SMTP is configured
        if (process.env.SMTP_USER && process.env.SMTP_PASS) {
          await this.sendEmail({
            to: client.email,
            subject: `Upcoming: ${event.title}`,
            text: `You have an upcoming ${event.type} for case ${case_.caseNumber} on ${event.date}`
          });
        } else {
          console.log('Email notification skipped - SMTP not configured');
        }

        return notification;
      }
    } catch (error) {
      console.error('Error scheduling notification:', error);
      throw error;
    }
  }

  async sendEmail({ to, subject, text, html }) {
    try {
      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.log('Email skipped - SMTP not configured');
        return;
      }

      const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to,
        subject,
        text,
        html
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async markAsRead(notificationId, userId) {
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
  }
}

module.exports = new NotificationService(); 