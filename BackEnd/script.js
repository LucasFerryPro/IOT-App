const temperatureData = [];
const humidityData = [];
const timestamps = [];

async function initializeData() {
    const response = await fetch('http://localhost:3030/api/data'); // Match your server's port
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json(); // Get the JSON response
    console.log(data); // Log the data to see its structure

    // Ensure that the data properties are being accessed correctly
    const { temperatureData: fetchedTemperatureData, humidityData: fetchedHumidityData, timestamps: fetchedTimestamps } = data;

    // Assign the fetched data
    fetchedTemperatureData.forEach((temp, index) => {
        temperatureData.push(temp);
        humidityData.push(fetchedHumidityData[index]); // Corrected variable name here
        timestamps.push(new Date(fetchedTimestamps[index]).toLocaleString()); // Corrected variable name here
    });

    updatePlot();
}

function updatePlot() {
    const trace1 = {
        x: timestamps,
        y: temperatureData,
        mode: 'lines+markers',
        name: 'Temperature',
        type: 'scatter'
    };

    const trace2 = {
        x: timestamps,
        y: humidityData,
        mode: 'lines+markers',
        name: 'Humidity',
        type: 'scatter'
    };

    const data = [trace1, trace2];

    const layout = {
        title: 'Real-Time Temperature and Humidity Data',
        xaxis: {
            title: 'Timestamp'
        },
        yaxis: {
            title: 'Value',
            rangemode: 'tozero'
        }
    };

    Plotly.newPlot('chart', data, layout);
}

// WebSocket connection
const socket = new WebSocket('ws://localhost:8081'); // Match the WebSocket server port

socket.onmessage = function(event) {
    const message = JSON.parse(event.data);

    // Format timestamp for better readability
    const date = new Date(message.timestamp);
    const formattedDate = date.toLocaleString();

    timestamps.push(formattedDate);
    temperatureData.push(message.temperature);
    humidityData.push(message.humidity);

    updatePlot();
};

// Initialize data on page load
window.onload = initializeData;
