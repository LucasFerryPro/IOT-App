import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TemperatureHumidity from './components/TemperatureHumidity';
import Accelerometer from './components/Accelerometer';
import Navbar from './components/Navbar';
import './index.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <div className="chart-container">
                    <Routes>
                        <Route path="/temperature-humidity" element={<TemperatureHumidity />} />
                        <Route path="/accelerometer" element={<Accelerometer />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
