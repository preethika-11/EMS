import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [formData, setFormData] = useState({
    employee_id: "",
    name: "",
    email: "",
    phone: "",
    department: "HR",
    date_of_joining: "",
    role: "",
  });
  const [employees, setEmployees] = useState([]); // State to store employee list
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("add"); // Tab state

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/employees", formData);
      setMessage(response.data.message);
      fetchEmployees(); // Refresh employee list
    } catch (err) {
      setMessage(err.response.data.message);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/employees");
      setEmployees(response.data);
    } catch (err) {
      console.error("Error fetching employees", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Employee Management System</h1>
      <div className="d-flex mb-4">
        <button className={`btn me-2 ${activeTab === "add" ? "btn-primary" : "btn-secondary"}`} onClick={() => setActiveTab("add")}>Add Employee</button>
        <button className={`btn ${activeTab === "view" ? "btn-primary" : "btn-secondary"}`} onClick={() => setActiveTab("view")}>View Employees</button>
      </div>

      {activeTab === "add" && (
        <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm">
          <div className="form-group">
            <label>Employee ID:</label>
            <input
              type="text"
              name="employee_id"
              value={formData.employee_id}
              onChange={handleChange}
              className="form-control"
              required
              maxLength="10"
            />
          </div>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label>Phone:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="form-control"
              pattern="\d{10}"
              required
            />
          </div>
          <div className="form-group">
            <label>Department:</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="form-control"
            >
              <option value="HR">HR</option>
              <option value="Engineering">Engineering</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>
          <div className="form-group">
            <label>Date of Joining:</label>
            <input
              type="date"
              name="date_of_joining"
              value={formData.date_of_joining}
              onChange={handleChange}
              className="form-control"
              max={new Date().toISOString().split("T")[0]}
              required
            />
          </div>
          <div className="form-group">
            <label>Role:</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="d-flex justify-content-between">
            <button type="submit" className="btn btn-primary">Submit</button>
            <button type="reset" className="btn btn-secondary">Reset</button>
          </div>
        </form>
      )}

      {activeTab === "view" && (
        <div>
          <h2 className="mb-4">Employee List</h2>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Department</th>
                <th>Date of Joining</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {employees.length > 0 ? (
                employees.map(employee => (
                  <tr key={employee.employee_id}>
                    <td>{employee.employee_id}</td>
                    <td>{employee.name}</td>
                    <td>{employee.email}</td>
                    <td>{employee.phone}</td>
                    <td>{employee.department}</td>
                    <td>{new Date(employee.date_of_joining).toLocaleDateString()}</td>
                    <td>{employee.role}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">No employees found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {message && <div className="alert alert-info mt-4">{message}</div>}
    </div>
  );
}

export default App;
