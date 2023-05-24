'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const UserOrders = queryInterface.createTable('UserOrders', {
      idUser: {
        type: Sequelize.INTEGER(11).UNSIGNED,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      idOrder:{
        type: Sequelize.INTEGER(11).UNSIGNED,
        allowNull: false,
        references: {
          model: 'Orders',
          key: 'id',
        },
      },
      idUserLocations:{
        type: Sequelize.INTEGER(11).UNSIGNED,
        allowNull: true,
        defaultValue:null,
        references: {
          model: 'UserLocations',
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
    return UserOrders;
  },

  down: queryInterface => queryInterface.dropTable('UserOrders'),
};
