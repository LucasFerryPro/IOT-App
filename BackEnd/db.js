const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

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

sequelize.sync();

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

async function fetchNanoData() {
  try {
    const datas = await NanoData.findAll(); // Fetch all records from the database
    
    const apiDatas = datas.map(record => {
      return {
        x:record.x,
        y:record.y,
        z:record.z,
        timestamp:record.timestamp
      }
    });
    
    return { data:apiDatas };
    
  } catch (error) {
    console.error('Error fetching nanoData :', error);
  }
}
// Call the function to fetch and log data
fetchData();
fetchNanoData();

module.exports = { sequelize, DhtData, NanoData,fetchData,fetchNanoData };