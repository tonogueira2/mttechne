const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('OrderItens', {
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
    idProducts: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'Products',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'OrderItens',
    timestamps: true,
    indexes: [
      {
        name: "idOrder",
        using: "BTREE",
        fields: [
          { name: "idOrder" },
        ]
      },
      {
        name: "idProducts",
        using: "BTREE",
        fields: [
          { name: "idProducts" },
        ]
      },
    ]
  });
};
