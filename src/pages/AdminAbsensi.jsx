import { useEffect, useState } from 'react';
import axios from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function AdminAbsensi() {
  //ini bagian state
  const [data, setData] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [activeTab, setActiveTab] = useState('attendance');
  const [filterUser, setFilterUser] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  //ini bagian ambil user dari localStorage
  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  //ini bagian logout
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  //ini bagian fetch data absensi dan izin untuk admin
  const fetchData = async () => {
    setLoading(true);
    try {
      const [absensiRes, izinRes] = await Promise.all([
        axios.get(`/admin/absensi`),
        axios.get(`/admin/permissions`) // <-- panggil data izin admin di sini
      ]);
      setData(absensiRes.data.data);
      setPermissions(Array.isArray(izinRes.data.data) ? izinRes.data.data : []);
    } catch (err) {
      console.error(err);
      alert('Gagal memuat data absensi atau izin.');
    } finally {
      setLoading(false);
    }
  };

  //ini bagian update status izin
  const handlePermissionStatus = async (uuid, status) => {
    if (!window.confirm(`Yakin ingin ${status === 'approved' ? 'menyetujui' : 'menolak'} izin ini?`)) return;
    try {
      await axios.put(`/admin/permissions/${uuid}/status`, { status });
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Gagal memperbarui status izin.');
    }
  };

  //ini bagian reset absensi
  const handleReset = async (uuid) => {
    if (!window.confirm('Yakin ingin reset absensi ini?')) return;
    try {
      await axios.put(`/admin/absensi/${uuid}/reset`);
      fetchData();
    } catch (err) {
      alert('Gagal reset absensi.');
    }
  };

  //ini bagian reset izin
  const handleResetPermission = async (uuid) => {
    if (!window.confirm('Yakin ingin reset pengajuan izin ini?')) return;
    try {
      await axios.put(`/admin/permissions/${uuid}/reset`);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Gagal reset data izin.');
    }
  };

  //ini bagian fetch data saat filterUser berubah
  useEffect(() => {
    fetchData();
  }, [filterUser]);

  //ini bagian render utama
  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="container-fluid py-4 flex-grow-1">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white border-bottom-0">
            <h2 className="card-title mb-0 fw-bold">
              <i className="bi bi-calendar-check me-2 text-primary"></i>
              Data Absensi & Izin Semua Karyawan
            </h2>
          </div>

          <div className="card-body">
            {/* ini bagian tab */}
            <div className="mb-3">
              <ul className="nav nav-tabs">
                <li className="nav-item">
                  <button className={`nav-link ${activeTab === 'attendance' ? 'active' : ''}`} onClick={() => setActiveTab('attendance')}>Absensi</button>
                </li>
                <li className="nav-item">
                  <button className={`nav-link ${activeTab === 'permission' ? 'active' : ''}`} onClick={() => setActiveTab('permission')}>Izin</button>
                </li>
              </ul>
            </div>

            {/* ini bagian filter user */}
            {activeTab === 'attendance' && (
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-funnel"></i></span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Filter berdasarkan Nama Karyawan"
                      value={filterUser}
                      onChange={(e) => setFilterUser(e.target.value)}
                    />
                    <button className="btn btn-outline-secondary" type="button" onClick={() => setFilterUser('')}>
                      <i className="bi bi-x-lg"></i>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ini bagian loading */}
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status" />
                <p className="mt-2">Memuat data...</p>
              </div>
            ) : activeTab === 'attendance' ? (
              //ini bagian tabel absensi
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
      !filterUser || absen.user?.name?.toLowerCase().includes(filterUser.toLowerCase())
    )
    .map((absen) => {
      //ini bagian cari izin yang di-approve pada tanggal dan user yang sama
      const izinApproved = permissions.find(
        (p) =>
          String(p.user_id) === String(absen.user_id) &&
          p.date === absen.date &&
          p.status === 'approved'
      );
      const isPermission = !!izinApproved;
      const permissionType = izinApproved?.type;

      //ini bagian mapping jenis izin ke label
      let izinLabel = 'Izin';
      if (permissionType === 'sick') izinLabel = 'Sakit';
      else if (permissionType === 'leave') izinLabel = 'Cuti/Izin';
      else if (permissionType === 'other') izinLabel = 'Lainnya';

      return (
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
          <td>{new Date(absen.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
          <td className="text-center">
            {isPermission ? (
              <span className="badge bg-info">{izinLabel}</span>
            ) : absen.clock_in && absen.clock_in !== '00:00:00' ? (
              <span className="badge bg-success">Hadir</span>
            ) : (
              <span className="badge bg-secondary">-</span>
            )}
          </td>
          <td className="text-center">
            {isPermission ? (
              <span className="badge bg-secondary">-</span>
            ) : absen.clock_in && absen.clock_in !== '00:00:00' ? (
              <span className={`badge ${isLate(absen.clock_in) ? 'bg-danger' : 'bg-success'}`}>
                {formatTime(absen.clock_in)} {isLate(absen.clock_in) && ' (Telat)'}
              </span>
            ) : (
              <span className="badge bg-secondary">-</span>
            )}
          </td>
          <td className="text-center">
            {isPermission ? (
              <span className="badge bg-secondary">-</span>
            ) : absen.clock_out && absen.clock_out !== '00:00:00' ? (
              <span className="badge bg-danger">{formatTime(absen.clock_out)}</span>
            ) : (
              <span className="badge bg-secondary">-</span>
            )}
          </td>
          <td className="text-center">
            {isPermission ? (
              <span className="badge bg-secondary">-</span>
            ) : absen.clock_in && absen.clock_out && absen.clock_in !== '00:00:00' && absen.clock_out !== '00:00:00' ? (
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
      );
    })}
</tbody>

                </table>
              </div>
            ) : (
              //ini bagian tabel izin
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Nama Karyawan</th>
                      <th>Tanggal</th>
                      <th>Jenis Izin</th>
                      <th>Keterangan</th>
                      <th>Status</th>
                      <th className="text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {permissions.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center text-muted py-4">Tidak ada data izin.</td>
                      </tr>
                    ) : (
                      permissions.map((p) => (
                        <tr key={p.id}>
                          <td>{p.user?.name ?? '-'}</td>
                          <td>{new Date(p.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                          <td>
                            {p.type === 'sick' ? 'Sakit' : p.type === 'leave' ? 'Cuti/Izin' : 'Lainnya'}
                          </td>
                          <td>{p.description ?? '-'}</td>
                          <td>
                            <span className={`badge ${
                              p.status === 'approved' ? 'bg-success' :
                              p.status === 'rejected' ? 'bg-danger' :
                              'bg-warning text-dark'
                            }`}>
                              {p.status === 'approved' ? 'Disetujui' : p.status === 'rejected' ? 'Ditolak' : 'Menunggu'}
                            </span>
                          </td>
                          <td className="text-center">
                            <>
                              {p.status === 'pending' && (
                                <>
                                  <button className="btn btn-sm btn-success me-2" onClick={() => handlePermissionStatus(p.id, 'approved')}>
                                    <i className="bi bi-check-circle me-1"></i>Approve
                                  </button>
                                  <button className="btn btn-sm btn-danger me-2" onClick={() => handlePermissionStatus(p.id, 'rejected')}>
                                    <i className="bi bi-x-circle me-1"></i>Reject
                                  </button>
                                </>
                              )}
                              <button className="btn btn-sm btn-outline-danger" onClick={() => handleResetPermission(p.id)}>
                                <i className="bi bi-arrow-clockwise me-1"></i>Reset
                              </button>
                            </>
                          </td>
                        </tr>
                      ))
                    )}
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

//ini bagian format jam
function formatTime(timeString) {
  const date = new Date(`1970-01-01T${timeString}`);
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

//ini bagian hitung durasi
function calculateDuration(clockIn, clockOut) {
  const [inH, inM] = clockIn.split(':').map(Number);
  const [outH, outM] = clockOut.split(':').map(Number);
  const total = (outH * 60 + outM) - (inH * 60 + inM);
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${h} jam ${m} menit`;
}

//ini bagian cek terlambat
function isLate(clockIn) {
  const limit = new Date('1970-01-01T09:00:00');
  const clock = new Date(`1970-01-01T${clockIn}`);
  return clock > limit;
}
