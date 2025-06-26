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
  const [data, setData] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterDays, setFilterDays] = useState(30);
  const [activeTab, setActiveTab] = useState('attendance');

  const navigate = useNavigate();
  const rawUser = localStorage.getItem('user');
  const user = rawUser ? JSON.parse(rawUser) : null;
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!user || !token) {
      localStorage.clear();
      navigate('/login');
      return;
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    fetchRiwayat(filterDays);
  }, [filterDays]);

  const fetchRiwayat = async (days) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        from: new Date(new Date().setDate(new Date().getDate() - days)).toISOString().split('T')[0],
        to: new Date().toISOString().split('T')[0],
      };

      // Ambil absensi dan izin user login
      const [attendanceRes, permissionRes] = await Promise.all([
        axios.get(`/history/${user.id}`, { params }),
        axios.get('/permissions', { params }) // <-- gunakan params agar filter tanggal sama
      ]);

      setData(attendanceRes.data.riwayat || []);
      // Ambil data izin dari permissionRes.data.data (lihat controller Anda)
      setPermissions(Array.isArray(permissionRes.data.data) ? permissionRes.data.data : []);

      setSummary({
        total: attendanceRes.data.total_absen || 0,
        late: attendanceRes.data.terlambat || 0,
        onTime: attendanceRes.data.tepat_waktu || 0,
        permission: Array.isArray(permissionRes.data.data) ? permissionRes.data.data.length : 0
      });
    } catch (err) {
      console.error('Error fetching history:', err);
      setError(err.response?.data?.message || 'Gagal memuat riwayat');
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.clear();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (str) => new Date(str).toLocaleDateString('id-ID', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
  });

  const formatTime = (str) => (str ? str.slice(0, 5) : '-');

  const getStatusIcon = (absen) => {
    if (!absen.clock_in) return <FiLoader className="text-warning" />;
    const [hour, minute] = absen.clock_in.split(':').map(Number);
    return (hour > 8 || (hour === 8 && minute > 0))
      ? <FiAlertCircle className="text-danger" />
      : <FiCheckCircle className="text-success" />;
  };

  const getStatusText = (absen) => {
    if (!absen.clock_in) return 'Belum Absen';
    const [hour, minute] = absen.clock_in.split(':').map(Number);
    return (hour > 8 || (hour === 8 && minute > 0)) ? 'Terlambat' : 'Tepat Waktu';
  };

  const getStatusBadgeClass = (absen) => {
    if (!absen.clock_in) return 'bg-warning text-dark';
    const [hour, minute] = absen.clock_in.split(':').map(Number);
    return (hour > 8 || (hour === 8 && minute > 0)) ? 'bg-danger' : 'bg-success';
  };

  const getPermissionStatusBadge = (status) => {
    if (status === 'approved') return 'bg-success';
    if (status === 'rejected') return 'bg-danger';
    return 'bg-warning text-dark';
  };

  const getPermissionTypeText = (type) => {
    if (type === 'sick') return 'Sakit';
    if (type === 'leave') return 'Cuti/Izin';
    return 'Lainnya';
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container-fluid p-0 min-vh-100 d-flex flex-column">
      <Navbar user={user} onLogout={() => {
        axios.post('/logout').finally(() => {
          localStorage.clear();
          navigate('/login');
        });
      }} />

      <main className="container py-4 flex-grow-1">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h4 fw-bold text-primary"><FiCalendar className="me-2" /> Riwayat Absensi</h1>
          <select
            value={filterDays}
            onChange={(e) => setFilterDays(Number(e.target.value))}
            className="form-select w-auto"
          >
            <option value={7}>7 Hari</option>
            <option value={30}>30 Hari</option>
            <option value={90}>90 Hari</option>
          </select>
        </div>

        {/* Tabs */}
        <ul className="nav nav-tabs mb-3">
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'attendance' ? 'active' : ''}`} onClick={() => setActiveTab('attendance')}>Absensi</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'permission' ? 'active' : ''}`} onClick={() => setActiveTab('permission')}>Izin</button>
          </li>
        </ul>

        {error && <div className="alert alert-danger"><FiAlertCircle className="me-2" /> {error}</div>}

        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
          </div>
        ) : activeTab === 'attendance' ? (
          data.length === 0 ? (
            <div className="alert alert-secondary text-center">
              <FiClock className="mb-2 fs-4" />
              <p>Tidak ada data absensi dalam {filterDays} hari terakhir.</p>
            </div>
          ) : (
            <div className="table-responsive shadow-sm">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Tanggal</th>
                    <th>Clock In</th>
                    <th>Status</th>
                    <th>Clock Out</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map(absen => {
                    const izinHariIni = permissions.find(p => p.date === absen.date && p.status === 'approved');
                    const isIzin = !!izinHariIni;
                    const isIzinSakit = isIzin && izinHariIni.type === 'sick';

                    return (
                      <tr key={absen.id}>
                        <td>{formatDate(absen.date)}</td>
                        <td>{isIzin ? '-' : formatTime(absen.clock_in)}</td>
                        <td>
                          {isIzinSakit ? (
                            <span className="badge bg-info">Izin/Sakit</span>
                          ) : isIzin ? (
                            <span className="badge bg-primary">Izin</span>
                          ) : (
                            <span className={`badge ${getStatusBadgeClass(absen)}`}>
                              {getStatusText(absen)}
                            </span>
                          )}
                        </td>
                        <td>{isIzin ? '-' : formatTime(absen.clock_out)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div className="table-responsive shadow-sm">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Tanggal</th>
                  <th>Jenis Izin</th>
                  <th>Keterangan</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {permissions.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center text-muted py-4">
                      Tidak ada data izin.
                    </td>
                  </tr>
                ) : (
                  permissions.map(p => (
                    <tr key={p.id}>
                      <td>{formatDate(p.date)}</td>
                      <td>{getPermissionTypeText(p.type)}</td>
                      <td>{p.description}</td>
                      <td>
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
        )}
      </main>

      <Footer />
    </motion.div>
  );
}
