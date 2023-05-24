'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'level', {
      type: Sequelize.ENUM(['ADMINISTRADOR', 'CLIENTE', 'ENTREGADOR', 'CARRO']),
      allowNull: false
    })
    return Promise.resolve();
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'level')
    return Promise.resolve();
  }
};
