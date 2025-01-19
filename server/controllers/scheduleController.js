const { Schedule, Case, User } = require('../models');
const { Op } = require('sequelize');

const scheduleController = {
  // Get all schedules
  getAll: async (req, res) => {
    try {
      const userId = req.user.id;
      const schedules = await Schedule.findAll({
        where: {
          [Op.or]: [
            { createdBy: userId },
            { '$case.lawyerId$': userId },
            { '$case.clientId$': userId }
          ]
        },
        include: [{
          model: Case,
          as: 'case',
          attributes: ['title']
        }, {
          model: User,
          as: 'creator',
          attributes: ['name']
        }],
        order: [['date', 'ASC']]
      });

      res.json(schedules);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      res.status(500).json({ message: 'Error fetching schedules' });
    }
  },

  // Create new schedule
  create: async (req, res) => {
    try {
      const { title, date, description, type, caseId } = req.body;
      
      if (!title || !date) {
        return res.status(400).json({ 
          message: 'Title and date are required' 
        });
      }

      const schedule = await Schedule.create({
        title,
        date,
        description,
        type,
        caseId,
        createdBy: req.user.id
      });

      // Fetch the created schedule with associations
      const createdSchedule = await Schedule.findByPk(schedule.id, {
        include: [{
          model: Case,
          as: 'case',
          attributes: ['title']
        }, {
          model: User,
          as: 'creator',
          attributes: ['name']
        }]
      });

      res.status(201).json(createdSchedule);
    } catch (error) {
      console.error('Error creating schedule:', error);
      res.status(400).json({ 
        message: 'Error creating schedule',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Update schedule
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const schedule = await Schedule.findByPk(id);
      
      if (!schedule) {
        return res.status(404).json({ message: 'Schedule not found' });
      }

      if (schedule.createdBy !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to update this schedule' });
      }

      await schedule.update(req.body);
      res.json(schedule);
    } catch (error) {
      console.error('Error updating schedule:', error);
      res.status(400).json({ message: 'Error updating schedule' });
    }
  },

  // Delete schedule
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const schedule = await Schedule.findByPk(id);
      
      if (!schedule) {
        return res.status(404).json({ message: 'Schedule not found' });
      }

      if (schedule.createdBy !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to delete this schedule' });
      }

      await schedule.destroy();
      res.json({ message: 'Schedule deleted successfully' });
    } catch (error) {
      console.error('Error deleting schedule:', error);
      res.status(500).json({ message: 'Error deleting schedule' });
    }
  }
};

module.exports = scheduleController;
