const axios = require("axios");

const { WRITE } = require("../config/constants.config");
const { EXT_API_URL, EXT_REPORTS_PATH } = require("../config/index");
const {
    GoogleSheetOperations,
    OrderFilterService,
    OrderFormatterService,
    MenuServices,
} = require("../services/index");
const recordFieldsService = require("../services/record-fields.service");

class ReportController {

    static async getOrders(restaurantId, startTime, endTime) {
        const extReportPath = EXT_API_URL + EXT_REPORTS_PATH;
        console.log("path: " + extReportPath);
        try {
            const response = await axios
                .get(extReportPath, {
                    params: {
                        restaurantId: restaurantId,
                        startTime: startTime,
                        endTime: endTime,
                    },
                })
                .then((response) => {
                    return { error: false, data: response.data };
                });
            return response;
        } catch (error) {
            console.error("Error during Report creation process: " + error);
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
        let { startTime, endTime, restaurantId, requestType } = req.query;
        if (!restaurantId || !endTime || !restaurantId) {
            res.status(400).json({ stats: 400, message: "Bad parameters." }).send();
            return;
        }

        const responseData = await ReportController.getOrders(restaurantId, startTime, endTime);
        // Call service to filter
        const serviceFiltered = OrderFilterService.callCenterUserFilter(responseData.data);
        const notCancelledOrders = OrderFilterService.cancelledStatusFilter(serviceFiltered);
        const recordFields = OrderFormatterService.getRecordFields(notCancelledOrders);

        if (!requestType || WRITE !== requestType.toUpperCase()) {
            res.send({ message: "Read-only request", data: recordFields });
            return;
        }

        try {
            let writeObject = await GoogleSheetOperations.writeData(recordFields);
            if (writeObject.status !== 200) {
                return res.json({ msg: "Something went wrong" });
            }
            return res.json({
                msg: "Spreadsheet update sucessfully!",
                data: recordFields,
            });
        } catch (e) {
            console.log("Error updating the spreadsheet", e);
            res.status(500).send();
        }
    }

    async getCallCenterReportObject(req, res) {
        console.log(req.query);
        let { startTime, endTime, restaurantId, requestType } = req.query;
        if (!restaurantId || !endTime || !restaurantId) {
            res.status(400).json({ stats: 400, message: "Bad parameters." }).send();
            return;
        }

        const responseData = await ReportController.getOrders(restaurantId, startTime, endTime);
        // Call service to filter
        const deliveryOrders = OrderFilterService.onlyDeliveryOrders(responseData.data);
        const notCancelledOrders = OrderFilterService.cancelledStatusFilter(deliveryOrders);
        const objectReport = OrderFormatterService.getRecordObjects(notCancelledOrders);        
        const totalDelivery = OrderFormatterService.getTotalDeliveryValue(objectReport);
        return res.json({
            msg: "Read-only request",
            data: objectReport,
            totalDelivery: totalDelivery,
        });
    }

    async getShakesReportObject(req, res) {
        console.log(req.query);
        let { startTime, endTime, restaurantId } = req.query;
        if (!restaurantId || !endTime || !restaurantId) {
            res.status(400).json({ stats: 400, message: "Bad parameters." }).send();
            return;
        }
        const shakesMenuObject = await MenuServices.getShakesMenuObject(restaurantId);
        const responseData = await ReportController.getOrders(restaurantId, startTime, endTime);
        // Call service to filter
        //const notCancelledOrders = OrderFilterService.cancelledStatusFilter(responseData.data);
        
        //Get all shakes records
        //const shakesOrders = OrderFilterService.onlyShakesOrders(responseData.data, shakesMenuObject);
        const shakesItems = recordFieldsService.getShakeRecords(responseData.data, shakesMenuObject);
        //Get total of day sales

        //const objectReport = OrderFormatterService.getShakeRecords(notCancelledOrders);        
        //const totalSale = OrderFormatterService.getTotalDeliveryValue(objectReport);
        return res.json({
            msg: "Read-only request",
            data: responseData.data
        });
    }
}

module.exports = new ReportController();
