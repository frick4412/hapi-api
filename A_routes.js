const { sql, poolPromise } = require('./A_db')

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
                    .query("select * from users")
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
        config: { auth: false },  // jwt auth override of default
        handler: async (req, res) => {
            try {
                var id = encodeURI(req.params.id)
                const pool = await poolPromise
                const result = await pool.request()
                    .input("id", sql.Int, id)
                    .query("select * from books where Id = @id; select * from users")
                return result
            } 
            catch (err) {
                console.log(err)
            }
        }
    },
    {
        method: 'GET',
        path: '/book1and2',
        config: { auth: false },  // jwt auth override of default
        handler: async (req, res) => {
            try {
                console.log("Querying...")
                var id = encodeURI(req.params.id)
                const pool = await poolPromise
                const result1 = await pool.request()
                    .query("select * from books where Id = 1")
                console.log(result1.recordset[0].Title) // see terminal running A_server.js                   
                const result2 = await pool.request()
                    .query("select * from books where Id = 2")
                console.log(result2.recordset[0].Title)                    

                return {result1, result2}
            } 
            catch (err) {
                console.log(err)
            }
        }
    }
]

