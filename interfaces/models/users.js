const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Users', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    cpf: {
      type: DataTypes.STRING(11),
      allowNull: true,
      unique: "CPF_UNIQUE"
    },
    telefone: {
      type: DataTypes.STRING(11),
      allowNull: false,
      unique: "Telefone_UNIQUE"
    },
    email: {
      type: DataTypes.STRING(256),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    salt: {
      type: DataTypes.STRING(256),
    },
    level: {
      type: DataTypes.ENUM('ADMINISTRADOR', 'CLIENTE', 'ENTREGADOR', 'CARRO'),
      allowNull: false
    },
    imei: {
      type: DataTypes.STRING(50),
      allowNull: true,
      default: null
    }
  }, {
    sequelize,
    tableName: 'Users',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "CPF_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "cpf" },
        ]
      },
      {
        name: "Telefone_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "telefone" },
        ]
      }
    ]
  });
};
