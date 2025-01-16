const { Schedule, Case, User } = require('../models');
const { sendNotification } = require('../utils/notifications');

const createSchedule = async (scheduleData) => {
  try {
    // Validate required fields
    if (!scheduleData.title || !scheduleData.date || !scheduleData.caseId) {
      throw new Error('Missing required fields');
    }

    const schedule = await Schedule.create(scheduleData);
    
    // Get case and client details
    const caseDetails = await Case.findByPk(schedule.caseId, {
      include: [
        { 
          model: User, 
          as: 'client',
          attributes: ['id', 'name', 'email'] 
        }
      ]
    });

    if (!caseDetails) {
      throw new Error('Case not found');
    }

    // Create notification for client
    await sendNotification({
      type: 'schedule',
      data: {
        title: 'New Schedule Added',
        message: `A new schedule has been added for case: ${caseDetails.caseTitle}`,
        userId: caseDetails.client.id,
        caseId: caseDetails.id,
        email: caseDetails.client.email,
        metadata: {
          scheduleId: schedule.id,
          scheduleTitle: schedule.title,
          scheduleDate: schedule.date
        }
      }
    });

    return {
      ...schedule.toJSON(),
      case: caseDetails
    };
  } catch (error) {
    console.error('Error creating schedule:', error);
    throw error;
  }
};

const updateSchedule = async (scheduleId, updateData, userId) => {
  try {
    const schedule = await Schedule.findByPk(scheduleId, {
      include: [{ 
        model: Case,
        include: [{ model: User, as: 'client' }]
      }]
    });

    if (!schedule) {
      throw new Error('Schedule not found');
    }

    // Check if user has permission to update
    if (schedule.createdBy !== userId) {
      throw new Error('Unauthorized to update this schedule');
    }

    await schedule.update(updateData);

    // Notify client about the update
    await sendNotification({
      type: 'schedule_update',
      data: {
        title: 'Schedule Updated',
        message: `Schedule for case: ${schedule.Case.caseTitle} has been updated`,
        userId: schedule.Case.client.id,
        caseId: schedule.caseId,
        email: schedule.Case.client.email,
        metadata: {
          scheduleId: schedule.id,
          scheduleTitle: updateData.title || schedule.title,
          scheduleDate: updateData.date || schedule.date
        }
      }
    });

    return schedule;
  } catch (error) {
    console.error('Error updating schedule:', error);
    throw error;
  }
};

const deleteSchedule = async (scheduleId, userId) => {
  try {
    const schedule = await Schedule.findByPk(scheduleId, {
      include: [{ 
        model: Case,
        include: [{ model: User, as: 'client' }]
      }]
    });

    if (!schedule) {
      throw new Error('Schedule not found');
    }

    // Check if user has permission to delete
    if (schedule.createdBy !== userId) {
      throw new Error('Unauthorized to delete this schedule');
    }

    // Notify client about the deletion
    await sendNotification({
      type: 'schedule_cancellation',
      data: {
        title: 'Schedule Cancelled',
        message: `Schedule for case: ${schedule.Case.caseTitle} has been cancelled`,
        userId: schedule.Case.client.id,
        caseId: schedule.caseId,
        email: schedule.Case.client.email,
        metadata: {
          scheduleId: schedule.id
        }
      }
    });

    await schedule.destroy();
    return true;
  } catch (error) {
    console.error('Error deleting schedule:', error);
    throw error;
  }
};

const getSchedulesByCase = async (caseId) => {
  try {
    const schedules = await Schedule.findAll({
      where: { caseId },
      include: [{ 
        model: Case,
        include: [
          { model: User, as: 'lawyer', attributes: ['id', 'name'] },
          { model: User, as: 'client', attributes: ['id', 'name'] }
        ]
      }],
      order: [['date', 'ASC']]
    });

    return schedules;
  } catch (error) {
    console.error('Error fetching schedules:', error);
    throw error;
  }
};

module.exports = {
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getSchedulesByCase
}; 