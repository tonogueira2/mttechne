'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Orders', 'idPayment', {
      type: Sequelize.STRING(256),
      after: 'idOrderStatus',
      allowNull: true,
      defaultValues: null
    })
    await queryInterface.addColumn("UserLocations", "cep",{
      type: Sequelize.STRING(8),
      after: 'country',
      allowNull: true,
      defaultValues: null
    })
    await queryInterface.addColumn("UserLocations", "formattedAddress",{
      type: Sequelize.STRING(256),
      after: 'cep',
      allowNull: true,
      defaultValues: null
    })
    return Promise.resolve();
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Orders', 'idPayment')
    await queryInterface.removeColumn('UserLocations', 'cep')
    await queryInterface.removeColumn('UserLocations', 'formattedAddress')
    return Promise.resolve();
  }
};
