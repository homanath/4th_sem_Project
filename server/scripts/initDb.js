const db = require('../models');

async function initializeDatabase() {
  try {
    await db.sequelize.authenticate();
    console.log('Database connection established.');

    // Force sync all models
    await db.sequelize.sync({ force: true });
    console.log('Database synchronized.');

    // Create test data
    const lawyer = await db.User.create({
      name: 'Test Lawyer',
      email: 'lawyer@test.com',
      password: '$2a$10$your_hashed_password',
      role: 'lawyer',
      status: 'active'
    });

    console.log('Test data created.');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

initializeDatabase(); 