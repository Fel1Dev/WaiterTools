const express = require('express');
const server = express();
const axios = require('axios');

const { API_URL, AUTH_PATH } = require('../config/index');

//Use requests as JSON
server.use(express.json());
//Allow connection with frontend soon 

server.get('/api/v1/authentication', async (req, res) => {
    let authenticationType = req.body.authenticationType;
    let hash = req.body.authenticationCredentials;
    console.log('req.body: ' + req.body);
    console.log('hash: ' + hash);

    let body = {
        authenticationType: authenticationType,
        authenticationCredentials: hash
    };

    let response = await axios.post(API_URL + AUTH_PATH, body);
    console.log('response: ' + response.data);
    /*
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(err => {
            console.log('Error authentication process');
        })
    */
    return res.send({ error: false, data: response });
});


module.exports = server;


