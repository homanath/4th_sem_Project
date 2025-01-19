const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CaseFile extends Model {
    static associate(models) {
      CaseFile.belongsTo(models.Case, {
        foreignKey: 'caseId'
      });
      CaseFile.belongsTo(models.User, {
        as: 'uploader',
        foreignKey: 'uploadedBy'
      });
    }
  }

  CaseFile.init({
    fileName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    filePath: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fileType: DataTypes.STRING,
    fileSize: DataTypes.INTEGER,
    uploadedBy: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'CaseFile',
  });

  return CaseFile;
}; 