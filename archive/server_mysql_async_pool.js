'use strict';

const Hapi = require('hapi');
const sql = require('mssql')

const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

// get client
const mysql = require('mysql2');
// create the pool
const pool = mysql.createPool({
  host: '192.168.1.116',
  database: 'employees',
  user: 'apiuser',
  password: 'greenway',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// simple query with parameter
server.route({
    method: 'GET',
    path: '/emp',
    handler: (request, h) => {
      return query1(pool);
    }
});


// async query from pool
async function query1(pool) {
  // get a promise wrapped instance of the pool
  const promisePool = pool.promise();
  // query database using promises
  const [rows, fields] = await promisePool.query("\
    SELECT emp_no, first_name, last_name \
    from employees \
    where emp_no = ? \
    limit 5 \
  ", [10001]);
  console.log(rows);
  console.log(fields);
  return rows;
}

// async query from pool
async function query2(pool) {
  // get a promise wrapped instance of the pool
  const promisePool = pool.promise();
  // query database using promises
  const [rows, fields] = await promisePool.query("\
    SELECT dept_no, dept_name \
    from departments \
    where dept_no = ? \
    limit 5 \
  ", ['d002']);
  console.log(rows);
  console.log(fields);
}
