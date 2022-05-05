const moment = require("moment");
const { DELIVERY_DATA } = require("../assets/DELIVERY_DATA");
const { DDMMYYYY_FORMAT, FULL_FORMAT, TAKEAWAY } = require("../config/constants.config");

const defaultZone = {
    name: TAKEAWAY,
    price: 0,
    zoneNote: ''
};

function getRecordFields(orders) {
    let output = [];
    orders.forEach(order => {
        let zone = getOrderZone(order);
        if (!zone) zone = defaultZone;

        output.push(
            [
                order._id,
                moment(order.creationTime).format(DDMMYYYY_FORMAT), //23/04/2022
                moment(order.creationTime).format(FULL_FORMAT), //HH:MM:SS
                getOrderValue(order),
                null,
                zone.name,
                null,
                null,
                null,
                order.customerName,
                order.customerAddress,
                order.customerPhone ? '\'' + order.customerPhone : null,
                zone.note,
                'NEW'
            ]
        );
    });
    return output;
}

function getOrderZone(order) {
    const stamps = order.itemstamps;
    for (let key in stamps) {
        const zone = {
            name: stamps[key].item.name,
            price: stamps[key].item.price,
            note: stamps[key].note
        }
        if (DELIVERY_DATA.find(item => item.name === zone.name)) {
            return zone
        }
    }
    return {
        name: TAKEAWAY,
        price: 0,
        zoneNote: ''
    }
}

function getOrderValue(order) {
    let total = 0;
    const stamps = order.itemstamps;
    for (let key in stamps) {
        total += stamps[key].item.price;
        for (const extra of stamps[key].extras) {
            total += extra.price;
        }
    }
    return total;
}



module.exports = {
    getRecordFields: getRecordFields
}