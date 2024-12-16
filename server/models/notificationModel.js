module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define("Notification", {
      title: { type: DataTypes.STRING, allowNull: false },
      message: { type: DataTypes.TEXT, allowNull: false },
      status: { type: DataTypes.STRING, defaultValue: "unread" }, // "read" or "unread"
    });
    return Notification;
  };
  