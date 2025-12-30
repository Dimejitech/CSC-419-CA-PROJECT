import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import LabResults from './pages/LabResults';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lab-results" element={<LabResults />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* Placeholder routes for other pages */}
          <Route path="/appointments" element={<div className="p-8"><h2 className="text-xl font-bold">Appointments - Coming Soon</h2></div>} />
          <Route path="/medical-records" element={<div className="p-8"><h2 className="text-xl font-bold">Medical Records - Coming Soon</h2></div>} />
          <Route path="/prescriptions" element={<div className="p-8"><h2 className="text-xl font-bold">Prescriptions - Coming Soon</h2></div>} />
          <Route path="/billing" element={<div className="p-8"><h2 className="text-xl font-bold">Billing - Coming Soon</h2></div>} />
          <Route path="/help" element={<div className="p-8"><h2 className="text-xl font-bold">Help / Support - Coming Soon</h2></div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;