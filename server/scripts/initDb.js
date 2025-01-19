require('dotenv').config();
const db = require('../models');
const bcrypt = require('bcryptjs');

async function initializeDatabase() {
  try {
    // Test the connection
    await db.sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Drop and recreate database
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await db.sequelize.query('DROP DATABASE IF EXISTS notification');
    await db.sequelize.query('CREATE DATABASE notification');
    await db.sequelize.query('USE notification');
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

    // Sync all models
    await db.sequelize.sync({ 
      force: true,
      alter: false,
      logging: console.log
    });
    console.log('Database synchronized');

    // Create initial admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await db.User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      status: 'active'
    });

    console.log('Initial admin user created');
    console.log('Database initialization completed successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

initializeDatabase(); 