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
  const [showPasswordInput, setShowPasswordInput] = useState(false); // For form password visibility
  const [showPasswordsTable, setShowPasswordsTable] = useState(false); // For table password visibility
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
      alert('Gagal menambahkan user. ' + (err.response?.data?.message || ''));
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

  // Mask password for display
  const maskPassword = (password) => {
    return password ? '••••••••' : '-';
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <Navbar user={user} onLogout={handleLogout} />
      
      <div className="container-fluid py-4 flex-grow-1">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white border-bottom-0">
            <h2 className="card-title mb-0 fw-bold">
              <i className="bi bi-people-fill me-2 text-primary"></i>
              Manajemen User Karyawan
            </h2>
          </div>

          <div className="card-body">
            {/* Form Section */}
            <div className="row mb-5">
              {/* Add User Card */}
              <div className="col-lg-6 mb-4 mb-lg-0">
                <div className="card shadow-sm h-100">
                  <div className="card-header bg-white border-bottom-0">
                    <h3 className="card-title mb-0 fw-bold">
                      <i className="bi bi-plus-circle me-2 text-success"></i>
                      Tambah User Baru
                    </h3>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleAddUser}>
                      <div className="mb-3">
                        <label htmlFor="addName" className="form-label">Nama Lengkap</label>
                        <input
                          type="text"
                          id="addName"
                          className="form-control"
                          placeholder="Masukkan nama lengkap"
                          value={addForm.name}
                          onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="addEmail" className="form-label">Alamat Email</label>
                        <input
                          type="email"
                          id="addEmail"
                          className="form-control"
                          placeholder="Masukkan email"
                          value={addForm.email}
                          onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="addPassword" className="form-label">Password</label>
                        <div className="input-group">
                          <input
                            type={showPassword ? "text" : "password"}
                            id="addPassword"
                            className="form-control"
                            placeholder="Masukkan password"
                            value={addForm.password}
                            onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                            required
                            minLength="8"
                          />
                          <button 
                            type="button" 
                            className="btn btn-outline-secondary"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                          </button>
                        </div>
                        <div className="form-text">Minimal 8 karakter</div>
                      </div>

                      <div className="mb-4">
                        <label htmlFor="addRole" className="form-label">Role</label>
                        <select
                          id="addRole"
                          className="form-select"
                          value={addForm.role}
                          onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
                        >
                          <option value="karyawan">Karyawan</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>

                      <div className="d-grid">
                        <button 
                          type="submit" 
                          className="btn btn-success btn-lg"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Memproses...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-person-plus me-2"></i>
                              Tambah User
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              {/* Edit User Card - Only shown when editing */}
              {editForm.id && (
                <div className="col-lg-6">
                  <div className="card shadow-sm h-100 border-primary">
                    <div className="card-header bg-white border-bottom-0">
                      <h3 className="card-title mb-0 fw-bold">
                        <i className="bi bi-pencil-square me-2 text-primary"></i>
                        Edit User
                        <span className="badge bg-primary ms-2">ID: {editForm.id}</span>
                      </h3>
                    </div>
                    <div className="card-body">
                      <form onSubmit={handleUpdateUser}>
                        <div className="mb-3">
                          <label htmlFor="editName" className="form-label">Nama Lengkap</label>
                          <input
                            type="text"
                            id="editName"
                            className="form-control"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            required
                          />
                        </div>

                        <div className="mb-3">
                          <label htmlFor="editEmail" className="form-label">Alamat Email</label>
                          <input
                            type="email"
                            id="editEmail"
                            className="form-control"
                            value={editForm.email}
                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            required
                          />
                        </div>

                        <div className="mb-3">
                          <label htmlFor="editPassword" className="form-label">Password</label>
                          <div className="input-group">
                            <input
                              type={showPassword ? "text" : "password"}
                              id="editPassword"
                              className="form-control"
                              placeholder="Kosongkan jika tidak diubah"
                              value={editForm.password}
                              onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                              minLength="8"
                            />
                            <button 
                              type="button" 
                              className="btn btn-outline-secondary"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                            </button>
                          </div>
                          <div className="form-text">Biarkan kosong jika tidak ingin mengubah password</div>
                        </div>

                        <div className="mb-4">
                          <label htmlFor="editRole" className="form-label">Role</label>
                          <select
                            id="editRole"
                            className="form-select"
                            value={editForm.role}
                            onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                          >
                            <option value="karyawan">Karyawan</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>

                        <div className="d-grid gap-2">
                          <button 
                            type="submit" 
                            className="btn btn-primary btn-lg"
                            disabled={loading}
                          >
                            {loading ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Memproses...
                              </>
                            ) : (
                              <>
                                <i className="bi bi-check-circle me-2"></i>
                                Update User
                              </>
                            )}
                          </button>
                          <button 
                            type="button" 
                            className="btn btn-outline-secondary btn-lg"
                            onClick={() => setEditForm({ id: null, name: '', email: '', password: '', role: 'karyawan' })}
                          >
                            <i className="bi bi-x-circle me-2"></i>
                            Batal Edit
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>

             {/* Daftar User */}
        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-header bg-white border-bottom-0 d-flex justify-content-between align-items-center">
                <h3 className="card-title mb-0 fw-bold">
                  <i className="bi bi-list-ul me-2 text-primary"></i>
                  Daftar User
                </h3>
                <div className="d-flex align-items-center">
                  <div className="input-group me-3">
                    <span className="input-group-text">
                      <i className="bi bi-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Cari user..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button 
                    className={`btn btn-sm ${showPasswordsTable ? 'btn-danger' : 'btn-outline-secondary'}`}
                    onClick={() => setShowPasswordsTable(!showPasswordsTable)}
                    title={showPasswordsTable ? "Sembunyikan Password" : "Tampilkan Password"}
                  >
                    <i className={`bi ${showPasswordsTable ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                </div>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th scope="col">Nama</th>
                        <th scope="col">Email</th>
                        <th scope="col">Password</th>
                        <th scope="col">Role</th>
                        <th scope="col" className="text-end">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentUsers.length > 0 ? (
                        currentUsers.map((user) => (
                          <tr key={user.id} className={editForm.id === user.id ? 'table-primary' : ''}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                              {showPasswordsTable && user.password ? (
                                <span className="text-monospace">{user.password}</span>
                              ) : (
                                <span className="text-monospace">••••••••</span>
                              )}
                            </td>
                            <td>
                              <span className={`badge ${user.role === 'admin' ? 'bg-primary' : 'bg-secondary'}`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="text-end">
                              <button 
                                onClick={() => handleEdit(user)} 
                                className="btn btn-sm btn-outline-primary me-2"
                                disabled={editForm.id === user.id}
                              >
                                <i className="bi bi-pencil-square"></i> Edit
                              </button>
                              <button 
                                onClick={() => handleDelete(user.id)} 
                                className="btn btn-sm btn-outline-danger"
                              >
                                <i className="bi bi-trash"></i> Hapus
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center py-4">
                            <i className="bi bi-exclamation-circle fs-4 text-muted"></i>
                            <p className="mt-2">Tidak ada data user</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                    {/* Pagination */}
                    {filteredUsers.length > usersPerPage && (
                      <nav aria-label="Page navigation" className="mt-4">
                        <ul className="pagination justify-content-center">
                          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button 
                              className="page-link" 
                              onClick={() => setCurrentPage(currentPage - 1)}
                            >
                              Previous
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
                              >
                                {index + 1}
                              </button>
                            </li>
                          ))}
                          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button 
                              className="page-link" 
                              onClick={() => setCurrentPage(currentPage + 1)}
                            >
                              Next
                            </button>
                          </li>
                        </ul>
                      </nav>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

