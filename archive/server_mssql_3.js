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

const server = Hapi.server({
    port: 3000,
    host: 'localhost',
    routes: {
        cors: true
    }
});

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

// Promise style connection pooling
const apipool = new sql.ConnectionPool(dbconfig);
/*
apipool.on('error', err => {
    console.log("pool error...");
    console.log('Error 2', err);
})
*/
/*
function queryBooks() {
    return apipool.then((pool) => {
        pool.request().query('select 1 as number', (err, result) => {
            // ... error checks     
            console.dir(result)
        })        
    });
}
*/

const init = async () => {
    /*
    await server.register(require('hapi-auth-jwt2'));
    server.auth.strategy('jwt', 'jwt', {
        key: 'FarmersFurniture',          // Never Share your secret key
        validate: validate,            // validate function defined above
        verifyOptions: { algorithms: [ 'HS256' ] } // pick a strong algorithm
    });
    server.auth.default('jwt');
    */

    server.route ({
        method: 'GET',
        path: '/login',
        config: { auth: false },
        handler: (request, h) => {
            // check authorization and authentication
            // var authorized = true
            // var authenticated = true
            // create JWT
            // jwt.sign({}, 'secret')
            // return JWT
            return 'test'
        }
    })
    server.route ({
        method: 'GET',
        path: '/books',
        config: { auth: false },  // jwt auth override of default
        handler: (request, h) => {
            apipool.connect(function(err) {
                
            })              
            return result
        }
    })
    server.route ({
        method: 'GET',
        path: '/users',
        // config: { auth: 'jwt' },
        handler: (request, h) => {
            var result = (async function () {
                try {
                    let result = await pool.request()
                    .query("select * from users")
                    console.log(result)
                    console.log(result.recordsets[0][0])
                    // console.log(result.recordsets[0][0].Username)
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
    })
    server.route ({
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
    })    

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.log('Error 6', err);
    process.exit(1);
});

init();
