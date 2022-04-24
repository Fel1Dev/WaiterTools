const axios = require('axios');
const { OrderFilterService } = require('../services/index')

const { EXT_API_URL, EXT_REPORTS_PATH } = require('../config/index');

class ReportController {

    static async getOrders(restaurantId, startTime, endTime) {
        const extReportPath = EXT_API_URL + EXT_REPORTS_PATH;
        console.log('path: ' + extReportPath);
        try {
            const response = await axios.get(extReportPath, {
                params: {
                    restaurantId: restaurantId,
                    startTime: startTime,
                    endTime: endTime
                }
            })
                .then((response) => {
                    return { error: false, data: response.data };
                });
            return response;
        } catch (error) {
            console.error('Error during Report creation process: ' + error);
        }
    }
    // Get all orders since a days
    async reportSinceTo(req, res) {
        console.log(req.query);
        let { restaurantId, startTime, endTime } = req.query;

        const responseData = await ReportController.getOrders(restaurantId, startTime, endTime);
        return res.send(responseData);
    }

    // Get Callcenter reports
    async createCallcenterReport(req, res) {
        console.log(req.query);
        let { startTime, endTime, restaurantId } = req.query;

        const responseData = await ReportController.getOrders(restaurantId, startTime, endTime);
        // Call service to filter
        const filteredData = OrderFilterService.callCenterFilter(responseData.data);
        //Call sevice to call sheet!

        return res.send(filteredData);
    }
}

module.exports = new ReportController();