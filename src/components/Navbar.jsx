import { Link, useLocation } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Navbar({ user, onLogout }) {
  const location = useLocation();
  
  // Menu untuk admin
  const adminNavItems = [
    { path: '/admin', icon: 'bi-speedometer2', label: 'Dashboard' },
    { path: '/admin/users', icon: 'bi-people', label: 'Kelola User' },
    { path: '/admin/absensi', icon: 'bi-calendar-check', label: 'Absensi' },
    { path: '/admin/statistik', icon: 'bi-bar-chart', label: 'Statistik' },
    { path: '/admin/laporan', icon: 'bi-file-earmark-text', label: 'Laporan' }
  ];
  
  // Menu untuk karyawan
  const karyawanNavItems = [
    { path: '/karyawan', icon: 'bi-speedometer2', label: 'Dashboard' },
    { path: '/karyawan', icon: 'bi-calendar-check', label: 'Absensi' },
    { path: '/karyawan/riwayat', icon: 'bi-clock-history', label: 'Riwayat' }
  ];
  
  // Tentukan menu berdasarkan role user
  const navItems = user?.role === 'admin' ? adminNavItems : karyawanNavItems;
  
  // Tentukan base path berdasarkan role
  const basePath = user?.role === 'admin' ? '/admin' : '/karyawan';
  
  // Tentukan judul role untuk ditampilkan
  const roleTitle = user?.role === 'admin' ? 'Administrator' : 'Karyawan';

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" 
      style={{ 
        backgroundColor: '#1a1a2e',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
        padding: '0.5rem 1rem'
      }}>
      <div className="container-fluid">
        {/* Brand Logo */}
        <Link className="navbar-brand d-flex align-items-center" to={basePath}>
          <div className="bg-gradient p-2 rounded me-2" style={{
            background: 'linear-gradient(135deg, #4e54c8 0%, #8f94fb 100%)'
          }}>
            <i className="bi bi-shield-shaded text-white fs-5"></i>
          </div>
          <span className="fw-bold fs-4 text-white">
            {user?.role === 'admin' ? 'Admin' : 'Karyawan'}
            <span style={{ color: '#8f94fb' }}>Absen</span>
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
            borderColor: 'rgba(255,255,255,0.2)',
            padding: '0.5rem',
            fontSize: '1.25rem'
          }}
        >
          <i className="bi bi-list text-white"></i>
        </button>

        {/* Main Nav Content */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {navItems.map((item) => (
              <li className="nav-item" key={item.path}>
                <Link 
                  className={`nav-link position-relative py-2 py-lg-3 px-2 px-lg-3 ${location.pathname === item.path ? 'active' : ''}`}
                  to={item.path}
                  style={{
                    color: location.pathname === item.path ? '#fff' : 'rgba(255,255,255,0.7)',
                    fontWeight: location.pathname === item.path ? '500' : '400',
                    transition: 'all 0.3s ease',
                    borderRadius: '4px',
                    margin: '0.1rem 0.25rem'
                  }}
                >
                  <i className={`bi ${item.icon} me-1 me-lg-2`}></i>
                  <span className="d-inline d-lg-inline">{item.label}</span>
                  {location.pathname === item.path && (
                    <span className="position-absolute bottom-0 start-50 translate-middle-x bg-gradient" 
                      style={{
                        width: '60%',
                        height: '3px',
                        background: 'linear-gradient(90deg, #8f94fb 0%, #4e54c8 100%)',
                        borderRadius: '3px 3px 0 0'
                      }}>
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* User Dropdown */}
          <div className="d-flex align-items-center ms-lg-2">
            <div className="dropdown">
              <button
                className="btn btn-link text-white dropdown-toggle d-flex align-items-center text-decoration-none p-0"
                type="button"
                id="userDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ outline: 'none', boxShadow: 'none' }}
              >
                <div className="position-relative me-1 me-lg-2">
                  <div className="bg-gradient rounded-circle p-2" style={{
                    background: 'linear-gradient(135deg, #8f94fb 0%, #4e54c8 100%)',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <i className="bi bi-person-circle text-white fs-5"></i>
                  </div>
                  <span className="position-absolute bottom-0 end-0 p-1 bg-success border border-2 border-dark rounded-circle"></span>
                </div>
                <div className="text-start d-none d-lg-block">
                  <div className="fw-semibold text-white" style={{ fontSize: '0.9rem' }}>{user?.name || 'User'}</div>
                  <small className="text-white-50" style={{ fontSize: '0.7rem' }}>{roleTitle}</small>
                </div>
              </button>
              <ul 
                className="dropdown-menu dropdown-menu-end shadow" 
                aria-labelledby="userDropdown"
                style={{
                  minWidth: '280px',
                  backgroundColor: '#16213e',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}
              >
                <li>
                  <div className="d-flex align-items-center px-3 py-3" style={{
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    borderBottom: '1px solid rgba(255,255,255,0.05)'
                  }}>
                    <div className="bg-gradient rounded-circle p-2 me-3" style={{
                      background: 'linear-gradient(135deg, #8f94fb 0%, #4e54c8 100%)',
                      width: '48px',
                      height: '48px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <i className="bi bi-person-circle text-white fs-4"></i>
                    </div>
                    <div>
                      <div className="fw-semibold text-white" style={{ fontSize: '0.95rem' }}>{user?.name || 'User'}</div>
                      <small className="text-white-50 d-block" style={{ fontSize: '0.8rem' }}>{user?.email || 'user@example.com'}</small>
                      <div className="badge bg-primary mt-1" style={{ 
                        fontSize: '0.65rem',
                        background: 'linear-gradient(135deg, #8f94fb 0%, #4e54c8 100%)',
                        border: 'none'
                      }}>
                        {roleTitle}
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <Link className="dropdown-item d-flex align-items-center py-2 px-3 text-white" 
                    to={`${basePath}/profile`}
                    style={{ 
                      transition: 'all 0.2s ease',
                      borderLeft: '3px solid transparent',
                      fontSize: '0.9rem'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                      e.currentTarget.style.borderLeftColor = '#8f94fb';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.borderLeftColor = 'transparent';
                    }}
                  >
                    <i className="bi bi-person me-3" style={{ width: '20px', color: '#8f94fb' }}></i>
                    <span>Profil Saya</span>
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item d-flex align-items-center py-2 px-3 text-white" 
                    to={`${basePath}/settings`}
                    style={{ 
                      transition: 'all 0.2s ease',
                      borderLeft: '3px solid transparent',
                      fontSize: '0.9rem'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                      e.currentTarget.style.borderLeftColor = '#8f94fb';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.borderLeftColor = 'transparent';
                    }}
                  >
                    <i className="bi bi-gear me-3" style={{ width: '20px', color: '#8f94fb' }}></i>
                    <span>Pengaturan</span>
                  </Link>
                </li>
                {user?.role === 'admin' && (
                  <li>
                    <Link className="dropdown-item d-flex align-items-center py-2 px-3 text-white" 
                      to={`${basePath}/notifications`}
                      style={{ 
                        transition: 'all 0.2s ease',
                        borderLeft: '3px solid transparent',
                        fontSize: '0.9rem'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                        e.currentTarget.style.borderLeftColor = '#8f94fb';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.borderLeftColor = 'transparent';
                      }}
                    >
                      <i className="bi bi-bell me-3" style={{ width: '20px', color: '#8f94fb' }}></i>
                      <span>Notifikasi</span>
                      <span className="badge bg-danger ms-auto" style={{ 
                        backgroundColor: '#ff4d4d !important',
                        fontSize: '0.7rem'
                      }}>3</span>
                    </Link>
                  </li>
                )}
                <li><hr className="my-1" style={{ borderColor: 'rgba(255,255,255,0.05)' }} /></li>
                <li>
                  <button 
                    className="dropdown-item d-flex align-items-center py-2 px-3 text-danger"
                    onClick={onLogout}
                    style={{ 
                      transition: 'all 0.2s ease',
                      borderLeft: '3px solid transparent',
                      fontSize: '0.9rem'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 77, 77, 0.1)';
                      e.currentTarget.style.borderLeftColor = '#ff4d4d';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.borderLeftColor = 'transparent';
                    }}
                  >
                    <i className="bi bi-box-arrow-right me-3" style={{ width: '20px' }}></i>
                    <span>Keluar</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}