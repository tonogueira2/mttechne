'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const RealLocation = queryInterface.createTable('RealLocation', {
      id: {
        type: Sequelize.INTEGER(11).UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      idUser:{
        type: Sequelize.INTEGER(11).UNSIGNED,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      latitude: {
        type: Sequelize.STRING(64),
        allowNull: false
      },
      longitude: {
        type: Sequelize.STRING(64),
        allowNull: false
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
    return RealLocation;
  },

  down: queryInterface => queryInterface.dropTable('RealLocation'),
};