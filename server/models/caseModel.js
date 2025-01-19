const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Case extends Model {
    static associate(models) {
      Case.belongsTo(models.User, {
        as: 'lawyer',
        foreignKey: 'lawyerId'
      });
      Case.belongsTo(models.User, {
        as: 'client',
        foreignKey: 'clientId'
      });
      Case.hasMany(models.CaseFile, {
        as: 'files',
        foreignKey: 'caseId'
      });
    }
  }

  Case.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.TEXT,
    caseType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('open', 'pending', 'closed', 'archived'),
      defaultValue: 'open'
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      defaultValue: 'medium'
    },
    courtDetails: DataTypes.TEXT,
    filingDate: DataTypes.DATE,
    nextHearingDate: DataTypes.DATE,
    judgeName: DataTypes.STRING,
    courtRoom: DataTypes.STRING,
    lawyerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Case',
    tableName: 'cases'
  });

  return Case;
}; 