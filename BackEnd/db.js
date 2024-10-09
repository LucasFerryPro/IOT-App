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


//database for data from accelerometer 

// Define a simple DhtData model
const NanoData = sequelize.define('NanoData', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true // Auto-incrementing unique ID
  },
  x: {
    type: DataTypes.FLOAT, 
    allowNull: false
  },
  y: {
    type: DataTypes.FLOAT, 
    allowNull: false
  },
  z: {
    type: DataTypes.FLOAT, 
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
    const datas = await DhtData.findAll(); // Fetch all records from the database
    
    const apiDatas = datas.map(record => {
      return {
        temperature:record.temperature,
        humidity:record.humidity,
        timestamp:record.timestamp
      }
    });
    
    return { data:apiDatas };
    
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
//Fetch accelerometer data
async function fetchNanoData() {
  try {
    const data = await NanoData.findAll(); // Fetch all records from the database
    
    // Initialize empty arrays
    const xData = [];
    const yData=[];
    const zData=[];
   const timestamps = [];
    
    // Loop through the data and populate the arrays
    data.forEach(record => {
      xData.push(record.x);
      yData.push(record.y);
      zData.push(record.z);
      timestamps.push(record.timestamp);
    });
    
    return { xData,yData,zData, timestamps };
    
  } catch (error) {
    console.error('Error fetching nanoData :', error);
  }
}
// Call the function to fetch and log data
fetchData();
fetchNanoData();

module.exports = { sequelize, DhtData, NanoData,fetchData,fetchNanoData };