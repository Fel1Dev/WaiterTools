const server = require('./src/server/index');
const { PORT } = require('./src/config');

server.listen(PORT, () => {
    console.log(`WaiterTools running on port ${PORT}`);
});
