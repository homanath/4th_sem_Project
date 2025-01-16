const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CaseEvent extends Model {
    static associate(models) {
      CaseEvent.belongsTo(models.Case, {
        foreignKey: 'caseId'
      });
    }
  }

  CaseEvent.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM(
        'hearing',
        'document_submission',
        'supplementary_docs',
        'meeting',
        'other'
      ),
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    description: DataTypes.TEXT,
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
      defaultValue: 'pending'
    },
    notificationSent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    caseId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Cases',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'CaseEvent'
  });

  return CaseEvent;
}; 