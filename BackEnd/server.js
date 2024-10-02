const net = require('net');
const { DhtData } = require('./db');

// Create a TCP server
const server = net.createServer((socket) => {
  console.log('Client connected.');

  socket.on('data', async (data) => {
    const message = data.toString().trim();
    console.log(`Received message: ${message}`);
  });
});

// Start the server on port 8080
server.listen(8080, () => {
    console.log('TCP server listening on port 8080.');
});
  