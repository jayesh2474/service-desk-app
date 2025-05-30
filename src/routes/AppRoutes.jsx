import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import RaiseTicket from '../pages/RaiseTicket';
import AdminPanel from '../pages/AdminPanel';

const AppRoutes = () => {
  return (
    <Router>
    {/* You can wrap routes in a layout later */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/raise-ticket" element={<RaiseTicket />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
