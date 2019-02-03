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
            return result
        }
    },
    {
        method: 'GET',
        path: '/books',
        config: { auth: false },  // jwt auth override of default
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
            return result
        }
    },
    {
        method: 'GET',
        path: '/users',
        config: { auth: 'jwt' },
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


