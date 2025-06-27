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
    <footer className="mt-auto position-relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      borderTop: '1px solid rgba(0,0,0,0.05)'
    }}>
      {/* Decorative elements */}
      <div className="position-absolute top-0 start-0 w-100 h-100" style={{
        zIndex: 0,
        opacity: 0.05,
        backgroundImage: 'radial-gradient(circle at 25% 25%, #6c757d 0%, transparent 50%)'
      }}></div>

      {/* Main content */}
      <div className="container py-5 position-relative" style={{ zIndex: 1 }}>
        <div className="row g-4">
          {/* Brand info */}
          <div className="col-lg-4 pe-lg-5">
            <div className="d-flex align-items-center mb-4">
              <div className="p-2 rounded me-3" style={{
                background: 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0,0,0,0.05)'
              }}>
                <i className="bi bi-shield-lock text-primary fs-4"></i>
              </div>
              <h3 className="mb-0 fw-bold" style={{ color: '#212529' }}>
                <span className="text-primary">Attend</span>Pro
              </h3>
            </div>
            <p className="text-secondary mb-4">
              Advanced workforce management solution with real-time analytics and AI-powered insights.
            </p>
            
            {/* Newsletter */}
            <div className="mb-4">
              <h6 className="mb-3 fw-semibold" style={{ color: '#495057' }}>Get Updates</h6>
              {subscribed ? (
                <div className="alert bg-white py-2 px-3 d-inline-flex align-items-center" style={{
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(0,0,0,0.05)',
                  borderRadius: '8px'
                }}>
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  <span className="small">Subscribed successfully!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="d-flex position-relative">
                  <input
                    type="email"
                    className="form-control ps-3 pe-4"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                      background: 'rgba(255,255,255,0.7)',
                      backdropFilter: 'blur(5px)',
                      border: '1px solid rgba(0,0,0,0.1)',
                      height: '42px',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.03)'
                    }}
                  />
                  <div className="position-absolute top-0 end-0 h-100 d-flex align-items-center pe-3 text-secondary">
                    <i className="bi bi-envelope"></i>
                  </div>
                  <button 
                    className="btn btn-primary px-3 ms-2 d-flex align-items-center"
                    type="submit"
                    style={{
                      border: 'none',
                      boxShadow: '0 2px 10px rgba(0,123,255,0.2)'
                    }}
                  >
                    <i className="bi bi-send-fill"></i>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Quick links */}
          <div className="col-lg-2 col-md-4">
            <h6 className="mb-3 fw-semibold" style={{ color: '#495057' }}>Quick Links</h6>
            <ul className="list-unstyled">
              {['Dashboard', 'Employees', 'Attendance', 'Reports'].map((item, index) => (
                <li key={index} className="mb-2">
                  <a href="#" className="text-secondary text-decoration-none d-flex align-items-center transition">
                    <span className="text-primary me-2">▹</span>
                    <span>{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="col-lg-2 col-md-4">
            <h6 className="mb-3 fw-semibold" style={{ color: '#495057' }}>Resources</h6>
            <ul className="list-unstyled">
              {[
                { icon: 'file-earmark-text', text: 'Documentation' },
                { icon: 'journal-code', text: 'API Reference' },
                { icon: 'question-circle', text: 'Help Center' },
                { icon: 'box-arrow-up-right', text: 'Status' }
              ].map((item, index) => (
                <li key={index} className="mb-2">
                  <a href="#" className="text-secondary text-decoration-none d-flex align-items-center transition">
                    <i className={`bi bi-${item.icon} text-primary me-2 icon-hover`}></i>
                    <span>{item.text}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-lg-4 col-md-4">
            <h6 className="mb-3 fw-semibold" style={{ color: '#495057' }}>Connect</h6>
            <div className="p-4 mb-4" style={{
              background: 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(10px)',
              borderRadius: '8px',
              border: '1px solid rgba(0,0,0,0.05)',
              boxShadow: '0 8px 20px rgba(0,0,0,0.03)'
            }}>
              <ul className="list-unstyled mb-0">
                <li className="mb-3 d-flex align-items-start">
                  <i className="bi bi-geo-alt text-primary mt-1 me-3"></i>
                  <div>
                    <span className="d-block" style={{ color: '#212529' }}>HQ</span>
                    <span className="text-secondary small">123 Tech Park, Silicon Valley</span>
                  </div>
                </li>
                <li className="mb-3 d-flex align-items-center">
                  <i className="bi bi-telephone text-primary me-3"></i>
                  <span className="text-secondary">+1 (555) 123-4567</span>
                </li>
                <li className="d-flex align-items-center">
                  <i className="bi bi-envelope text-primary me-3"></i>
                  <span className="text-secondary">support@attendpro.com</span>
                </li>
              </ul>
            </div>

            {/* Social links */}
            <div className="d-flex">
              {['twitter-x', 'linkedin', 'github', 'discord'].map((icon, index) => (
                <a 
                  key={index} 
                  href="#" 
                  className="btn btn-icon me-2 rounded-circle social-icon"
                  style={{
                    width: '36px',
                    height: '36px',
                    background: 'rgba(255,255,255,0.7)',
                    backdropFilter: 'blur(5px)',
                    border: '1px solid rgba(0,0,0,0.05)',
                    color: '#495057'
                  }}
                >
                  <i className={`bi bi-${icon}`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="row mt-5 pt-4">
          <div className="col-12 position-relative">
            <div className="divider-line" style={{
              height: '1px',
              background: 'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.05) 50%, transparent 100%)',
              marginBottom: '1.5rem'
            }}></div>
          </div>
          <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
            <p className="text-secondary small mb-0">
              &copy; {new Date().getFullYear()} <span style={{ color: '#212529' }}>AttendPro Systems</span>. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <div className="d-flex justify-content-center justify-content-md-end gap-3">
              {['Privacy Policy', 'Terms of Service', 'Cookies'].map((item, index) => (
                <a 
                  key={index} 
                  href="#" 
                  className="text-secondary small hover-primary transition"
                  style={{ textDecoration: 'none' }}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        .transition {
          transition: all 0.3s ease;
        }
        
        .hover-primary:hover {
          color: var(--bs-primary) !important;
        }
        
        .icon-hover {
          transition: all 0.3s ease;
        }
        
        .icon-hover:hover {
          transform: scale(1.2);
        }
        
        .social-icon {
          transition: all 0.3s ease;
        }
        
        .social-icon:hover {
          transform: translateY(-2px);
          background: rgba(255,255,255,0.9) !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          color: var(--bs-primary) !important;
        }
      `}</style>
    </footer>
  );
}