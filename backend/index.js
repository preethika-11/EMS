const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

// Add Employee Endpoint
app.post('/api/employees', (req, res) => {
    const { employee_id, name, email, phone, department, date_of_joining, role } = req.body;

    // Validation
    const sqlCheck = 'SELECT * FROM employees WHERE employee_id = ? OR email = ?';
    db.query(sqlCheck, [employee_id, email], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            return res.status(400).json({ message: 'Employee ID or Email already exists' });
        }

        const sqlInsert = `INSERT INTO employees (employee_id, name, email, phone, department, date_of_joining, role)
                          VALUES (?, ?, ?, ?, ?, ?, ?)`;
        db.query(sqlInsert, [employee_id, name, email, phone, department, date_of_joining, role], (err, result) => {
            if (err) throw err;
            res.status(200).json({ message: 'Employee added successfully' });
        });
    });
});

// Get All Employees Endpoint
app.get('/api/employees', (req, res) => {
    const sqlGet = 'SELECT * FROM employees';
    db.query(sqlGet, (err, results) => {
        if (err) throw err;
        res.status(200).json(results);
    });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
