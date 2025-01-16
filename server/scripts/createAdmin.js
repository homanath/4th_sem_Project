const { User } = require('../models');
const bcrypt = require('bcryptjs');

async function createAdminUser() {
  try {
    const adminExists = await User.findOne({
      where: { email: 'admin@example.com' }
    });

    if (adminExists) {
      console.log('Admin user already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);

    await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      status: 'active'
    });

    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

createAdminUser(); 