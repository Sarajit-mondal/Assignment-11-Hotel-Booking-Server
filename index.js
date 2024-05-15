const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId, ClientSession } = require('mongodb');
const cors = require('cors')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');
const app = express()
require('dotenv').config()
const port =process.env.PORT || 5000


// middleware
app.use(cors(
  {
    origin: ["http://localhost:5173","http://localhost:5174","https://hotel-booking-c0e42.firebaseapp.com/","https://hotel-booking-c0e42.web.app/"],
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
  console.log(token)
  // if(!token){
  //   return res.status(401).send({meassage: "not Authrich"})
  // }

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
    const dbBookingCollection = database.collection("Booking");
    const dbRatingCollection = database.collection("Rating");

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
      res.clearCookie("token",{...cookieOption,maxAge:0}).send({success:true})
  })
  // logout user 

  // get all rooms
  app.get('/allRoom',async(req,res) =>{
     const query = {Availability : "available"}
     const result =await dbAllRoomCollection.find(query).toArray()

     res.send(result)
  })

  // sort by price range 
  app.get('/allRoom/sort',async(req,res)=>{
    const rangeOne = parseInt(req.query.rangeOne)
    const rangeTwo = parseInt(req.query.rangeTwo)
    const result = await dbAllRoomCollection.find({PricePerNight :{$gte:rangeOne, $lte:rangeTwo}}).sort({PricePerNight : 1}).toArray()
    res.send(result)
  })
  //get one data useing id
  app.get('/allRoom/:id',async(req,res)=>{
  const id = req.params.id;
  const query = {_id: new ObjectId(id)}
  const result =await dbAllRoomCollection.findOne(query)
  res.send(result)
  })

  // unavailable  room after booking this room
  // unavailable  room after booking this room
  app.patch('/allRoomUpdate/:id',async(req,res)=>{
    const update = req.body;
    const id = req.params.id;
    const query = {_id :  new ObjectId(id)}

    const updateDoc = {
      $set :{
        Availability : update.update
      }
    }

    const result = await dbAllRoomCollection.updateOne(query,updateDoc)

    res.send(result)
  })
  // review update this room
  app.patch('/allRoomUpdateRewiew/:id',async(req,res)=>{
    const update = req.body;
    const id = req.params.id;
    const query = {_id :  new ObjectId(id)}

    const updateDoc = {
      $set :{
          TotalReviews : update.update
      }
    }

    const result = await dbAllRoomCollection.updateOne(query,updateDoc)

    res.send(result)
   
   
  })
  // update Availability
  app.patch('/allRoomUpdateAvailability/:id',async(req,res)=>{
    const update = req.body;
    const id = req.params.id;
    const query = {_id :  new ObjectId(id)}

    const updateDoc = {
      $set :{
        Availability : update.update
      }
    }

    const result = await dbAllRoomCollection.updateOne(query,updateDoc)

    res.send(result)
   
   
  })

  /// set booking room 
  /// set booking room 
  /// set booking room 
  app.post('/bookingRoom',async(req,res)=>{
    const booking = req.body;
    const result = await dbBookingCollection.insertOne(booking)
    res.send(result)
  })

  // get all booking data
  app.get('/allBooking/:email', async(req,res)=>{
    const currentEmail = req.params.email;
    // if(req.user.email !== currentEmail){
    //   return res.status(403).send({message: "forbidden"})
    // }
    // console.log("woner email",req.user.email)
    let query ={}
    if(req.params?.email){
      query = {userEmail : currentEmail}
    }
    const result = await dbBookingCollection.find(query).toArray()
    res.send(result)
  })
    //  booking data update
    app.patch('/bookingUpdate/:id',async(req,res)=>{
      const update = req.body;
      const id = req.params.id;
      const query = {_id :  new ObjectId(id)}
  
      const updateDoc = {
        $set :{
            checkIn : update.checkIn,
            checkOut:update.checkOut
        }
      }
  
      const result = await dbBookingCollection.updateOne(query,updateDoc)
  
      res.send(result)
    
    })

    // booking delete
    app.delete('/bookingDelete/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
     const result = await dbBookingCollection.deleteOne(query)
     res.send(result)
    
    })

  ///set reviews database
  app.post('/rating',async(req,res) =>{
   const rating = req.body;
    const result =await dbRatingCollection.insertOne(rating)
    res.send(result)
  })
  //get all reviews 
  app.get('/allReview',async(req,res)=>{
    const result = await dbRatingCollection.find().toArray();
    res.send(result)
  })
  app.get('/allReview/sort',async(req,res)=>{
    const result = await dbRatingCollection.find().sort({
      timeStamp : -1}).toArray();
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