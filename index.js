const express = require('express')
const MongoClient = require('mongodb').MongoClient;
var cors = require('cors');
var bodyParser = require('body-parser');
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s5oej.mongodb.net/${process.env.DB_NAME}retryWrites=true&w=majority`;

const app = express();
app.use(cors())
app.use(bodyParser.json())
const port = 4000

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db(`${process.env.DB_NAME}`).collection("products");
  const paymentCollection = client.db(`${process.env.DB_NAME}`).collection("paymentInfo");
  const subscriberCollection = client.db(`${process.env.DB_NAME}`).collection("subscribe");

  app.get('/product', (req, res)=>{
      productCollection.find({})
      .toArray((err, documests)=>{
        res.send(documests)
      })
  })

  app.get('/products/:id', (req, res)=>{
    productCollection.find({id: req.params.id})
    .toArray((error, documests)=>{
      res.send(documests[0])
    })
  })

  app.post('/paymentInfo', (req, res)=>{
    const payment = req.body
    paymentCollection.insertOne(payment)
    .then(result =>{
      res.send(result.insertedCount > 0)
    })
  })

  app.post('/subscribe', (req, res)=>{
    const subscribe = req.body
    console.log(subscribe);
    subscriberCollection.insertOne(subscribe)
    .then(result =>{
      res.send(result.insertedCount > 0)
    })
  })


  console.log('database connected');
});


app.get('/', (req, res) => {
    res.send('Hello World! working working')
  })
  
  app.listen(process.env.PORT ||port)
  
