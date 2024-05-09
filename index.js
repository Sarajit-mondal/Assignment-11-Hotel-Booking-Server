const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const app = express()
require('dotenv').config()
const port = 3000


// middleware
app.use(cors())
app.use(express.json())
app.use(cookieParser())



app.get('/', (req, res) => {
  res.send('server is ranning....')
})

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})