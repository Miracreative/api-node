const  Pool  = require("pg").Pool;

const pool = new Pool({
    user: 'nanalit',
    password: 's123s345',
    host: '127.0.0.1',
    port: 5432,
    database: "atman"
})

console.log(pool.log)

module.exports = pool