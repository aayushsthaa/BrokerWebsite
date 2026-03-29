var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();

var indexRouter = require('./routes/IndexRoutes');
var usersRouter = require('./routes/UserRoutes');
var authRouter = require('./routes/AuthRoutes');
var propertyRouter = require('./routes/PropertyRoutes');
var cors = require("cors");
var dns = require('dns');
dns.setServers(["1.1.1.1", "8.8.8.8"]);

var app = express();
app.use(cors({
  origin: "https://urbaniva.onrender.com"
}));

app.use(logger('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/properties', propertyRouter);

const mongoose = require("mongoose");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_URI, {
      dbName: "Urbaniva",
    })
    .then((data) => {
      console.log("Database connected successfully", data.connection.name);
    });
}

module.exports = app;
