module.exports = (sequelize, DataTypes) => {
    const Case = sequelize.define("Case", {
      caseTitle: { type: DataTypes.STRING, allowNull: false },
      details: { type: DataTypes.TEXT },
      status: { type: DataTypes.STRING, defaultValue: "open" }, // "open", "closed"
    });
    return Case;
  };

  