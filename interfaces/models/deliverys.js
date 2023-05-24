const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Deliverys', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    idOrder: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'Orders',
        key: 'id'
      }
    },
    idUser: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    idDeliveryStatus: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'DeliveryStatus',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'Deliverys',
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
        name: "idOrder",
        using: "BTREE",
        fields: [
          { name: "idOrder" },
        ]
      },
      {
        name: "idUser",
        using: "BTREE",
        fields: [
          { name: "idUser" },
        ]
      },
      {
        name: "idDeliveryStatus",
        using: "BTREE",
        fields: [
          { name: "idDeliveryStatus" },
        ]
      },
    ]
  });
};
