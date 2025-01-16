const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Client extends Model {
    static associate(models) {
      // Client belongs to a Lawyer
      Client.belongsTo(models.User, {
        as: 'lawyer',
        foreignKey: 'lawyerId'
      });

      // Client has many Cases
      Client.hasMany(models.Case, {
        as: 'cases',
        foreignKey: 'clientId'
      });
    }
  }

  Client.init({
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
    mobile: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active'
    },
    lawyerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Client',
    tableName: 'clients'
  });

  return Client;
}; 