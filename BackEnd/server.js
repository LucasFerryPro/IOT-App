// Import required packages
const express = require('express'); 
const net = require('net');
const WebSocket = require('ws');
const { Sequelize, DataTypes } = require('sequelize');


const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite' 
});

// Define the DhtData model
const DhtData = sequelize.define('DhtData', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true 
  },
  temperature: {
    type: DataTypes.FLOAT, 
    allowNull: false
  },
  humidity: {
    type: DataTypes.FLOAT, 
    allowNull: false
  },
  timestamp: {
    type: DataTypes.DATE, 
    allowNull: false,
    defaultValue: DataTypes.NOW 
  }
});


sequelize.sync();
//create express application
const app = express();
const port = 3000;

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
});

// websockect server creation for real-time updates
const wss = new WebSocket.Server({ port: 3000 });

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');
});

// Endpoint to get all Data
app.get('/data', async (req, res) => {
  try {
    const data = await DhtData.findAll();
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});

// Start the TCP server on port 8080
tcpServer.listen(8080, () => {
  console.log('TCP server listening on port 8080.');
});