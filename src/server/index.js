const express = require('express');
const server = express();
const axios = require('axios');
const helmet = require('helmet');
const { EXT_API_URL, EXT_AUTH_PATH, AUTH_PATH } = require('../config/index');

//Use requests as JSON
server.use(express.json());
//Sercurity
server.use(helmet());
//Allow connection with frontend soon 

server.post(AUTH_PATH, async (req, res) => {
    let authenticationType = req.body.authenticationType;
    let hash = req.body.authenticationCredentials;
    const authPath = EXT_API_URL + EXT_AUTH_PATH;

    const body = {
        authenticationType: authenticationType,
        authenticationCredentials: hash
    };
    console.log('path:' + authPath);
    console.table(body);
    try {
        await axios.post(authPath, body)
            .then(response => {
                return res.send({ error: false, data: response.data });
            });
    } catch (error) {
        console.error('Error during Authentication process: ' + error);
    }
});


module.exports = server;


