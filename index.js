const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');
const app = express()
require('dotenv').config()
const port =process.env.PORT || 5000


// middleware
app.use(cors(
  {
    origin: ["http://localhost:5173"],
    credentials: true,

  }
))
app.use(express.json())
app.use(cookieParser())

// cookieOption
const cookieOption ={
  httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true:false,
      sameSite: process.env.NODE_ENV === "production" ? "none": "strict"
}

///verofy tocken 
const verifyToken = async (req,res,next) =>{
  const token = req.cookies?.token;
  // console.log("This is my token", token)
  if(!token){
    return res.status(401).send({meassage: "not Authrich"})
  }

  jwt.verify(token,process.env.ACCESS_TOCKEN ,(err,decoded) =>{
   if(err){
    return res.status(401).send({meassage: "not Authrich"})
   }

   req.user = decoded;
   next()
  })
 
}
// verifyToken

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

    const database = client.db("HotelData");
    const dbAllRoomCollection = database.collection("AllRooms");

    // auth apiz
    // auth apiz
  app.post('/jwt',async(req,res)=>{
    const user = req.body;
    const token = jwt.sign(user,process.env.SECRET_TOKEN,{expiresIn:"20d"});
    res.cookie("token",token,cookieOption).send({success : true})
  })

  // logOut user and delete cookie
  app.post('/logOut',async(req,res)=>{
      const user = req.body;
      
      console.log(user)
      res.clearCookie("token",{...cookieOption,maxAge:0}).send({success:true})
  })
  // logout user 

  // get all rooms
  app.get('/allRoom',async(req,res) =>{
     const result =await dbAllRoomCollection.find().toArray()
     console.log(result)
     res.send(result)
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