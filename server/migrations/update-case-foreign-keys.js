'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Drop existing foreign keys
    await queryInterface.removeConstraint('Cases', 'cases_ibfk_1');
    await queryInterface.removeConstraint('Cases', 'cases_ibfk_2');

    // Add new foreign keys with proper constraints
    await queryInterface.addConstraint('Cases', {
      fields: ['lawyerId'],
      type: 'foreign key',
      name: 'cases_lawyer_fk',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('Cases', {
      fields: ['clientId'],
      type: 'foreign key',
      name: 'cases_client_fk',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Cases', 'cases_lawyer_fk');
    await queryInterface.removeConstraint('Cases', 'cases_client_fk');
  }
}; 