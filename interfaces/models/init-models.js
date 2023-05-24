const sequelize = require('../../connections/mysql');

var DataTypes = require("sequelize").DataTypes;
var _deliveryHistory = require("./deliveryHistory");
var _deliveryStatus = require("./deliveryStatus");
var _deliverys = require("./deliverys");
var _orderItens = require("./orderItens");
var _orderStatus = require("./orderStatus");
var _orders = require("./orders");
var _products = require("./products");
var _userLocations = require("./userLocations");
var _userOrders = require("./userOrders");
var _users = require("./users");
var _realLocation = require("./realLocation");
var _stockDriver = require("./stockDrivers");
var _stockConfig = require("./stockConfig");

function initModels() {
  var deliveryHistory = _deliveryHistory(sequelize, DataTypes);
  var deliveryStatus = _deliveryStatus(sequelize, DataTypes);
  var deliverys = _deliverys(sequelize, DataTypes);
  var orderStatus = _orderStatus(sequelize, DataTypes);
  var orders = _orders(sequelize, DataTypes);
  var products = _products(sequelize, DataTypes);
  var userLocations = _userLocations(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);
  var _sequelize = sequelize;
  var orderItens = _orderItens(sequelize, DataTypes);
  var userOrders = _userOrders(sequelize, DataTypes);
  var realLocation = _realLocation(sequelize, DataTypes);
  var stockDriver = _stockDriver(sequelize, DataTypes);
  var stockConfig = _stockConfig(sequelize, DataTypes);

  deliveryStatus.hasMany(deliverys, { as: "deliverys", foreignKey: "idDeliveryStatus" });
  deliverys.hasMany(deliveryHistory, { as: "deliveryHistorys", foreignKey: "idDelivery" });
  orderStatus.hasMany(orders, { as: "orders", foreignKey: "idOrderStatus" });
  orders.hasMany(deliverys, { as: "deliverys", foreignKey: "idOrder" });
  orders.hasMany(orderItens, { as: "orderItens", foreignKey: "idOrder"});
  users.hasMany(deliverys, { as: "deliverys", foreignKey: "idUser" });
  users.hasMany(userLocations, { as: "userLocations", foreignKey: "idUser" });
  users.hasMany(realLocation, { as: "realLocation", foreignKey: "idUser" });
  users.hasMany(stockDriver, { as: "stockDriver", foreignKey: "idUser" });
  products.hasMany(stockDriver, { as: "stockDrivers", foreignKey: "idProducts" });
  products.hasMany(stockConfig, { as: "stocksConfig", foreignKey: "idProducts" });
  userLocations.hasMany(userOrders, { as: "userOrders", foreignKey: "idUserLocations" });
  deliverys.belongsTo(deliveryStatus, { as: "deliveryStatus", foreignKey: "idDeliveryStatus" });
  deliveryHistory.belongsTo(deliverys, { as: "delivery", foreignKey: "idDelivery" });
  deliverys.belongsTo(orders, { as: "order", foreignKey: "idOrder" });
  deliverys.belongsTo(users, { as: "user", foreignKey: "idUser" });
  userLocations.belongsTo(users, { as: "user", foreignKey: "idUser" });
  realLocation.belongsTo(users, { as: "user", foreignKey: "idUser" });
  orderItens.belongsTo(products, { as: "product", foreignKey: "idProducts"});
  userOrders.belongsTo(orders, { as: "order", foreignKey: "idOrder"});
  userOrders.belongsTo(users, { as: "user", foreignKey: "idUser"});
  userOrders.belongsTo(userLocations, { as: "userLocations", foreignKey: "idUserLocations"});
  stockDriver.belongsTo(products, { as: "product", foreignKey: "idProducts"});
  stockDriver.belongsTo(users, { as: "user", foreignKey: "idUser"});
  stockConfig.belongsTo(products, { as: "product", foreignKey: "idProducts"});
  //orderItens.belongsTo(orders, { as: "order", foreignKey: "idOrder"});
  //orders.belongsTo(orderStatus, { as: "orderStatus", foreignKey: "idOrderStatus"});
  //users.hasMany(userOrders, { as: "userOrders", foreignKey: "idUser"});
  //orders.hasMany(userOrders, { as: "userOrders", foreignKey: "idOrder"});
  //products.hasMany(orderItens, { as: "orderItens", foreignKey: "idProducts"});
  users.belongsToMany(orders, { as: "orders", foreignKey: "idUser", through: 'UserOrders' });
  orders.belongsToMany(users, { as: "users", foreignKey: 'idOrder', through: 'UserOrders' });

  orders.belongsToMany(products, { as: "products", foreignKey: 'idOrder', through: 'OrderItens' });
  products.belongsToMany(orders, { as: "orders", foreignKey: 'idProducts', through: 'OrderItens' });

  return {
    deliveryHistory,
    deliveryStatus,
    deliverys,
    orderStatus,
    orders,
    products,
    userLocations,
    users,
    orderItens,
    userOrders,
    realLocation,
    stockDriver,
    stockConfig,
    _sequelize,

  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
