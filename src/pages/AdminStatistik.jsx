import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from 'react-router-dom';

export default function AdminStatistik() {
  // ===== STATE MANAGEMENT =====
  const [data, setData] = useState([]); // Data statistik absensi (bulanan/tahunan)
  const [permissions, setPermissions] = useState([]); // Data izin karyawan
  const [loading, setLoading] = useState(true); // Status loading saat fetch data
  const [timeRange, setTimeRange] = useState('monthly'); // Rentang waktu statistik (bulanan/tahunan)
  const [user, setUser] = useState(null); // Data user admin yang login
  const navigate = useNavigate();

  // Ambil data user admin dari localStorage saat komponen mount
  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  // Logout admin, hapus data dari localStorage, redirect ke login
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // ===== FETCH STATISTIK =====
  // Mengambil data statistik absensi dan izin dari server
  const fetchStatistik = async () => {
    setLoading(true);
    try {
      const [statRes, izinRes] = await Promise.all([
        axios.get(`/admin/absensi/statistik?range=${timeRange}`), // Statistik absensi
        axios.get(`/admin/permissions`) // Data izin
      ]);
      setData(statRes.data);
      setPermissions(Array.isArray(izinRes.data.data) ? izinRes.data.data : []);
    } catch (err) {
      console.error(err);
      alert('Gagal memuat data statistik atau izin.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistik setiap kali timeRange berubah (bulanan/tahunan)
  useEffect(() => {
    fetchStatistik();
  }, [timeRange]);

  // Mendapatkan jumlah izin pada bulan/tahun tertentu
  const getIzinCount = (item) => {
    if (timeRange === 'monthly') {
      return permissions.filter(p => {
        const izinDate = new Date(p.date);
        const izinMonth = izinDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' });
        return izinMonth === item.bulan;
      }).length;
    } else {
      return permissions.filter(p => {
        const izinYear = new Date(p.date).getFullYear();
        return String(izinYear) === String(item.tahun);
      }).length;
    }
  };

  // ===== RENDER =====
  return (
    <div className="min-vh-100 d-flex flex-column" style={{ 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      backdropFilter: 'blur(10px)'
    }}>
      {/* Navbar admin */}
      <Navbar user={user} onLogout={handleLogout} />
      
      <main className="container-fluid py-4 flex-grow-1">
        {/* Card utama statistik */}
        <div className="card border-0" style={{
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
          overflow: 'hidden'
        }}>
          {/* Header dengan tab bulanan/tahunan */}
          <div className="card-header border-bottom-0 d-flex justify-content-between align-items-center" style={{
            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '1.5rem'
          }}>
            <div>
              <h2 className="card-title mb-0 fw-bold" style={{ fontSize: '1.5rem' }}>
                <i className="bi bi-bar-chart-line me-2"></i>
                Statistik Absensi
              </h2>
              <p className="mb-0 opacity-75">Analisis data kehadiran karyawan & izin</p>
            </div>
            
            {/* Tab navigasi bulanan/tahunan */}
            <div className="btn-group" role="group" style={{ 
              borderRadius: '50px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <button
                type="button"
                className={`btn ${timeRange === 'monthly' ? 'btn-light' : 'btn-transparent text-white'}`}
                style={{
                  border: 'none',
                  padding: '0.5rem 1.25rem',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => setTimeRange('monthly')}
              >
                Bulanan
              </button>
              <button
                type="button"
                className={`btn ${timeRange === 'yearly' ? 'btn-light' : 'btn-transparent text-white'}`}
                style={{
                  border: 'none',
                  padding: '0.5rem 1.25rem',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => setTimeRange('yearly')}
              >
                Tahunan
              </button>
            </div>
          </div>

          <div className="card-body" style={{ padding: '2rem' }}>
            {/* Loading spinner saat data dimuat */}
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-grow text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 fw-medium">Memuat data statistik...</p>
              </div>
            ) : data.length > 0 ? (
              <div className="row g-4">
                {/* Grafik batang absensi */}
                <div className="col-lg-8">
                  <div className="chart-container" style={{ 
                    height: '400px',
                    background: 'rgba(255,255,255,0.5)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                  }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={timeRange === 'monthly' ? [...data].reverse() : data}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                        <XAxis 
                          dataKey={timeRange === 'monthly' ? "bulan" : "tahun"} 
                          tick={{ fill: '#4a5568' }}
                        />
                        <YAxis tick={{ fill: '#4a5568' }} />
                        <Tooltip
                          contentStyle={{
                            background: 'rgba(255,255,255,0.95)',
                            border: 'none',
                            borderRadius: '12px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                            padding: '1rem'
                          }}
                          formatter={(value, name) => {
                            if (name === 'Izin') return [`${value} izin`, 'Izin'];
                            return [value, name];
                          }}
                        />
                        <Legend 
                          wrapperStyle={{ paddingTop: '20px' }} 
                          iconSize={12}
                          iconType="circle"
                        />
                        {/* Bar total hadir */}
                        <Bar 
                          dataKey="total" 
                          name="Total Hadir" 
                          fill="#4f46e5" 
                          radius={[8, 8, 0, 0]} 
                          animationDuration={1500} 
                        />
                        {/* Bar terlambat */}
                        <Bar 
                          dataKey="telat" 
                          name="Terlambat" 
                          fill="#ef4444" 
                          radius={[8, 8, 0, 0]} 
                          animationDuration={1500} 
                        />
                        {/* Bar hadir tepat waktu */}
                        <Bar
                          dataKey={(item) => item.total - item.telat}
                          name="Tepat Waktu"
                          fill="#3b82f6"
                          radius={[8, 8, 0, 0]}
                          animationDuration={1500}
                        />
                        {/* Bar izin */}
                        <Bar
                          dataKey={(item) => getIzinCount(item)}
                          name="Izin"
                          fill="#10b981"
                          radius={[8, 8, 0, 0]}
                          animationDuration={1500}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                {/* Detail statistik per bulan/tahun */}
                <div className="col-lg-4">
                  <div className="h-100" style={{
                    background: 'rgba(255,255,255,0.5)',
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    overflow: 'hidden'
                  }}>
                    <div className="p-3" style={{
                      background: 'linear-gradient(90deg, rgba(79, 70, 229, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)',
                      borderBottom: '1px solid rgba(0,0,0,0.05)'
                    }}>
                      <h3 className="mb-0 fw-bold" style={{ fontSize: '1.25rem' }}>
                        <i className="bi bi-info-circle me-2 text-primary"></i>
                        Detail Statistik
                      </h3>
                    </div>
                    <div className="overflow-auto" style={{ maxHeight: '350px', padding: '1rem' }}>
                      <ul className="list-group list-group-flush">
                        {data.map((item, idx) => (
                          <li key={idx} className="list-group-item border-0 py-3 px-0" 
                            style={{ 
                              transition: 'all 0.2s ease',
                              borderBottom: '1px solid rgba(0,0,0,0.05) !important'
                            }}>
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <h6 className="mb-1 fw-semibold" style={{ color: '#1e293b' }}>
                                  {timeRange === 'monthly' ? item.bulan : item.tahun}
                                </h6>
                                <div className="d-flex flex-wrap gap-2 mt-2">
                                  <span className="badge rounded-pill bg-primary bg-opacity-10 text-primary">
                                    {item.total} Total
                                  </span>
                                  <span className="badge rounded-pill bg-success bg-opacity-10 text-success">
                                    {getIzinCount(item)} Izin
                                  </span>
                                  <span className="badge rounded-pill bg-blue-100 text-blue-800">
                                    {item.total - item.telat} Tepat Waktu
                                  </span>
                                </div>
                              </div>
                              <div className="text-end">
                                <span className="badge rounded-pill bg-danger bg-opacity-10 text-danger">
                                  {item.telat} Terlambat
                                </span>
                                <div className="mt-2">
                                  <small className="text-muted fw-medium">
                                    {item.total > 0 ? Math.round((item.telat / item.total) * 100) : 0}% terlambat
                                  </small>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Jika tidak ada data statistik
              <div className="text-center py-5" style={{
                background: 'rgba(255,255,255,0.5)',
                borderRadius: '16px',
                padding: '3rem'
              }}>
                <i className="bi bi-exclamation-circle fs-1 text-muted opacity-50"></i>
                <p className="mt-3 fw-medium text-muted">Tidak ada data statistik yang tersedia</p>
                <button 
                  className="btn btn-primary mt-2 rounded-pill px-4"
                  onClick={fetchStatistik}
                >
                  <i className="bi bi-arrow-clockwise me-1"></i>
                  Coba Lagi
                </button>
              </div>
            )}
          </div>

          {/* Footer card: info update & tombol refresh */}
          <div className="card-footer border-top-0 d-flex justify-content-between align-items-center" style={{
            background: 'rgba(255,255,255,0.5)',
            padding: '1.5rem'
          }}>
            <small className="text-muted fw-medium">
              Data diperbarui: {new Date().toLocaleDateString('id-ID', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </small>
            {/* Tombol refresh data */}
            <button 
              className="btn btn-sm rounded-pill px-3"
              style={{
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.opacity = 0.8}
              onMouseOut={(e) => e.target.style.opacity = 1}
              onClick={fetchStatistik}
            >
              <i className="bi bi-arrow-clockwise me-1"></i>
              Refresh Data
            </button>
          </div>
        </div>
      </main>

      {/* Footer aplikasi */}
      <Footer />
    </div>
  );
}