const axios = require('axios');

const { EXT_API_URL, EXT_REPORTS_PATH } = require('../config/index');

class ReportController {

    // Get all orders since a days
    async getAllSinceTo(req, res) {
        console.log(req.query);
        let { startTime, endTime, restaurantId } = req.query;
        const reportPath = EXT_API_URL + EXT_REPORTS_PATH;

        console.log('path: ' + reportPath);
        try {
            await axios.get(reportPath, {
                params: {
                    restaurantId: restaurantId,
                    startTime: startTime,
                    endTime: endTime
                }
            })
                .then((response) => {
                    return res.send({ error: false, data: response.data });
                });
        } catch (error) {
            console.error('Error during Report creation process: ' + error);
        }
    }
}

module.exports = new ReportController();