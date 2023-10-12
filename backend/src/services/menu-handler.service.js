const axios = require('axios');
const { EXT_API_URL, EXT_MENU_PATH, SHAKE_CATEGORIE_NAME } = require('../config/index');

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
                console.log('Resposne!');
                menuResponse.data = response.data[0];
            });
    } catch (error) {
        menuResponse.error = true;
        menuResponse.data = 'Error during Menu data creation process: ' + error;
    }
    return menuResponse;
};

async function getShakesMenuObject(restaurantId) {
    const menuData = await getMenu(restaurantId);

    const shakeCategorie = new Map();

    menuData.data.categories.forEach((categorie) => {
        const categorieName = categorie.name.toUpperCase().replace(' ', '');
        //Gets SHAKE_CATEGORIE
        if (categorieName === SHAKE_CATEGORIE_NAME) {
            //Get categorie objet
            const items = categorie.items;
            //Add to map all items
            //Select as key the ID
            items.forEach((item) => {
                shakeCategorie.set(item.id, item);
            });
        }
    });

    return shakeCategorie;
}

module.exports = {
    getMenu: getMenu,
    getShakesMenuObject: getShakesMenuObject,
};
