const router = require("express").Router();
const { AuthenticationController } = require('../controllers/index');

const { AUTH_PATH } = require('../config/index');

router.post(AUTH_PATH, AuthenticationController.authentication);

module.exports = router;

