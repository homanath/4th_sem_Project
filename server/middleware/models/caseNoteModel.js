module.exports = (sequelize, DataTypes) => {
  const CaseNote = sequelize.define("CaseNote", {
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('general', 'court', 'client', 'internal'),
      defaultValue: 'general'
    },
    visibility: {
      type: DataTypes.ENUM('public', 'private', 'client-only'),
      defaultValue: 'public'
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  CaseNote.associate = (models) => {
    CaseNote.belongsTo(models.Case);
    CaseNote.belongsTo(models.User, { as: 'author', foreignKey: 'createdBy' });
  };

  return CaseNote;
}; 