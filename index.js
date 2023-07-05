const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const http = require("http");
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));

const {MongoClient,ServerApiVersion, ConnectionClosedEvent} = require("mongodb");
const uri = "mongodb+srv://chaitanyasaim5:chaitanyasai@cluster0.klesare.mongodb.net/iot_project";
const client = new MongoClient(uri,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    serverApi:ServerApiVersion.v1,
});
client.connect;

app.get("/",(req,res)=>{
    var lat = req.body.latitude;
    var lon = req.body.longitude;
    

    
})
app.post("/", async (req, res) => {
    var latitude = req.body.latitude;
    var longitude = req.body.longitude;
    var _id = req.body._id;
    var accuracy = req.body.accuracy;
    const collection = client.db().collection("location");
  
    const existingUser = await collection.findOne({ _id });
  
    if (existingUser) {
      // User exists in the database
      if (latitude !== "" && longitude !== "") {
        // Both lat and lon are not null, update the user data
        await collection.updateOne({ _id }, { $set: { latitude, longitude, accuracy } });
        res.status(200).json({ message: "User data updated successfully" });
      } else {
        // Either lat or lon is null, no update needed
        res.status(200).json({ message: "User data not updated" });
      }
    } else {
      // User does not exist, insert new user if lat and lon are not null
      if (latitude !== "" && longitude !== "") {
        await collection.insertOne({ _id, latitude, longitude, accuracy });
        res.status(200).json({ message: "User data inserted successfully" });
      } else {
        res.status(200).json({ message: "User data not inserted" });
      }
    }
  });
  
  

  app.post("/signup", async (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    var rfid = req.body.rfid;
    var amount = 0;
  
    const collection = client.db().collection("users");
  
    try {
      const existingUser = await collection.findOne({ _id: username });
  
      if (existingUser) {
        if (!existingUser.password && password) {
          // Update the existing user's password with the entered one
          await collection.updateOne(
            { _id: username },
            { $set: { password: password } }
          );
          res.send("Password updated successfully");
        } else {
          res.send("Username already exists");
        }
      } else {
        // Insert a new user
        if (rfid) {
          const userWithRFID = await collection.findOne({ rfid: rfid });
  
          if (userWithRFID) {
            // Increment the amount for the user with the matching RFID
            await collection.updateOne(
              { rfid: rfid },
              { $inc: { amount: 15 } }
            );
            res.send("Amount incremented successfully");
          } else {
            // Insert a new user with the provided RFID
            await collection.insertOne({
              _id: username,
              password: password,
              amount: amount,
              rfid: rfid,
            });
            res.send("User created successfully");
          }
        } else {
          // Insert a new user without RFID
          await collection.insertOne({
            _id: username,
            password: password,
            amount: amount,
          });
          res.send("User created successfully");
        }
      }
    } catch (e) {
      console.log(e);
    }
  });
  
  
  
  

app.get("/users",async(req,res)=>{
    const collection = client.db().collection("users");
    
    try{
        const allUsers =await collection.find().toArray();
        console.log(allUsers);
        res.send(allUsers);
    }catch(e){
        console.log(e);
    }
    
})

app.get("/admin",async(req,res)=>{
    const collection = client.db().collection("location");
    
    try{
        const allUsers =await collection.find().toArray();
        console.log(allUsers);
        res.send(allUsers);
    }catch(e){
        console.log(e);
    }
    
})

app.post("/drivers",async(req,res)=>{
  const adminname = req.body.adminname;
  const password = req.body.password;

  const collection = client.db().collection("drivers");

  try{
    await collection.insertOne({_id:adminname,password:password});
    res.send("Succesfully Posted");

  }catch(e){
    console.log(e);
  }

  
})

app.get("/drivers",async(req,res)=>{
  const collection = client.db().collection("drivers");

  try{
    const allAdmins = await collection.find().toArray();
    console.log(allAdmins);
    res.send(allAdmins);

  }catch(e){
    console.log(e);
  }
})




app.listen("4000",()=>{
    console.log("Connected to the Server 4000");
})


