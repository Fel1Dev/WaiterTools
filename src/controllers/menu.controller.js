const axios = require('axios');
const { EXT_API_URL, EXT_MENU_PATH } = require('../config/index');

class MenuController {

    async getMenus(req, res) {
        console.log(req.query);
        const extMenuPath = EXT_API_URL + EXT_MENU_PATH;
        console.log('path: ' + extMenuPath);
        let { restaurantId } = req.query;

        try {
            await axios.get(extMenuPath, {
                params: {
                    restaurantId: restaurantId
                }
            })
                .then((response) => {
                    return res.send({ error: false, data: response.data });
                });
        } catch (error) {
            console.error('Error during Menu data creation process: ' + error);
        }
    }
}

module.exports = new MenuController();