const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('UserOrders', {
    idUser: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    idOrder: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'Orders',
        key: 'id'
      }
    }
    ,
    idUserLocations: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'UserLocations',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'UserOrders',
    timestamps: true,
    indexes: [
      {
        name: "idUser",
        using: "BTREE",
        fields: [
          { name: "idUser" },
        ]
      },
      {
        name: "idOrder",
        using: "BTREE",
        fields: [
          { name: "idOrder" },
        ]
      },
    ]
  });
};
