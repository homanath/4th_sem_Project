const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Cases where user is lawyer
      User.hasMany(models.Case, { 
        as: 'lawyerCases',
        foreignKey: 'lawyerId',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      });
      
      // Cases where user is client
      User.hasMany(models.Case, { 
        as: 'clientCases',
        foreignKey: 'clientId',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      });

      // For clients to reference their lawyer
      User.belongsTo(models.User, { 
        as: 'lawyer',
        foreignKey: {
          name: 'lawyerId',
          allowNull: true
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      });

      // For lawyers to reference their clients
      User.hasMany(models.User, {
        as: 'clients',
        foreignKey: 'lawyerId',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      });
    }
  }

  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
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
    barNumber: DataTypes.STRING,
    specialization: DataTypes.STRING,
    lastLogin: DataTypes.DATE,
    lawyerId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users'
  });

  return User;
}; 