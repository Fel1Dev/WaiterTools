const server = require('express');
const router = server.Router();

const { USER_PATH } = require('../config/index');
const UserController = require('../controllers/user.controller');

server.get(USER_PATH, UserController);

module.exports = router;