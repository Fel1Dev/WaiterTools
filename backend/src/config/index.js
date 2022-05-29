if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

module.exports = {
    PORT: process.env.PORT,
    EXT_API_URL: process.env.EXT_API_URL,
    EXT_AUTH_PATH: process.env.EXT_AUTH_PATH,
    EXT_REPORTS_PATH: process.env.EXT_REPORTS_PATH,
    EXT_USER_PATH: process.env.EXT_USER_PATH,
    EXT_MENU_PATH: process.env.EXT_MENU_PATH,
    AUTH_PATH: process.env.AUTH_PATH,
    REPORTS_PATH: process.env.REPORTS_PATH,
    CALLCENTER_REPORT_PATH: process.env.CALLCENTER_REPORT_PATH,
    USER_PATH: process.env.USER_PATH,
    MENU_PATH: process.env.MENU_PATH,
    GOOGLE_TOKEN_FILE: process.env.GOOGLE_TOKEN_FILE,
    GOOGLE_SHEET_ID: process.env.GOOGLE_SHEET_ID
};