import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import { Fleet } from './pages/Fleet';
import { Contact } from './pages/Contact';
import { VehicleDetails } from './pages/VehicleDetails';
import { MyBookings } from './pages/MyBookings';
import { PrivacyPolicy } from './pages/PrivacyPolicy';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/fleet" element={<Fleet />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/vehicle/:id" element={<VehicleDetails />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;