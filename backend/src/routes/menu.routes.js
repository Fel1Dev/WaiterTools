const router = require("express").Router();

const { MENU_PATH } = require("../config");
const { MenuController } = require("../controllers");

router.get(MENU_PATH, MenuController.getMenus);

module.exports = router;
