const express = require('express');
const server = express();
const helmet = require('helmet');

const { AuthRoute, ReportRoute, UserRoute } = require('../routes/index')

//Use requests as JSON
server.use(express.json());
//Sercurity
server.use(helmet());
//Allow connection with frontend soon 

server.use('/', AuthRoute);

server.use('/', ReportRoute);

server.use('/', UserRoute);

module.exports = server;


