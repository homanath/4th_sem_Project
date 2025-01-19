module.exports = (sequelize, DataTypes) => {
  const Schedule = sequelize.define('Schedule', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'hearing'
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    caseId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Cases',
        key: 'id'
      }
    }
  }, {
    tableName: 'Schedules',
    timestamps: true
  });

  Schedule.associate = function(models) {
    Schedule.belongsTo(models.Case, {
      foreignKey: 'caseId',
      as: 'case'
    });
  };

  return Schedule;
}; 