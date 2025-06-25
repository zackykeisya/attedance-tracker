import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from 'react-router-dom';

export default function AdminStatistik() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('monthly');
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

  const fetchStatistik = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/admin/absensi/statistik?range=${timeRange}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
      alert('Gagal memuat data statistik.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistik();
  }, [timeRange]);

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <Navbar user={user} onLogout={handleLogout} />
      
      <main className="container-fluid py-4 flex-grow-1">
        <div className="card shadow-lg border-0">
          <div className="card-header bg-white border-bottom-0 d-flex justify-content-between align-items-center">
            <div>
              <h2 className="card-title mb-0 fw-bold">
                <i className="bi bi-bar-chart-line me-2 text-primary"></i>
                Statistik Absensi
              </h2>
              <p className="text-muted mb-0">Analisis data kehadiran karyawan</p>
            </div>
            
            <div className="btn-group" role="group">
              <button
                type="button"
                className={`btn btn-sm ${timeRange === 'monthly' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setTimeRange('monthly')}
              >
                Bulanan
              </button>
              <button
                type="button"
                className={`btn btn-sm ${timeRange === 'yearly' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setTimeRange('yearly')}
              >
                Tahunan
              </button>
            </div>
          </div>

          <div className="card-body">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Memuat data statistik...</p>
              </div>
            ) : data.length > 0 ? (
              <div className="row">
                <div className="col-lg-8">
                  <div className="chart-container" style={{ height: '400px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={timeRange === 'monthly' ? [...data].reverse() : data}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                          dataKey={timeRange === 'monthly' ? "bulan" : "tahun"} 
                          tick={{ fill: '#6c757d' }}
                        />
                        <YAxis tick={{ fill: '#6c757d' }} />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid rgba(0,0,0,0.1)',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                          }}
                        />
                        <Legend 
                          wrapperStyle={{
                            paddingTop: '20px'
                          }}
                        />
                        <Bar 
                          dataKey="total" 
                          name="Total Hadir" 
                          fill="#4e54c8" 
                          radius={[4, 4, 0, 0]}
                          animationDuration={1500}
                        />
                        <Bar 
                          dataKey="telat" 
                          name="Karyawan Terlambat" 
                          fill="#ff6b6b" 
                          radius={[4, 4, 0, 0]}
                          animationDuration={1500}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="col-lg-4">
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-header bg-white border-bottom-0">
                      <h3 className="card-title mb-0 fw-bold">
                        <i className="bi bi-info-circle me-2 text-primary"></i>
                        Detail Statistik
                      </h3>
                    </div>
                    <div className="card-body overflow-auto" style={{ maxHeight: '350px' }}>
                      <ul className="list-group list-group-flush">
                        {data.map((item, idx) => (
                          <li key={idx} className="list-group-item border-0 py-2 px-0">
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <h6 className="mb-0 fw-semibold">
                                  {timeRange === 'monthly' ? item.bulan : item.tahun}
                                </h6>
                                <small className="text-muted">
                                  Total: {item.total} karyawan
                                </small>
                              </div>
                              <div className="text-end">
                                <span className="badge bg-danger bg-opacity-10 text-danger">
                                  {item.telat} terlambat
                                </span>
                                <div className="mt-1">
                                  <small className="text-muted">
                                    {Math.round((item.telat / item.total) * 100)}% terlambat
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
              <div className="text-center py-5">
                <i className="bi bi-exclamation-circle fs-1 text-muted"></i>
                <p className="mt-3">Tidak ada data statistik yang tersedia</p>
              </div>
            )}
          </div>

          <div className="card-footer bg-white border-top-0 d-flex justify-content-between align-items-center">
            <small className="text-muted">
              Data diperbarui: {new Date().toLocaleDateString('id-ID', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </small>
            <button 
              className="btn btn-sm btn-outline-primary"
              onClick={fetchStatistik}
            >
              <i className="bi bi-arrow-clockwise me-1"></i>
              Refresh Data
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}