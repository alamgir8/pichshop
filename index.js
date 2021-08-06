const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5055;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World');
});

// little updated connected with public repo

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oqab1.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const serviceCollection = client.db('picture-shop').collection('services');
  const adminCollection = client.db('picture-shop').collection('admins');
  const orderCollection = client.db('picture-shop').collection('orders');

  app.post('/addService', (req, res) => {
    const service = req.body;
    serviceCollection.insertOne(service).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get('/services', (req, res) => {
    serviceCollection.find({}).toArray((error, document) => {
      res.send(document);
    });
  });

  app.post('/addAdmin', (req, res) => {
    const newAdmin = req.body;
    adminCollection.insertOne(newAdmin).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get('/isAdmin', (req, res) => {
    //   const email = req.body.email;
    adminCollection.find({}).toArray((error, document) => {
      res.send(document);
    });
  });

  app.post('/addOrder', (req, res) => {
    const orderedService = req.body;
    orderCollection.insertOne(orderedService).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
  app.get('/orders', (req, res) => {
    orderCollection.find({}).toArray((error, document) => {
      res.send(document);
    });
  });

  app.get('/order', (req, res) => {
    const email = req.query.email;
    orderCollection.find({ email: email }).toArray((error, document) => {
      res.send(document);
    });
  });

  app.patch('/updateService/:id', (req, res) => {
    const updateId = req.params.id;
    const newStatus = req.body.status;
    console.log(newStatus);
    orderCollection
      .updateOne(
        { _id: objectId(updateId) },
        {
          $set: { status: newStatus },
        }
      )

      .then((result) => {
        //   res.redirect('/dashboard/myService')
        res.send(result.modifiedCount > 0);
      });
  });

  app.delete('/deleteService/:id', (req, res) => {
    const serviceId = req.params.id;
    serviceCollection.deleteOne({ _id: objectId(serviceId) }).then((result) => {
      //   res.send(result.deletedCount > 0)
      res.redirect('/dashboard/manageService');
    });
  });
});

app.listen(port);
