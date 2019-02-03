'use strict';

const Hapi = require('hapi');
const sql = require('mssql');

const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

const dbconfig = {
    user: 'scrombie',
    password: 'greenway',
    server: '192.168.1.123', // You can use 'localhost\\instance' to connect to named instance
    database: 'Testing',
    port: 1433,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: false
    }
}

const pool = new sql.ConnectionPool(dbconfig)
pool.on('error', err => {
    console.log("pool error...");
    console.log('Error 2', err);
})
/*
*/

server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
        
        return 'Hello, world!';
    }
});

/*
server.route({
    method: 'GET',
    path: '/{name}',
    handler: (request, h) => {
        
        return 'Hello, ' + encodeURIComponent(request.params.name) + '!';
    }
});
*/

/*
server.route({
    method: 'GET',
    path: '/users',
    handler: (request, h) => {
        var result = (async function () {
            try {
                let result = await pool.request()
                .query("select * from users")
                return result
            } catch (err) {
                // ... error checks
                console.log('Error 4', err)
                return err
            }
        })();
        return result;
    }
});
*/

const init = async () => {

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();