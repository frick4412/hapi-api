'use strict';

const env = 'dev'  // dev or live

const Hapi = require('hapi')
const routes = require('./B_routes.js')

const server = Hapi.server({
    port: 3000,
    host: 'localhost',
    routes: {
        cors: true
    }
});

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

const init = async () => {
    server.route(routes)

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.log('Error 6', err);
    process.exit(1);
});

init();
