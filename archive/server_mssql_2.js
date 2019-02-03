/*
  async
  pool
  cors
*/


'use strict';

const env = 'dev'  // dev or live

const Hapi = require('hapi')
const sql = require('mssql')
var jwt = require('jsonwebtoken')

if (env == 'live') {
    const server = Hapi.server({
        port: 3000,
        host: '192.168.1.123',
        routes: {
            cors: true
        }
    });
} else {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
        routes: {
            cors: true
        }
    });
}

// define "users database"
const users = {
    1: {
        id: 1,
        name: 'scrombie'
    }
}

// custom validation function
const validate = async function (decoded, request) {
    // chec to see if person is valid
    if (!people[decoded.id]) {
        return { isValid: false };
    } else {
        return { isValid: true };
    }    
}

const dbconfig = {
    user: 'scrombie',
    password: 'greenway',
    server: '192.168.1.123', // You can use 'localhost\\instance' to connect to named instance
    database: 'Testing',
    port: 1433,
    stream: false,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: false
    }
}

const pool = new sql.ConnectionPool(dbconfig, err => {
  if (err) {
      console.log('Error 1', err);
  }
})

pool.on('error', err => {
    console.log("pool error...");
    console.log('Error 2', err);
})


const init = async () => {
    await server.register(require('hapi-auth-jwt2'));
    server.auth.strategy('jwt', 'jwt', {
        key: 'FarmersFurniture',          // Never Share your secret key
        validate: validate,            // validate function defined above
        verifyOptions: { algorithms: [ 'HS256' ] } // pick a strong algorithm
    });
    server.auth.default('jwt');

    var routes = require('./server_routes.js')
    server.route(routes)

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.log('Error 6', err);
    process.exit(1);
});

init();
