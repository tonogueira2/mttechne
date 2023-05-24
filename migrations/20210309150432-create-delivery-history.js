'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const DeliveryHistory = queryInterface.createTable('DeliveryHistory', {
      id: {
        type: Sequelize.INTEGER(11).UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      idDelivery:{
        type: Sequelize.INTEGER(11).UNSIGNED,
        allowNull: false,
        references: {
          model: 'Deliverys',
          key: 'id',
        },
      },
      location:{
        allowNull: false,
        type: Sequelize.STRING(256),
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    }, {
      engine: 'InnoDB',
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
    return DeliveryHistory;
  },

  down: queryInterface => queryInterface.dropTable('DeliveryHistory'),
};
