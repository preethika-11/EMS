const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection using environment variables
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DBNAME
});

// Connect to MySQL with improved error handling
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        process.exit(1); // Exit the application on DB connection failure
    }
    console.log('MySQL Connected...');
});

// Add Employee Endpoint
app.post('/api/employees', async (req, res) => {
    const { employee_id, name, email, phone, department, date_of_joining, role } = req.body;

    try {
        // Check if employee ID or email already exists
        const [result] = await db.promise().query('SELECT * FROM employees WHERE employee_id = ? OR email = ?', [employee_id, email]);

        if (result.length > 0) {
            return res.status(400).json({ message: 'Employee ID or Email already exists' });
        }

        // Insert the new employee
        const sqlInsert = 'INSERT INTO employees (employee_id, name, email, phone, department, date_of_joining, role) VALUES (?, ?, ?, ?, ?, ?, ?)';
        await db.promise().query(sqlInsert, [employee_id, name, email, phone, department, date_of_joining, role]);

        res.status(200).json({ message: 'Employee added successfully' });
    } catch (err) {
        console.error('Error during the insert operation:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get All Employees Endpoint
app.get('/api/employees', async (req, res) => {
    try {
        const [results] = await db.promise().query('SELECT * FROM employees');
        res.status(200).json(results);
    } catch (err) {
        console.error('Error fetching employees:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Start the server on the configured port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
