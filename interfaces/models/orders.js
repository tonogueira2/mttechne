const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Orders', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    idOrderStatus: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'OrderStatus',
        key: 'id'
      }
    },
    idPayment:{
      type: DataTypes.STRING(256),
      allowNull:true
    }
  }, {
    sequelize,
    tableName: 'Orders',
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
        name: "idOrderStatus",
        using: "BTREE",
        fields: [
          { name: "idOrderStatus" },
        ]
      },
    ]
  });
};
