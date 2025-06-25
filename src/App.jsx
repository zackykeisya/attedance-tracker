import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import AdminUserList from './pages/AdminUserList';
import AdminAbsensi from './pages/AdminAbsensi';
import AdminStatistik from './pages/AdminStatistik';
import KaryawanDashboard from './pages/KaryawanDashboard';
import KaryawanRiwayat from './pages/KaryawanRiwayat';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root ke /login */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute role="admin">
              <AdminUserList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/absensi"
          element={
            <ProtectedRoute role="admin">
              <AdminAbsensi />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/statistik"
          element={
            <ProtectedRoute role="admin">
              <AdminStatistik />
            </ProtectedRoute>
          }
        />

        {/* Karyawan Routes */}
        <Route
          path="/karyawan"
          element={
            <ProtectedRoute role="karyawan">
              <KaryawanDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/karyawan/riwayat"
          element={
            <ProtectedRoute role="karyawan">
              <KaryawanRiwayat />
            </ProtectedRoute>
          }
        />

        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;

