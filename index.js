const express = require('express')
const app = express()
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5005
const cors = require('cors')
app.use(cors())
app.use(express.json())


console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.f8w8siu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

console.log(uri);


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    const coffeeCollection = client.db('coffeeDB').collection('coffee')
    const userCollection = client.db('coffeeDB').collection('user')
    app.get('/coffee',async(req,res)=>{
       const cursor = coffeeCollection.find()
       const result = await cursor.toArray()
       res.send(result)
    })
    app.get('/coffee/:id',async(req,res)=>{
        const id = req.params.id
        const query = {_id : new ObjectId(id)}
        const result = await coffeeCollection.findOne(query)
        res.send(result)
    })
    
    app.post('/coffee',async(req,res)=>{
       const newCoffee = req.body;
       console.log(newCoffee);
       const result = await coffeeCollection.insertOne(newCoffee)
       res.send(newCoffee)
    })

    app.delete('/coffee/:id',async(req,res)=>{
        const id = req.params.id
        const query = {_id : new ObjectId(id)}
        const result = await coffeeCollection.deleteOne(query)
        res.send(result)
    })

    app.put('/coffee/:id',async(req,res)=>{
        const id = req.params.id
        const fillter = {_id : new ObjectId(id)}
        const options = {upsert: true}
        const updatedCoffee = req.body
        const coffee = {
           $set:{
            name:updatedCoffee.name,quantity:updatedCoffee.quantity,supplier:updatedCoffee.supplier,test:updatedCoffee.test,category:updatedCoffee.category,details:updatedCoffee.details,photo:updatedCoffee.photo
           }
        }
          const result = await coffeeCollection.updateOne(fillter,coffee,options)
          res.send(result)
    })

    // user related api 
    app.get('/user',async(req,res)=>{
      const cursor = userCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    app.post('/user',async(req,res)=>{
        const user = req.body;
        console.log(user);
        const result = await userCollection.insertOne(user)
        res.send(result)
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






app.get('/', (req, res) => {
    res.send('Hello World! it s me how are you')
  })



  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })

  
