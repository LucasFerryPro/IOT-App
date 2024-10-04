const { Sequelize, DataTypes } = require('sequelize');

// Create a new SQLite database connection
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite' // You can change this to any other supported DB
});

// Define a simple DhtData model
const DhtData = sequelize.define('DhtData', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true // Auto-incrementing unique ID
  },
  temperature: {
    type: DataTypes.FLOAT, // Float for temperature values
    allowNull: false
  },
  humidity: {
    type: DataTypes.FLOAT, // Float for humidity values
    allowNull: false
  },
  timestamp: {
    type: DataTypes.DATE, // Stores the date and time
    allowNull: false,
    defaultValue: DataTypes.NOW // Sets the default value to the current time
  }
});

// Sync the database schema
sequelize.sync();

// Function to fetch data and populate the arrays
async function fetchData() {
  try {
    const data = await DhtData.findAll(); // Fetch all records from the database
    
    // Initialize empty arrays
    const temperatureData = [];
    const humidityData = [];
    const timestamps = [];
    
    // Loop through the data and populate the arrays
    data.forEach(record => {
      temperatureData.push(record.temperature);
      humidityData.push(record.humidity);
      timestamps.push(record.timestamp);
    });
    
    return { temperatureData, humidityData, timestamps };
    
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Call the function to fetch and log data
fetchData();

module.exports = { sequelize, DhtData, fetchData };