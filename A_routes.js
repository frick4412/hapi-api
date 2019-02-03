const { poolPromise } = require('./A_db')

module.exports = [
    {
        method: 'POST',
        path: '/login',
        config: { auth: false },
        handler: (request, h) => {
            // check authorization and authentication
            // var authorized = true
            // var authenticated = true
            // create JWT
            // jwt.sign({}, 'secret')
            // return JWT
            var result = 'login result'
            return result
        }
    },
    {
        method: 'GET',
        path: '/books',
        config: { auth: false },  // jwt auth override of default
        handler: async (req, res) => {
            try {
                const pool = await poolPromise
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
                const pool = await poolPromise
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


