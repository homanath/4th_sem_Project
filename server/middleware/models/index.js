const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../config/db.js');

const db = {};

const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    logging: false,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

// Import models
db.User = require('./User')(sequelize, Sequelize.DataTypes);
db.Case = require('./Case')(sequelize, Sequelize.DataTypes);
db.CaseEvent = require('./CaseEvent')(sequelize, Sequelize.DataTypes);
db.CaseFile = require('./CaseFile')(sequelize, Sequelize.DataTypes);
db.CaseNote = require('./CaseNote')(sequelize, Sequelize.DataTypes);
db.Notification = require('./Notification')(sequelize, Sequelize.DataTypes);
db.Schedule = require('./Schedule')(sequelize, Sequelize.DataTypes);

// Initialize associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
