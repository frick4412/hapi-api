const { poolPromise1 } = require('./B_db_1') // Testing database
const { poolPromise2 } = require('./B_db_2') // Auth database

const appname = 'example'

console.log(sql2)

module.exports = [
    {
        method: 'POST',
        path: '/login',
        config: { auth: false },
        handler: (request, h) => {
            // console.log('request: ', request)
            // console.log('h: ', h)
            console.log('poolPromise2.sql2: ', poolPromise2.sql2)
            //console.log('sql2: ', sql2)
            // check authentication
            var authn = true  // TESTING OVERRIDE (use activedirectory)  
            try { // check authorization
                const pool = poolPromise2
                const result = pool.request()
                    .input('username', sql2.NVarChar, request.params.username)
                    .input('appname', sql2.NVarChar, appname)
                    .query(`select * from authLogins 
                            where Username = @username
                            and Appname = @appname
                            and Active = 'Y'`)
                console.log(result.recordset)
                //return result.recordset
                var authz = '???'
            } 
            catch (err) {
                console.log('Failed to authorize!', err)
                var authz = false
            }
            var authz = true  // TESTING OVERRIDE (check database for username, active, )
            if (authz && authn) {
                // create JWT
                var jwt = 'abc123';  // TESTING only
                // nbf, exp, sub (appname), iss (database), aud (array of username, location, roles, email)
                // jwt.sign({}, 'secret')
                // save jwt (?)
                // return JWT
            } else {
                return false
            }
            //var result = 'login result'
            return [authn, authz]
        }
    },
    {
        method: 'GET',
        path: '/books',
        config: { auth: false },  // jwt auth override of default
        handler: async (req, res) => {
            try {
                const pool = await poolPromise1
                const result = await pool.request()
                    .query('select * from books')
                return result.recordset
            } 
            catch (err) {
                console.log(err)
            }
        }
    },
    {
        method: 'GET',
        path: '/users',
        //config: { auth: 'jwt' },
        config: { auth: false },  // jwt auth override of default
        handler: async (req, res) => {
            try {
                const pool = await poolPromise1
                const result = await pool.request()
                    .query('select * from users')
                return result.recordset
            } 
            catch (err) {
                console.log(err)
            }
        }
    },
    {
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
    }    
]
/*
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
        return result
    }
});
*/


