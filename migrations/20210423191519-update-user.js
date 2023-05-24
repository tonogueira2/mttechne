'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'imei', {
      type: Sequelize.STRING(50),
      after: 'level',
      allowNull: true,
      defaultValues: null
    })
    return Promise.resolve();
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'imei')
    return Promise.resolve();
  }
};
