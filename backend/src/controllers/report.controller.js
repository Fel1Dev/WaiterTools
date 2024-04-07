const axios = require('axios');

const { WRITE } = require('../config/constants.config');
const { EXT_API_URL, EXT_REPORTS_PATH } = require('../config/index');
const {
    GoogleSheetOperations,
    OrderFilterService,
    OrderFormatterService,
    MenuServices,
    WhatsappServices,
} = require('../services/index');
const recordFieldsService = require('../services/record-fields.service');
const ordersObject = require('../assets/ORDERS_DATA');

class ReportController {
    static async getOrders(restaurantId, startTime, endTime) {
        console.log('Start getOrders');
        const extReportPath = EXT_API_URL + EXT_REPORTS_PATH;
        console.log('path: ' + extReportPath);
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
                    console.log('End getOrders');
                    return { error: false, data: response.data };
                });
            return response;
        } catch (error) {
            console.error('Error during Report creation process: ' + error);
            console.log('End getOrders');
            return { error: false, data: ordersObject.ORDERS_DATA.data };            
        }
    }
    // Get all orders since a days
    async reportSinceTo(req, res) {
        console.log(req.query);
        console.log('Start reportSinceTo');
        let { restaurantId, startTime, endTime } = req.query;

        const responseData = await ReportController.getOrders(restaurantId, startTime, endTime);
        console.log('End reportSinceTo');
        return res.send(responseData);
    }

    // Get Callcenter reports
    async createCallcenterReport(req, res) {
        console.log('Start createCallcenterReport');
        console.log(req.query);
        let { startTime, endTime, restaurantId, requestType } = req.query;
        if (!restaurantId || !endTime || !restaurantId) {
            res.status(400).json({ stats: 400, message: 'Bad parameters.' }).send();
            return;
        }

        const responseData = await ReportController.getOrders(restaurantId, startTime, endTime);
        // Call service to filter
        const serviceFiltered = OrderFilterService.callCenterUserFilter(responseData.data);
        const notCancelledOrders = OrderFilterService.cancelledStatusFilter(serviceFiltered);
        const recordFields = OrderFormatterService.getRecordFields(notCancelledOrders);

        if (!requestType || WRITE !== requestType.toUpperCase()) {
            res.send({ message: 'Read-only request', data: recordFields });
            console.log('End createCallcenterReport');
            return;
        }

        try {
            let writeObject = await GoogleSheetOperations.writeData(recordFields);
            if (writeObject.status !== 200) {
                return res.json({ msg: 'Something went wrong' });
            }
            console.log('End createCallcenterReport');
            return res.json({
                msg: 'Spreadsheet update sucessfully!',
                data: recordFields,
            });
        } catch (e) {
            console.log('Error updating the spreadsheet', e);
            console.log('End createCallcenterReport');
            res.status(500).send();
        }
    }

    async getCallCenterReportObject(req, res) {
        console.log(req.query);
        let { startTime, endTime, restaurantId, requestType } = req.query;
        if (!restaurantId || !endTime || !restaurantId) {
            res.status(400).json({ stats: 400, message: 'Bad parameters.' }).send();
            return;
        }

        const responseData = await ReportController.getOrders(restaurantId, startTime, endTime);
        // Call service to filter
        const deliveryOrders = OrderFilterService.onlyDeliveryOrders(responseData.data);
        const notCancelledOrders = OrderFilterService.cancelledStatusFilter(deliveryOrders);
        const objectReport = OrderFormatterService.getRecordObjects(notCancelledOrders);
        const totalDelivery = OrderFormatterService.getTotalDeliveryValue(objectReport);
        return res.json({
            msg: 'Read-only request',
            data: objectReport,
            totalDelivery: totalDelivery,
        });
    }

    async getShakesReportObject(req, res) {
        console.log(req.query);
        let reponseMsg = 'Read-only request';
        let { startTime, endTime, restaurantId, sendMessage } = req.query;
        if (!restaurantId || !endTime || !restaurantId) {
            res.status(400).json({ stats: 400, message: 'Bad parameters.' }).send();
            return;
        }
        const shakesNamesArray = await MenuServices.getShakeNamesArray(restaurantId);
        const responseData = await ReportController.getOrders(restaurantId, startTime, endTime);

        //Get all shakes records
        const shakesItems = recordFieldsService.getShakeRecords(
            responseData.data,
            shakesNamesArray
        );

        const whatsappMessages = recordFieldsService.buildWhastappMessage(shakesItems);
        if (sendMessage) {
            const msgSize = whatsappMessages.length;
            console.log(msgSize + ' messages to send');
            whatsappMessages.forEach((saleReport, idx) => {
                if( WhatsappServices.sendMessage(saleReport)) {
                    console.log(idx + 'Message sent!');
                }
            });
            reponseMsg = `${msgSize} message sent!`;
        }

        return res.json({
            msg: reponseMsg,
            total: shakesItems.total,
            data: whatsappMessages,
        });
    }
}

module.exports = new ReportController();
