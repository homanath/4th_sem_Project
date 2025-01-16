module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
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
      type: DataTypes.ENUM('lawyer', 'client', 'admin'),
      defaultValue: 'client'
    },
    status: {
      type: DataTypes.ENUM('pending', 'active', 'inactive'),
      defaultValue: 'active'
    },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  });

  User.associate = (models) => {
    User.hasMany(models.Case, { foreignKey: 'lawyerId', as: 'lawyerCases' });
    User.hasMany(models.Case, { foreignKey: 'clientId', as: 'clientCases' });
    User.hasMany(models.Notification, { 
      foreignKey: 'userId',
      as: 'notifications'
    });
    User.hasMany(models.Schedule, { foreignKey: 'createdBy' });
    User.belongsTo(models.User, { as: 'lawyer', foreignKey: 'lawyerId' });
    User.hasMany(models.User, { as: 'clients', foreignKey: 'lawyerId' });
  };

  return User;
}; 