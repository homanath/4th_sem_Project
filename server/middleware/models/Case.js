const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Case = sequelize.define('Case', {
    caseNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('open', 'pending', 'closed'),
      defaultValue: 'open'
    },
    caseType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    courtDetails: {
      type: DataTypes.STRING,
      allowNull: true
    },
    filingDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
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
    tableName: 'Cases'
  });

  Case.associate = function(models) {
    Case.belongsTo(models.User, {
      as: 'lawyer',
      foreignKey: 'lawyerId'
    });
    Case.belongsTo(models.User, {
      as: 'client',
      foreignKey: 'clientId'
    });
    Case.hasMany(models.CaseNote, {
      as: 'notes',
      foreignKey: 'caseId'
    });
    Case.hasMany(models.CaseFile, {
      as: 'files',
      foreignKey: 'caseId'
    });
    Case.hasMany(models.CaseEvent, {
      as: 'events',
      foreignKey: 'caseId'
    });
  };

  return Case;
}; 