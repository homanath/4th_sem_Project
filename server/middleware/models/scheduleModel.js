module.exports = (sequelize, DataTypes) => {
    const Schedule = sequelize.define("Schedule", {
      eventTitle: { type: DataTypes.STRING, allowNull: false },
      date: { type: DataTypes.DATE, allowNull: false },
      description: { type: DataTypes.TEXT },
    });
    return Schedule;
  };
  