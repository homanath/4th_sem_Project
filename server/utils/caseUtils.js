const { Case } = require('../models');
const { Op } = require('sequelize');

const generateCaseNumber = async () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  
  // Get count of cases created today
  const todayStart = new Date(today.setHours(0, 0, 0, 0));
  const todayEnd = new Date(today.setHours(23, 59, 59, 999));
  
  const count = await Case.count({
    where: {
      createdAt: {
        [Op.between]: [todayStart, todayEnd]
      }
    }
  });

  // Format: YYYY-MM-XXXX where XXXX is a sequential number
  const sequentialNumber = String(count + 1).padStart(4, '0');
  return `${year}-${month}-${sequentialNumber}`;
};

module.exports = {
  generateCaseNumber
}; 