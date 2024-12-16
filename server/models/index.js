const dbConfig = require("../config/db.js");
const { Sequelize, DataTypes } = require("sequelize");

// Initialize Sequelize
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  port: 3306,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

// Attach Sequelize and connection instance
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import Models
db.users = require("./userModel.js")(sequelize, DataTypes); // For lawyers, clients, and admin users
db.notifications = require("./notificationModel.js")(sequelize, DataTypes); // For notifications
db.schedules = require("./scheduleModel.js")(sequelize, DataTypes); // For court schedules or events
db.cases = require("./caseModel.js")(sequelize, DataTypes); // For case details

// Relationships
// Users can have multiple notifications
db.users.hasMany(db.notifications, { foreignKey: "userId", as: "notifications" });
db.notifications.belongsTo(db.users, { foreignKey: "userId", as: "user" });

// Users can have multiple schedules (e.g., court appearances, deadlines)
db.users.hasMany(db.schedules, { foreignKey: "userId", as: "schedules" });
db.schedules.belongsTo(db.users, { foreignKey: "userId", as: "user" });

// Users can be associated with cases (lawyers and clients linked to cases)
db.users.hasMany(db.cases, { foreignKey: "lawyerId", as: "lawyerCases" });
db.users.hasMany(db.cases, { foreignKey: "clientId", as: "clientCases" });
db.cases.belongsTo(db.users, { foreignKey: "lawyerId", as: "lawyer" });
db.cases.belongsTo(db.users, { foreignKey: "clientId", as: "client" });

// Sync database
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected successfully!");
  })
  .catch((err) => {
    console.error("Error connecting to database: " + err);
  });

db.sequelize.sync({ force: false }).then(() => {
  console.log("Database synced successfully!");
});

module.exports = db;
