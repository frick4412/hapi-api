/*
  async
  pool
  cors
*/


'use strict';

const Hapi = require('hapi');
const sql = require('mssql')

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

const pool = new sql.ConnectionPool(dbconfig, err => {
  if (err) {
      console.log('Error 1', err);
  }
})

pool.on('error', err => {
    console.log("pool error...");
    console.log('Error 2', err);
})

// simple query with parameter
server.route({
    method: 'GET',
    path: '/book/{id}',
    handler: (request, h) => {
        var id = encodeURI(request.params.id)
        var result = (async function () {
            try {
                let result = await pool.request()
                .input("id", sql.Int, id)
                .query("select * from books where Id = @id")
                return result
            } catch (err) {
                // ... error checks
                console.log('Error 3', err)
                return err
            }
        })();
        return result;
    }
});

server.route({
    method: 'GET',
    path: '/books',
    handler: (request, h) => {
        var id = encodeURI(request.params.id)
        var result = (async function () {
            try {
                let result = await pool.request()
                .query("select * from books")
                console.log(result)
                console.log(result.recordsets[0][0])
                return result
            } catch (err) {
                // ... error checks
                console.log('Error 3', err)
                return err
            }
        })();
        return result;
    }
});

// simple query
server.route({
    method: 'GET',
    path: '/users',
    handler: (request, h) => {
        var result = (async function () {
            try {
                let result = await pool.request()
                .query("select * from users")
                console.log(result)
                console.log(result.recordsets[0][0])
                console.log(result.recordsets[0][0].Username)
                console.log(result.recordsets[1])
                console.log(result.recordsets[2])
                console.log(result.recordsets[3])
                // console.log(result.recordsets[1])
                // console.log(result.recordsets[2])
                let data = result.recordsets[0]
                let cnt  = result.recordsets[2]
                let res = {data:data, count:cnt}
                return res
            } catch (err) {
                // ... error checks
                console.log('Error 4', err)
                return err
            }
        })();
        return result;
    }
});

// multiple queries/results returned
server.route({
    method: 'GET',
    path: '/bookandusers/{id}',
    handler: (request, h) => {
        var id = encodeURI(request.params.id)
        var result = (async function () {
            try {
                let result = await pool.request()
                .input("id", sql.Int, id)
                .query("select * from books where Id = @id; select * from users")
                return result
            } catch (err) {
                // ... error checks
                console.log('Error 5', err)
                return err
            }
        })();
        return result;
    }
});



const init = async () => {


    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

    console.log('Error 6', err);
    process.exit(1);
});

init();
