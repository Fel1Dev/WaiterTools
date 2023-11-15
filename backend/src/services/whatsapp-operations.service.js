const axios = require('axios');
const { WHATSAPP_API_KEY, WHATSAPP_API_CODE } = require('../config/index');
const FACEBOOK_HOST = `https://graph.facebook.com/v17.0/`;
const MESSAGE_ENDPOINT = `/messages`;

const sendMessage = async (message) => {
    const whatsappUrl = `${FACEBOOK_HOST}${WHATSAPP_API_CODE}${MESSAGE_ENDPOINT}`;
    console.log('\n: ~ sendMessage ~ whatsappUrl:', whatsappUrl);

    let messageResponse = { error: false, data: {} };
    let authHeaders = { headers: { Authorization: `Bearer ${WHATSAPP_API_KEY}` } };
    let bodyToSend = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: '573113888409',
        type: 'text',
        text: {
            preview_url: false,
            body: message,
        },
    };

    try {
        await axios.post(whatsappUrl, bodyToSend, authHeaders)
        .then((response) => {
            console.log('Message id: ' + response.messages[0].id);
            //messageResponse.data = response.data;
            return true;
        });
    } catch (error) {
        return false;
    }
};

module.exports = {
    sendMessage: sendMessage,
};
