import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css'; // Import CSS module for styling

const Navbar = () => {
    return (
        <div className={styles.navLinks}>
            <Link to="/temperature-humidity" className={styles.link}>🌡 Temperature & Humidity</Link>
            <Link to="/accelerometer" className={styles.link}>📊 Accelerometer Data</Link>
        </div>
    );
};

export default Navbar;
