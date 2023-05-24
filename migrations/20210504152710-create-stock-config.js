'use strict';


module.exports = {
  up: async (queryInterface, Sequelize) => {
    const StockConfigs = queryInterface.createTable('StockConfigs', {
      id: {
        type: Sequelize.INTEGER(11).UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      idProducts:{
        type: Sequelize.INTEGER(11).UNSIGNED,
        allowNull: false,
        references: {
          model: 'Products',
          key: 'id',
        },
      },
      quantity: {
        allowNull: false,
        type: Sequelize.INTEGER(11).UNSIGNED,
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
    return StockConfigs;
  },

  down: queryInterface => queryInterface.dropTable('StockConfigs'),
};