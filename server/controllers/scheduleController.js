const { Schedule, Case } = require('../models');

const scheduleController = {
  getSchedules: async (req, res) => {
    try {
      const schedules = await Schedule.findAll({
        include: [
          {
            model: Case,
            attributes: ['title', 'caseNumber']
          }
        ],
        order: [['date', 'ASC']]
      });
      res.json(schedules);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      res.status(500).json({ message: 'Failed to fetch schedules' });
    }
  },

  createSchedule: async (req, res) => {
    try {
      const { title, date, description, caseId, type } = req.body;
      const schedule = await Schedule.create({
        title,
        date,
        description,
        caseId,
        type
      });

      res.status(201).json(schedule);
    } catch (error) {
      console.error('Error creating schedule:', error);
      res.status(500).json({ message: 'Failed to create schedule' });
    }
  },

  getScheduleById: async (req, res) => {
    try {
      const schedule = await Schedule.findByPk(req.params.id, {
        include: [
          {
            model: Case,
            attributes: ['title', 'caseNumber']
          }
        ]
      });

      if (!schedule) {
        return res.status(404).json({ message: 'Schedule not found' });
      }

      res.json(schedule);
    } catch (error) {
      console.error('Error fetching schedule:', error);
      res.status(500).json({ message: 'Failed to fetch schedule' });
    }
  },

  updateSchedule: async (req, res) => {
    try {
      const { title, date, description, type } = req.body;
      const schedule = await Schedule.findByPk(req.params.id);

      if (!schedule) {
        return res.status(404).json({ message: 'Schedule not found' });
      }

      await schedule.update({
        title,
        date,
        description,
        type
      });

      res.json(schedule);
    } catch (error) {
      console.error('Error updating schedule:', error);
      res.status(500).json({ message: 'Failed to update schedule' });
    }
  },

  deleteSchedule: async (req, res) => {
    try {
      const schedule = await Schedule.findByPk(req.params.id);

      if (!schedule) {
        return res.status(404).json({ message: 'Schedule not found' });
      }

      await schedule.destroy();
      res.json({ message: 'Schedule deleted successfully' });
    } catch (error) {
      console.error('Error deleting schedule:', error);
      res.status(500).json({ message: 'Failed to delete schedule' });
    }
  }
};

module.exports = scheduleController;
