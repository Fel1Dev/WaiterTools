const axios = require('axios');
const { EXT_API_URL, EXT_MENU_PATH, SHAKE_CATEGORIE_NAME } = require('../config/index');
const menuObject = require('../assets/MENU_DATA');
const deletedShakesItems = require('../assets/DELETED_SHAKES_ITEMS');

const getMenu = async (restaurantId) => {
    const extMenuPath = EXT_API_URL + EXT_MENU_PATH;
    console.log('path: ' + extMenuPath);
    let menuResponse = { error: false, data: {} };
    try {
        await axios
            .get(extMenuPath, {
                params: {
                    restaurantId: restaurantId,
                },
            })
            .then((response) => {
                console.log('Menu response!');
                menuResponse.data = response.data[0];
            });
    } catch (error) {
        menuResponse.error = true;
        menuResponse.data = 'Error during Menu data creation process: ' + error;
        //offLine tests
        console.log('Offline response');
        menuResponse.data = menuObject.MENU_DATA[0];
    }
    return menuResponse;
};

async function getShakeNamesArray(restaurantId) {
    const menuData = await getMenu(restaurantId);

    const shakeNames = [];

    if (!menuData.data) {
        return shakeNames;
    }
    menuData.data.categories.forEach((categorie) => {
        const categorieName = categorie.name.toUpperCase().replace(' ', '');
        //Gets SHAKE_CATEGORIE
        if (categorieName === SHAKE_CATEGORIE_NAME) {
            const shakeItems = categorie.items;

            shakeItems.forEach((item) => {
                shakeNames.push(item.name.toUpperCase().replaceAll(' ', ''));
            });
        }
    });
    if (deletedShakesItems.DELETED_ITEMS) {
        deletedShakesItems.DELETED_ITEMS.forEach((deletedShakeName) => {
            shakeNames.push(deletedShakeName.toUpperCase().replaceAll(' ', ''));
        });
    }
    return shakeNames;
}

module.exports = {
    getMenu: getMenu,
    getShakeNamesArray: getShakeNamesArray,
};
