// db.js
const { Sequelize, DataTypes } = require('sequelize');

// Create a new SQLite database connection
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite' // You can change this to any other supported DB
});

// Define a simple User model
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

module.exports = { sequelize, DhtData };
