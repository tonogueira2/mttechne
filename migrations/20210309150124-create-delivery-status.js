'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const DeliveryStatus = queryInterface.createTable('DeliveryStatus', {
      id: {
        type: Sequelize.INTEGER(11).UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      name:{
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
    return DeliveryStatus;
  },

  down: queryInterface => queryInterface.dropTable('DeliveryStatus'),
};
