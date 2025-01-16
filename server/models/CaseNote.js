module.exports = (sequelize, DataTypes) => {
  const CaseNote = sequelize.define('CaseNote', {
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('general', 'hearing', 'document', 'client_communication'),
      defaultValue: 'general'
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    caseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Cases',
        key: 'id'
      }
    }
  });

  CaseNote.associate = (models) => {
    CaseNote.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'author'
    });
    CaseNote.belongsTo(models.Case, {
      foreignKey: 'caseId'
    });
  };

  return CaseNote;
}; 