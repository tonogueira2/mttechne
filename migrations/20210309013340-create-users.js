'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const UsersTable = queryInterface.createTable('Users', {
      id: {
        type: Sequelize.INTEGER(11).UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING(256),
      },
      email: {
        type: Sequelize.STRING(256),
        allowNull: false,
      },
      cpf: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING(11),
      },
      telefone: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING(11),
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING(256),
      },
      salt: {
        allowNull: false,
        type: Sequelize.STRING(256),
      },
      level: {
        type: Sequelize.ENUM(['ADMINISTRADOR', 'CLIENTE', 'ENTREGADOR', 'CARRO']),
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

    return UsersTable;
  },

  down: queryInterface => queryInterface.dropTable('Users'),
};
