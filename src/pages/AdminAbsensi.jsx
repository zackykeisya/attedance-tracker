import { useEffect, useState } from 'react';
import axios from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function AdminAbsensi() {
  const [data, setData] = useState([]);
  const [filterUser, setFilterUser] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // Ambil semua data tanpa filter user_name
      const res = await axios.get(`/admin/absensi`);
      setData(res.data.data);
    } catch (err) {
      console.error(err);
      alert('Gagal memuat data absensi.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (absenId) => {
    if (confirm('Yakin ingin reset clock in dan clock out?')) {
      try {
        await axios.put(`/admin/absensi/${absenId}/reset`);
        fetchData();
      } catch (err) {
        console.error(err);
        alert('Gagal mereset absensi.');
      }
    }
  };



  useEffect(() => {
    fetchData();
  }, [filterUser]);

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="container-fluid py-4 flex-grow-1">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white border-bottom-0">
            <h2 className="card-title mb-0 fw-bold">
              <i className="bi bi-calendar-check me-2 text-primary"></i>
              Data Absensi Semua Karyawan
            </h2>
          </div>

          <div className="card-body">
            <div className="row mb-4">
              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-funnel"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Filter berdasarkan Nama Karyawan"
                    value={filterUser}
                    onChange={(e) => setFilterUser(e.target.value)}
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setFilterUser('')}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Memuat data...</span>
                </div>
                <p className="mt-2">Memuat data absensi...</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Nama Karyawan</th>
                      <th>Tanggal</th>
                      <th className="text-center">Status</th>
                      <th className="text-center">Clock In</th>
                      <th className="text-center">Clock Out</th>
                      <th className="text-center">Durasi</th>
                      <th className="text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data
                      .filter(absen =>
                        !filterUser ||
                        absen.user?.name?.toLowerCase().includes(filterUser.toLowerCase())
                      )
                      .map((absen) => (
                        <tr key={absen.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="bg-primary bg-opacity-10 p-2 rounded me-2">
                                <i className="bi bi-person text-primary"></i>
                              </div>
                              <div>
                                <p className="mb-0 fw-semibold">{absen.user?.name}</p>
                                <small className="text-muted">Gmail: {absen.user?.email}</small>
                              </div>
                            </div>
                          </td>
                          <td>{new Date(absen.date).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}</td>
                          <td className="text-center">
                            {absen.is_permission ? (
                              <span className="badge bg-info">Izin {absen.permission_type}</span>
                            ) : absen.clock_in ? (
                              <span className="badge bg-success">Hadir</span>
                            ) : (
                              <span className="badge bg-secondary">-</span>
                            )}
                          </td>
                          <td className="text-center">
                            {absen.clock_in ? (
                              <span className={`badge ${isLate(absen.clock_in) ? 'bg-danger' : 'bg-success'}`}>
                                {formatTime(absen.clock_in)} {isLate(absen.clock_in) && ' (Telat)'}
                              </span>
                            ) : (
                              <span className="badge bg-secondary">-</span>
                            )}
                          </td>
                          <td className="text-center">
                            {absen.clock_out ? (
                              <span className="badge bg-danger">
                                {formatTime(absen.clock_out)}
                              </span>
                            ) : (
                              <span className="badge bg-secondary">-</span>
                            )}
                          </td>
                          <td className="text-center">
                            {absen.clock_in && absen.clock_out ? (
                              <span className="badge bg-info">
                                {calculateDuration(absen.clock_in, absen.clock_out)}
                              </span>
                            ) : (
                              <span className="badge bg-warning">Belum selesai</span>
                            )}
                          </td>
                          <td className="text-center">
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleReset(absen.id)}
                            >
                              <i className="bi bi-arrow-clockwise me-1"></i>Reset
                            </button>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Format clock-in/out time
function formatTime(timeString) {
  const date = new Date(`1970-01-01T${timeString}`);
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Calculate duration between clock-in and clock-out
function calculateDuration(clockIn, clockOut) {
  const [inH, inM] = clockIn.split(':').map(Number);
  const [outH, outM] = clockOut.split(':').map(Number);
  const total = (outH * 60 + outM) - (inH * 60 + inM);
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${h} jam ${m} menit`;
}

// Check if the clock-in time is late
function isLate(clockIn) {
  const limit = new Date('1970-01-01T09:00:00');
  const clock = new Date(`1970-01-01T${clockIn}`);
  return clock > limit;
}

