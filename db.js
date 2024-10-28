// const Pool = require('pg').Pool;

// const pool = new Pool({
//     user: 'postgres',
//     password: 's123s345',
//     host: 'localhost',
//     port: 5432,
//     database: 'node_postgres',
// });

// module.exports = pool;

const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'atman',
    password: 's123s345',
    host: 'localhost',
    port: 5432,
    database: 'atman',
});

module.exports = pool;
