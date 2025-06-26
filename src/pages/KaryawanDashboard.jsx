import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const KaryawanDashboard = () => {
  //ini bagian state user
  const [user, setUser] = useState(() => {
    const rawUser = localStorage.getItem('user');
    return rawUser ? JSON.parse(rawUser) : null;
  });
  
  //ini bagian state absensi hari ini
  const [todayAttendance, setTodayAttendance] = useState(() => {
    const saved = localStorage.getItem('todayAttendance');
    return saved ? JSON.parse(saved) : null;
  });
  
  //ini bagian state loading
  const [loading, setLoading] = useState({
    clockIn: false,
    clockOut: false,
    general: false
  });
  
  //ini bagian state statistik absensi
  const [attendanceStats, setAttendanceStats] = useState({});
  //ini bagian state error
  const [error, setError] = useState(null);
  //ini bagian state modal izin
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  //ini bagian state data form izin
  const [permissionData, setPermissionData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'sick',
    description: ''
  });
  
  //ini bagian state status izin hari ini
  const [permissionStatus, setPermissionStatus] = useState(() => {
    const saved = localStorage.getItem('permissionStatus');
    return saved ? JSON.parse(saved) : null;
  });
  
  //ini bagian navigate
  const navigate = useNavigate();

  //ini bagian useEffect untuk inisialisasi user dan token
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

  //ini bagian format waktu
  const formatTime = (timeString) => {
    if (!timeString) return '-';
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };

  //ini bagian cek terlambat
  const isLate = (clockInTime) => {
    if (!clockInTime) return false;
    const [hours, minutes] = clockInTime.split(':').map(Number);
    return hours > 8 || (hours === 8 && minutes > 0);
  };

  //ini bagian fetch data absensi dan izin hari ini
  const fetchData = async () => {
    try {
      setLoading(prev => ({ ...prev, general: true }));
      setError(null);

      const todayRes = await axios.get('/today');
      setTodayAttendance(todayRes.data);

      const today = new Date().toISOString().split('T')[0];
      const permissionRes = await axios.get('/permissions', { params: { date: today } });
      //ini bagian set status izin hari ini
      if (permissionRes.data && Array.isArray(permissionRes.data) && permissionRes.data.length > 0) {
        setPermissionStatus(permissionRes.data[0]);
      } else if (permissionRes.data && Array.isArray(permissionRes.data.data) && permissionRes.data.data.length > 0) {
        setPermissionStatus(permissionRes.data.data[0]);
      } else {
        setPermissionStatus(null);
      }

      // Ambil data absensi dan izin untuk statistik mingguan
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

      // Buat array tanggal yang ada izin approved
      const izinDates = izinApproved.map(i => i.date);

      // Filter absensi yang tidak sedang izin
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

  //ini bagian handler clock in
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

  //ini bagian handler clock out
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

  //ini bagian handler submit izin
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
      setShowPermissionModal(false);
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengajukan izin');
    } finally {
      setLoading(prev => ({...prev, general: false}));
    }
  };

  //ini bagian handler logout
  const handleLogout = () => {
    axios.post('/logout').finally(() => {
      localStorage.clear();
      navigate('/login');
    });
  };

  //ini bagian simpan ke localStorage
  useEffect(() => {
    if (todayAttendance) {
      localStorage.setItem('todayAttendance', JSON.stringify(todayAttendance));
    }
    if (permissionStatus) {
      localStorage.setItem('permissionStatus', JSON.stringify(permissionStatus));
    }
  }, [todayAttendance, permissionStatus]);

  //ini bagian clear localStorage jika hari berganti
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

  //ini bagian fetch data saat user sudah ada
  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  //ini bagian komponen jam realtime
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

  //ini bagian status absensi hari ini
  const renderAttendanceStatus = () => {
    if (permissionStatus?.status === 'approved') {
      return (
        <div className="alert alert-success">
          <i className="bi bi-check-circle-fill me-2"></i>
          Izin Anda pada tanggal {new Date(permissionStatus.date).toLocaleDateString('id-ID')} telah disetujui
        </div>
      );
    }
    if (permissionStatus?.status === 'pending') {
      return (
        <div className="alert alert-info">
          <i className="bi bi-hourglass-split me-2"></i>
          Permohonan izin Anda pada tanggal {new Date(permissionStatus.date).toLocaleDateString('id-ID')} sedang diproses
        </div>
      );
    }
    if (todayAttendance?.status === 'permission') {
      return (
        <div className="alert alert-info">
          <i className="bi bi-info-circle me-2"></i>
          Anda telah mengajukan izin hari ini
        </div>
      );
    }
    if (todayAttendance?.clock_out) {
      return (
        <div className="alert alert-success">
          <i className="bi bi-check-circle me-2"></i>
          Absensi hari ini sudah selesai
        </div>
      );
    }
    if (todayAttendance?.clock_in) {
      return (
        <div className={`alert ${isLate(todayAttendance.clock_in) ? 'alert-warning' : 'alert-success'}`}>
          <i className={`bi ${isLate(todayAttendance.clock_in) ? 'bi-exclamation-triangle' : 'bi-check-circle'} me-2`}></i>
          {isLate(todayAttendance.clock_in) ? 'Anda terlambat hari ini' : 'Anda sudah clock in'}
        </div>
      );
    }
    return null;
  };

  //ini bagian tombol aksi absensi/izin
  const renderActionButtons = () => {
    if (permissionStatus?.status === 'approved') {
      return (
        <div className="alert alert-success">
          <i className="bi bi-check-circle-fill me-2"></i>
          Anda tidak perlu absen karena izin telah disetujui
        </div>
      );
    }
    if (permissionStatus?.status === 'pending') {
      return (
        <button className="btn btn-secondary w-100" disabled>
          <i className="bi bi-hourglass me-2"></i>
          Menunggu persetujuan izin
        </button>
      );
    }
    if (!todayAttendance?.clock_in) {
      return (
        <button 
          onClick={handleClockIn} 
          className="btn btn-success" 
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
              Clock In
            </>
          )}
        </button>
      );
    }
    if (!todayAttendance?.clock_out) {
      return (
        <button 
          onClick={handleClockOut} 
          className="btn btn-danger" 
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
              Clock Out
            </>
          )}
        </button>
      );
    }
    return null;
  };

  //ini bagian render utama dashboard
  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <Navbar user={user} onLogout={handleLogout} />
      
      <main className="container py-4 flex-grow-1">
        <h2 className="fw-bold mb-3">
          <i className="bi bi-house-door me-2"></i>
          Selamat datang, {user?.name}!
        </h2>

        {error && (
          <div className="alert alert-danger alert-dismissible fade show">
            {error}
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setError(null)}
              aria-label="Close"
            />
          </div>
        )}

        <div className="row">
          {/* Attendance Card */}
          <div className="col-md-6 mb-4">
            <div className="card shadow-sm h-100">
              <div className="card-body d-flex flex-column">
                <h4 className="card-title">
                  <i className="bi bi-calendar-check me-2"></i>
                  Absensi Hari Ini
                </h4>
                
                <RealTimeClock />
                
                {renderAttendanceStatus()}
                
                <div className="d-grid gap-2 mt-auto">
                  {renderActionButtons()}
                </div>

                <div className="attendance-times mt-3">
                  <div className="row text-center">
                    <div className="col-6">
                      <div className={`time-box ${todayAttendance?.clock_in ? 'active' : ''}`}>
                        <p className="text-muted mb-1">Clock In</p>
                        <p className={`fw-bold ${isLate(todayAttendance?.clock_in) ? 'text-warning' : ''}`}>
                          {formatTime(todayAttendance?.clock_in)}
                        </p>
                        {isLate(todayAttendance?.clock_in) && (
                          <small className="text-warning">Terlambat</small>
                        )}
                      </div>
                    </div>
                    <div className="col-6">
                      <div className={`time-box ${todayAttendance?.clock_out ? 'active' : ''}`}>
                        <p className="text-muted mb-1">Clock Out</p>
                        <p className="fw-bold">{formatTime(todayAttendance?.clock_out)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {!todayAttendance?.clock_in && !todayAttendance?.clock_out && !permissionStatus && (
                  <button 
                    onClick={() => setShowPermissionModal(true)}
                    className="btn btn-outline-primary mt-3"
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
          <div className="col-md-6 mb-4">
            <div className="card shadow-sm h-100">
              <div className="card-body d-flex flex-column">
                <h4 className="card-title">
                  <i className="bi bi-graph-up me-2"></i>
                  Statistik Mingguan
                </h4>
                
                <div className="row text-center mb-3">
                  <div className="col-4">
                    <div className="stat-box">
                      <p className="text-muted mb-1">Hadir Tepat</p>
                      <p className="fw-bold text-success">{attendanceStats.present || 0}</p>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="stat-box">
                      <p className="text-muted mb-1">Terlambat</p>
                      <p className="fw-bold text-warning">{attendanceStats.late || 0}</p>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="stat-box">
                      <p className="text-muted mb-1">Absen</p>
                      <p className="fw-bold text-danger">{attendanceStats.absent || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="progress mb-3">
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
                <small className="text-muted mb-3">Rata-rata kehadiran 7 hari terakhir</small>

                <div className="mt-auto">
                  <Link to="/karyawan/riwayat" className="btn btn-outline-primary w-100">
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
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-envelope-paper me-2"></i>
                  Ajukan Izin
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowPermissionModal(false)}
                  disabled={loading.general}
                  aria-label="Close"
                />
              </div>
              
              <div className="modal-body">
                {error && <div className="alert alert-danger">{error}</div>}
                
                <div className="mb-3">
                  <label className="form-label">Tanggal Izin</label>
                  <input
                    type="date"
                    className="form-control"
                    value={permissionData.date}
                    onChange={(e) => setPermissionData({...permissionData, date: e.target.value})}
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Jenis Izin</label>
                  <select
                    className="form-select"
                    value={permissionData.type}
                    onChange={(e) => setPermissionData({...permissionData, type: e.target.value})}
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
                    rows={3}
                    value={permissionData.description}
                    onChange={(e) => setPermissionData({...permissionData, description: e.target.value})}
                    placeholder="Alasan izin"
                  />
                </div>
              </div>
              
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowPermissionModal(false)}
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