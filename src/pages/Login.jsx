import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('/login', { email, password });
      const token = res.data.access_token;
      const user = res.data.user;

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);

      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/karyawan');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login gagal');
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
                    <i className="bi bi-box-arrow-in-right fs-3"></i>
                  </div>
                </div>
                <h2 className="mt-3 fw-bold mb-0">Masuk ke Akun Anda</h2>
                <p className="mb-0 opacity-75">Silakan masuk untuk melanjutkan</p>
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

                <form onSubmit={handleLogin}>
                  <div className="mb-4">
                    <label htmlFor="email" className="form-label fw-semibold text-muted">Alamat Email</label>
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
                        placeholder="contoh@email.com"
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
                        placeholder="Masukkan password"
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
                          Memproses...
                        </>
                      ) : (
                        <>
                          <span>Masuk</span>
                          <span className="position-absolute top-0 end-0 h-100 d-flex align-items-center pe-3">
                            <i className="bi bi-arrow-right"></i>
                          </span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="text-center mb-3">
                    <Link 
                      to="/forgot-password" 
                      className="text-decoration-none text-muted"
                      style={{
                        transition: 'all 0.2s ease',
                        fontSize: '0.9rem'
                      }}
                      onMouseEnter={(e) => e.target.style.color = '#667eea'}
                      onMouseLeave={(e) => e.target.style.color = '#6c757d'}
                    >
                      Lupa password?
                    </Link>
                  </div>
                </form>
              </div>

              <div className="card-footer bg-transparent py-3 text-center border-top-0" style={{
                background: 'rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(5px)'
              }}>
                <p className="mb-0 text-muted">
                  Belum punya akun?{' '}
                  <Link 
                    to="/register" 
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
                    Daftar sekarang
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