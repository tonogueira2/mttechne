'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('OrderStatus', [
      {
        id: 1,
        name: 'Pendente'
      },
      {
        id: 2,
        name: 'Aguardando pagamento'
      },
      {
        id: 3,
        name: 'Pagamento efetuado'
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
    return queryInterface.bulkDelete('OrderStatus', null, {});
  }
};