const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('DeliveryHistory', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    idDelivery: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'Deliverys',
        key: 'id'
      }
    },
    location: {
      type: DataTypes.STRING(256),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'DeliveryHistory',
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
        name: "idDelivery",
        using: "BTREE",
        fields: [
          { name: "idDelivery" },
        ]
      },
    ]
  });
};
