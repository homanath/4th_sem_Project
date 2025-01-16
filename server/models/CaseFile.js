module.exports = (sequelize, DataTypes) => {
  const CaseFile = sequelize.define('CaseFile', {
    fileName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fileType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    filePath: {
      type: DataTypes.STRING,
      allowNull: false
    },
    uploadedBy: {
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
    },
    description: {
      type: DataTypes.TEXT
    }
  });

  CaseFile.associate = (models) => {
    CaseFile.belongsTo(models.User, {
      foreignKey: 'uploadedBy',
      as: 'uploader'
    });
    CaseFile.belongsTo(models.Case, {
      foreignKey: 'caseId'
    });
  };

  return CaseFile;
}; 