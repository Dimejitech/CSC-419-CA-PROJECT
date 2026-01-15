import { Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './pages/SignIn';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';
import RolesPermission from './pages/RolesPermission';
import AuditLogs from './pages/AuditLogs';
import Profile from './pages/Profile';

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/dashboard" element={<AdminDashboard />} />
      <Route path="/user-management" element={<UserManagement />} />
      <Route path="/roles-permissions" element={<RolesPermission />} />
      <Route path="/audit-logs" element={<AuditLogs />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;