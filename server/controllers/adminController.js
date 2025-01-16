const { User, Case, Schedule } = require('../models');
const { Op } = require('sequelize');

const adminController = {
  getDashboardStats: async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
      }

      const today = new Date();
      const lastMonth = new Date(today.setMonth(today.getMonth() - 1));

      // Get basic stats
      const [totalUsers, totalLawyers, totalClients, totalCases] = await Promise.all([
        User.count(),
        User.count({ where: { role: 'lawyer' } }),
        User.count({ where: { role: 'client' } }),
        Case.count()
      ]);

      // Get case statistics
      const caseStats = await Case.findAll({
        attributes: [
          'status',
          [sequelize.fn('COUNT', sequelize.col('status')), 'count']
        ],
        group: ['status']
      });

      // Get recent activities
      const recentActivities = await Case.findAll({
        limit: 10,
        order: [['updatedAt', 'DESC']],
        include: [
          {
            model: User,
            as: 'lawyer',
            attributes: ['name']
          },
          {
            model: User,
            as: 'client',
            attributes: ['name']
          }
        ]
      });

      // Format activities for display
      const formattedActivities = recentActivities.map(activity => ({
        id: activity.id,
        description: `Case ${activity.caseNumber} was updated`,
        time: activity.updatedAt,
        icon: '📋' // You can customize icons based on activity type
      }));

      res.json({
        totalUsers,
        totalLawyers,
        totalClients,
        totalCases,
        caseStats: {
          labels: caseStats.map(stat => stat.status),
          data: caseStats.map(stat => parseInt(stat.getDataValue('count')))
        },
        userStats: {
          labels: ['Lawyers', 'Clients', 'Total Users'],
          data: [totalLawyers, totalClients, totalUsers]
        },
        recentActivities: formattedActivities
      });

    } catch (error) {
      console.error('Error in getDashboardStats:', error);
      res.status(500).json({ 
        message: 'Failed to fetch admin statistics',
        error: error.message 
      });
    }
  }
};

module.exports = adminController; 