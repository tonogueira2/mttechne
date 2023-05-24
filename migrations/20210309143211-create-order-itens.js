'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const OrderItens = queryInterface.createTable('OrderItens', {
      id: {
        type: Sequelize.INTEGER(11).UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      idOrder:{
        type: Sequelize.INTEGER(11).UNSIGNED,
        allowNull: false,
        references: {
          model: 'Orders',
          key: 'id',
        },
      },
      idProducts:{
        type: Sequelize.INTEGER(11).UNSIGNED,
        allowNull: false,
        references: {
          model: 'Products',
          key: 'id',
        },
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
    return OrderItens;
  },

  down: queryInterface => queryInterface.dropTable('OrderItens'),
};
