import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import ProfileCard from './ProfileCard';
import { Modal } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Navbar({ user, onLogout }) {
  const location = useLocation();
  const [showProfile, setShowProfile] = useState(false);

  if (!user || !user.role) return null;

  const adminNavItems = [
    { path: '/admin', icon: 'bi-speedometer2', label: 'Dashboard' },
    { path: '/admin/users', icon: 'bi-people', label: 'User Management' },
    { path: '/admin/absensi', icon: 'bi-calendar-check', label: 'Attendance' },
    { path: '/admin/statistik', icon: 'bi-bar-chart', label: 'Analytics' },
  ];

  const karyawanNavItems = [
    { path: '/karyawan', icon: 'bi-speedometer2', label: 'Dashboard' },
    { path: '/karyawan/riwayat', icon: 'bi-clock-history', label: 'History' }
  ];

  const navItems = user.role === 'admin' ? adminNavItems : karyawanNavItems;
  const basePath = user.role === 'admin' ? '/admin' : '/karyawan';
  const roleTitle = user.role === 'admin' ? 'Administrator' : 'Employee';

  return (
    <>
      <nav className="navbar navbar-expand-lg" style={{
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        padding: '0.5rem 1.5rem',
        position: 'relative',
        zIndex: 1000 // Tambahkan z-index tinggi untuk navbar
      }}>
        <div className="container-fluid">
          {/* Brand Logo with Glass Effect */}
          <Link className="navbar-brand d-flex align-items-center" to={basePath}>
            <div className="me-2 glass-icon" style={{
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(5px)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
            }}>
              <i className="bi bi-shield-shaded" style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '1.5rem'
              }}></i>
            </div>
            <span className="fw-bold fs-4" style={{
              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {user.role === 'admin' ? 'Admin' : 'Staff'}Portal
            </span>
          </Link>

          {/* Mobile Toggle */}
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarContent" 
            aria-controls="navbarContent" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
            style={{
              border: 'none',
              padding: '0.5rem',
              outline: 'none',
              boxShadow: 'none'
            }}
          >
            <i className="bi bi-list" style={{
              color: '#495057',
              fontSize: '1.75rem'
            }}></i>
          </button>

          {/* Nav Items */}
          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {navItems.map((item) => (
                <li className="nav-item mx-1" key={item.path}>
                  <Link 
                    className={`nav-link position-relative py-2 px-3 ${location.pathname === item.path ? 'active' : ''}`} 
                    to={item.path} 
                    style={{
                      color: location.pathname === item.path ? '#667eea' : '#495057',
                      fontWeight: location.pathname === item.path ? '600' : '400',
                      transition: 'all 0.3s ease',
                      borderRadius: '8px',
                      margin: '0.1rem 0',
                      background: location.pathname === item.path ? 'rgba(102, 126, 234, 0.1)' : 'transparent'
                    }}
                  >
                    <i className={`bi ${item.icon} me-2`} style={{
                      color: location.pathname === item.path ? '#667eea' : '#6c757d'
                    }}></i>
                    <span>{item.label}</span>
                    {location.pathname === item.path && (
                      <span className="position-absolute bottom-0 start-50 translate-middle-x" style={{
                        width: '60%',
                        height: '2px',
                        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '2px'
                      }}></span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>

            

            {/* User Dropdown */}
            <div className="d-flex align-items-center ms-lg-2" style={{ position: 'relative' }}>
              <div className="dropdown">
                <button 
                  className="btn btn-link dropdown-toggle d-flex align-items-center text-decoration-none p-0" 
                  type="button" 
                  id="userDropdown" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                  style={{
                    outline: 'none',
                    boxShadow: 'none',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div className="position-relative me-2">
                    <div className="rounded-circle" style={{
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(255, 255, 255, 0.7)',
                      backdropFilter: 'blur(5px)',
                      border: '1px solid rgba(0, 0, 0, 0.05)',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
                    }}>
                      <i className="bi bi-person-circle" style={{
                        color: '#667eea',
                        fontSize: '1.25rem'
                      }}></i>
                    </div>
                    <span className="position-absolute bottom-0 end-0 p-1 bg-success border border-2 border-white rounded-circle" style={{
                      boxShadow: '0 0 5px rgba(40, 167, 69, 0.5)'
                    }}></span>
                  </div>
                  <div className="text-start d-none d-lg-block">
                    <div className="fw-semibold" style={{ 
                      color: '#212529',
                      fontSize: '0.9rem'
                    }}>{user.name}</div>
                    <small className="text-muted" style={{ 
                      fontSize: '0.7rem'
                    }}>{roleTitle}</small>
                  </div>
                </button>
                <ul 
                  className="dropdown-menu dropdown-menu-end shadow-lg mt-2" 
                  aria-labelledby="userDropdown" 
                  style={{
                    minWidth: '280px',
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid rgba(0,0,0,0.05)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(15px)',
                    WebkitBackdropFilter: 'blur(15px)',
                    overflow: 'hidden',
                    padding: '0.5rem 0',
                    position: 'absolute',
                    zIndex: 1050 // Pastikan lebih tinggi dari navbar
                  }}
                >
                  <li>
                    <button 
                      className="dropdown-item d-flex align-items-center py-2 px-3 w-100" 
                      onClick={() => setShowProfile(true)}
                      style={{
                        transition: 'all 0.2s ease',
                        borderLeft: '3px solid transparent',
                        fontSize: '0.9rem',
                        background: 'transparent',
                        color: '#212529'
                      }}
                      onMouseEnter={(e) => e.target.style.borderLeft = '3px solid #667eea'}
                      onMouseLeave={(e) => e.target.style.borderLeft = '3px solid transparent'}
                    >
                      <div className="icon-container me-3">
                        <i className="bi bi-person" style={{ color: '#667eea' }}></i>
                      </div>
                      <span>My Profile</span>
                    </button>
                  </li>
                  <li>
                    <Link 
                      className="dropdown-item d-flex align-items-center py-2 px-3" 
                      to={`${basePath}/settings`}
                      style={{
                        transition: 'all 0.2s ease',
                        borderLeft: '3px solid transparent',
                        fontSize: '0.9rem',
                        background: 'transparent',
                        color: '#212529'
                      }}
                      onMouseEnter={(e) => e.target.style.borderLeft = '3px solid #667eea'}
                      onMouseLeave={(e) => e.target.style.borderLeft = '3px solid transparent'}
                    >
                      <div className="icon-container me-3">
                        <i className="bi bi-gear" style={{ color: '#667eea' }}></i>
                      </div>
                      <span>Settings</span>
                    </Link>
                  </li>
                  {user.role === 'admin' && (
                    <li>
                      <Link 
                        className="dropdown-item d-flex align-items-center py-2 px-3" 
                        to={`${basePath}/absensi?tab=permission`}
                        style={{
                          transition: 'all 0.2s ease',
                          borderLeft: '3px solid transparent',
                          fontSize: '0.9rem',
                          background: 'transparent',
                          color: '#212529'
                        }}
                        onMouseEnter={(e) => e.target.style.borderLeft = '3px solid #667eea'}
                        onMouseLeave={(e) => e.target.style.borderLeft = '3px solid transparent'}
                      >
                        <div className="icon-container me-3">
                          <i className="bi bi-bell" style={{ color: '#667eea' }}></i>
                        </div>
                        <span>Notifications</span>
                        <span className="badge bg-danger ms-auto" style={{ 
                          fontSize: '0.7rem',
                        }}>3</span>
                      </Link>
                    </li>
                  )}
                  <li><hr className="my-1" style={{ borderColor: 'rgba(0,0,0,0.05)' }} /></li>
                  <li>
                    <button 
                      className="dropdown-item d-flex align-items-center py-2 px-3" 
                      onClick={onLogout}
                      style={{
                        transition: 'all 0.2s ease',
                        borderLeft: '3px solid transparent',
                        fontSize: '0.9rem',
                        background: 'transparent',
                        color: '#dc3545'
                      }}
                      onMouseEnter={(e) => e.target.style.borderLeft = '3px solid #dc3545'}
                      onMouseLeave={(e) => e.target.style.borderLeft = '3px solid transparent'}
                    >
                      <div className="icon-container me-3">
                        <i className="bi bi-box-arrow-right" style={{ color: '#dc3545' }}></i>
                      </div>
                      <span>Logout</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Profile Modal */}
      <Modal 
        show={showProfile} 
        onHide={() => setShowProfile(false)} 
        centered
        contentClassName="border-0"
        style={{ backdropFilter: 'blur(5px)' }}
      >
        <Modal.Header closeButton className="border-bottom-0" style={{
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(10px)'
        }}>
          <Modal.Title>My Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(10px)',
          padding: '0'
        }}>
          <ProfileCard user={user} />
        </Modal.Body>
      </Modal>

      {/* Custom Styles */}
      <style jsx>{`
        .nav-link:hover {
          background: rgba(102, 126, 234, 0.05) !important;
          color: #667eea !important;
        }
        .dropdown-item:hover {
          background: rgba(102, 126, 234, 0.1) !important;
        }
        .icon-container {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(102, 126, 234, 0.1);
          border-radius: 6px;
        }
      `}</style>
    </>
  );
}