const axios = require('axios');


const { EXT_API_URL, EXT_REPORTS_PATH } = require('../config/index');
const { OrderFilterService, OrderValueCounter, WriteGoogleSheet } = require('../services/index');
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
        const serviceFiltered = OrderFilterService.callCenterFilter(responseData.data);
        const usersFiltered = OrderFilterService.callCenterUserFilter(serviceFiltered);
        const recordFields = OrderValueCounter.getRecordFields(usersFiltered);

        //await WriteGoogleSheet.writeGoogleSheet(test);
        //Call sevice to call sheet!
        let writeObject = null;

        try {
            writeObject = await WriteGoogleSheet.writeData(recordFields);
            if (writeObject.status === 200) {
                return res.json({ msg: 'Spreadsheet update sucessfully!', data: recordFields });
            }
            return res.json({ msg: 'Something went wrong' });
        } catch (e) {
            console.log('Error updating the spreadsheet', e);
            //res.send(recordFields);
            res.status(500).send();
        }

    }
}

module.exports = new ReportController();