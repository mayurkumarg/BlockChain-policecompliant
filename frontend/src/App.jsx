import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import UserPortal from './pages/UserPortal';
import PolicePortal from './pages/PolicePortal';
import './App.css';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-white">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/user" element={<UserPortal />} />
            <Route path="/police" element={<PolicePortal />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;