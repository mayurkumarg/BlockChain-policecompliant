import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [complaints, setComplaints] = useState([]);
  const [form, setForm] = useState({
    name: '',
    title: '',
    description: '',
    location: '',
    date: '',
    evidence: null,
  });
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/complaints');
      setComplaints(response.data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  console.log('Submitting form:', form);

  try {
    const response = await axios.post(
      'http://localhost:5000/api/complaints/submit',
      form, // send JSON directly
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    console.log('Response:', response);

    setForm({
      name: '',
      title: '',
      description: '',
      location: '',
      date: '',
      evidence: null,
    });

    fetchComplaints();

  } catch (error) {
    console.error('Error submitting complaint:', error.response?.data || error.message);
  }
};

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/complaints/${id}/status`, { status });
      fetchComplaints();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Police Complaint Management System</h1>
      
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Submit Complaint Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Submit Complaint</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="file"
              onChange={(e) => setForm({ ...form, evidence: e.target.files[0] })}
              className="w-full p-2 border rounded"
            />
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
              Submit Complaint
            </button>
          </form>
        </div>

        {/* Complaints List */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">All Complaints</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {complaints.map((complaint) => (
              <div key={complaint.id} className="border p-4 rounded">
                <h3 className="font-semibold">{complaint.title}</h3>
                <p className="text-sm text-gray-600">By: {complaint.name}</p>
                <p className="text-sm">Status: <span className={`font-semibold ${
                  complaint.status === 'Pending' ? 'text-yellow-600' :
                  complaint.status === 'In Progress' ? 'text-blue-600' : 'text-green-600'
                }`}>{complaint.status}</span></p>
                <div className="mt-2 space-x-2">
                  <button
                    onClick={() => setSelectedComplaint(complaint)}
                    className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                  >
                    View Details
                  </button>
                  <select
                    onChange={(e) => handleStatusChange(complaint.id, e.target.value)}
                    value={complaint.status}
                    className="border p-1 rounded text-sm"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Complaint Details Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Complaint Details</h2>
            <p><strong>ID:</strong> {selectedComplaint.id}</p>
            <p><strong>Name:</strong> {selectedComplaint.name}</p>
            <p><strong>Title:</strong> {selectedComplaint.title}</p>
            <p><strong>Description:</strong> {selectedComplaint.description}</p>
            <p><strong>Location:</strong> {selectedComplaint.location}</p>
            <p><strong>Date:</strong> {new Date(selectedComplaint.date).toLocaleDateString()}</p>
            <p><strong>Status:</strong> {selectedComplaint.status}</p>
            <p><strong>Blockchain Hash:</strong> {selectedComplaint.blockchainHash}</p>
            {selectedComplaint.ipfsHash && <p><strong>IPFS Hash:</strong> {selectedComplaint.ipfsHash}</p>}
            <button
              onClick={() => setSelectedComplaint(null)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;