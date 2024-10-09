const temperatureData = [];
const humidityData = [];
const timestamps = [];

async function initializeData() {
    const response = await fetch('http://localhost:3030/api/data'); // Match your server's port
    if (!response.ok) {
        throw new Error(`HTTP error! Status:     ${response.status}`);
    }

    const { data: datas } = await response.json(); // Destructure the 'data' array from the JSON response
    
    // Loop through the data and populate the arrays
    datas.forEach(record => {
        temperatureData.push(record.temperature);
        humidityData.push(record.humidity);
        timestamps.push(new Date (record.timestamp).toLocaleString());
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
