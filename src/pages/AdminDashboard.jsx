import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [telatHariIni, setTelatHariIni] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      setUser(JSON.parse(saved));
    }

    const fetchTelatHariIni = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:8000/admin/absensi/statistik?range=daily', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const json = await res.json();
        console.log('DEBUG statistik:', json);

        if (!Array.isArray(json)) return;

        const today = new Date().toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        });

        const todayData = json.find((d) => d.tanggal === today);
        setTelatHariIni(todayData ? parseInt(todayData.telat || 0) : 0);
      } catch (err) {
        console.error('Gagal memuat data keterlambatan:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTelatHariIni();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleResetDay = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const confirmReset = window.confirm('Yakin ingin kembali ke hari sebenarnya? Ini akan menghapus absensi masa depan.');
      if (!confirmReset) return;

      await fetch('http://localhost:8000/admin/absensi/reset-day', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Berhasil kembali ke hari sekarang.');
    } catch (error) {
      console.error(error);
      alert('Gagal melakukan reset hari.');
    }
  };

  const handleSkipDay = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const confirmSkip = window.confirm('Apakah kamu yakin ingin skip ke hari berikutnya dengan absensi otomatis?');
      if (!confirmSkip) return;

      await fetch('http://localhost:8000/admin/absensi/skip-day', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Hari berhasil disimulasikan. Coba cek riwayat absensi!');
    } catch (error) {
      console.error(error);
      alert('Gagal skip hari.');
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <Navbar user={user} onLogout={handleLogout} />
      
      <main className="container py-4 flex-grow-1">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">
              <i className="bi bi-speedometer2 me-2 text-primary"></i>
              Admin Dashboard
            </h2>
            <p className="text-muted mb-0">
              Selamat datang, <span className="fw-semibold text-primary">{user?.name}</span>
            </p>
          </div>
          <div className="d-flex">
            <button 
              onClick={handleResetDay}
              className="btn btn-outline-secondary me-2"
              title="Reset ke hari sekarang"
            >
              <i className="bi bi-arrow-counterclockwise"></i>
            </button>
            <button 
              onClick={handleSkipDay}
              className="btn btn-outline-dark"
              title="Simulasi hari berikutnya"
            >
              <i className="bi bi-fast-forward"></i>
            </button>
          </div>
        </div>

        <div className="row g-4">
          {/* Kelola Users Card */}
          <div className="col-md-6 col-xl-4">
            <Link to="/admin/users" className="card border-0 shadow-sm h-100 text-decoration-none hover-scale">
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                    <i className="bi bi-people-fill text-primary fs-3"></i>
                  </div>
                  <h3 className="card-title mb-0 fw-bold">Kelola Users</h3>
                </div>
                <p className="card-text text-muted">Kelola akun karyawan: tambah, edit, dan hapus</p>
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <span className="badge bg-primary rounded-pill">Manage</span>
                  <i className="bi bi-arrow-right-short fs-4 text-primary"></i>
                </div>
              </div>
            </Link>
          </div>

          {/* Kelola Absensi Card */}
          <div className="col-md-6 col-xl-4">
            <Link to="/admin/absensi" className="card border-0 shadow-sm h-100 text-decoration-none hover-scale">
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-success bg-opacity-10 p-3 rounded-circle me-3">
                    <i className="bi bi-calendar-check-fill text-success fs-3"></i>
                  </div>
                  <h3 className="card-title mb-0 fw-bold">Kelola Absensi</h3>
                </div>
                <p className="card-text text-muted">Filter, lihat & export data absensi karyawan</p>
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <span className="badge bg-success rounded-pill">Analyze</span>
                  <i className="bi bi-arrow-right-short fs-4 text-success"></i>
                </div>
              </div>
            </Link>
          </div>

          {/* Statistik Absensi Card */}
          <div className="col-md-6 col-xl-4">
            <Link to="/admin/statistik" className="card border-0 shadow-sm h-100 text-decoration-none hover-scale">
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-info bg-opacity-10 p-3 rounded-circle me-3">
                    <i className="bi bi-bar-chart-fill text-info fs-3"></i>
                  </div>
                  <h3 className="card-title mb-0 fw-bold">Statistik Absensi</h3>
                </div>
                <p className="card-text text-muted">Laporan bulanan visual dengan grafik interaktif</p>
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <span className="badge bg-info rounded-pill">Visualize</span>
                  <i className="bi bi-arrow-right-short fs-4 text-info"></i>
                </div>
              </div>
            </Link>
          </div>

          {/* Riwayat Aktivitas Card */}
          <div className="col-md-6 col-xl-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-warning bg-opacity-10 p-3 rounded-circle me-3">
                    <i className="bi bi-clock-history text-warning fs-3"></i>
                  </div>
                  <h3 className="card-title mb-0 fw-bold">Riwayat Aktivitas</h3>
                </div>
                <p className="card-text text-muted">Lihat log aktivitas sistem terbaru</p>
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <span className="badge bg-warning text-dark rounded-pill">Recent</span>
                  <i className="bi bi-arrow-right-short fs-4 text-warning"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Peringatan Card */}
          <div className="col-md-6 col-xl-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-danger bg-opacity-10 p-3 rounded-circle me-3">
                    <i className="bi bi-exclamation-triangle-fill text-danger fs-3"></i>
                  </div>
                  <h3 className="card-title mb-0 fw-bold">Peringatan</h3>
                </div>
                {loading ? (
                  <div className="d-flex align-items-center">
                    <div className="spinner-border spinner-border-sm text-danger me-2" role="status"></div>
                    <small className="text-muted">Memuat data...</small>
                  </div>
                ) : (
                  <>
                    <p className="card-text text-muted">
                      {telatHariIni === 0 ? (
                        <span className="text-success">Tidak ada keterlambatan hari ini</span>
                      ) : (
                        <span className="text-danger">
                          <i className="bi bi-exclamation-circle-fill me-1"></i>
                          {telatHariIni} karyawan terlambat hari ini
                        </span>
                      )}
                    </p>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <span className="badge bg-danger rounded-pill">Alert</span>
                      <i className="bi bi-arrow-right-short fs-4 text-danger"></i>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Simulasi Card */}
          <div className="col-md-6 col-xl-4">
            <div 
              className="card border-0 shadow-sm h-100 hover-scale" 
              onClick={handleSkipDay}
              style={{ cursor: 'pointer' }}
            >
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-dark bg-opacity-10 p-3 rounded-circle me-3">
                    <i className="bi bi-fast-forward-circle-fill text-dark fs-3"></i>
                  </div>
                  <h3 className="card-title mb-0 fw-bold">Simulasi Hari</h3>
                </div>
                <p className="card-text text-muted">Testing: tambah data absensi otomatis untuk hari berikutnya</p>
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <span className="badge bg-dark text-white rounded-pill">Simulasi</span>
                  <i className="bi bi-arrow-right-short fs-4 text-dark"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}