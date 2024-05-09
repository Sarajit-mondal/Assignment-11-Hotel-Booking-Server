const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');
const app = express()
require('dotenv').config()
const port =process.env.PORT || 5000


// middleware
app.use(cors())
app.use(express.json())
app.use(cookieParser())



app.get('/', (req, res) => {
  res.send('server is ranning....')
})

// mongodb database 
// mongodb database 


const uri =`mongodb+srv://${process.env.ADMIN_NAME}:${process.env.PASSWORD}@hotel-booking.a2yhjhv.mongodb.net/?retryWrites=true&w=majority&appName=Hotel-Booking` ;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri);

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });

    app.get('/all',(req,res)=>{
      res.send("mongodb is working")
    })
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// mongodb database 
// mongodb database 

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})