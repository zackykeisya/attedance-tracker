import { useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="mt-auto position-relative overflow-hidden bg-dark text-white">
      {/* Animated background elements */}
      <div className="position-absolute top-0 start-0 w-100 h-100" style={{
        background: 'linear-gradient(135deg, rgba(30, 33, 64, 0.8) 0%, rgba(19, 20, 38, 0.95) 100%)',
        zIndex: -2
      }}>
        <div className="position-absolute top-50 start-10 translate-middle" style={{
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(142, 148, 251, 0.15) 0%, transparent 70%)',
          borderRadius: '50%'
        }}></div>
        <div className="position-absolute top-20 start-80 translate-middle" style={{
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(78, 84, 200, 0.1) 0%, transparent 70%)',
          borderRadius: '50%'
        }}></div>
      </div>

      {/* Glass overlay */}
      <div className="position-absolute top-0 start-0 w-100 h-100" style={{
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(15, 15, 26, 0.7)',
        zIndex: -1
      }}></div>

      <div className="container-fluid py-5 position-relative">
        <div className="row g-4">
          {/* Brand info */}
          <div className="col-lg-4">
            <div className="d-flex align-items-center mb-3">
              <div className="bg-gradient p-2 rounded me-3" style={{
                background: 'linear-gradient(135deg, #8f94fb 0%, #4e54c8 100%)'
              }}>
                <i className="bi bi-shield-shaded text-white fs-4"></i>
              </div>
              <h3 className="text-white mb-0">Attendance<span className="text-gradient">Pro</span></h3>
            </div>
            <p className="text-white-50 mb-4" style={{ maxWidth: '300px' }}>
              The ultimate employee management system with advanced analytics and real-time monitoring.
            </p>
            
            {/* Newsletter subscription */}
            <div className="mb-4">
              <h6 className="text-white mb-3">Stay Updated</h6>
              {subscribed ? (
                <div className="alert alert-success py-2">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  Thank you for subscribing!
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="d-flex">
                  <input
                    type="email"
                    className="form-control form-control-sm bg-dark border-dark text-white"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                      borderTopRightRadius: '0',
                      borderBottomRightRadius: '0'
                    }}
                  />
                  <button 
                    className="btn btn-gradient btn-sm" 
                    type="submit"
                    style={{
                      borderTopLeftRadius: '0',
                      borderBottomLeftRadius: '0'
                    }}
                  >
                    <i className="bi bi-send"></i>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Quick links */}
          <div className="col-lg-2 col-md-4">
            <h6 className="text-white mb-3">Navigation</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-white-50 hover-text-gradient text-decoration-none d-flex align-items-center">
                  <i className="bi bi-chevron-right me-2 small"></i>
                  Dashboard
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-white-50 hover-text-gradient text-decoration-none d-flex align-items-center">
                  <i className="bi bi-chevron-right me-2 small"></i>
                  Employee Management
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-white-50 hover-text-gradient text-decoration-none d-flex align-items-center">
                  <i className="bi bi-chevron-right me-2 small"></i>
                  Attendance
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-white-50 hover-text-gradient text-decoration-none d-flex align-items-center">
                  <i className="bi bi-chevron-right me-2 small"></i>
                  Analytics
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-lg-2 col-md-4">
            <h6 className="text-white mb-3">Legal</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-white-50 hover-text-gradient text-decoration-none d-flex align-items-center">
                  <i className="bi bi-chevron-right me-2 small"></i>
                  Privacy Policy
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-white-50 hover-text-gradient text-decoration-none d-flex align-items-center">
                  <i className="bi bi-chevron-right me-2 small"></i>
                  Terms of Service
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-white-50 hover-text-gradient text-decoration-none d-flex align-items-center">
                  <i className="bi bi-chevron-right me-2 small"></i>
                  Cookies
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-white-50 hover-text-gradient text-decoration-none d-flex align-items-center">
                  <i className="bi bi-chevron-right me-2 small"></i>
                  Licenses
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-lg-4 col-md-4">
            <h6 className="text-white mb-3">Contact Us</h6>
            <ul className="list-unstyled">
              <li className="mb-3 d-flex align-items-center">
                <i className="bi bi-geo-alt text-gradient me-3"></i>
                <span className="text-white-50">123 Business Ave, Tech City</span>
              </li>
              <li className="mb-3 d-flex align-items-center">
                <i className="bi bi-telephone text-gradient me-3"></i>
                <span className="text-white-50">+1 (555) 123-4567</span>
              </li>
              <li className="mb-3 d-flex align-items-center">
                <i className="bi bi-envelope text-gradient me-3"></i>
                <span className="text-white-50">support@attendancepro.com</span>
              </li>
            </ul>

            <div className="d-flex mt-4">
              <a href="#" className="btn btn-icon btn-dark me-2 rounded-circle">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="btn btn-icon btn-dark me-2 rounded-circle">
                <i className="bi bi-twitter-x"></i>
              </a>
              <a href="#" className="btn btn-icon btn-dark me-2 rounded-circle">
                <i className="bi bi-linkedin"></i>
              </a>
              <a href="#" className="btn btn-icon btn-dark rounded-circle">
                <i className="bi bi-github"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="row mt-5 pt-3 border-top border-light">
          <div className="col-md-6 text-center text-md-start">
            <p className="mb-0 text-white-50">
              &copy; {new Date().getFullYear()} AttendancePro. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <div className="d-inline-flex">
              <span className="badge bg-light text-dark me-2 border border-dark">
                <i className="bi bi-shield-lock me-1"></i> Secure
              </span>
              <span className="badge bg-light text-dark border border-dark">
                v2.1.0
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS in JS for unique effects */}
      <style>
        {`
          .hover-text-gradient:hover {
            background: linear-gradient(to right, #ff0000, #00ff00);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        `}
      </style>
    </footer>
  );
}