const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const ObjectID = require('mongodb').ObjectID
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

require('dotenv').config()


const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.fjsvr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const eventsCollection = client.db(process.config.DB_NAME).collection("events");
  const registeredEvents = client.db(process.config.DB_NAME).collection("registered");
  //mongo scope start
  app.get('/show-volunteers', (req,res)=>{
    eventsCollection.find({})
    .toArray((error, documents)=>{
      res.send(documents)
    })
  })

  app.get('/all-registered-events',(req,res)=>{
    registeredEvents.find({})
    .toArray((error,documents)=>{
      res.send(documents)
      
    })
  })

  app.get('/my-events',(req,res)=>{
    registeredEvents.find({email:req.headers.email})
    .toArray((error,documents)=>{
      res.send(documents)
      
    })
  })

    app.post('/submit-form',(req,res)=>{
      registeredEvents.insertOne(req.body)
      .then(result=>{
        
        res.send(result.insertedCount>0)
      })
    })

    app.post('/add-event',(req,res)=>{
      eventsCollection.insertOne(req.body)
      .then(result=>{
        res.send(result.insertedCount>0)
      })
    })


    app.delete('/cancel-event',(req,res)=>{
      registeredEvents.deleteOne({_id:ObjectID(req.headers.id)})
      .then(result=>{
        
        res.send(result.deletedCount>0)
      })
    })

    app.delete('/delete-event',(req,res)=>{
      registeredEvents.deleteOne({_id:ObjectID(req.headers.id)})
      .then(result=>{
        
        res.send(result.deletedCount>0)
      })
    })


  //mongo scope end
});



const PORT = process.env.PORT || 3001
app.listen(PORT, ()=>{
    console.log('Server is running with '+PORT+' port')
})