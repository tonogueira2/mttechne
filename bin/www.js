const logger = require('../helpers/logger');
const config = require('config');
const dotenv = require('dotenv');
const fs = require('fs');
const httpServer = require('http');
const app = require('../app');

if (!process.env.NODE_ENV) {
  let msg = "ERROR: SERVER RUNNING WITHOUT NODE_ENV CONFIG!";
  logger.info(msg);
  throw new Error(msg);
}

if (dotenv.config({
    path: `env/${process.env.NODE_ENV}.env`
  }).error) {
  throw new Error(`Verify that .env file exists in the env folder`);
}

const port = process.env.PORT ? process.env.PORT : 3000;
app.set('port', port);

const server = httpServer.createServer(app);


/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ?
    'Pipe ' + port :
    'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}


/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  const addr = server.address();

  logger.info("SERVER RUNNING...");
  logger.info("SERVER CONFIG: " + config.name);
  logger.info("SERVER PORT: " + addr.port);
}

/**
 * Listen on provided port, on all network interfaces.
 */
server.on('error', onError);
server.on('listening', onListening);
server.listen(port);