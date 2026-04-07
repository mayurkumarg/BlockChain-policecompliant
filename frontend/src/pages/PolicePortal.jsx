import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, ShieldCheck, Clock, MapPin, Hash, CheckCircle, RefreshCcw } from 'lucide-react';

const PolicePortal = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/complaints');
      setComplaints(response.data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/complaints/${id}/status`, { status });
      fetchComplaints();
      if (selectedComplaint && selectedComplaint.id === id) {
        setSelectedComplaint({ ...selectedComplaint, status });
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Resolved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center">
              <ShieldCheck className="mr-3 h-8 w-8 text-blue-600" />
              Police Dashboard
            </h1>
            <p className="text-gray-500 mt-1">Manage and track secure citizen grievances</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search cases..." 
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
            <button 
              onClick={fetchComplaints}
              className="bg-white border border-gray-200 p-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center text-gray-600 hover:text-blue-600"
              title="Refresh"
            >
              <RefreshCcw className={`h-5 w-5 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <RefreshCcw className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-gray-100 text-slate-600 text-sm font-semibold">
                    <th className="p-4">Case Details</th>
                    <th className="p-4">Complainant</th>
                    <th className="p-4 hidden md:table-cell">Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComplaints.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-gray-500">
                        No complaints match your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredComplaints.map((complaint) => (
                      <tr key={complaint.id} className="border-b border-gray-50 hover:bg-slate-50/50 transition-colors">
                        <td className="p-4">
                          <div className="font-semibold text-slate-900">{complaint.title}</div>
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <MapPin className="h-3 w-3 mr-1" /> {complaint.location}
                          </div>
                          <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-mono bg-gray-100 inline-block px-2 py-0.5 rounded">
                            {complaint.id.substring(0, 8)}...
                          </div>
                        </td>
                        <td className="p-4 text-gray-700">{complaint.name}</td>
                        <td className="p-4 text-gray-500 hidden md:table-cell">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            {new Date(complaint.date).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(complaint.status)}`}>
                            {complaint.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => setSelectedComplaint(complaint)}
                            className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            Review Case
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-800">Case Investigation File</h2>
              <button 
                onClick={() => setSelectedComplaint(null)}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-200 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Complainant</h3>
                  <p className="font-medium text-slate-900">{selectedComplaint.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Incident Date</h3>
                  <p className="font-medium text-slate-900">{new Date(selectedComplaint.date).toDateString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Location</h3>
                  <p className="font-medium text-slate-900 flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                    {selectedComplaint.location}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">System ID</h3>
                  <p className="font-mono text-sm text-slate-600 bg-gray-100 px-2 py-1 rounded inline-block">
                    {selectedComplaint.id}
                  </p>
                </div>
              </div>

              <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Subject</h3>
                <p className="font-bold text-lg text-slate-900 mb-4">{selectedComplaint.title}</p>
                
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Detailed Report</h3>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{selectedComplaint.description}</p>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
                <h3 className="text-sm font-semibold text-blue-800 uppercase tracking-wider mb-2 flex items-center">
                  <Hash className="h-4 w-4 mr-1" /> Blockchain Integrity
                </h3>
                <p className="text-sm text-blue-900 break-all font-mono bg-white p-2 rounded border border-blue-200">
                  {selectedComplaint.blockchainHash}
                </p>
                {selectedComplaint.ipfsHash && (
                  <div className="mt-2 text-sm text-blue-900 flex items-center">
                    <span className="font-semibold mr-2">IPFS Evidence:</span> 
                    <span className="font-mono truncate">{selectedComplaint.ipfsHash}</span>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Update Case Status</h3>
                <div className="flex gap-3">
                  {['Pending', 'In Progress', 'Resolved'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(selectedComplaint.id, status)}
                      className={`flex-1 py-3 px-4 rounded-xl border focus:outline-none transition-all flex items-center justify-center font-medium ${
                        selectedComplaint.status === status
                          ? status === 'Pending' ? 'bg-yellow-100 border-yellow-300 text-yellow-800 shadow-inner'
                            : status === 'In Progress' ? 'bg-blue-100 border-blue-300 text-blue-800 shadow-inner'
                            : 'bg-green-100 border-green-300 text-green-800 shadow-inner'
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {selectedComplaint.status === status && <CheckCircle className="h-4 w-4 mr-2" />}
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button
                onClick={() => setSelectedComplaint(null)}
                className="bg-white border border-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PolicePortal;
