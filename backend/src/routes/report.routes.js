const router = require("express").Router();
const { ReportController } = require("../controllers/index");

const { REPORTS_PATH, CALLCENTER_REPORT_PATH } = require("../config/index");

router.get(REPORTS_PATH, ReportController.reportSinceTo);
router.get(
    REPORTS_PATH + CALLCENTER_REPORT_PATH,
    ReportController.createCallcenterReport
);

module.exports = router;
