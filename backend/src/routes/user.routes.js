const router = require("express").Router();

const { UserController } = require("../controllers/index");
const { USER_PATH } = require("../config/index");

router.get(USER_PATH, UserController.getUsers);

module.exports = router;
