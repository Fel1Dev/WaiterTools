const { format, parse } = require('date-fns');
const  esFormatDate = require('date-fns/locale/es');
const { DELIVERY_DATA } = require('../assets/DELIVERY_DATA');
const { DDMMYYYY_FORMAT, FULL_FORMAT, TAKEAWAY, CANCELLED } = require('../config/constants.config');

const defaultZone = {
    name: TAKEAWAY,
    price: 0,
    zoneNote: '',
};

const usaFullDateFormat = 'MM/dd/yyyy HH:mm:ss';
const usaSimpleDate = 'MM/dd/yyyy';
const localSimpleDate = 'dd/MM/yyyy';

function getRecordFields(orders) {
    let output = [];
    orders = setTakewayFristOrder(orders);
    orders.forEach((order) => {
        let zone = getOrderZone(order);
        output.push([
            order._id,
            format(order.creationTime, DDMMYYYY_FORMAT), //23/04/2022
            format(order.creationTime, FULL_FORMAT), //HH:MM:SS
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
            'NEW',
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
            date: order.creationTime,
            totalValue: getOrderValue(order),
            userDeliveryPrice: zone.price,
            deliveryPrice: zone.deliveryPrice,
            deliveryType: zone.name,
            clientName: order.customerName,
            address: order.customerAddress,
            cellphone: order.customerPhone ? "'" + order.customerPhone : null,
            note: zone.note,
            user: '',
        });
    });
    return deliveryList;
}

function getShakeRecords(orders, shakesMenuMap) {
    let shakeRows = [];
    let shakeRowsText = '';
    let totalSales = 0;
    orders.forEach((order) => {
        for (let key in order.itemstamps) {
            const itemStamp = order.itemstamps[key];
            const item = itemStamp.item;
            const creationDate = format(order.creationTime, usaSimpleDate);
            const creationTime = format(order.creationTime, usaFullDateFormat);

            const weekNum = format(order.creationTime, 'w');
            const dayName = format(order.creationTime, 'eeee');
            const monthName = format(order.creationTime, 'MMMM');
            const morningOrNigth = format(order.creationTime, 'H') > 15 ? 'Noche' : 'Mañana';

            let totalPrice = item.price;
            for (const extra of itemStamp.extras) {
                totalPrice += Number(extra.price);
            }
            //Item from shakes
            if (itemStamp.status !== CANCELLED && shakesMenuMap.has(item.id)) {
                shakeRows.push({
                    shortDate: creationDate,
                    creationDate: creationTime,
                    name: item.name,
                    qty: 1,
                    total: totalPrice,
                    shift: morningOrNigth,
                });
                totalSales += totalPrice;
                console.log(
                    `${creationDate},${creationTime},${item.name},1,${totalPrice},${totalPrice},${weekNum},${dayName},${monthName},${morningOrNigth}`
                );
            }
        }
    });
    console.log();
    console.log('-------------------------');
    console.log(totalSales);
    return { rows: shakeRows, csv: shakeRowsText };
}

function getOrderZone(order) {
    const stamps = order.itemstamps;
    for (let key in stamps) {
        if (stamps[key].status !== CANCELLED) {
            const zone = {
                name: stamps[key].item.name,
                price: stamps[key].item.price,
                deliveryPrice: 0,
                note: stamps[key].note,
            };
            let deliveryZone = DELIVERY_DATA.find(
                (item) => item.name.toLocaleLowerCase() === zone.name.toLocaleLowerCase()
            );
            if (deliveryZone) {
                zone.deliveryPrice = deliveryZone.deliveryPrice;
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

function getTotalDeliveryValue(ordersObj) {
    return ordersObj.reduce((acum, item) => acum + item.deliveryPrice, 0);
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
    getTotalDeliveryValue: getTotalDeliveryValue,
    getShakeRecords: getShakeRecords,
};
