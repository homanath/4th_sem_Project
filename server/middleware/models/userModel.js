const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('admin', 'lawyer', 'client'),
      defaultValue: 'client'
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended'),
      defaultValue: 'active'
    },
    phoneNumber: DataTypes.STRING,
    address: DataTypes.TEXT,
    barNumber: DataTypes.STRING, // For lawyers
    specialization: DataTypes.STRING, // For lawyers
    profileImage: DataTypes.STRING,
    lastLogin: DataTypes.DATE
  });

  User.associate = (models) => {
    User.hasMany(models.Case, { as: 'lawyerCases', foreignKey: 'lawyerId' });
    User.hasMany(models.Case, { as: 'clientCases', foreignKey: 'clientId' });
    User.belongsTo(models.User, { as: 'lawyer', foreignKey: 'lawyerId' }); // For clients to reference their lawyer
  };

  return User;
};



