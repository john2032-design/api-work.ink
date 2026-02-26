const express = require('express');
const bodyParser = require('body-parser');
const createRouter = require('./routes/create');
const redirectRouter = require('./routes/redirect');

const app = express();
const port = process.env.PORT || 3000;

app.set('trust proxy', 1);

app.use(bodyParser.json());

const redirectMap = new Map();
app.locals.redirectMap = redirectMap;

app.use(createRouter);
app.use(redirectRouter);

app.head('/', (req, res) => {
  res.status(200).end();
});

app.get('/', (req, res) => {
  res.status(200).send('VortixWorld API is Running');
});

app.use((req, res) => {
  res.status(405).send('Method Not Allowed');
});

app.listen(port, function() {});