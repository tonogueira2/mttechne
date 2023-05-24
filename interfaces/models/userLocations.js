const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('UserLocations', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    idUser: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    street: {
      type: DataTypes.STRING(256),
      allowNull: false,
    },
    number: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING(128),
      allowNull: false,
    }, 
    cep: {
      type: DataTypes.STRING(8),
      allowNull: true,
    }, 
    formattedAddress: {
      type: DataTypes.STRING(256),
      allowNull: true,
    },
    latitude: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    longitude: {
      type: DataTypes.STRING(64),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'UserLocations',
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
        name: "id",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "idUser",
        using: "BTREE",
        fields: [
          { name: "idUser" },
        ]
      },
    ]
  });
};
