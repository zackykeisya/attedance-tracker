import { useEffect, useState } from 'react';
import axios from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function AdminAbsensi() {
  const [data, setData] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [activeTab, setActiveTab] = useState('attendance');
  const [filterUser, setFilterUser] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [absensiRes, izinRes] = await Promise.all([
        axios.get(`/admin/absensi`),
        axios.get(`/admin/permissions?status=all`)
      ]);
      setData(absensiRes.data.data);
      setPermissions(Array.isArray(izinRes.data.data) ? izinRes.data.data : []);
    } catch (err) {
      console.error(err);
      alert('Failed to load attendance or permission data.');
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionStatus = async (uuid, status) => {
    if (!window.confirm(`Are you sure you want to ${status === 'approved' ? 'approve' : 'reject'} this permission?`)) return;
    try {
      await axios.put(`/admin/permissions/${uuid}/status`, { status });
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to update permission status.');
    }
  };

  const handleReset = async (uuid) => {
    if (!window.confirm('Are you sure you want to reset this attendance?')) return;
    try {
      await axios.put(`/admin/absensi/${uuid}/reset`);
      fetchData();
    } catch (err) {
      alert('Failed to reset attendance.');
    }
  };

  const handleResetPermission = async (uuid) => {
    if (!window.confirm('Are you sure you want to reset this permission request?')) return;
    try {
      await axios.put(`/admin/permissions/${uuid}/reset`);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to reset permission data.');
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterUser]);

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="container-fluid py-4 flex-grow-1">
        {/* Glass Card Container */}
        <div className="card border-0 shadow-lg" style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderRadius: '12px',
          overflow: 'hidden'
        }}>
          {/* Card Header with Gradient */}
          <div className="card-header border-bottom-0 py-3" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}>
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="card-title mb-0 text-white fw-bold">
                <i className="bi bi-calendar-check me-2"></i>
                Employee Attendance Dashboard
              </h2>
              <div className="d-flex align-items-center">
                <span className="badge bg-white text-dark me-2">
                  <i className="bi bi-people-fill me-1"></i>
                  {data.length} Records
                </span>
              </div>
            </div>
          </div>

          <div className="card-body p-0">
            {/* Modern Tabs */}
            <div className="px-4 pt-3">
              <ul className="nav nav-tabs nav-tabs-custom">
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'attendance' ? 'active' : ''}`}
                    onClick={() => setActiveTab('attendance')}
                    style={{
                      borderTopLeftRadius: '8px',
                      borderTopRightRadius: '8px',
                      fontWeight: '500',
                      color: activeTab === 'attendance' ? '#667eea' : '#6c757d'
                    }}
                  >
                    <i className="bi bi-clock-history me-2"></i>
                    Attendance
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'permission' ? 'active' : ''}`}
                    onClick={() => setActiveTab('permission')}
                    style={{
                      borderTopLeftRadius: '8px',
                      borderTopRightRadius: '8px',
                      fontWeight: '500',
                      color: activeTab === 'permission' ? '#667eea' : '#6c757d'
                    }}
                  >
                    <i className="bi bi-envelope-paper me-2"></i>
                    Permissions
                  </button>
                </li>
              </ul>
            </div>

            {/* Tab Content */}
            <div className="px-4 pb-4">
              {activeTab === 'attendance' && (
                <div className="row mb-4">
                  <div className="col-md-6">
                    <div className="input-group input-group-custom">
                      <span className="input-group-text bg-white border-end-0">
                        <i className="bi bi-search text-muted"></i>
                      </span>
                      <input 
                        type="text" 
                        className="form-control border-start-0" 
                        placeholder="Filter by employee name..." 
                        value={filterUser} 
                        onChange={(e) => setFilterUser(e.target.value)}
                        style={{
                          borderColor: '#dee2e6'
                        }}
                      />
                      {filterUser && (
                        <button 
                          className="btn btn-outline-secondary" 
                          type="button" 
                          onClick={() => setFilterUser('')}
                          style={{
                            borderColor: '#dee2e6'
                          }}
                        >
                          <i className="bi bi-x"></i>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }} />
                  <p className="mt-3 fw-semibold">Loading data...</p>
                </div>
              ) : activeTab === 'attendance' ? (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead>
                      <tr style={{
                        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
                      }}>
                        <th style={{ minWidth: '200px' }}>Employee</th>
                        <th style={{ minWidth: '150px' }}>Date</th>
                        <th className="text-center">Status</th>
                        <th className="text-center">Clock In</th>
                        <th className="text-center">Clock Out</th>
                        <th className="text-center">Duration</th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.filter(absen => !filterUser || absen.user?.name?.toLowerCase().includes(filterUser.toLowerCase())).map((absen) => {
                        const isPermission = absen.is_permission === true;
                        const permissionType = absen.permission_type;
                        let permissionLabel = 'Permission';
                        if (permissionType === 'sick') permissionLabel = 'Sick';
                        else if (permissionType === 'leave') permissionLabel = 'Leave';
                        else if (permissionType === 'other') permissionLabel = 'Other';

                        return (
                          <tr key={absen.id} style={{ borderBottom: '1px solid #f1f1f1' }}>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="avatar bg-primary bg-opacity-10 text-primary rounded-circle me-3 p-2">
                                  <i className="bi bi-person-fill"></i>
                                </div>
                                <div>
                                  <p className="mb-0 fw-semibold">{absen.user?.name || 'Unknown'}</p>
                                  <small className="text-muted">{absen.user?.email || '-'}</small>
                                </div>
                              </div>
                            </td>
                            <td>{new Date(absen.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</td>
                            <td className="text-center">
                              {isPermission ? (
                                <span className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25 rounded-pill px-3 py-1">
                                  {permissionLabel}
                                </span>
                              ) : absen.clock_in && absen.clock_in !== '00:00:00' ? (
                                <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 rounded-pill px-3 py-1">
                                  Present
                                </span>
                              ) : (
                                <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25 rounded-pill px-3 py-1">
                                  -
                                </span>
                              )}
                            </td>
                            <td className="text-center fw-semibold">{isPermission ? '-' : absen.clock_in || '-'}</td>
                            <td className="text-center fw-semibold">{isPermission ? '-' : absen.clock_out || '-'}</td>
                            <td className="text-center">
                              {isPermission ? '-' : (absen.clock_in && absen.clock_out && absen.clock_in !== '00:00:00' && absen.clock_out !== '00:00:00') ? (
                                <span className="badge bg-light text-dark border rounded-pill px-3 py-1">
                                  {calculateDuration(absen.clock_in, absen.clock_out)}
                                </span>
                              ) : (
                                <span className="badge bg-light text-muted border rounded-pill px-3 py-1">
                                  Not completed
                                </span>
                              )}
                            </td>
                            <td className="text-center">
                              <button 
                                className="btn btn-sm btn-outline-danger rounded-pill px-3"
                                onClick={() => handleReset(absen.id)}
                                style={{
                                  borderColor: '#dc3545',
                                  color: '#dc3545'
                                }}
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
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead>
                      <tr style={{
                        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
                      }}>
                        <th style={{ minWidth: '200px' }}>Employee</th>
                        <th style={{ minWidth: '150px' }}>Date</th>
                        <th>Type</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {permissions.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center text-muted py-5">
                            <i className="bi bi-inbox fs-1 mb-3"></i>
                            <p className="fw-semibold">No permission requests found</p>
                          </td>
                        </tr>
                      ) : (
                        permissions.map((p) => (
                          <tr key={p.id} style={{ borderBottom: '1px solid #f1f1f1' }}>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="avatar bg-primary bg-opacity-10 text-primary rounded-circle me-3 p-2">
                                  <i className="bi bi-person-fill"></i>
                                </div>
                                <div>
                                  <p className="mb-0 fw-semibold">{p.user?.name || 'Unknown'}</p>
                                </div>
                              </div>
                            </td>
                            <td>{new Date(p.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</td>
                            <td>
                              <span className="badge bg-light text-dark border rounded-pill px-3 py-1">
                                {p.type === 'sick' ? 'Sick' : p.type === 'leave' ? 'Leave' : 'Other'}
                              </span>
                            </td>
                            <td>{p.description || '-'}</td>
                            <td>
                              <span className={`badge rounded-pill px-3 py-1 ${
                                p.status === 'approved' ? 'bg-success bg-opacity-10 text-success border border-success border-opacity-25' :
                                p.status === 'rejected' ? 'bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25' :
                                'bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25'
                              }`}>
                                {p.status === 'approved' ? 'Approved' : p.status === 'rejected' ? 'Rejected' : 'Pending'}
                              </span>
                            </td>
                            <td className="text-center">
                              <div className="d-flex justify-content-center gap-2">
                                {p.status === 'pending' && (
                                  <>
                                    <button 
                                      className="btn btn-sm btn-success rounded-pill px-3"
                                      onClick={() => handlePermissionStatus(p.id, 'approved')}
                                    >
                                      <i className="bi bi-check-circle me-1"></i>Approve
                                    </button>
                                    <button 
                                      className="btn btn-sm btn-danger rounded-pill px-3"
                                      onClick={() => handlePermissionStatus(p.id, 'rejected')}
                                    >
                                      <i className="bi bi-x-circle me-1"></i>Reject
                                    </button>
                                  </>
                                )}
                                <button 
                                  className="btn btn-sm btn-outline-danger rounded-pill px-3"
                                  onClick={() => handleResetPermission(p.id)}
                                >
                                  <i className="bi bi-arrow-clockwise me-1"></i>Reset
                                </button>
                              </div>
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
        </div>
      </main>

      <Footer />
    </div>
  );
}

function calculateDuration(clockIn, clockOut) {
  const [inH, inM] = clockIn.split(':').map(Number);
  const [outH, outM] = clockOut.split(':').map(Number);
  const total = (outH * 60 + outM) - (inH * 60 + inM);
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${h}h ${m}m`;
}