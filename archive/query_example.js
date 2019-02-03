
// node query_example.js

const config = {
    user: 'scrombie',
    password: 'greenway',
    server: '192.168.1.123', // You can use 'localhost\\instance' to connect to named instance
    database: 'Testing',
}

const sql = require('mssql');

(async function () {
    try {
        let pool = await sql.connect(config)
        let result1 = await pool.request()
            //.input('input_parameter', sql.Int, value)
            .query('select * from books')
            
        console.dir(result1)
    
    } catch (err) {
        console.log(err)
    }
})()
 
sql.on('error', err => {
    console.log(err)
})