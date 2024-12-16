const { Schedule, User } = require("../models");

// Helper function for error handling
const handleError = (res, error) => res.status(500).json({ error: error.message });

module.exports = {
  createSchedule: async (req, res) => {
    try {
      const { eventTitle, date, description, userId } = req.body;
      const schedule = await Schedule.create({ eventTitle, date, description, userId });
      res.status(201).json({ message: "Schedule created successfully", schedule });
    } catch (error) {
      handleError(res, error);
    }
  },

  getSchedules: async (req, res) => {
    try {
      const schedules = await Schedule.findAll({ include: User });
      res.status(200).json(schedules);
    } catch (error) {
      handleError(res, error);
    }
  },

  getScheduleById: async (req, res) => {
    try {
      const { id } = req.params;
      const schedule = await Schedule.findByPk(id, { include: User });
      if (!schedule) return res.status(404).json({ message: "Schedule not found" });
      res.status(200).json(schedule);
    } catch (error) {
      handleError(res, error);
    }
  },

  updateSchedule: async (req, res) => {
    try {
      const { id } = req.params;
      const { eventTitle, date, description } = req.body;
      await Schedule.update({ eventTitle, date, description }, { where: { id } });
      res.status(200).json({ message: "Schedule updated successfully" });
    } catch (error) {
      handleError(res, error);
    }
  },

  deleteSchedule: async (req, res) => {
    try {
      const { id } = req.params;
      await Schedule.destroy({ where: { id } });
      res.status(200).json({ message: "Schedule deleted successfully" });
    } catch (error) {
      handleError(res, error);
    }
  },
};
