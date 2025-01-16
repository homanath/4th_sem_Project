module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('case_update', 'hearing_reminder', 'document_required', 'general'),
      defaultValue: 'general'
    },
    status: {
      type: DataTypes.ENUM('unread', 'read'),
      defaultValue: 'unread'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  });

  Notification.associate = function(models) {
    // Define the association with User model
    Notification.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'recipient'
    });

    // Define the association with Case model
    Notification.belongsTo(models.Case, {
      foreignKey: 'caseId',
      as: 'case'
    });
  };

  return Notification;
}; 