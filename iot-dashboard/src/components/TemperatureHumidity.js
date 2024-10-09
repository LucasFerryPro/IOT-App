import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

const Temperature = () => {
    const [temperatureData, setTemperatureData] = useState([]);
    const [humidityData, setHumidityData] = useState([]);
    const [timestamps, setTimestamps] = useState([]);

    useEffect(() => {
        // Function to fetch historical data
        async function fetchHistoricalData() {
            try {
                const response = await fetch('http://localhost:3030/api/data'); // Replace with your correct API endpoint
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json();

                const tempValues = [];
                const humValues = [];
                const timeStamps = [];

                result.data.forEach(record => {
                    tempValues.push(record.temperature);
                    humValues.push(record.humidity);
                    timeStamps.push(new Date(record.timestamp).toLocaleString());
                });

                setTemperatureData(tempValues);
                setHumidityData(humValues);
                setTimestamps(timeStamps);

            } catch (error) {
                console.error('Error fetching historical data:', error);
            }
        }

        // Initial call to load historical data
        fetchHistoricalData();

        // Establish WebSocket connection
        const socket = new WebSocket('ws://localhost:8081');

        socket.onopen = () => {
            console.log('WebSocket is connected');
        };

        socket.onmessage = (event) => {
            const record = JSON.parse(event.data);
            
            // Check if data contains temperature and humidity values
            if (record.temperature && record.humidity && record.timestamp) {
                setTemperatureData(prevData => [...prevData, record.temperature]);
                setHumidityData(prevData => [...prevData, record.humidity]);
                setTimestamps(prevTimestamps => [
                    ...prevTimestamps,
                    new Date(record.timestamp).toLocaleString()
                ]);
            }
        };

        socket.onerror = (error) => {
            console.error('WebSocket Error: ', error);
        };

        socket.onclose = () => {
            console.log('WebSocket is closed');
        };

        // Close WebSocket connection when component unmounts
        return () => {
            socket.close();
        };
    }, []);

    // Limit the number of labels on the x-axis
    const maxLabels = 6; // Maximum number of labels to display
    const labelStep = Math.ceil(timestamps.length / maxLabels);
    const tickvals = timestamps.filter((_, index) => index % labelStep === 0);
    // Ensure the last timestamp is included in tickvals
    if (!tickvals.includes(timestamps[timestamps.length - 1])) {
        tickvals.push(timestamps[timestamps.length - 1]);
    }

    return (
        <div className="container">
            <h2 className="title">Temperature & Humidity Data</h2>
            <Plot
                data={[
                    {
                        x: timestamps,
                        y: temperatureData,
                        type: 'scatter',
                        mode: 'lines',
                        name: 'Temperature (°C)',
                    },
                    {
                        x: timestamps,
                        y: humidityData,
                        type: 'scatter',
                        mode: 'lines',
                        name: 'Humidity (%)',
                    },
                ]}
                layout={{
                    title: 'Real-Time Temperature and Humidity Data',
                    xaxis: {
                        title: 'Timestamp',
                        automargin: true,
                        tickvals: tickvals,
                        tickangle: -45,
                        tickfont: { size: 10 },
                        tickmode: 'array', // Set tickmode to 'array'
                    },
                    yaxis: {
                        title: 'Values',
                        automargin: true,
                    },
                    autosize: true,
                    margin: { l: 50, r: 50, t: 50, b: 150 },
                    showlegend: true,
                }}
                useResizeHandler={true}
                style={{ width: '95%', height: '70%' }}
            />
        </div>
    );
};

export default Temperature;
