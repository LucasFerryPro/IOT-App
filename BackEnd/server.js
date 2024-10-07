// Import required packages
const express = require('express'); 
const net = require('net');
const WebSocket = require('ws');
const { sequelize, DhtData,NanoData, fetchData,fetchNanoData } = require('./db'); // Import from db.js
const cors = require('cors');

// Create Express application
const app = express();
const port = 3030;

// Enable CORS for API endpoints
app.use(cors());

// Start the Express server
app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});

// TCP server
const tcpServer = net.createServer((socket) => {
  console.log('Client connected.');

  socket.on('data', async (data) => {

    const message = data.toString().trim();
    console.log(`Received message: ${message}`);

    const [temperature, humidity] = message.split(",");

    if (temperature && humidity) {
      try {
        const newData = await DhtData.create({
          temperature: parseFloat(temperature),
          humidity: parseFloat(humidity),
          timestamp: new Date()
        });

        // Send data to WebSocket clients
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              temperature: newData.temperature,
              humidity: newData.humidity,
              timestamp: newData.timestamp
            }));
          }
        });

        socket.write(`Data ${newData.temperature} added successfully!\n`);
      } catch (error) {
        console.error('Error creating data', error);
        socket.write('Error adding data.\n');
      }
    }
  });

  socket.on('error', (err) => {
    console.error('Socket error:', err.message);
  });

  socket.on('close', () => {
    console.log('Client disconnected.');
  });
  
  socket.on('end', () => {
    console.log('Client ended connection.');
  });
});

// Start the TCP server on port 8080
tcpServer.listen(8080, () => {
  console.log('TCP server listening on port 8080.');
});

// WebSocket server creation for real-time updates
const wss = new WebSocket.Server({ port: 8081 }); // Use a different port

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');
});

// Endpoint to fetch initial data
app.get('/api/data', async (req, res) => {
  try {
    const data = await fetchData(); // Call fetchData from db.js
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});
app.use(express.json()); // For parsing application/json

app.post('/api/nano_data', async (req, res) => {
  try {
    // Log received data
    console.log('Received Data:', req.body); 

    // Extract accelerometer data from the request
    const { x, y, z } = req.body;

    console.log(`Accelerometer Data - X: ${x}, Y: ${y}, Z: ${z}`);

    const newNanoData = await NanoData.create({
      x: x,
      y: y,
      z: z,
      timestamp: new Date()
    }); 

    // Respond to the Arduino Nano
    res.status(200).send(`Data received: X = ${x}, Y = ${y}, Z = ${z}`);
  } catch (error) {
    console.error('Error processing data:', error);
    res.status(500).send('Internal Server Error');
  }

});
app.get('/api/nano_data', async (req, res) => {
    try {
      const data = await fetchNanoData(); // Call fetchData from db.js
      res.json(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).send('Internal Server Error');
    }
  });