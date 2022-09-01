
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const mysql = require('mysql2');
const myconn = require('express-myconnection');
require('dotenv').config();
const dbOptions = {
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: 'root',
  database: 'DbContabilly',
};

const middlewares = require('./middlewares');
const api = require('./api');
const mailer = require('./mailer');
const firebaseMessagging = require('./firebaseMesagging');
const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(myconn(mysql, dbOptions, 'single'));


app.get('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄'
  });
});

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);
app.use(mailer.enviarCorreo);
app.use(firebaseMessagging.enviarNotificacionTopic);
module.exports = app;
