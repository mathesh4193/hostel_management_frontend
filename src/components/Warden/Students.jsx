// src/components/Students.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const Students = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    rollNo: '',
    regNo: '',
    roomNo: '',
    department: '',
    year: '',
    address: '',
    contact: '',
    parentContact: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_BASE = process.env.REACT_APP_API_URL || 'https://hostel-management-backend-eo9s.onrender.com/api';

  // ✅ Fetch students from API
  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`${API_BASE}/students`);
      console.log('API response:', response.data);
      // ✅ Fix: access response.data.students
      setStudents(Array.isArray(response.data.students) ? response.data.students : []);
    } catch (err) {
      console.error('Error fetching students', err);
      setError('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent({ ...newStudent, [name]: value });
  };

  // Handle add student
  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE}/students`, newStudent);
      alert(response.data.message || 'Student added successfully!');
      setNewStudent({
        name: '',
        rollNo: '',
        regNo: '',
        roomNo: '',
        department: '',
        year: '',
        address: '',
        contact: '',
        parentContact: ''
      });
      setShowForm(false);
      fetchStudents(); // refresh list
    } catch (err) {
      console.error('Error adding student', err);
      alert('Failed to add student');
    }
  };

  // Filter students by search term
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.regNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.roomNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#1976d2' }}>Student Directory</h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Search students"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: '100%',
          padding: '12px',
          marginBottom: '20px',
          borderRadius: '8px',
          border: '1px solid #1976d2',
          backgroundColor: '#e3f2fd',
          color: '#0d47a1',
          fontWeight: '500'
        }}
      />

      {/* Toggle Add Form */}
      <button
        onClick={() => setShowForm(!showForm)}
        style={{
          marginBottom: '20px',
          padding: '10px 20px',
          backgroundColor: '#0d47a1',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '600'
        }}
      >
        {showForm ? 'Cancel' : 'Add Student'}
      </button>

      {/* Add Student Form */}
      {showForm && (
        <form
          onSubmit={handleAddStudent}
          style={{
            marginBottom: '30px',
            border: '1px solid #0d47a1',
            padding: '20px',
            borderRadius: '12px',
            backgroundColor: '#bbdefb'
          }}
        >
          <h3 style={{ color: '#0d47a1' }}>Add New Student</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '10px' }}>
            <input type="text" name="name" placeholder="Name" value={newStudent.name} onChange={handleInputChange} required />
            <input type="text" name="rollNo" placeholder="Roll No" value={newStudent.rollNo} onChange={handleInputChange} required />
            <input type="text" name="regNo" placeholder="Registration No" value={newStudent.regNo} onChange={handleInputChange} required />
            <input type="text" name="roomNo" placeholder="Room No" value={newStudent.roomNo} onChange={handleInputChange} required />
            <input type="text" name="department" placeholder="Department" value={newStudent.department} onChange={handleInputChange} required />
            <input type="text" name="year" placeholder="Year" value={newStudent.year} onChange={handleInputChange} required />
            <input type="text" name="address" placeholder="Address" value={newStudent.address} onChange={handleInputChange} required />
            <input type="text" name="contact" placeholder="Student Contact" value={newStudent.contact} onChange={handleInputChange} required />
            <input type="text" name="parentContact" placeholder="Parent Contact" value={newStudent.parentContact} onChange={handleInputChange} required />
          </div>
          <button
            type="submit"
            style={{
              marginTop: '15px',
              padding: '10px 20px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Submit
          </button>
        </form>
      )}

      {/* Loading / Error / Table */}
      {loading ? (
        <p style={{ textAlign: 'center', color: '#1976d2' }}>Loading students...</p>
      ) : error ? (
        <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>
      ) : filteredStudents.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#1976d2' }}>No students found.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#1976d2', color: 'white' }}>
                <th style={tableHeaderStyle}>Name</th>
                <th style={tableHeaderStyle}>Roll No</th>
                <th style={tableHeaderStyle}>Reg. No</th>
                <th style={tableHeaderStyle}>Room No</th>
                <th style={tableHeaderStyle}>Department</th>
                <th style={tableHeaderStyle}>Year</th>
                <th style={tableHeaderStyle}>Address</th>
                <th style={tableHeaderStyle}>Student Contact</th>
                <th style={tableHeaderStyle}>Parent Contact</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student._id} style={{ backgroundColor: '#e3f2fd' }}>
                  <td style={tableCellStyle}>{student.name}</td>
                  <td style={tableCellStyle}>{student.rollNo}</td>
                  <td style={tableCellStyle}>{student.regNo}</td>
                  <td style={tableCellStyle}>{student.roomNo}</td>
                  <td style={tableCellStyle}>{student.department}</td>
                  <td style={tableCellStyle}>{student.year}</td>
                  <td style={tableCellStyle}>{student.address}</td>
                  <td style={tableCellStyle}><a href={`tel:${student.contact}`} style={linkStyle}>{student.contact}</a></td>
                  <td style={tableCellStyle}><a href={`tel:${student.parentContact}`} style={linkStyle}>{student.parentContact}</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const tableHeaderStyle = { padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' };
const tableCellStyle = { padding: '12px', borderBottom: '1px solid #ddd' };
const linkStyle = { color: '#0d47a1', textDecoration: 'none' };

export default Students;
