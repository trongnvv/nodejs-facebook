#!/usr/bin/env node

/**
 * Module dependencies.
 */

const http = require('http');
const debug = require('debug')('demo:server');

const { NODE_ENV } = process.env;
const app = NODE_ENV !== 'production' ? require('./dev') : require('./prod');

/**
 * Get port from environment and store in Express.
 */

const PORT = normalizePort(process.env.PORT || '4000');
app.set('PORT', PORT);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided PORT, on all network interfaces.
 */

server.listen(PORT);
server.on('error', onError);
server.on('listening', onListening);


const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});

require('../src/services/socket').connect(io);
global.io = io;

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (Number.isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof PORT === 'string' ? `Pipe ${PORT}` : `Port ${PORT}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      // eslint-disable-next-line no-console
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      // eslint-disable-next-line no-console
      console.error(`${bind} is already in use`);
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
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  // eslint-disable-next-line no-console
  console.log(
    `Listening on http://localhost:${addr.port}`,
  );
  debug(`Listening on ${bind}`);
}
