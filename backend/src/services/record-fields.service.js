const moment = require("moment");
const { DELIVERY_DATA } = require("../assets/DELIVERY_DATA");
const { DDMMYYYY_FORMAT, FULL_FORMAT, TAKEAWAY, CANCELLED } = require("../config/constants.config");

const defaultZone = {
    name: TAKEAWAY,
    price: 0,
    zoneNote: "",
};

function getRecordFields(orders) {
    let output = [];
    orders = setTakewayFristOrder(orders);
    orders.forEach((order) => {
        let zone = getOrderZone(order);
        output.push([
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
            order.customerPhone ? "'" + order.customerPhone : null,
            zone.note,
            "NEW",
        ]);
    });
    return output;
}

function getRecordObjects(orders) {
    let deliveryList = [];
    orders.forEach((order) => {
        let zone = getOrderZone(order);
        deliveryList.push({
            id: order._id,
            date: moment(order.creationTime).toDate(),
            totalValue: getOrderValue(order),
            deliveryValue: zone.price,
            deliveryType: zone.name,
            clientName: order.customerName,
            address: order.customerAddress,
            cellphone: order.customerPhone ? "'" + order.customerPhone : null,
            note: zone.note,
            user: "",
        });
    });
    return deliveryList;
}

function getOrderZone(order) {
    const stamps = order.itemstamps;
    for (let key in stamps) {
        if (stamps[key].status !== CANCELLED) {
            const zone = {
                name: stamps[key].item.name,
                price: stamps[key].item.price,
                note: stamps[key].note,
            };
            if (DELIVERY_DATA.find((item) => item.name === zone.name)) {
                return zone;
            }
        }
    }
    return defaultZone;
}

function getOrderValue(order) {
    let total = 0;
    const stamps = order.itemstamps;
    for (let key in stamps) {
        if (stamps[key].status !== CANCELLED) {
            total += Number(stamps[key].item.price);
        }
        for (const extra of stamps[key].extras) {
            total += Number(extra.price);
        }
    }
    return total;
}

function setTakewayFristOrder(orders) {
    return orders.sort((firstItem, secondItem) => {
        const firstService = firstItem.service.toUpperCase();
        const secondService = secondItem.service.toUpperCase();
        if (secondService < firstService) {
            return -1;
        }
        if (secondService > firstService) {
            return 1;
        }
        // names must be equal
        return 0;
    });
}

function getOrderCreatorName(orders) {
    return orders.map((order) => {
        const usersIds = [].concat(order.usersIds || []);
        for (const userId of usersIds) {
            if (userList.includes(userId)) {
                return order;
            }
        }
    });
}

module.exports = {
    getRecordFields: getRecordFields,
    getRecordObjects: getRecordObjects,
};
