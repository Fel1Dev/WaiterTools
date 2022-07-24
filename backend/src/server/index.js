const express = require("express");
const server = express();
const helmet = require("helmet");
const cors = require("cors");

const { AuthRoute, ReportRoute, UserRoute, MenuRouter } = require("../routes/index");

//Use requests as JSON
server.use(express.json());
//Sercurity
server.use(helmet());
//Allow connection with frontEnd
server.use(cors());

server.use("/", AuthRoute);

server.use("/", ReportRoute);

server.use("/", UserRoute);

server.use("/", MenuRouter);

module.exports = server;
