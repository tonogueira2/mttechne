'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const UserLocation = queryInterface.createTable('UserLocations', {
      id: {
        type: Sequelize.INTEGER(11).UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      idUser: {
        type: Sequelize.INTEGER(11).UNSIGNED,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING(256),
      },
      street: {
        type: Sequelize.STRING(256),
        allowNull: false,
      },
      number: {
        allowNull: false,
        type: Sequelize.INTEGER(11).UNSIGNED,
      },
      city: {
        type: Sequelize.STRING(128),
        allowNull: false,
      },
      state: {
        type: Sequelize.STRING(128),
        allowNull: false,
      },
      country: {
        type: Sequelize.STRING(128),
        allowNull: false,
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

    return UserLocation;
  },

  down: queryInterface => queryInterface.dropTable('UserLocations'),
};
