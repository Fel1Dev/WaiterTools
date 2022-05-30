const { google } = require("googleapis");
const { GOOGLE_SHEET_ID, GOOGLE_TOKEN_PATH } = require("../config/index");
const path = require("path");
//All permissons
const SCOPE = "https://www.googleapis.com/auth/spreadsheets";

const authentication = async () => {
    const auth = new google.auth.GoogleAuth({
        keyFile: path.join(__dirname, GOOGLE_TOKEN_PATH),
        scopes: SCOPE,
    });

    const client = await auth.getClient();

    const sheets = google.sheets({
        version: "v4",
        auth: client,
    });
    return { sheets };
};

async function writeData(data) {
    const { sheets } = await authentication();

    const writeReq = await sheets.spreadsheets.values.append({
        spreadsheetId: GOOGLE_SHEET_ID,
        range: "Registro!A:A",
        valueInputOption: "USER_ENTERED",
        resource: {
            values: data,
        },
    });
    return writeReq;
}

module.exports = {
    writeData: writeData,
};
