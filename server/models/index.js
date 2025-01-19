const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../config/database.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

// Import models in the correct order (parent models first)
const User = require('./userModel')(sequelize, Sequelize.DataTypes);
const Case = require('./caseModel')(sequelize, Sequelize.DataTypes);
const CaseFile = require('./caseFileModel')(sequelize, Sequelize.DataTypes);

// Add models to db object
db.User = User;
db.Case = Case;
db.CaseFile = CaseFile;

// Set up associations
Object.values(db).forEach((model) => {
  if (model.associate) {
    model.associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db; 