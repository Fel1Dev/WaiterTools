const { MenuServices } = require('../services');

class MenuController {
    async getMenus(req, res) {
        console.log(req.query);
        let { restaurantId } = req.query;
        const responseData = await MenuServices.getMenu(restaurantId);
        console.log(responseData);
        return res.send(responseData);
    }
}

module.exports = new MenuController();
