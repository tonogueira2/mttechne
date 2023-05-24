const database = require('../config/mysql')[process.env.NODE_ENV];
const dotenv = require('dotenv');

if (dotenv.config({
  path: `env/${process.env.NODE_ENV}.env`
}).error) {
  throw new Error(`Verify that .env file exists in the env folder`);
}

database.database = process.env.DB_MYSQL_DATABASE
database.username = process.env.DB_MYSQL_USER
database.password = process.env.DB_MYSQL_PASSWORD
database.host = process.env.DB_MYSQL_HOSTS
database.port = process.env.DB_MYSQL_PORT
//database.dialectOptions = { decimalNumbers: true }

const Sequelize = require('sequelize');
const sequelize = new Sequelize(database);

module.exports = sequelize;