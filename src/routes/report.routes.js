const router = require("express").Router();
const { ReportController } = require('../controllers/index');

const { REPORTS_PATH } = require('../config/index');

router.get(REPORTS_PATH, ReportController.getAllSinceTo);

module.exports = router;
