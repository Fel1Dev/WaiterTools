const { TABLE, TAKEAWAY, DELIVERY } = require('../config/constants.config')

function orderTypeFilter(orders, orderTypes) {
    return orders.filter((order) => {
        for (const type of orderTypes) {
            if (order.service === type) {
                return true;
            }
        }
    });
}

function callCenterFilter(orders) {
    return orderTypeFilter(orders, [TAKEAWAY, DELIVERY]);
}

function onlyTableFilter(orders) {
    return orderTypeFilter(orders, [TABLE]);
}


module.exports = {
    callCenterFilter: callCenterFilter,
    onlyTableFilter: onlyTableFilter
}
