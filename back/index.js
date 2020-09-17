
const mongoose = require('mongoose');

const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')
const axios = require('axios')

var bodyParser = require('body-parser');

const evenementModel = require('./schema/evenement');

app.use(cors())
app.use(bodyParser.json());


mongoose.connect('mongodb://localhost:27017/evenement', {useNewUrlParser: true})
    .then(()=> console.log("connexion MongoDB ok"))
    .catch(()=> console.log("connexion MongoDB échoué "));

mongoose.set('useFindAndModify', false);

const allowedOrigins = [
  'http://localhost:8100'
];

// Reflect the origin if it's in the allowed list or not defined (cURL, Postman, etc.)
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Origin not allowed by CORS'));
    }
  }
}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)

  axios.get('https://data.loire-atlantique.fr/api/records/1.0/search/?dataset=224400028_sorties-et-loisirs-en-loire-atlantique-rt').then(response => {
      response.data.records.forEach(r => {
        let event = new evenementModel({
          ...r.fields
        })
        event.save()
      })
  })
})

// Enable preflight requests for all routes
app.options('*', cors(corsOptions));


app.get('/evenement', cors(corsOptions), function(req, res)  {
    evenementModel.find()
        .then(event => res.status(200).json({event}))
        .catch(error => res.status(400).json({error}))
})


app.get('/favoris', cors(corsOptions), function(req, res) {
    evenementModel.find().where({favoris: true})
        .then(event => res.status(200).json({event}))
        .catch(error => res.status(400).json({error}))
})

app.put('/favoris/:eventid/add', cors(corsOptions), function(req, res) {
    evenementModel.findOneAndUpdate(
        { eventid: req.params.eventid }, 
        {
          $set: {
            favoris: true
          }
        },
        {
          upsert: false
        }
      )
        .then(() => res.status(201).json({}))
        .catch(error => res.status(400).json({error}))
})


app.put('/favoris/:eventid/remove', cors(corsOptions), function(req, res) {
    evenementModel.findOneAndUpdate(
      { eventid: req.params.eventid }, 
      {
        $set: {
          favoris: false
        }
      },
      {
        upsert: false
      }
    )
      .then(() => res.status(201).json({}))
      .catch(error => res.status(400).json({error}))
})


app.put('/evenement/vote/:eventid/add', cors(corsOptions), function(req, res) {
  evenementModel.findOneAndUpdate(
    { eventid: req.params.eventid }, 
    {
      $inc: {
        vote: 1
      }
    },
    {
      upsert: false
    }
  )
    .then(() => res.status(201).json({}))
    .catch(error => res.status(400).json({error}))
})


app.put('/evenement/vote/:eventid/remove', cors(corsOptions), function(req, res) {
  evenementModel.findOneAndUpdate(
    { eventid: req.params.eventid }, 
    {
      $inc: {
        vote: -1
      }
    },
    {
      upsert: false
    }
  )
    .then(() => res.status(201).json({}))
    .catch(error => res.status(400).json({error}))
})