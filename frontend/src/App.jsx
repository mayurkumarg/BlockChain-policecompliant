import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import UserPortal from './pages/UserPortal';
import PolicePortal from './pages/PolicePortal';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-white">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/user" element={
                <ProtectedRoute allowedRoles={['CITIZEN', 'ADMIN']}>
                  <UserPortal />
                </ProtectedRoute>
              } />
              <Route path="/police" element={
                <ProtectedRoute allowedRoles={['POLICE', 'ADMIN']}>
                  <PolicePortal />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;