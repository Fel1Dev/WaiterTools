const axios = require("axios");

const { EXT_API_URL, EXT_AUTH_PATH } = require("../config/index");

class AuthenticationController {
    async authentication(req, res) {
        let authenticationType = req.body.authenticationType;
        let hash = req.body.authenticationCredentials;
        const authPath = EXT_API_URL + EXT_AUTH_PATH;
        const body = {
            authenticationType: authenticationType,
            authenticationCredentials: hash,
        };

        console.log("path: " + authPath);
        try {
            axios
                .post(authPath, body)
                .then((response) => {
                    return res.send({ error: false, data: response.data });
                })
                .catch((error) => {
                    console.error("Error during POST Authentication process: " + error.message);
                });
        } catch (error) {
            console.error("Error during Authentication process: " + error.message);
        }
    }
}

module.exports = new AuthenticationController();
