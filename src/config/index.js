if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

module.exports = {
    PORT: process.env.PORT,
    EXT_API_URL: process.env.EXT_API_URL,
    EXT_AUTH_PATH: process.env.EXT_AUTH_PATH,
    AUTH_PATH: process.env.AUTH_PATH
};