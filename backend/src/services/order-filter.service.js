const {
    TABLE,
    TAKEAWAY,
    DELIVERY,
    CALLCENTER_USERS_IDS,
    CANCELLED,
} = require('../config/constants.config');

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
    let takeaways = orderTypeFilter(orders, [TAKEAWAY]);
    takeaways = orderUserFilter(takeaways, CALLCENTER_USERS_IDS);
    const deliveries = orderTypeFilter(orders, [DELIVERY]);
    return [].concat(takeaways, deliveries);
}

function onlyDeliveryOrders(orders) {
    return orderTypeFilter(orders, [DELIVERY]);
}

module.exports = {
    callCenterFilter: callCenterFilter,
    onlyTableFilter: onlyTableFilter,
    onlyDeliveryOrders: onlyDeliveryOrders,
    callCenterUserFilter: callCenterUserFilter,
    cancelledStatusFilter: cancelledStatusFilter,
    onlyShakesOrders: onlyShakesOrders,
};
