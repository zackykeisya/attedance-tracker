import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post('/register', {
        name,
        email,
        password
      });

      alert('🎉 Registrasi Admin Berhasil!\n\nSelamat datang! Silakan login untuk mengakses dashboard.');
      navigate('/login');
    } catch (err) {
      const response = err.response;
      if (response?.status === 422 && response.data?.errors) {
        const messages = Object.values(response.data.errors).flat().join('\n');
        setError(`⚠️ ${messages}`);
      } else if (response?.status === 409) {
        setError('❌ Email sudah terpakai, silakan gunakan email lain.');
      } else {
        setError(response?.data?.message || '❌ Terjadi kesalahan saat registrasi.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-sm border-0">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <i className="bi bi-person-plus text-primary fs-1"></i>
                  <h2 className="mt-3 fw-bold">Buat Akun Admin</h2>
                  <p className="text-muted">Isi data berikut untuk mendaftarkan akun admin</p>
                </div>

                {error && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <strong>Oops!</strong> <br /> {error}
                    <button type="button" className="btn-close" onClick={() => setError('')}></button>
                  </div>
                )}

                <form onSubmit={handleRegister}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Nama Lengkap</label>
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-person"></i></span>
                      <input
                        type="text"
                        id="name"
                        className="form-control"
                        placeholder="Nama lengkap Anda"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                      <input
                        type="email"
                        id="email"
                        className="form-control"
                        placeholder="email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-lock"></i></span>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        className="form-control"
                        placeholder="Minimal 8 karakter"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                      </button>
                    </div>
                  </div>

                  <div className="form-check mb-3">
                    <input className="form-check-input" type="checkbox" id="terms" required />
                    <label className="form-check-label" htmlFor="terms">
                      Saya menyetujui syarat & ketentuan
                    </label>
                  </div>

                  <div className="d-grid mb-3">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Mendaftarkan...
                        </>
                      ) : (
                        'Daftar Admin Sekarang'
                      )}
                    </button>
                  </div>
                </form>
              </div>

              <div className="card-footer text-center py-3">
                <p className="mb-0">
                  Sudah punya akun?{' '}
                  <Link to="/login" className="text-primary text-decoration-none fw-semibold">
                    Masuk di sini
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

