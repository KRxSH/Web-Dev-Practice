const http = require('http'); //use of this???
const app = require('./app');

const port = process.env.PORT || 3000;

const server = http.createServer(app); //use of this???

server.listen(port, () => console.log(`Listening on Port ${port}`));