// src/components/Students.jsx
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const Students = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    rollNo: "",
    regNo: "",
    roomNo: "",
    department: "",
    year: "",
    address: "",
    contact: "",
    parentContact: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Use Render backend API
  const API_BASE =
    process.env.REACT_APP_API_URL ||
    "https://hostel-management-backend-eo9s.onrender.com/api";

  // Fetch students
  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(`${API_BASE}/students`);
      console.log("API response:", response.data);

      if (response.data.students && response.data.students.length > 0) {
        setStudents(response.data.students);
      } else {
        setStudents([]);
        setError("No students found.");
      }
    } catch (err) {
      console.error("Error fetching students", err);
      setError("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent({ ...newStudent, [name]: value });
  };

  // Add new student
  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE}/students`, newStudent);
      alert(response.data.message || "Student added successfully!");
      setNewStudent({
        name: "",
        rollNo: "",
        regNo: "",
        roomNo: "",
        department: "",
        year: "",
        address: "",
        contact: "",
        parentContact: "",
      });
      setShowForm(false);
      fetchStudents();
    } catch (err) {
      console.error("Error adding student", err);
      alert("Failed to add student");
    }
  };

  // Filter students
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.regNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.roomNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans">
      <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">
        Student Directory
      </h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Search students"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-3 mb-4 rounded-lg border border-blue-600 bg-blue-50 text-blue-900 font-medium"
      />

      {/* Toggle Add Student Form */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-4 px-5 py-2 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800"
      >
        {showForm ? "Cancel" : "Add Student"}
      </button>

      {/* Add Student Form */}
      {showForm && (
        <form
          onSubmit={handleAddStudent}
          className="mb-6 border border-blue-900 p-5 rounded-xl bg-blue-100"
        >
          <h3 className="text-lg font-bold text-blue-900">Add New Student</h3>
          <div className="grid grid-cols-2 gap-4 mt-3">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={newStudent.name}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="rollNo"
              placeholder="Roll No"
              value={newStudent.rollNo}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="regNo"
              placeholder="Registration No"
              value={newStudent.regNo}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="roomNo"
              placeholder="Room No"
              value={newStudent.roomNo}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="department"
              placeholder="Department"
              value={newStudent.department}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="year"
              placeholder="Year"
              value={newStudent.year}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={newStudent.address}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="contact"
              placeholder="Student Contact"
              value={newStudent.contact}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="parentContact"
              placeholder="Parent Contact"
              value={newStudent.parentContact}
              onChange={handleInputChange}
              required
            />
          </div>
          <button
            type="submit"
            className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg font-medium"
          >
            Submit
          </button>
        </form>
      )}

      {/* Loading / Error / Students Table */}
      {loading ? (
        <p className="text-center text-blue-700">Loading students...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : filteredStudents.length === 0 ? (
        <p className="text-center text-blue-700">No students found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Roll No</th>
                <th className="px-4 py-2 border">Reg. No</th>
                <th className="px-4 py-2 border">Room No</th>
                <th className="px-4 py-2 border">Department</th>
                <th className="px-4 py-2 border">Year</th>
                <th className="px-4 py-2 border">Address</th>
                <th className="px-4 py-2 border">Student Contact</th>
                <th className="px-4 py-2 border">Parent Contact</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student._id} className="text-center bg-blue-50">
                  <td className="px-4 py-2 border">{student.name}</td>
                  <td className="px-4 py-2 border">{student.rollNo}</td>
                  <td className="px-4 py-2 border">{student.regNo}</td>
                  <td className="px-4 py-2 border">{student.roomNo}</td>
                  <td className="px-4 py-2 border">{student.department}</td>
                  <td className="px-4 py-2 border">{student.year}</td>
                  <td className="px-4 py-2 border">{student.address}</td>
                  <td className="px-4 py-2 border">
                    <a
                      href={`tel:${student.contact}`}
                      className="text-blue-800 underline"
                    >
                      {student.contact}
                    </a>
                  </td>
                  <td className="px-4 py-2 border">
                    <a
                      href={`tel:${student.parentContact}`}
                      className="text-blue-800 underline"
                    >
                      {student.parentContact}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Students;
