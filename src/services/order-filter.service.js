const { TABLE, TAKEAWAY, DELIVERY, MELO_USER_ID, SALO_USER_ID, CANCELLED } = require('../config/constants.config')

function orderTypeFilter(orders, orderTypes) {
    return orders.filter((order) => {
        for (const type of orderTypes) {
            if (order.service === type) {
                return true;
            }
        }
    });
}

function orderUserFilter(orders, userList) {
    return orders.filter((order) => {
        const usersIds = [].concat(order.usersIds || []);
        for (const userId of usersIds) {
            if (userList.includes(userId)) {
                return true;
            }
        }
    });
}
// Delete all cancelled orders
function cancelledStatusFilter(orders) {
    return orders.filter((order) => {
        const stamps = order.itemstamps;
        let cancelledItems = 0;
        let itemsAmount = 0;
        for (let key in stamps) {
            itemsAmount++;
            if (stamps[key].status === CANCELLED) {
                cancelledItems++;
            }
        }
        return !(itemsAmount === cancelledItems);
    });
}

function callCenterFilter(orders) {
    return orderTypeFilter(orders, [TAKEAWAY, DELIVERY]);
}

function onlyTableFilter(orders) {
    return orderTypeFilter(orders, [TABLE]);
}

function callCenterUserFilter(orders) {
    return orderUserFilter(orders, [MELO_USER_ID, SALO_USER_ID]);
}

module.exports = {
    callCenterFilter: callCenterFilter,
    onlyTableFilter: onlyTableFilter,
    callCenterUserFilter: callCenterUserFilter,
    cancelledStatusFilter: cancelledStatusFilter
}
