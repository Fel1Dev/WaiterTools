const axios = require('axios');

const { EXT_API_URL, EXT_USER_PATH } = require('../config/index');

class UserController {

    async getUsers(req, res) {
        console.log(req.query);
        let { restaurantId } = req.query;
        const extUsersPath = EXT_API_URL + EXT_USER_PATH;
        console.log('path: ' + extUsersPath);
        try {
            await axios.get(extUsersPath, {
                params: {
                    restaurantId: restaurantId
                }
            })
                .then((response) => {
                    return res.send({ error: false, data: response.data });
                });
        } catch (error) {
            console.error('Error during Users data creation process: ' + error);
        }
    }
}

module.exports = UserController;