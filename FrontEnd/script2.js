const xData = [];
const yData = [];
const zData = [];
const accelTimestamps = [];

async function initializeNanoData() {
    const response = await fetch('http://localhost:3030/api/nano_data');
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const { data: datas } = await response.json(); // Destructure the 'data' array from the JSON response
    
    // Loop through the data and populate the arrays
    datas.forEach(record => {
        xData.push(record.x);
        yData.push(record.y);
        zData.push(record.z)
        accelTimestamps.push(new Date (record.timestamp).toLocaleString());
    });

    updateNanoPlot();
}

function updateNanoPlot() {
    const traceX = {
        x: accelTimestamps,
        y: xData,
        mode: 'lines+markers',
        name: 'X',
        type: 'scatter'
    };

    const traceY = {
        x: accelTimestamps,
        y: yData,
        mode: 'lines+markers',
        name: 'Y',
        type: 'scatter'
    };

    const traceZ = {
        x: accelTimestamps,
        y: zData,
        mode: 'lines+markers',
        name: 'Z',
        type: 'scatter'
    };

    const data = [traceX, traceY, traceZ];

    const layout = {
        title: 'Real-Time Accelerometer Data',
        xaxis: { title: 'Timestamp' },
        yaxis: { title: 'Acceleration Value' }
    };

    Plotly.newPlot('chart2', data, layout);
}

// Initialize data on page load
window.onload = initializeNanoData;
