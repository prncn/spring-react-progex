require('dotenv').config()

const Pool = require('pg').Pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: 'bvx68j0emed82irosdmj-postgresql.services.clever-cloud.com',
  database: 'bvx68j0emed82irosdmj',
  password: process.env.DB_PASS,
  port: '5432'
})

const getPosts = (request, response) => {
  pool.query('select * from posts', (error, result) => {
    if(error) throw error
    response.status(200).json(result.rows)
  })
}

module.exports = { getPosts };