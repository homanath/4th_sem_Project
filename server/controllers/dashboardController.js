const { Case, User, Schedule } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('sequelize');

const dashboardController = {
  getLawyerDashboard: async (req, res) => {
    try {
      const lawyerId = req.user.id;
      const timeframe = req.query.timeframe || 'month';

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

      // Get upcoming schedules
      const upcomingSchedules = await Schedule.findAll({
        where: {
          date: {
            [Op.gte]: new Date()
          }
        },
        include: [{
          model: Case,
          where: { lawyerId },
          attributes: ['title']
        }],
        order: [['date', 'ASC']],
        limit: 5
      });

      // Get case statuses
      const caseStatuses = await Case.findAll({
        where: { lawyerId },
        attributes: [
          'status',
          [sequelize.fn('COUNT', sequelize.col('status')), 'count']
        ],
        group: ['status']
      });

      // Get monthly stats
      const monthlyStats = await getMonthlyStats(lawyerId, timeframe);

      res.json({
        totalCases,
        pendingCases,
        totalClients,
        upcomingSchedules,
        caseStatuses,
        monthlyStats
      });
    } catch (error) {
      console.error('Error fetching lawyer dashboard data:', error);
      res.status(500).json({ message: 'Failed to fetch dashboard data' });
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

// Helper function to get monthly stats
async function getMonthlyStats(lawyerId, timeframe) {
  const today = new Date();
  let months = 6; // Default to 6 months

  switch (timeframe) {
    case 'week':
      months = 1;
      break;
    case 'year':
      months = 12;
      break;
  }

  const labels = [];
  const data = [];

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const count = await Case.count({
      where: {
        lawyerId,
        createdAt: {
          [Op.between]: [date, endDate]
        }
      }
    });

    labels.push(date.toLocaleString('default', { month: 'short', year: 'numeric' }));
    data.push(count);
  }

  return { labels, data };
}

module.exports = dashboardController; 