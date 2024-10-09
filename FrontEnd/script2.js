const xData = [];
const yData = [];
const zData = [];
const accelTimestamps = [];

async function initializeNanoData() {
    const response = await fetch('http://localhost:3030/api/nano_data');
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    const { xData: fetchedXData, yData: fetchedYData, zData: fetchedZData, timestamps: fetchedTimestamps } = data;

    fetchedXData.forEach((x, index) => {
        xData.push(x);
        yData.push(fetchedYData[index]);
        zData.push(fetchedZData[index]);
        accelTimestamps.push(new Date(fetchedTimestamps[index]).toLocaleString());
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
