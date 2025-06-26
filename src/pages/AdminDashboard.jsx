import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function AdminDashboard() {
  //ini bagian navigate
  const navigate = useNavigate();
  //ini bagian state user
  const [user, setUser] = useState(null);

  //ini bagian ambil user dari localStorage
  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  //ini bagian logout
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  //ini bagian handle reset hari ke hari sekarang
  const handleResetDay = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const confirmReset = window.confirm('Yakin ingin kembali ke hari sebenarnya? Ini akan menghapus absensi masa depan.');
      if (!confirmReset) return;

      await fetch('http://localhost:8000/admin/absensi/reset-day', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Berhasil kembali ke hari sekarang.');
    } catch (error) {
      console.error(error);
      alert('Gagal melakukan reset hari.');
    }
  };

  //ini bagian handle skip hari ke hari berikutnya
  const handleSkipDay = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const confirmSkip = window.confirm('Apakah kamu yakin ingin skip ke hari berikutnya dengan absensi otomatis?');
      if (!confirmSkip) return;

      await fetch('http://localhost:8000/admin/absensi/skip-day', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Hari berhasil disimulasikan. Coba cek riwayat absensi!');
    } catch (error) {
      console.error(error);
      alert('Gagal skip hari.');
    }
  };

  //ini bagian render utama dashboard admin
  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <Navbar user={user} onLogout={handleLogout} />
      <main className="container-fluid py-4 flex-grow-1">
        <div className="row mb-4">
          <div className="col-12">
            <h2 className="fw-bold">
              <i className="bi bi-house-door me-2"></i>
              Selamat datang, <span className="text-primary">{user?.name}</span> 
            </h2>
            <p className="text-muted">Apa yang ingin Anda lakukan hari ini?</p>
          </div>
        </div>

        <div className="row g-4">
          {/* ini bagian card kelola users */}
          <div className="col-md-6 col-lg-4">
            <Link to="/admin/users" className="card card-hover h-100 text-decoration-none">
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-primary bg-opacity-10 p-3 rounded me-3">
                    <i className="bi bi-people-fill text-primary fs-4"></i>
                  </div>
                  <h3 className="card-title mb-0 fw-bold">Kelola Users</h3>
                </div>
                <p className="card-text text-muted">Lihat, tambah, edit dan hapus akun karyawan</p>
                <div className="text-end">
                  <span className="badge bg-primary">Manage</span>
                </div>
              </div>
            </Link>
          </div>

          {/* ini bagian card kelola absensi */}
          <div className="col-md-6 col-lg-4">
            <Link to="/admin/absensi" className="card card-hover h-100 text-decoration-none">
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-success bg-opacity-10 p-3 rounded me-3">
                    <i className="bi bi-calendar-check-fill text-success fs-4"></i>
                  </div>
                  <h3 className="card-title mb-0 fw-bold">Kelola Absensi</h3>
                </div>
                <p className="card-text text-muted">Filter, lihat & export data absensi karyawan</p>
                <div className="text-end">
                  <span className="badge bg-success">Analyze</span>
                </div>
              </div>
            </Link>
          </div>

          {/* ini bagian card statistik absensi */}
          <div className="col-md-6 col-lg-4">
            <Link to="/admin/statistik" className="card card-hover h-100 text-decoration-none">
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-info bg-opacity-10 p-3 rounded me-3">
                    <i className="bi bi-bar-chart-fill text-info fs-4"></i>
                  </div>
                  <h3 className="card-title mb-0 fw-bold">Statistik Absensi</h3>
                </div>
                <p className="card-text text-muted">Laporan bulanan visual dengan grafik interaktif</p>
                <div className="text-end">
                  <span className="badge bg-info">Visualize</span>
                </div>
              </div>
            </Link>
          </div>

          {/* ini bagian card riwayat aktivitas */}
          <div className="col-md-6 col-lg-4">
            <div className="card h-100">
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-warning bg-opacity-10 p-3 rounded me-3">
                    <i className="bi bi-clock-history text-warning fs-4"></i>
                  </div>
                  <h3 className="card-title mb-0 fw-bold">Riwayat Aktivitas</h3>
                </div>
                <p className="card-text text-muted">Lihat log aktivitas sistem terbaru</p>
                <div className="text-end">
                  <span className="badge bg-warning text-dark">Recent</span>
                </div>
              </div>
            </div>
          </div>

          {/* ini bagian card peringatan */}
          <div className="col-md-6 col-lg-4">
            <div className="card h-100">
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-danger bg-opacity-10 p-3 rounded me-3">
                    <i className="bi bi-exclamation-triangle-fill text-danger fs-4"></i>
                  </div>
                  <h3 className="card-title mb-0 fw-bold">Peringatan</h3>
                </div>
                <p className="card-text text-muted">3 karyawan terlambat hari ini</p>
                <div className="text-end">
                  <span className="badge bg-danger">Alert</span>
                </div>
              </div>
            </div>
          </div>

          {/* ini bagian card reset hari */}
          <div className="col-md-6 col-lg-4">
            <div
              className="card h-100 card-hover text-decoration-none"
              onClick={handleResetDay}
              style={{ cursor: 'pointer' }}
            >
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-secondary bg-opacity-10 p-3 rounded me-3">
                    <i className="bi bi-arrow-counterclockwise text-secondary fs-4"></i>
                  </div>
                  <h3 className="card-title mb-0 fw-bold">Reset Hari</h3>
                </div>
                <p className="card-text text-muted">Kembali ke hari sekarang dan hapus data masa depan</p>
                <div className="text-end">
                  <span className="badge bg-secondary text-white">Reset</span>
                </div>
              </div>
            </div>
          </div>

          {/* ini bagian card skip hari */}
          <div className="col-md-6 col-lg-4">
            <div
              className="card h-100 card-hover text-decoration-none"
              onClick={handleSkipDay}
              style={{ cursor: 'pointer' }}
            >
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-dark bg-opacity-10 p-3 rounded me-3">
                    <i className="bi bi-fast-forward-circle-fill text-dark fs-4"></i>
                  </div>
                  <h3 className="card-title mb-0 fw-bold">Skip Hari</h3>
                </div>
                <p className="card-text text-muted">Testing: tambah data absensi otomatis untuk hari berikutnya</p>
                <div className="text-end">
                  <span className="badge bg-dark text-white">Simulasi</span>
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

