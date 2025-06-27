import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const KaryawanDashboard = () => {
  // State management
  const [user, setUser] = useState(() => {
    const rawUser = localStorage.getItem('user');
    return rawUser ? JSON.parse(rawUser) : null;
  });
  
  const [todayAttendance, setTodayAttendance] = useState(() => {
    const saved = localStorage.getItem('todayAttendance');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [loading, setLoading] = useState({
    clockIn: false,
    clockOut: false,
    general: false
  });
  
  const [attendanceStats, setAttendanceStats] = useState({});
  const [error, setError] = useState(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [permissionData, setPermissionData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'sick',
    description: ''
  });
  
  const [permissionStatus, setPermissionStatus] = useState(() => {
    const saved = localStorage.getItem('permissionStatus');
    return saved ? JSON.parse(saved) : null;
  });
  
  const navigate = useNavigate();

  // Helper functions
  const formatTime = (timeString) => {
    if (!timeString) return '-';
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };

  const isLate = (clockInTime) => {
    if (!clockInTime) return false;
    const [hours, minutes] = clockInTime.split(':').map(Number);
    return hours > 8 || (hours === 8 && minutes > 0);
  };

  // Data fetching
  const fetchData = async () => {
    try {
      setLoading(prev => ({ ...prev, general: true }));
      setError(null);

      const todayRes = await axios.get('/today');
      let attendanceData = todayRes.data;

      setTodayAttendance(attendanceData);
      localStorage.setItem('todayAttendance', JSON.stringify(attendanceData));

      const today = new Date().toISOString().split('T')[0];
      const permissionRes = await axios.get('/permissions', { params: { date: today } });
      
      if (permissionRes.data && Array.isArray(permissionRes.data.data) && permissionRes.data.data.length > 0) {
        setPermissionStatus(permissionRes.data.data[0]);
      } else {
        setPermissionStatus(null);
      }

      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const [statsRes, izinStatRes] = await Promise.all([
        axios.get('/history', {
          params: {
            from: oneWeekAgo.toISOString().split('T')[0],
            to: new Date().toISOString().split('T')[0]
          }
        }),
        axios.get('/permissions', {
          params: {
            from: oneWeekAgo.toISOString().split('T')[0],
            to: new Date().toISOString().split('T')[0],
            status: 'approved'
          }
        })
      ]);

      const history = Array.isArray(statsRes.data?.data) ? statsRes.data.data : [];
      const izinApproved = Array.isArray(izinStatRes.data?.data) ? izinStatRes.data.data : [];
      const izinDates = izinApproved.map(i => i.date);
      const hadirTanpaIzin = history.filter(item => !izinDates.includes(item.date) && item.clock_in);
      const lateDays = hadirTanpaIzin.filter(item => isLate(item.clock_in)).length;

      setAttendanceStats({
        present: hadirTanpaIzin.length - lateDays,
        late: lateDays,
        absent: 7 - hadirTanpaIzin.length - izinDates.length,
        attendanceRate: Math.round((hadirTanpaIzin.length / 7) * 100),
        totalWorkHours: hadirTanpaIzin.reduce((total, item) => {
          if (item.clock_in && item.clock_out) {
            const [inH, inM] = item.clock_in.split(':').map(Number);
            const [outH, outM] = item.clock_out.split(':').map(Number);
            return total + (outH - inH) + (outM - inM) / 60;
          }
          return total;
        }, 0)
      });

    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat data');
    } finally {
      setLoading(prev => ({ ...prev, general: false }));
    }
  };

  // Event handlers
  const handleClockIn = async () => {
    try {
      setLoading(prev => ({...prev, clockIn: true}));
      const optimisticData = {
        clock_in: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        status: 'present'
      };
      setTodayAttendance(optimisticData);
      const res = await axios.post('/clock-in');
      setTodayAttendance({
        clock_in: res.data.data.clock_in,
        status: 'present'
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal melakukan clock in');
      setTodayAttendance(prev => {
        const saved = localStorage.getItem('todayAttendance');
        return saved ? JSON.parse(saved) : prev;
      });
    } finally {
      setLoading(prev => ({...prev, clockIn: false}));
    }
  };

  const handleClockOut = async () => {
    try {
      setLoading(prev => ({...prev, clockOut: true}));
      const optimisticData = {
        ...todayAttendance,
        clock_out: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };
      setTodayAttendance(optimisticData);
      const res = await axios.post('/clock-out');
      setTodayAttendance(prev => ({
        ...prev,
        clock_out: res.data.data.clock_out
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal melakukan clock out');
      setTodayAttendance(prev => {
        const saved = localStorage.getItem('todayAttendance');
        return saved ? JSON.parse(saved) : prev;
      });
    } finally {
      setLoading(prev => ({...prev, clockOut: false}));
    }
  };

  const handlePermissionSubmit = async () => {
    try {
      setLoading(prev => ({...prev, general: true}));
      if (!permissionData.date || !permissionData.description) {
        throw new Error('Harap isi semua field');
      }

      const res = await axios.post('/permissions', permissionData);

      setPermissionStatus({
        status: 'pending',
        date: permissionData.date,
        type: permissionData.type,
        description: permissionData.description
      });

      await fetchData();
      setShowPermissionModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengajukan izin');
    } finally {
      setLoading(prev => ({...prev, general: false}));
    }
  };

  const handleLogout = () => {
    axios.post('/logout').finally(() => {
      localStorage.clear();
      navigate('/login');
    });
  };

  // Effects
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

  useEffect(() => {
    if (todayAttendance) {
      localStorage.setItem('todayAttendance', JSON.stringify(todayAttendance));
    }
    if (permissionStatus) {
      localStorage.setItem('permissionStatus', JSON.stringify(permissionStatus));
    }
  }, [todayAttendance, permissionStatus]);

  useEffect(() => {
    const checkDate = () => {
      const today = new Date().toLocaleDateString('id-ID');
      const lastSavedDate = localStorage.getItem('lastAttendanceDate');
      if (lastSavedDate !== today) {
        localStorage.removeItem('todayAttendance');
        localStorage.removeItem('permissionStatus');
        localStorage.setItem('lastAttendanceDate', today);
      }
    };
    checkDate();
  }, []);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  useEffect(() => {
    const checkResetAttendance = async () => {
      try {
        const todayRes = await axios.get('/today');
        const attendanceData = todayRes.data;
        if (attendanceData.clock_in === null) {
          localStorage.removeItem('todayAttendance');
          setTodayAttendance(null);
        }
      } catch (err) {
        console.error('Error checking attendance:', err);
      }
    };

    const interval = setInterval(checkResetAttendance, 30000);
    return () => clearInterval(interval);
  }, []);

  // Components
  const RealTimeClock = () => {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
      const timer = setInterval(() => setTime(new Date()), 1000);
      return () => clearInterval(timer);
    }, []);
    return (
      <div className="mb-3">
        <p className="mb-1"><strong>Jam: </strong>{time.toLocaleTimeString('id-ID')}</p>
        <p className="mb-0"><strong>Tanggal: </strong>{time.toLocaleDateString('id-ID', {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        })}</p>
      </div>
    );
  };

  const renderAttendanceStatus = () => {
    if (todayAttendance?.is_permission) {
      return (
        <div className="alert alert-info d-flex align-items-center">
          <i className="bi bi-check-circle-fill me-2 fs-4"></i>
          <span>Anda sedang izin hari ini ({todayAttendance.permission_type})</span>
        </div>
      );
    }

    if (permissionStatus?.status === 'approved') {
      return (
        <div className="alert alert-success d-flex align-items-center">
          <i className="bi bi-check-circle-fill me-2 fs-4"></i>
          <span>Anda tidak perlu absen karena izin telah disetujui</span>
        </div>
      );
    }

    if (permissionStatus?.status === 'pending') {
      return (
        <div className="alert alert-info d-flex align-items-center">
          <i className="bi bi-hourglass-split me-2 fs-4"></i>
          <span>Permohonan izin Anda pada tanggal {new Date(permissionStatus.date).toLocaleDateString('id-ID')} sedang diproses</span>
        </div>
      );
    }

    if (todayAttendance?.clock_out) {
      return (
        <div className="alert alert-success d-flex align-items-center">
          <i className="bi bi-check-circle me-2 fs-4"></i>
          <span>Absensi hari ini sudah selesai</span>
        </div>
      );
    }

    return null;
  };

  const renderActionButton = () => {
    if (todayAttendance?.is_permission || permissionStatus?.status === 'approved') {
      return null;
    }

    if (permissionStatus?.status === 'pending') {
      return (
        <button className="btn btn-secondary w-100 btn-lg" disabled>
          <i className="bi bi-hourglass me-2"></i>
          Menunggu persetujuan izin
        </button>
      );
    }

    if (!todayAttendance?.clock_in) {
      return (
        <button 
          onClick={handleClockIn} 
          className="btn btn-primary btn-lg w-100 py-3"
          disabled={loading.clockIn || loading.general}
        >
          {loading.clockIn ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Memproses...
            </>
          ) : (
            <>
              <i className="bi bi-box-arrow-in-right me-2"></i>
              Clock In Sekarang
            </>
          )}
        </button>
      );
    }

    if (!todayAttendance?.clock_out) {
      return (
        <button 
          onClick={handleClockOut} 
          className="btn btn-danger btn-lg w-100 py-3"
          disabled={loading.clockOut || loading.general}
        >
          {loading.clockOut ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Memproses...
            </>
          ) : (
            <>
              <i className="bi bi-box-arrow-right me-2"></i>
              Clock Out Sekarang
            </>
          )}
        </button>
      );
    }

    return null;
  };

  // Main render
  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <Navbar user={user} onLogout={handleLogout} />
      
      <main className="container py-4 flex-grow-1">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold mb-0">
            <i className="bi bi-house-door me-2"></i>
            Dashboard Karyawan
          </h2>
          <div className="badge bg-primary fs-6">
            {user?.name}
          </div>
        </div>

        {error && (
          <div className="alert alert-danger alert-dismissible fade show">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setError(null)}
              aria-label="Close"
            />
          </div>
        )}

        <div className="row g-4">
          {/* Attendance Card */}
          <div className="col-lg-6">
            <div className="card shadow-sm h-100 border-0">
              <div className="card-header bg-white border-0 py-3">
                <h4 className="card-title mb-0">
                  <i className="bi bi-calendar-check me-2 text-primary"></i>
                  Absensi Hari Ini
                </h4>
              </div>
              <div className="card-body d-flex flex-column">
                <RealTimeClock />
                
                {renderAttendanceStatus()}
                
                <div className="mt-3">
                  {renderActionButton()}
                </div>

                <div className="attendance-times mt-4">
                  <div className="row text-center g-2">
                    <div className="col-6">
                      <div className={`p-3 rounded-3 ${todayAttendance?.clock_in ? 'bg-light' : 'bg-light-subtle'}`}>
                        <p className="text-muted mb-1 small">Clock In</p>
                        <p className={`fw-bold fs-4 mb-0 ${isLate(todayAttendance?.clock_in) ? 'text-warning' : ''}`}>
                          {formatTime(todayAttendance?.clock_in)}
                        </p>
                        {isLate(todayAttendance?.clock_in) && (
                          <small className="text-warning">
                            <i className="bi bi-exclamation-triangle-fill me-1"></i>
                            Terlambat
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-6">
                      <div className={`p-3 rounded-3 ${todayAttendance?.clock_out ? 'bg-light' : 'bg-light-subtle'}`}>
                        <p className="text-muted mb-1 small">Clock Out</p>
                        <p className="fw-bold fs-4 mb-0">{formatTime(todayAttendance?.clock_out)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {!todayAttendance?.clock_in && !todayAttendance?.clock_out && !permissionStatus && (
                  <button 
                    onClick={() => setShowPermissionModal(true)}
                    className="btn btn-outline-primary btn-lg w-100 mt-3"
                    disabled={loading.general}
                  >
                    <i className="bi bi-envelope-paper me-2"></i>
                    Ajukan Izin
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="col-lg-6">
            <div className="card shadow-sm h-100 border-0">
              <div className="card-header bg-white border-0 py-3">
                <h4 className="card-title mb-0">
                  <i className="bi bi-graph-up me-2 text-primary"></i>
                  Statistik Mingguan
                </h4>
              </div>
              <div className="card-body d-flex flex-column">
                <div className="row g-3 mb-4">
                  <div className="col-md-4">
                    <div className="p-3 bg-success bg-opacity-10 rounded-3 text-center">
                      <p className="text-muted mb-1 small">Hadir Tepat</p>
                      <p className="fw-bold fs-3 text-success mb-0">{attendanceStats.present || 0}</p>
                      <small className="text-muted">hari</small>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-3 bg-warning bg-opacity-10 rounded-3 text-center">
                      <p className="text-muted mb-1 small">Terlambat</p>
                      <p className="fw-bold fs-3 text-warning mb-0">{attendanceStats.late || 0}</p>
                      <small className="text-muted">hari</small>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-3 bg-danger bg-opacity-10 rounded-3 text-center">
                      <p className="text-muted mb-1 small">Absen</p>
                      <p className="fw-bold fs-3 text-danger mb-0">{attendanceStats.absent || 0}</p>
                      <small className="text-muted">hari</small>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h5 className="mb-2">Persentase Kehadiran</h5>
                  <div className="progress" style={{ height: '20px' }}>
                    <div 
                      className="progress-bar bg-success" 
                      role="progressbar" 
                      style={{ width: `${attendanceStats.attendanceRate || 0}%` }}
                      aria-valuenow={attendanceStats.attendanceRate || 0}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      {attendanceStats.attendanceRate || 0}%
                    </div>
                  </div>
                  <small className="text-muted">7 hari terakhir</small>
                </div>

                <div className="mt-auto">
                  <Link to="/karyawan/riwayat" className="btn btn-outline-primary btn-lg w-100">
                    <i className="bi bi-clock-history me-2"></i>
                    Lihat Riwayat Lengkap
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Permission Modal */}
      {showPermissionModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  <i className="bi bi-envelope-paper me-2"></i>
                  Ajukan Izin
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => {
                    setShowPermissionModal(false);
                    setPermissionData({
                      date: new Date().toISOString().split('T')[0],
                      type: 'sick',
                      description: ''
                    });
                    setError(null);
                  }}
                  disabled={loading.general}
                  aria-label="Close"
                />
              </div>

              <div className="modal-body">
                {error && (
                  <div className="alert alert-danger">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label fw-bold">Tanggal Izin</label>
                  <input
                    type="date"
                    className="form-control form-control-lg"
                    autoFocus
                    value={permissionData.date}
                    onChange={(e) => setPermissionData({ ...permissionData, date: e.target.value })}
                    max={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Jenis Izin</label>
                  <select
                    className="form-select form-select-lg"
                    value={permissionData.type}
                    onChange={(e) => setPermissionData({ ...permissionData, type: e.target.value })}
                    required
                  >
                    <option value="sick">Sakit</option>
                    <option value="leave">Cuti/Izin</option>
                    <option value="other">Lainnya</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Keterangan</label>
                  <textarea
                    className="form-control form-control-lg"
                    rows={4}
                    placeholder="Masukkan alasan izin secara singkat dan jelas"
                    value={permissionData.description}
                    onChange={(e) => setPermissionData({ ...permissionData, description: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowPermissionModal(false);
                    setPermissionData({
                      date: new Date().toISOString().split('T')[0],
                      type: 'sick',
                      description: ''
                    });
                    setError(null);
                  }}
                  disabled={loading.general}
                >
                  Batal
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handlePermissionSubmit}
                  disabled={loading.general}
                >
                  {loading.general ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Mengirim...
                    </>
                  ) : 'Ajukan Izin'}
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