const  Pool  = require("pg").Pool;

const pool = new Pool({
    user: 'nana',
    password: 's123s345',
    host: '83.147.246.205',
    port: 5432,
    database: "node_postgres"
})

module.exports = pool