import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

const Accelerometer = () => {
    const [accelXData, setAccelXData] = useState([]);
    const [accelYData, setAccelYData] = useState([]);
    const [accelZData, setAccelZData] = useState([]);
    const [timestamps, setTimestamps] = useState([]);

    useEffect(() => {
        async function fetchHistoricalData() {
            try {
                const response = await fetch('http://localhost:3030/api/nano_data'); 
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json();
                const xValues = [];
                const yValues = [];
                const zValues = [];
                const timeStamps = [];

                result.data.forEach(record => {
                    xValues.push(record.x);
                    yValues.push(record.y);
                    zValues.push(record.z);
                    timeStamps.push(new Date(record.timestamp).toLocaleString());
                });

                setAccelXData(xValues);
                setAccelYData(yValues);
                setAccelZData(zValues);
                setTimestamps(timeStamps);

            } catch (error) {
                console.error('Error fetching historical data:', error);
            }
        }

        fetchHistoricalData();

        const socket = new WebSocket('ws://localhost:8081');

        socket.onopen = () => {
            console.log('WebSocket is connected');
        };

        socket.onmessage = (event) => {
            const record = JSON.parse(event.data);
            if (record.x && record.y && record.z && record.timestamp) {
                setAccelXData(prevData => [...prevData, record.x]);
                setAccelYData(prevData => [...prevData, record.y]);
                setAccelZData(prevData => [...prevData, record.z]);
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

        return () => {
            socket.close();
        };
    }, []);

   const maxLabels = 6; 
   const labelStep = Math.ceil(timestamps.length / maxLabels);
   const tickvals = timestamps.filter((_, index) => index % labelStep === 0);
   // Ensure to add the last timestamp to the tickvals
   if (!tickvals.includes(timestamps[timestamps.length - 1])) {
       tickvals.push(timestamps[timestamps.length - 1]);
   }

    return (
        <div className="container">
            <h2 className="title">Accelerometer Data</h2>
            <Plot
                data={[
                    {
                        x: timestamps,
                        y: accelXData,
                        type: 'scatter',
                        mode: 'lines',
                        name: 'Accel X',
                    },
                    {
                        x: timestamps,
                        y: accelYData,
                        type: 'scatter',
                        mode: 'lines',
                        name: 'Accel Y',
                    },
                    {
                        x: timestamps,
                        y: accelZData,
                        type: 'scatter',
                        mode: 'lines',
                        name: 'Accel Z',
                    }
                ]}
                layout={{
                    title: 'Real-Time Accelerometer Data',
                    xaxis: {
                        title: 'Timestamp',
                        automargin: true,
                        tickvals: tickvals,
                        tickangle: -45,
                        tickfont: { size: 10 },
                        tickmode: 'array', // Set tickmode to 'array'
                    },
                    yaxis: {
                        title: 'Acceleration (m/s²)',
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

export default Accelerometer;
