import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SignUp, SignIn, Home, Prescriptions, MedicalRecords, Appointments, Billing, LabResults, Profile } from './pages';
import { DashboardLayout } from './layouts';
import './styles/global.css';

// Placeholder component for pages your teammates will implement
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '400px',
    gap: '16px',
  }}>
    <h2 style={{ color: '#4A4A4A', margin: 0 }}>{title}</h2>
    <p style={{ color: '#9EA2AD', margin: 0 }}>This page is ready for your teammates to implement.</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Authentication Routes (no sidebar/header) */}
        <Route path="/login" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Dashboard Routes (with sidebar/header) */}
        <Route element={<DashboardLayout />}>
          {/* Implemented pages */}
          <Route path="/prescriptions" element={<Prescriptions />} />
          <Route path="/medical-records" element={<MedicalRecords />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/lab-results" element={<LabResults />} />
          <Route path="/profile" element={<Profile />} />

          {/* Home route */}
          <Route path="/" element={<Home />} />

          {/* Placeholder routes for teammates to implement */}
          <Route path="/help" element={<PlaceholderPage title="Help / Support" />} />
        </Route>

        {/* Redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
