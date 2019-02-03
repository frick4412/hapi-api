'use strict';

const api = {
    env: 'dev', // dev or live
    appname: 'example',
    db: 'Testing'
}

const Hapi = require('hapi')
const sql = require('mssql')
const password_hash = require('password_hash')
const jwt = require('jsonwebtoken')

const server = Hapi.server({
    port: 3000,
    host: 'localhost',
    routes: {
        cors: true
    }
});

// ***** DATABASE CONFIG *****
const dbconfig_testing = {
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

const dbconfig_auth = {
    user: 'scrombie',
    password: 'greenway',
    server: '192.168.1.123', // You can use 'localhost\\instance' to connect to named instance
    database: 'Auth',
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

// ***** PROMISE POOLS *****
const poolPromise_testing = new sql.ConnectionPool(dbconfig_testing)
  .connect()
  .then(pool => {
    console.log('Connected to MSSQL (' + dbconfig_testing.database + ' database)')
    return pool
  })
  .catch(err => console.log('Database Connection Failed! Bad Config: ', err))

const poolPromise_auth = new sql.ConnectionPool(dbconfig_auth)
  .connect()
  .then(pool => {
    console.log('Connected to MSSQL (' + dbconfig_auth.database + ' database)')
    return pool
  })
  .catch(err => console.log('Database Connection Failed! Bad Config: ', err))



const init = async () => {
    // *************************************************************************************
    // ***** ROUTES *****
    server.route({
        method: 'POST',
        path: '/login',
        config: { auth: false },
        handler: async (req, res) => {
            console.log(req.payload)
            var username = req.payload.username // payload for POST, params for GET in URL
            console.log('username: ', username)
            var password = req.payload.password
            var authn = false
            var authz = false
            var authjwt = false
            // AUTHENTICATION (activedirectory)
            authn = true;
            if(authn) {
                // AUTHORIZATION
                try {
                    const pool = await poolPromise_auth 
                    const result = await pool.request() 
                        .input('username', sql.NVarChar, username)
                        .input('appname', sql.NVarChar, api.appname)
                        .query(`select Id, Roles, Location, Email 
                                from authLogins 
                                where 1=1
                                and Username = @username
                                and Appname = @appname
                                and Active = 'Y'`)
                    console.log(result.recordset)
                    if(result.recordset) { authz = true }
                    var userdata = result.recordset[0]
                } 
                catch (err) {
                    console.log(err)
                    authz = false
                }
            }

            console.log('userdata: ', userdata)

            // CREATE JWT
            if(authn && authz) {
                authjwt = '' 
                var salt = password_hash().salt()
                var payload = {}
                var secret = password_hash(password).hash(salt)
                console.log('secret: ', secret)
                var options = {
                    expiresIn: '8h',
                    notBefore: '-5m',
                    subject: api.appname,
                    issuer: api.db,
                    audience: [
                        username, 
                        userdata.Location, 
                        userdata.Roles, 
                        userdata.Email
                    ]
                }
                try {
                    const pool = await poolPromise_auth 
                    const result2 = await pool.request() 
                    .input('secret', sql.NVarChar, secret)
                    .input('id', sql.Int, userdata.Id)
                    .query(`update authLogins
                                set PwHash = @secret
                                where Id = @id`)
                    console.log('result2.rowsAffected: ', result2.rowsAffected)
                }
                catch (err) {
                    console.log('Failed to update PwHash!', err)
                }
                authjwt = jwt.sign(payload, secret, options) 
                console.log('authjwt: ', authjwt)    
                
                try {
                    var tested = jwt.verify(authjwt, secret)
                } catch (err) {
                    console.log(err)
                }
                console.log('tested: ', tested)
            }
            return [authn, authz, authjwt]
        }
    })
    /*
    */
    server.route ({
        method: 'GET',
        path: '/books',
        config: { auth: false },  // jwt auth override of default
        handler: async (req, res) => {
            try {
                const pool = await poolPromise_testing
                const result = await pool.request()
                    .query('select * from books')
                return result.recordset
            } 
            catch (err) {
                console.log(err)
            }
        }
    })
    server.route({
        method: 'GET',
        path: '/users',
        //config: { auth: 'jwt' },
        config: { auth: false },  // jwt auth override of default
        handler: async (req, res) => {
            try {
                const pool = await poolPromise_testing
                const result = await pool.request()
                    .query('select * from users')
                return result.recordset
            } 
            catch (err) {
                console.log(err)
            }
        }
    })
    // *************************************************************************************

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.log('Error 6', err);
    process.exit(1);
});

init();
