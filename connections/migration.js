const dotenv = require('dotenv');

if (dotenv.config({
  path: `env/${process.env.NODE_ENV}.env`
}).error) {
throw new Error(`Verify that .env file exists in the env folder`);
}

const {dialect} = require('../config/mysql')[process.env.NODE_ENV];

module.exports = {
  development: {
    database: process.env.DB_MYSQL_DATABASE,
    username: process.env.DB_MYSQL_USER,
    password: process.env.DB_MYSQL_PASSWORD,
    host: process.env.DB_MYSQL_HOSTS,
    dialect: dialect
  },
  test: {
    database: process.env.DB_MYSQL_DATABASE,
    username: process.env.DB_MYSQL_USER,
    password: process.env.DB_MYSQL_PASSWORD,
    host: process.env.DB_MYSQL_HOSTS,
    dialect: dialect
  },
  staging: {
    database: process.env.DB_MYSQL_DATABASE,
    username: process.env.DB_MYSQL_USER,
    password: process.env.DB_MYSQL_PASSWORD,
    host: process.env.DB_MYSQL_HOSTS,
    dialect: dialect
  },
  production: {
    database: process.env.DB_MYSQL_DATABASE,
    username: process.env.DB_MYSQL_USER,
    password: process.env.DB_MYSQL_PASSWORD,
    host: process.env.DB_MYSQL_HOSTS,
    dialect: dialect
  }
};