module.exports = (sequelize, DataTypes) => {
  const Case = sequelize.define("Case", {
    caseNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
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
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });

  Case.associate = (models) => {
    Case.belongsTo(models.User, { as: 'lawyer', foreignKey: 'lawyerId' });
    Case.belongsTo(models.User, { as: 'client', foreignKey: 'clientId' });
    Case.hasMany(models.CaseNote, { as: 'notes' });
    Case.hasMany(models.CaseFile, { as: 'files' });
    Case.hasMany(models.CaseEvent, { as: 'events' });
  };

  return Case;
};

  