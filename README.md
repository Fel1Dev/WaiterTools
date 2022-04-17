# Waiter Tools Backed services

WaiterTools is a NodeJs API to get information from a restaurant created in Waiter app using the associated user and password.


## Installation

Use the package manager NPM to install WaierTools.
```bash
npm install
```
Make sure you have the following variables properly configured in your local machine:
```bash
$API_URL
```
And finally, use the custom script to run the server.
```bash
npm start
```

## REST API
There are different endpoint to process and get data: 

### Get session token and RestaurantId
`POST /api/v1/authentication`
```json
{
    "authenticationType": "Basic ",
    "authenticationCredentials": "$HASH"
}
```
#### Response
    HTTP/1.1 200 OK
    Date: Thu, 24 Feb 2011 12:36:32 GMT
    Status: 200 OK
    Connection: close
    Content-Type: application/json
    Content-Length: 168

    {"email":"123@waitertools.com","firstName":"Sal","lastName":"Lome",
    "restaurantId":"cc3d4fa20e2","restaurantName":"Areperia","waiterioToken":"715cb5715cb5"
    }

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)