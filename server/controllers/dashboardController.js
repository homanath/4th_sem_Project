const { Case, User, sequelize } = require('../models');
const { Op } = require('sequelize');

const dashboardController = {
  getLawyerDashboard: async (req, res) => {
    try {
      const lawyerId = req.user.id;
      const timeframe = req.query.timeframe || 'month';

      // Calculate date range based on timeframe
      const now = new Date();
      let startDate;
      switch (timeframe) {
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'year':
          startDate = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
        default: // month
          startDate = new Date(now.setMonth(now.getMonth() - 1));
      }

      // Get total cases
      const totalCases = await Case.count({
        where: { lawyerId }
      });

      // Get pending cases
      const pendingCases = await Case.count({
        where: {
          lawyerId,
          status: 'pending'
        }
      });

      // Get total clients
      const totalClients = await User.count({
        where: {
          lawyerId,
          role: 'client'
        }
      });

      // Get case statuses for chart
      const caseStatuses = await Case.findAll({
        where: { lawyerId },
        attributes: [
          'status',
          [sequelize.fn('COUNT', sequelize.col('status')), 'count']
        ],
        group: ['status']
      });

      // Get upcoming schedules
      const upcomingSchedules = await Case.findAll({
        where: {
          lawyerId,
          nextHearingDate: {
            [Op.gte]: new Date()
          }
        },
        order: [['nextHearingDate', 'ASC']],
        limit: 5,
        attributes: ['id', 'title', 'nextHearingDate', 'status']
      });

      // Get monthly stats
      const monthlyStats = await Case.findAll({
        where: {
          lawyerId,
          createdAt: {
            [Op.gte]: startDate
          }
        },
        attributes: [
          [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m-%d'), 'date'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m-%d')],
        order: [[sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m-%d'), 'ASC']]
      });

      // Format monthly stats for chart
      const labels = monthlyStats.map(stat => stat.getDataValue('date'));
      const data = monthlyStats.map(stat => parseInt(stat.getDataValue('count')));

      res.json({
        totalCases,
        pendingCases,
        totalClients,
        upcomingSchedules,
        caseStatuses: caseStatuses.map(status => ({
          status: status.status,
          count: parseInt(status.getDataValue('count'))
        })),
        monthlyStats: {
          labels,
          data
        }
      });
    } catch (error) {
      console.error('Error in lawyer dashboard:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching dashboard data',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  getClientDashboard: async (req, res) => {
    try {
      const clientId = req.user.id;

      // Get total cases
      const totalCases = await Case.count({
        where: { clientId }
      });

      // Get active cases
      const activeCases = await Case.count({
        where: { 
          clientId,
          status: {
            [Op.not]: 'closed'
          }
        }
      });

      // Get upcoming schedules
      const upcomingSchedules = await Schedule.findAll({
        where: {
          date: {
            [Op.gte]: new Date()
          }
        },
        include: [{
          model: Case,
          where: { clientId },
          attributes: ['title']
        }],
        order: [['date', 'ASC']],
        limit: 5
      });

      res.json({
        totalCases,
        activeCases,
        upcomingSchedules
      });
    } catch (error) {
      console.error('Error fetching client dashboard data:', error);
      res.status(500).json({ message: 'Failed to fetch dashboard data' });
    }
  }
};

module.exports = dashboardController; 