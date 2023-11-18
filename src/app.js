const http = require('http');
const url = require('url');
const fs = require('fs');
const getUsers = require('./modules/users');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((request, response) => {
    const parsedUrl = url.parse(request.url, true);
    const queryObject = parsedUrl.query;

    if (parsedUrl.pathname === '/users') {
        fs.readFile('data/users.json', (err, data) => {
            if (err) {
                response.writeHead(200, { 'Content-Type': 'text/plain' });
                response.end(getUsers());
            } else {
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.end(data);
            }
        });
    } else if ('hello' in queryObject) {
        const name = queryObject['hello'];
        if (name) {
            response.writeHead(200, { 'Content-Type': 'text/plain' });
            response.end(`Hello, ${name}.`);
        } else {
            response.writeHead(400, { 'Content-Type': 'text/plain' });
            response.end('Bad Request: Enter a name');
        } 
    } else if (Object.keys(queryObject).length > 0) {
        response.writeHead(500, { 'Content-Type': 'text/plain' });
        response.end('Internal Server Error');
    } else if (parsedUrl.pathname === '/') {
        response.writeHead(200, { 'Content-Type': 'text/plain' });
        response.end('Hello, World!');
    } else {
        response.writeHead(500, { 'Content-Type': 'text/plain' });
        response.end('Not Found');
    }
});

server.listen(port, hostname, () => {
    console.log(`Сервер запущен по адресу http://${hostname}:${port}/`);
});