require('dotenv').config()

const express = require('express')
const cors = require('cors')
const db = require('./api')
const port = process.env.PORT

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.get('/api/posts', db.getPosts)

app.listen(port, () => {
  console.log(`Node server running on http://localhost:${port}`)
})

//TEST TEST