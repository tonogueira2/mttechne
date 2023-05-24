'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('DeliveryStatus', [
      {
        id: 1,
        name: 'Pendente'
      },
      {
        id: 2,
        name: 'Coletado'
      },
      {
        id: 3,
        name: 'A Caminho'
      },
      {
        id: 4,
        name: 'Entregue'
      },
      {
        id: 5,
        name: 'Cancelado'
      }
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('DeliveryStatus', null, {});
  }
};
