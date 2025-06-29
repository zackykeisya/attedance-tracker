import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { FiClock, FiCalendar, FiCheckCircle, FiAlertCircle, FiLoader } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function KaryawanRiwayat() {
  // ===== STATE MANAGEMENT =====
  const [data, setData] = useState([]); // Data absensi
  const [permissions, setPermissions] = useState([]); // Data izin
  const [summary, setSummary] = useState({}); // Ringkasan statistik absensi
  const [loading, setLoading] = useState(true); // Status loading
  const [error, setError] = useState(null); // Pesan error
  const [filterDays, setFilterDays] = useState(30); // Filter hari (7/30/90)
  const [activeTab, setActiveTab] = useState('attendance'); // Tab aktif: absensi/izin

  const navigate = useNavigate();
  const rawUser = localStorage.getItem('user');
  const user = rawUser ? JSON.parse(rawUser) : null;
  const token = localStorage.getItem('token');

  // Ambil data saat komponen mount atau filterDays berubah
  useEffect(() => {
    if (!user || !token) {
      localStorage.clear();
      navigate('/login');
      return;
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    fetchRiwayat(filterDays);
  }, [filterDays]);

  // ===== FETCH DATA RIWAYAT =====
  // Mengambil data absensi dan izin dari server
  const fetchRiwayat = async (days) => {
    try {
      setLoading(true);
      setError(null);

      const today = new Date().toISOString().split('T')[0];
      const fromDate = new Date(new Date().setDate(new Date().getDate() - days)).toISOString().split('T')[0];

      const rangeParams = { from: fromDate, to: today };
      const dateParam = { date: today };

      // Ambil data absensi, izin range, dan izin hari ini
      const [attendanceRes, permissionRes, todayPermissionRes] = await Promise.all([
        axios.get(`/history/${user.id}`, { params: rangeParams }),
        axios.get('/permissions', { params: rangeParams }),
        axios.get('/permissions', { params: dateParam })
      ]);

      // Gabungkan data izin agar tidak duplikat
      const combinedPermissions = [
        ...(Array.isArray(permissionRes.data.data) ? permissionRes.data.data : []),
        ...(Array.isArray(todayPermissionRes.data.data) ? todayPermissionRes.data.data : [])
      ];
      const uniquePermissions = combinedPermissions.filter(
        (item, index, self) => index === self.findIndex(p => p.id === item.id)
      );

      setData(attendanceRes.data.riwayat || []);
      setPermissions(uniquePermissions);

      // Set ringkasan statistik absensi
      setSummary({
        total: attendanceRes.data.total_absen || 0,
        late: attendanceRes.data.terlambat || 0,
        onTime: attendanceRes.data.tepat_waktu || 0,
        permission: uniquePermissions.length
      });
    } catch (err) {
      console.error('Error fetching history:', err);
      setError(err.response?.data?.message || 'Gagal memuat riwayat');
      if ([401, 403].includes(err.response?.status)) {
        localStorage.clear();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // ===== HELPER FUNCTIONS =====
  // Format tanggal ke format lokal
  const formatDate = (str) => new Date(str).toLocaleDateString('id-ID', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
  });

  // Format jam (ambil jam:menit)
  const formatTime = (str) => (str ? str.slice(0, 5) : '-');

  // Icon status absensi (tepat waktu/terlambat/belum absen)
  const getStatusIcon = (absen) => {
    if (!absen.clock_in) return <FiLoader className="text-warning" />;
    const [hour, minute] = absen.clock_in.split(':').map(Number);
    return (hour > 8 || (hour === 8 && minute > 0))
      ? <FiAlertCircle className="text-danger" />
      : <FiCheckCircle className="text-success" />;
  };

  // Teks status absensi
  const getStatusText = (absen) => {
    const izin = permissions.find(p => p.date === absen.date && p.status === 'approved');
    if (izin) return 'Izin';
    if (!absen.clock_in) return 'Belum Absen';

    const [hour, minute] = absen.clock_in.split(':').map(Number);
    return (hour > 8 || (hour === 8 && minute > 0)) ? 'Terlambat' : 'Tepat Waktu';
  };

  // Badge warna status absensi
  const getStatusBadgeClass = (absen) => {
    const izin = permissions.find(p => p.date === absen.date && p.status === 'approved');
    if (izin) return 'bg-info';
    if (!absen.clock_in) return 'bg-warning text-dark';

    const [hour, minute] = absen.clock_in.split(':').map(Number);
    return (hour > 8 || (hour === 8 && minute > 0)) ? 'bg-danger' : 'bg-success';
  };

  // Badge warna status izin
  const getPermissionStatusBadge = (status) => {
    if (status === 'approved') return 'bg-success';
    if (status === 'rejected') return 'bg-danger';
    return 'bg-warning text-dark';
  };

  // Teks jenis izin
  const getPermissionTypeText = (type) => {
    if (type === 'sick') return 'Sakit';
    if (type === 'leave') return 'Cuti/Izin';
    return 'Lainnya';
  };

  // ===== RENDER =====
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="container-fluid p-0 min-vh-100 d-flex flex-column bg-light"
    >
      {/* Navbar karyawan */}
      <Navbar user={user} onLogout={() => {
        axios.post('/logout').finally(() => {
          localStorage.clear();
          navigate('/login');
        });
      }} />

      <main className="container py-4 flex-grow-1">
        {/* Header dan filter */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold mb-0 text-primary">
            <FiCalendar className="me-2" />
            Riwayat Absensi
          </h2>
          <div className="d-flex align-items-center">
            <span className="me-2 text-muted">Filter:</span>
            <select
              value={filterDays}
              onChange={(e) => setFilterDays(Number(e.target.value))}
              className="form-select form-select-sm w-auto"
            >
              <option value={7}>7 Hari Terakhir</option>
              <option value={30}>30 Hari Terakhir</option>
              <option value={90}>90 Hari Terakhir</option>
            </select>
          </div>
        </div>

        {/* Kartu ringkasan statistik */}
        <div className="row mb-4 g-3">
          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <h3 className="card-title fs-1 fw-bold text-primary">{summary.total || 0}</h3>
                <p className="card-text text-muted">Total Kehadiran</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <h3 className="card-title fs-1 fw-bold text-success">{summary.onTime || 0}</h3>
                <p className="card-text text-muted">Tepat Waktu</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <h3 className="card-title fs-1 fw-bold text-warning">{summary.late || 0}</h3>
                <p className="card-text text-muted">Terlambat</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <h3 className="card-title fs-1 fw-bold text-info">{summary.permission || 0}</h3>
                <p className="card-text text-muted">Izin</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab navigasi absensi/izin */}
        <ul className="nav nav-tabs nav-fill mb-4">
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'attendance' ? 'active fw-bold' : ''}`} 
              onClick={() => setActiveTab('attendance')}
            >
              <FiClock className="me-2" />
              Absensi
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'permission' ? 'active fw-bold' : ''}`} 
              onClick={() => setActiveTab('permission')}
            >
              <FiCheckCircle className="me-2" />
              Izin
            </button>
          </li>
        </ul>

        {/* Pesan error */}
        {error && (
          <div className="alert alert-danger d-flex align-items-center">
            <FiAlertCircle className="me-2 fs-4" />
            <div>{error}</div>
          </div>
        )}

        {/* Loading spinner */}
        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : activeTab === 'attendance' ? (
          // Tabel absensi
          data.length === 0 ? (
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5">
                <FiClock className="mb-3 fs-1 text-muted" />
                <h5 className="text-muted">Tidak ada data absensi</h5>
                <p className="text-muted">Tidak ada data absensi dalam {filterDays} hari terakhir.</p>
              </div>
            </div>
          ) : (
            <div className="card border-0 shadow-sm">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">Tanggal</th>
                      <th>Clock In</th>
                      <th>Status</th>
                      <th className="pe-4">Clock Out</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map(absen => {
                      const izinHariIni = permissions.find(p => p.date === absen.date && p.status === 'approved');
                      const isIzin = !!izinHariIni;

                      return (
                        <tr key={absen.id}>
                          <td className="ps-4 fw-medium">{formatDate(absen.date)}</td>
                          <td>{isIzin ? '-' : formatTime(absen.clock_in)}</td>
                          <td>
                            {isIzin ? (
                              <span className="badge bg-info">
                                Izin ({getPermissionTypeText(izinHariIni.type)})
                              </span>
                            ) : (
                              <span className={`badge ${getStatusBadgeClass(absen)}`}>
                                {getStatusText(absen)}
                              </span>
                            )}
                          </td>
                          <td className="pe-4">{isIzin ? '-' : formatTime(absen.clock_out)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )
        ) : (
          // Tabel izin
          <div className="card border-0 shadow-sm">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4">Tanggal</th>
                    <th>Jenis Izin</th>
                    <th>Keterangan</th>
                    <th className="pe-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {permissions.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center text-muted py-5">
                        <FiCheckCircle className="mb-2 fs-4" />
                        <p>Tidak ada data izin.</p>
                      </td>
                    </tr>
                  ) : (
                    permissions.map(p => (
                      <tr key={p.id}>
                        <td className="ps-4 fw-medium">{formatDate(p.date)}</td>
                        <td>{getPermissionTypeText(p.type)}</td>
                        <td>{p.description}</td>
                        <td className="pe-4">
                          <span className={`badge ${getPermissionStatusBadge(p.status)}`}>
                            {p.status === 'approved' ? 'Disetujui' : p.status === 'rejected' ? 'Ditolak' : 'Menunggu'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </motion.div>
  );
}