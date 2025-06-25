import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const KaryawanDashboard = () => {
  const [user, setUser] = useState(null);
  const [absenToday, setAbsenToday] = useState(null);
  const [loading, setLoading] = useState(false);
  const [attendanceStats, setAttendanceStats] = useState({});
  const [error, setError] = useState(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [permissionData, setPermissionData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'sick',
    description: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const rawUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (rawUser && token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(JSON.parse(rawUser));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const todayRes = await axios.get('/today');

      setAbsenToday({
        clock_in: todayRes.data.clock_in || null,
        clock_out: todayRes.data.clock_out || null,
        is_permission: todayRes.data.is_permission || false,
        permission_type: todayRes.data.permission_type || null,
        description: todayRes.data.description || null,
        date: todayRes.data.date || new Date().toISOString().split('T')[0]
      });

      const statsRes = await axios.get(`/history/${user?.id}`, {
        params: {
          from: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
          to: new Date().toISOString().split('T')[0]
        }
      });

      const history = Array.isArray(statsRes.data?.data) ? statsRes.data.data : [];
      const presentDays = history.filter(item => item.clock_in).length;
      const lateDays = history.filter(item => {
        if (!item.clock_in) return false;
        const [hours, minutes] = item.clock_in.split(':').map(Number);
        return hours > 8 || (hours === 8 && minutes > 0);
      }).length;

      setAttendanceStats({
        present: presentDays - lateDays,
        late: lateDays,
        absent: 7 - presentDays,
        attendanceRate: Math.round((presentDays / 7) * 100)
      });

    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError(err.response?.data?.message || 'Gagal memuat data');
      setAbsenToday({
        clock_in: null,
        clock_out: null,
        is_permission: false,
        permission_type: null,
        description: null,
        date: new Date().toISOString().split('T')[0]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClockIn = async () => {
    try {
      setLoading(true);
      setError(null);
      await axios.post('/clock-in');
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal melakukan clock in');
      if (err.response?.status === 401) handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    try {
      setLoading(true);
      setError(null);
      await axios.post('/clock-out');
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal melakukan clock out');
      if (err.response?.status === 401) handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    axios.post('/logout')
      .finally(() => {
        localStorage.clear();
        navigate('/login');
      });
  };

  const handlePermissionSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      await axios.post('/permissions', permissionData);
      await fetchData();
      setShowPermissionModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengajukan izin');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const RealTimeClock = () => {
    const [now, setNow] = useState(new Date());
    useEffect(() => {
      const timer = setInterval(() => setNow(new Date()), 1000);
      return () => clearInterval(timer);
    }, []);
    return (
      <div className="row mb-3">
        <div className="col-6">
          <p className="text-muted mb-1">Tanggal</p>
          <p className="fw-bold">
            {now.toLocaleDateString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <div className="col-6">
          <p className="text-muted mb-1">Jam Sekarang</p>
          <p className="fw-bold">{now.toLocaleTimeString('id-ID')}</p>
        </div>
      </div>
    );
  };

  const isLate = (clockInTime) => {
    if (!clockInTime) return false;
    const [hours, minutes] = clockInTime.split(':').map(Number);
    return hours > 8 || (hours === 8 && minutes > 0);
  };

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="container-fluid py-4 flex-grow-1">
        <div className="row mb-4">
          <div className="col-12">
            <h2 className="fw-bold">
              <i className="bi bi-house-door me-2"></i>
              Selamat datang, <span className="text-primary">{user?.name}</span>!
            </h2>
            <p className="text-muted">Apa yang ingin Anda lakukan hari ini?</p>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger alert-dismissible fade show">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
            <button
              type="button"
              className="btn-close"
              onClick={() => setError(null)}
            ></button>
          </div>
        )}

        <div className="row g-4">
          {/* Absensi Hari Ini */}
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-white border-bottom-0">
                <h3 className="card-title mb-0 fw-bold">
                  <i className="bi bi-calendar-check me-2 text-primary"></i>
                  Absensi Hari Ini
                </h3>
              </div>
              <div className="card-body">
                <RealTimeClock />
                <div className="d-flex justify-content-between mb-4">
                  <div>
                    <p className="text-muted mb-1">Clock In</p>
                    <p className="fw-bold fs-5">
                      {absenToday?.is_permission ? (
                        <span className="badge bg-info">Izin {absenToday.permission_type}</span>
                      ) : absenToday?.clock_in ? (
                        <>
                          {absenToday.clock_in}
                          {isLate(absenToday.clock_in) && (
                            <span className="badge bg-danger ms-2">Telat</span>
                          )}
                        </>
                      ) : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted mb-1">Clock Out</p>
                    <p className="fw-bold fs-5">
                      {absenToday?.is_permission ? '-' : absenToday?.clock_out || '-'}
                    </p>
                  </div>
                </div>

                <div className="d-grid gap-2">
                  {absenToday?.is_permission ? (
                    <div className="alert alert-info mb-0">
                      <i className="bi bi-check-circle me-2"></i>
                      Anda memiliki izin {absenToday.permission_type}: {absenToday.description}
                    </div>
                  ) : (
                    <>
                      {(!absenToday?.clock_in) && (
                        <button onClick={handleClockIn} className="btn btn-success btn-lg" disabled={loading}>
                          {loading ? 'Memproses...' : <> <i className="bi bi-box-arrow-in-right me-2" /> Clock In </>}
                        </button>
                      )}

                      {(absenToday?.clock_in && !absenToday?.clock_out) && (
                        <button onClick={handleClockOut} className="btn btn-danger btn-lg" disabled={loading}>
                          {loading ? 'Memproses...' : <> <i className="bi bi-box-arrow-right me-2" /> Clock Out </>}
                        </button>
                      )}

                      {(absenToday?.clock_in && absenToday?.clock_out) && (
                        <div className="alert alert-success mb-0">
                          <i className="bi bi-check-circle me-2" />
                          Absensi hari ini sudah selesai
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Statistik Mingguan */}
          <div className="col-md-6 col-lg-4">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-white border-bottom-0">
                <h3 className="card-title mb-0 fw-bold">
                  <i className="bi bi-graph-up me-2 text-primary"></i>
                  Statistik Minggu Ini
                </h3>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between mb-3">
                  <div className="text-center">
                    <p className="text-muted mb-1">Hadir</p>
                    <p className="fw-bold fs-4 text-success">{attendanceStats.present || 0}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted mb-1">Terlambat</p>
                    <p className="fw-bold fs-4 text-warning">{attendanceStats.late || 0}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted mb-1">Absen</p>
                    <p className="fw-bold fs-4 text-danger">{attendanceStats.absent || 0}</p>
                  </div>
                </div>
                <div className="progress mb-3" style={{ height: '10px' }}>
                  <div className="progress-bar bg-success" style={{ width: `${attendanceStats.attendanceRate || 0}%` }}></div>
                </div>
                <Link to="/karyawan/riwayat" className="btn btn-outline-primary w-100">Lihat Detail Riwayat</Link>
              </div>
            </div>
          </div>

          {/* Akses Cepat */}
          <div className="col-md-6 col-lg-3">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-white border-bottom-0">
                <h3 className="card-title mb-0 fw-bold">
                  <i className="bi bi-lightning me-2 text-primary"></i>
                  Akses Cepat
                </h3>
              </div>
              <div className="card-body">
                <div className="d-grid gap-2">
                  <Link to="/karyawan/riwayat" className="btn btn-outline-secondary text-start">
                    <i className="bi bi-clock-history me-2"></i> Riwayat Absensi
                  </Link>
                  <Link to="/karyawan/profile" className="btn btn-outline-secondary text-start">
                    <i className="bi bi-person me-2"></i> Profil Saya
                  </Link>
                  <button onClick={() => setShowPermissionModal(true)} className="btn btn-outline-secondary text-start">
                    <i className="bi bi-envelope-paper me-2"></i> Ajukan Izin
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Modal Izin */}
      {showPermissionModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Ajukan Izin</h5>
                <button type="button" className="btn-close" onClick={() => setShowPermissionModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Tanggal Izin</label>
                  <input
                    type="date"
                    className="form-control"
                    value={permissionData.date}
                    onChange={(e) => setPermissionData({ ...permissionData, date: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Jenis Izin</label>
                  <select
                    className="form-select"
                    value={permissionData.type}
                    onChange={(e) => setPermissionData({ ...permissionData, type: e.target.value })}
                  >
                    <option value="sick">Sakit</option>
                    <option value="leave">Cuti/Izin</option>
                    <option value="other">Lainnya</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Keterangan</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={permissionData.description}
                    onChange={(e) => setPermissionData({ ...permissionData, description: e.target.value })}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowPermissionModal(false)}>Batal</button>
                <button type="button" className="btn btn-primary" onClick={handlePermissionSubmit} disabled={loading}>
                  {loading ? 'Mengirim...' : 'Ajukan Izin'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KaryawanDashboard;
