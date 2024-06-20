const Pool = require('pg').Pool

const pool = new Pool({
    host: 'localhost', 
    user: "postgres",
    port: 5432,
    database: "diarybook",
    password: 'avazbek+1201'
})

module.exports = pool