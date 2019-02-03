/*
Test routers:
  http://localhost:3000/
  http://localhost:3000/Steven
  http://localhost:3000/hello
  http://localhost:3000/books
*/

/*******************************************
 only good for one query connection problem
 see server_async_pool.js for fix
*******************************************/

'use strict';

const Hapi = require('hapi');
const sql = require('mssql')

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
    options: {
        encrypt: false
    }
}

// simple route
server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {

        return 'Hello, world!';
    }
});

// simple route with parameter
server.route({
    method: 'GET',
    path: '/{name}',
    handler: (request, h) => {

        // request.log(['a', 'name'], "Request name");
        // or
        request.logger.info('In handler %s', request.path);

        return `Hello, ${encodeURIComponent(request.params.name)}!`;
    }
});

// simple route with mssql callback query
server.route({
    method: 'GET',
    path: '/books1',
    handler: (request, h) => {
        sql.connect(dbconfig, err => {
            // error checks
            new sql.Request().query("select * from books", (err, result1) => {
                // error checks
                console.dir(result1)
                return result1
            })
        });
    }
});

// simple route with mssql async query
server.route({
    method: 'GET',
    path: '/books3',
    handler: (request, h) => {
        var result = (async function () {
            try {
                let pool = await sql.connect(dbconfig)
                let result1 = await pool.request()
                .input("id", sql.Int, 1)
                .query("select * from books where Id = @id")
                console.dir(result1)                   
                pool.close()
                return result1
            } catch (err) {
                // ... error checks
                console.log(err)
                return err
            }
        })();
        return result;
    }
});



const init = async () => {

    await server.register(require('inert'));

    await server.register({
        plugin: require('hapi-pino'),
        options: {
            prettyPrint: true,
            logEvents: ['response']
        }
    });

    // simple route to static file
    server.route({
        method: 'GET',
        path: '/hello',
        handler: (request, h) => {
            return h.file('./public/hello.html');
        }
    });

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();
