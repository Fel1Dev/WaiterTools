const { format, parse } = require('date-fns');
const  esFormatDate = require('date-fns/locale/es');
const { DELIVERY_DATA } = require('../assets/DELIVERY_DATA');
const { DDMMYYYY_FORMAT, FULL_FORMAT, TAKEAWAY, CANCELLED } = require('../config/constants.config');

const WEEK_FORMAT = 'w';
const DAY_NAME_FORMAT = 'eeee';
const MONTH_NAME_FORMAT = 'MMMM';
const HOUR_FORMAT = 'H';
const MORNING_HOUR_LIMIT = 15;
const NIGHT_SHIFT = 'Noche';
const MORNING_SHIFT = 'Mañana';

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

function getRecordByCategoryMap(orders, categoryMap) {
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
            //Item from shakesCategorie
            if (itemStamp.status !== CANCELLED && categoryMap.has(item.id)) {
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

function calculateTotalPrice(itemStamp) {
    return itemStamp.extras.reduce((total, extra) => total + Number(extra.price), itemStamp.item.price);
}

function getRecordByCategoryMap2(orders, categoryMap) {
    let totalSales = 0;
    const shakeRows = orders.flatMap((order) => {    
    return orders.itemstamps
        .filter((itemStamp) => itemStamp.status !== CANCELLED && categoryMap.has(itemStamp.item.id))
        .map((itemStamp) => {
            const item = itemStamp.item;
            const creationDate = format(order.creationTime, usaSimpleDate);
            const creationTime = format(order.creationTime, usaFullDateFormat);

            const weekNum = format(order.creationTime, WEEK_FORMAT);
            const dayName = format(order.creationTime, DAY_NAME_FORMAT);
            const monthName = format(order.creationTime, MONTH_NAME_FORMAT);
            const morningOrNigth = format(order.creationTime, HOUR_FORMAT) > MORNING_HOUR_LIMIT ? NIGHT_SHIFT : MORNING_SHIFT;

            let totalPrice = calculateTotalPrice(timeStamp)
            //Item from shakesCategorie
            if (itemStamp.status !== CANCELLED && categoryMap.has(item.id)) {
                
                
                totalSales += totalPrice;
                console.log(
                    `${creationDate},${creationTime},${item.name},1,${totalPrice},${totalPrice},${weekNum},${dayName},${monthName},${morningOrNigth}`
                );
                return {
                    shortDate: creationDate,
                    creationDate: creationTime,
                    name: item.name,
                    qty: 1,
                    total: totalPrice,
                    shift: morningOrNigth,
                };
            }
        });
    });
    console.log();
    console.log('-------------------------');
    console.log(totalSales);
    return { rows: shakeRows, csv: '' };
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

function buildWhastappMessage(itemList) {
    const salesMap = createSalesMap(itemList.rows);

    let messages = createMessagesFromSalesMap(salesMap);

    return messages;
}

function createSalesMap(itemList) {
    let salesMap = new Map();
    if (!itemList) {
        return salesMap;
    }
    itemList.forEach((item) => {
        let shiftsMap = salesMap.get(item.shortDate);

        if (!shiftsMap) {
            shiftsMap = new Map();
            salesMap.set(item.shortDate, shiftsMap);
        }

        let shiftData = shiftsMap.get(item.shift);
        if (!shiftData) {
            const newShakeMap = new Map();
            shiftData = {
                shakeMap: newShakeMap,
                totalShift: item.total,
            };
            shiftsMap.set(item.shift, shiftData);
        } else {
            shiftData['totalShift'] += item.total;
        }

        let shakeMap = shiftData['shakeMap'];
        let shakeData = shakeMap.get(item.name);
        if (!shakeData) {
            //const newShakeMap = new Map();
            shakeData = {
                name: item.name,
                qty: item.qty,
                total: item.total,
            };
            shakeMap.set(item.name, shakeData);
        } else {
            shakeData['qty'] += item.qty;
            shakeData['total'] += item.total;
            shakeMap.set(item.name, shakeData);
        }
    });

    console.log('\n: ~ createReportMap ~ reportMap:', salesMap);
    return salesMap;
}

function createMessagesFromSalesMap(salesMap) {
    const messageArr = [];
    //Check size of the map
    if (!salesMap) {
        return;
    }

    salesMap.forEach((shiftMap, saleDateKey) => {
        shiftMap.forEach((shiftData, shiftKey) => {
            let fullMessage = '';
            let itemLines = '';
            let totalShiftLine = shiftData['totalShift'];
            const separatorLine = '----------------';
            const headLine = `Body Shake To Go`;
            const saleDate = parse(saleDateKey, 'MM/dd/yyyy', new Date());
            const saleDateFormatted = format(saleDate, 'dd/MM/yyyy');
            const saleDay = format(saleDate, 'EEEE', { locale: esFormatDate } );
            const dateLine = `${toUpperFirst(saleDay)} ${saleDateFormatted}`;
            
            shiftData['shakeMap'].forEach((shakeData) => {
                const formatItemTotal = shakeData.total.toLocaleString();
                const itemLine = `${shakeData.qty} ${shakeData.name} - $${formatItemTotal}`;
                itemLines += itemLine + '\n';
            });
            itemLines = itemLines.slice(0, -1);

            fullMessage =
                '*' + headLine + '*\n' +
                '*' + dateLine + '*\n' +
                shiftKey + '\n' +
                itemLines + '\n' +
                separatorLine + '\n' +
                '*' + totalShiftLine.toLocaleString() + '*\n';
                
                console.log('');
                console.log('*' + headLine + '*');
                console.log('*' + dateLine + '*');
                console.log(shiftKey);
                console.log(itemLines);
                console.log(separatorLine);
                console.log('*' + totalShiftLine.toLocaleString() + '*');

            messageArr.push(fullMessage);
        });
    });
    //return array of messages.
    return messageArr;
}

function toUpperFirst(string) { 
	return string[0].toUpperCase() + string.substring(1) 
}

module.exports = {
    getRecordFields: getRecordFields,
    getRecordObjects: getRecordObjects,
    getTotalDeliveryValue: getTotalDeliveryValue,
    getShakeRecords: getRecordByCategoryMap,
    buildWhastappMessage: buildWhastappMessage,
};
