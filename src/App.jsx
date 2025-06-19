import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        {/* ADMIN */}
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
        {/* KARYAWAN */}
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
      </Routes>
    </Router>
  );
}

export default App;

