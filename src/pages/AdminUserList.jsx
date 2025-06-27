import { useEffect, useState } from 'react';
import axios from '../api/axios';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function AdminUserList() {
  const [users, setUsers] = useState([]);
  const [addForm, setAddForm] = useState({ name: '', email: '', password: '', role: 'karyawan' });
  const [editForm, setEditForm] = useState({ id: null, name: '', email: '', password: '', role: 'karyawan' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/admin/karyawan', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data.data);
    } catch (err) {
      alert('Gagal memuat data user.');
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/admin/karyawan', addForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAddForm({ name: '', email: '', password: '', role: 'karyawan' });
      fetchUsers();
    } catch (err) {
      if (err.response?.data?.errors) {
        alert(
          Object.values(err.response.data.errors)
            .map(msgArr => msgArr.join(', '))
            .join('\n')
        );
      } else {
        alert('Gagal menambahkan user. ' + (err.response?.data?.message || ''));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`/admin/karyawan/${editForm.id}`, editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditForm({ id: null, name: '', email: '', password: '', role: 'karyawan' });
      fetchUsers();
    } catch (err) {
      alert('Gagal mengupdate user. ' + (err.response?.data?.message || ''));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditForm({
      id: user.id,
      name: user.name,
      email: user.email,
      password: '',
      role: user.role
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      try {
        await axios.delete(`/admin/karyawan/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchUsers();
        if (editForm.id === id) {
          setEditForm({ id: null, name: '', email: '', password: '', role: 'karyawan' });
        }
      } catch (err) {
        alert('Gagal menghapus user.');
      }
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      backdropFilter: 'blur(10px)'
    }}>
      <Navbar user={user} onLogout={handleLogout} />
      
      <main className="container-fluid px-4 py-4 flex-grow-1">
        {/* Glass Morphism Dashboard Header */}
        <div className="dashboard-header mb-4 p-4 rounded-4" style={{
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.1)'
        }}>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
            <div className="mb-3 mb-md-0">
              <h1 className="fw-bold mb-1" style={{ 
                color: '#4f46e5',
                fontSize: '1.75rem'
              }}>
                <i className="bi bi-people-fill me-2"></i>
                Manajemen Pengguna
              </h1>
              <p className="mb-0" style={{ color: '#64748b' }}>Kelola semua akun karyawan dan hak akses</p>
            </div>
            <div className="d-flex flex-column flex-md-row gap-3 w-100 w-md-auto">
              <div className="search-box flex-grow-1">
                <div className="input-group" style={{
                  borderRadius: '50px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}>
                  <span className="input-group-text bg-white border-end-0">
                    <i className="bi bi-search" style={{ color: '#94a3b8' }}></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Cari pengguna..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      background: 'rgba(255,255,255,0.8)',
                      borderColor: 'rgba(0,0,0,0.05)'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards Row with Glass Effect */}
        <div className="row g-4 mb-4">
          {/* Add User Card */}
          <div className="col-xl-6">
            <div className="h-100" style={{
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(31, 38, 135, 0.1)',
              overflow: 'hidden'
            }}>
              <div className="p-4" style={{
                background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
                borderBottom: '1px solid rgba(0,0,0,0.05)'
              }}>
                <h3 className="mb-0 fw-bold" style={{ color: '#047857' }}>
                  <i className="bi bi-person-plus me-2"></i>
                  Tambah Pengguna Baru
                </h3>
              </div>
              <div className="p-4">
                <form onSubmit={handleAddUser} className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-medium" style={{ color: '#334155' }}>Nama Lengkap</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nama Lengkap"
                      value={addForm.name}
                      onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                      required
                      style={{
                        background: 'rgba(255,255,255,0.8)',
                        borderColor: 'rgba(0,0,0,0.1)',
                        borderRadius: '8px'
                      }}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-medium" style={{ color: '#334155' }}>Email</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="user@email.com"
                      value={addForm.email}
                      onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                      required
                      style={{
                        background: 'rgba(255,255,255,0.8)',
                        borderColor: 'rgba(0,0,0,0.1)',
                        borderRadius: '8px'
                      }}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-medium" style={{ color: '#334155' }}>Kata Sandi</label>
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        placeholder="Minimal 8 karakter"
                        value={addForm.password}
                        onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                        required
                        minLength="8"
                        style={{
                          background: 'rgba(255,255,255,0.8)',
                          borderColor: 'rgba(0,0,0,0.1)',
                          borderRadius: '8px 0 0 8px'
                        }}
                      />
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          borderColor: 'rgba(0,0,0,0.1)',
                          borderRadius: '0 8px 8px 0'
                        }}
                      >
                        <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                      </button>
                    </div>
                    <small className="text-muted">Minimal 8 karakter</small>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-medium" style={{ color: '#334155' }}>Peran</label>
                    <select
                      className="form-select"
                      value={addForm.role}
                      onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
                      style={{
                        background: 'rgba(255,255,255,0.8)',
                        borderColor: 'rgba(0,0,0,0.1)',
                        borderRadius: '8px'
                      }}
                    >
                      <option value="karyawan">Karyawan</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>

                  <div className="col-12 mt-2">
                    <button 
                      type="submit" 
                      className="btn w-100 py-2 rounded-pill"
                      disabled={loading}
                      style={{
                        background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                        color: 'white',
                        border: 'none',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => e.target.style.opacity = 0.9}
                      onMouseOut={(e) => e.target.style.opacity = 1}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Memproses...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-person-plus me-2"></i>
                          Buat Pengguna
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Edit User Card (Conditional) */}
          {editForm.id && (
            <div className="col-xl-6">
              <div className="h-100" style={{
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(31, 38, 135, 0.1)',
                overflow: 'hidden',
                border: '2px solid rgba(99, 102, 241, 0.3)'
              }}>
                <div className="p-4" style={{
                  background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.1) 0%, rgba(79, 70, 229, 0.1) 100%)',
                  borderBottom: '1px solid rgba(0,0,0,0.05)'
                }}>
                  <h3 className="mb-0 fw-bold" style={{ color: '#4f46e5' }}>
                    <i className="bi bi-pencil-square me-2"></i>
                    Edit Pengguna
                  </h3>
                  <small className="text-muted">Edit ID: {editForm.id}</small>
                </div>
                <div className="p-4">
                  <form onSubmit={handleUpdateUser} className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-medium" style={{ color: '#334155' }}>Nama Lengkap</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        required
                        style={{
                          background: 'rgba(255,255,255,0.8)',
                          borderColor: 'rgba(0,0,0,0.1)',
                          borderRadius: '8px'
                        }}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-medium" style={{ color: '#334155' }}>Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        required
                        style={{
                          background: 'rgba(255,255,255,0.8)',
                          borderColor: 'rgba(0,0,0,0.1)',
                          borderRadius: '8px'
                        }}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-medium" style={{ color: '#334155' }}>Kata Sandi Baru</label>
                      <div className="input-group">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control"
                          placeholder="Kosongkan jika tidak diubah"
                          value={editForm.password}
                          onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                          minLength="8"
                          style={{
                            background: 'rgba(255,255,255,0.8)',
                            borderColor: 'rgba(0,0,0,0.1)',
                            borderRadius: '8px 0 0 8px'
                          }}
                        />
                        <button 
                          type="button" 
                          className="btn btn-outline-secondary"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            borderColor: 'rgba(0,0,0,0.1)',
                            borderRadius: '0 8px 8px 0'
                          }}
                        >
                          <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                        </button>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-medium" style={{ color: '#334155' }}>Peran</label>
                      <select
                        className="form-select"
                        value={editForm.role}
                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                        style={{
                          background: 'rgba(255,255,255,0.8)',
                          borderColor: 'rgba(0,0,0,0.1)',
                          borderRadius: '8px'
                        }}
                      >
                        <option value="karyawan">Karyawan</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </div>

                    <div className="col-12 mt-2">
                      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                        <button 
                          type="button" 
                          className="btn rounded-pill px-4"
                          onClick={() => setEditForm({ id: null, name: '', email: '', password: '', role: 'karyawan' })}
                          style={{
                            background: 'rgba(255,255,255,0.8)',
                            border: '1px solid rgba(0,0,0,0.1)',
                            color: '#64748b',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseOver={(e) => {
                            e.target.style.background = 'rgba(0,0,0,0.05)';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.background = 'rgba(255,255,255,0.8)';
                          }}
                        >
                          <i className="bi bi-x-circle me-2"></i>
                          Batal
                        </button>
                        <button 
                          type="submit" 
                          className="btn rounded-pill px-4"
                          disabled={loading}
                          style={{
                            background: 'linear-gradient(90deg, #6366f1 0%, #4f46e5 100%)',
                            color: 'white',
                            border: 'none',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseOver={(e) => e.target.style.opacity = 0.9}
                          onMouseOut={(e) => e.target.style.opacity = 1}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Memperbarui...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-check-circle me-2"></i>
                              Simpan Perubahan
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Users Table Section with Glass Effect */}
        <div className="rounded-4 overflow-hidden" style={{
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.1)'
        }}>
          <div className="p-4" style={{
            borderBottom: '1px solid rgba(0,0,0,0.05)'
          }}>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
              <div className="mb-2 mb-md-0">
                <h3 className="mb-0 fw-bold" style={{ color: '#1e293b' }}>
                  <i className="bi bi-table me-2"></i>
                  Direktori Pengguna
                </h3>
                <small className="text-muted">{filteredUsers.length} pengguna ditemukan</small>
              </div>
              <div className="d-flex align-items-center gap-2">
                <div className="dropdown">
                  <button 
                    className="btn rounded-pill px-3 dropdown-toggle"
                    type="button"
                    id="filterDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{
                      background: 'rgba(255,255,255,0.8)',
                      border: '1px solid rgba(0,0,0,0.1)',
                      color: '#64748b'
                    }}
                  >
                    <i className="bi bi-funnel me-1"></i> Filter
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="filterDropdown">
                    <li><a className="dropdown-item" href="#">Semua Pengguna</a></li>
                    <li><a className="dropdown-item" href="#">Aktif</a></li>
                    <li><a className="dropdown-item" href="#">Tidak Aktif</a></li>
                  </ul>
                </div>
                <button className="btn rounded-pill px-3" style={{
                  background: 'rgba(255,255,255,0.8)',
                  border: '1px solid rgba(0,0,0,0.1)',
                  color: '#64748b',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'rgba(0,0,0,0.05)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.8)';
                }}>
                  <i className="bi bi-download me-1"></i> Ekspor
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-0">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead style={{
                  background: 'linear-gradient(90deg, rgba(79, 70, 229, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)'
                }}>
                  <tr>
                    <th className="ps-4 py-3" style={{ color: '#4f46e5' }}>Pengguna</th>
                    <th className="py-3" style={{ color: '#4f46e5' }}>Kontak</th>
                    <th className="py-3" style={{ color: '#4f46e5' }}>Peran</th>
                    <th className="py-3" style={{ color: '#4f46e5' }}>Status</th>
                    <th className="pe-4 py-3 text-end" style={{ color: '#4f46e5' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.length > 0 ? (
                    currentUsers.map((user) => (
                      <tr 
                        key={user.id} 
                        className={editForm.id === user.id ? 'table-active' : ''}
                        style={{
                          transition: 'all 0.2s ease',
                          borderBottom: '1px solid rgba(0,0,0,0.05)'
                        }}
                      >
                        <td className="ps-4 py-3">
                          <div className="d-flex align-items-center">
                            <div className="avatar me-3" style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 'bold'
                            }}>
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h6 className="mb-0 fw-bold" style={{ color: '#1e293b' }}>{user.name}</h6>
                              <small className="text-muted">ID: {user.id}</small>
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          <div>
                            <div style={{ color: '#334155' }}>{user.email}</div>
                            <small className="text-muted">Login terakhir: Hari ini</small>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className={`badge rounded-pill py-1 px-3 ${user.role === 'admin' ? 'bg-primary' : 'bg-secondary'}`}
                            style={{
                              background: user.role === 'admin' 
                                ? 'rgba(79, 70, 229, 0.1)' 
                                : 'rgba(100, 116, 139, 0.1)',
                              color: user.role === 'admin' ? '#4f46e5' : '#64748b',
                              fontWeight: '500'
                            }}>
                            {user.role === 'admin' ? 'Administrator' : 'Karyawan'}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className="badge rounded-pill py-1 px-3" style={{
                            background: 'rgba(16, 185, 129, 0.1)',
                            color: '#047857',
                            fontWeight: '500'
                          }}>
                            <i className="bi bi-check-circle-fill me-1"></i>
                            Aktif
                          </span>
                        </td>
                        <td className="pe-4 py-3 text-end">
                          <div className="btn-group" role="group">
                            <button 
                              onClick={() => handleEdit(user)} 
                              className="btn btn-sm rounded-start-pill px-3"
                              disabled={editForm.id === user.id}
                              style={{
                                background: editForm.id === user.id 
                                  ? 'rgba(79, 70, 229, 0.2)' 
                                  : 'rgba(79, 70, 229, 0.1)',
                                color: '#4f46e5',
                                border: 'none',
                                transition: 'all 0.3s ease'
                              }}
                              onMouseOver={(e) => {
                                if (editForm.id !== user.id) {
                                  e.target.style.background = 'rgba(79, 70, 229, 0.2)';
                                }
                              }}
                              onMouseOut={(e) => {
                                if (editForm.id !== user.id) {
                                  e.target.style.background = 'rgba(79, 70, 229, 0.1)';
                                }
                              }}
                            >
                              <i className="bi bi-pencil-square"></i>
                            </button>
                            <button 
                              onClick={() => handleDelete(user.id)} 
                              className="btn btn-sm rounded-end-pill px-3"
                              style={{
                                background: 'rgba(239, 68, 68, 0.1)',
                                color: '#dc2626',
                                border: 'none',
                                transition: 'all 0.3s ease'
                              }}
                              onMouseOver={(e) => {
                                e.target.style.background = 'rgba(239, 68, 68, 0.2)';
                              }}
                              onMouseOut={(e) => {
                                e.target.style.background = 'rgba(239, 68, 68, 0.1)';
                              }}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-5">
                        <div className="empty-state">
                          <i className="bi bi-people text-muted fs-1 mb-3 opacity-50"></i>
                          <h5 className="fw-bold" style={{ color: '#1e293b' }}>Tidak ada pengguna ditemukan</h5>
                          <p className="text-muted">Coba ubah kata kunci pencarian atau filter</p>
                          <button 
                            className="btn rounded-pill px-4 mt-3"
                            onClick={() => setSearchTerm('')}
                            style={{
                              background: 'linear-gradient(90deg, #6366f1 0%, #4f46e5 100%)',
                              color: 'white',
                              border: 'none',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => e.target.style.opacity = 0.9}
                            onMouseOut={(e) => e.target.style.opacity = 1}
                          >
                            <i className="bi bi-arrow-clockwise me-2"></i>
                            Reset Pencarian
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4" style={{
            borderTop: '1px solid rgba(0,0,0,0.05)'
          }}>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
              <div className="mb-2 mb-md-0" style={{ color: '#64748b' }}>
                Menampilkan {indexOfFirstUser + 1} sampai {Math.min(indexOfLastUser, filteredUsers.length)} dari {filteredUsers.length} entri
              </div>
              
              {filteredUsers.length > usersPerPage && (
                <nav aria-label="Navigasi halaman">
                  <ul className="pagination pagination-sm mb-0">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button 
                        className="page-link rounded-start-pill" 
                        onClick={() => setCurrentPage(currentPage - 1)}
                        style={{
                          borderColor: 'rgba(0,0,0,0.1)',
                          color: currentPage === 1 ? '#94a3b8' : '#4f46e5'
                        }}
                      >
                        Sebelumnya
                      </button>
                    </li>
                    {[...Array(totalPages)].map((_, index) => (
                      <li 
                        key={index} 
                        className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                      >
                        <button 
                          className="page-link" 
                          onClick={() => setCurrentPage(index + 1)}
                          style={{
                            borderColor: 'rgba(0,0,0,0.1)',
                            background: currentPage === index + 1 ? '#4f46e5' : 'transparent',
                            color: currentPage === index + 1 ? 'white' : '#4f46e5'
                          }}
                        >
                          {index + 1}
                        </button>
                      </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button 
                        className="page-link rounded-end-pill" 
                        onClick={() => setCurrentPage(currentPage + 1)}
                        style={{
                          borderColor: 'rgba(0,0,0,0.1)',
                          color: currentPage === totalPages ? '#94a3b8' : '#4f46e5'
                        }}
                      >
                        Berikutnya
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}