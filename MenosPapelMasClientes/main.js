const http = require('http');

const hostname  = '127.0.0.1';
const port      = 3080;

const server = http.createServer((request, response){
    
});


server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});