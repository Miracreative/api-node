const  Pool  = require("pg").Pool;

const pool = new Pool({
    user: 'atman',
    password: 's123s345',
    host: '127.0.0.1',
    port: 5432,
    database: "atman"
})

module.exports = pool