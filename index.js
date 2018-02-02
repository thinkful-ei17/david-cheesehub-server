'use strict';
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const {Cheeses} = require('./models');
const {PORT, CLIENT_ORIGIN} = require('./config');
const {dbConnect} = require('./db-mongoose');
// const {dbConnect} = require('./db-knex');

const app = express();

app.use(bodyParser.json());

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

// app.get('/api/cheeses', (req, res) => {
//   const cheeses = [
//     'Bath Blue',
//     'Barkham Blue',
//     'Buxton Blue',
//     'Cheshire Blue',
//     'Devon Blue',
//     'Dorset Blue Vinney',
//     'Dovedale',
//     'Exmoor Blue',
//     'Harbourne Blue',
//     'Lanark Blue',
//     'Lymeswold',
//     'Oxford Blue',
//     'Shropshire Blue',
//     'Stichelton',
//     'Stilton',
//     'Blue Wensleydale',
//     'Yorkshire Blue'
//   ];
//   res.json(cheeses);
// });

app.get('/api/cheeses', (req, res) => {
  console.log('get running');
  Cheeses
    .find()
    .then(cheeses => {
      res.json(cheeses.map(cheese => cheese.serialize()));
    })
    .catch(error => {
      console.error(error);
      res.status(500).json(error)
    });
});

app.post('/api/cheeses', (req, res) => {
  console.log('post running', req.body);
  const name = 'name';
  if (!(name in req.body)) {
    const message = 'Missing cheese name in request body';
    console.error(message);
    return res.status(400).send(message);
  }

  Cheeses
    .create({
      name: req.body.name
    })
    .then(cheese => res.status(201).json(cheese.serialize()))
    .catch(error => {
      console.error(error);
      res.status(500).json(error);
    });
});

app.delete('/api/cheeses/:id', (req, res) => {
  Cheeses
    .findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({ message: 'success' });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went terribly wrong' });
    });
});


function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = {app};
