const sql = require('mssql')

const dbconfig = {
    user: 'scrombie',
    password: 'greenway',
    server: '192.168.1.113', // You can use 'localhost\\instance' to connect to named instance
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

const poolPromise = new sql.ConnectionPool(dbconfig)
  .connect()
  .then(pool => {
    console.log('Connected to MSSQL')
    return pool
  .on('error', err => {
    return err;
  })
  })
  .catch(err => console.log('Database Connection Failed! Bad Config: ', err))

module.exports = {
  sql, poolPromise
}
