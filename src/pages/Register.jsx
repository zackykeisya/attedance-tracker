import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Swal from 'sweetalert2';

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

      await Swal.fire({
        title: '<strong>Registrasi <u>Berhasil</u></strong>',
        icon: 'success',
        html: '<b>Selamat datang!</b> Silakan login untuk mengakses dashboard.',
        showCloseButton: true,
        confirmButtonText: '<i class="bi bi-box-arrow-in-right"></i> Lanjut ke Login',
        confirmButtonColor: '#667eea',
        background: 'rgba(255, 255, 255, 0.9)',
        backdrop: `
          rgba(102, 126, 234, 0.4)
          url("/images/nyan-cat.gif")
          left top
          no-repeat
        `
      });

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

      Swal.fire({
        icon: 'error',
        title: 'Registrasi Gagal',
        text: err.response?.data?.message || 'Terjadi kesalahan saat registrasi',
        confirmButtonColor: '#667eea',
        background: 'rgba(255, 255, 255, 0.9)',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-lg border-0" style={{
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              borderRadius: '20px',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
            }}>
              {/* Gradient Header */}
              <div className="py-4 text-center" style={{
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                color: 'white'
              }}>
                <div className="d-flex justify-content-center">
                  <div style={{
                    width: '60px',
                    height: '60px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(5px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}>
                    <i className="bi bi-person-plus fs-3"></i>
                  </div>
                </div>
                <h2 className="mt-3 fw-bold mb-0">Buat Akun Baru</h2>
                <p className="mb-0 opacity-75">Isi data berikut untuk mendaftar</p>
              </div>

              <div className="card-body p-4 p-md-5">
                {error && (
                  <div className="alert alert-danger alert-dismissible fade show d-flex align-items-center" role="alert" style={{
                    borderRadius: '10px',
                    border: 'none',
                    background: 'rgba(220, 53, 69, 0.1)',
                    backdropFilter: 'blur(5px)'
                  }}>
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    <div>{error}</div>
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={() => setError('')}
                      style={{ filter: 'brightness(0.8)' }}
                    ></button>
                  </div>
                )}

                <form onSubmit={handleRegister}>
                  <div className="mb-4">
                    <label htmlFor="name" className="form-label fw-semibold text-muted">Nama Lengkap</label>
                    <div className="input-group" style={{
                      background: 'rgba(255, 255, 255, 0.7)',
                      borderRadius: '10px',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      overflow: 'hidden',
                      backdropFilter: 'blur(5px)'
                    }}>
                      <span className="input-group-text bg-transparent border-0">
                        <i className="bi bi-person text-primary"></i>
                      </span>
                      <input
                        type="text"
                        id="name"
                        className="form-control border-0 bg-transparent"
                        placeholder="Nama lengkap Anda"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={{
                          boxShadow: 'none',
                          height: '45px'
                        }}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="email" className="form-label fw-semibold text-muted">Email</label>
                    <div className="input-group" style={{
                      background: 'rgba(255, 255, 255, 0.7)',
                      borderRadius: '10px',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      overflow: 'hidden',
                      backdropFilter: 'blur(5px)'
                    }}>
                      <span className="input-group-text bg-transparent border-0">
                        <i className="bi bi-envelope text-primary"></i>
                      </span>
                      <input
                        type="email"
                        id="email"
                        className="form-control border-0 bg-transparent"
                        placeholder="email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                          boxShadow: 'none',
                          height: '45px'
                        }}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label fw-semibold text-muted">Password</label>
                    <div className="input-group" style={{
                      background: 'rgba(255, 255, 255, 0.7)',
                      borderRadius: '10px',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      overflow: 'hidden',
                      backdropFilter: 'blur(5px)'
                    }}>
                      <span className="input-group-text bg-transparent border-0">
                        <i className="bi bi-lock text-primary"></i>
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        className="form-control border-0 bg-transparent"
                        placeholder="Minimal 8 karakter"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                          boxShadow: 'none',
                          height: '45px'
                        }}
                      />
                      <button 
                        type="button" 
                        className="btn btn-link text-decoration-none bg-transparent border-0"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          color: '#6c757d',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                      </button>
                    </div>
                  </div>

                  <div className="form-check mb-4">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="terms" 
                      required 
                    />
                    <label className="form-check-label text-muted" htmlFor="terms">
                      Saya menyetujui syarat & ketentuan
                    </label>
                  </div>

                  <div className="d-grid mb-3">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg py-3 fw-semibold"
                      disabled={loading}
                      style={{
                        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        borderRadius: '10px',
                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
                        e.target.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Mendaftarkan...
                        </>
                      ) : (
                        <>
                          <span>Daftar Sekarang</span>
                          <span className="position-absolute top-0 end-0 h-100 d-flex align-items-center pe-3">
                            <i className="bi bi-arrow-right"></i>
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              <div className="card-footer bg-transparent py-3 text-center border-top-0" style={{
                background: 'rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(5px)'
              }}>
                <p className="mb-0 text-muted">
                  Sudah punya akun?{' '}
                  <Link 
                    to="/login" 
                    className="fw-semibold text-decoration-none"
                    style={{
                      color: '#667eea',
                      transition: 'all 0.2s ease',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = '#764ba2';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = '#667eea';
                    }}
                  >
                    Masuk di sini
                    <span style={{
                      position: 'absolute',
                      bottom: '-2px',
                      left: 0,
                      width: '100%',
                      height: '1px',
                      background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                      transform: 'scaleX(0)',
                      transformOrigin: 'right',
                      transition: 'transform 0.3s ease'
                    }}></span>
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