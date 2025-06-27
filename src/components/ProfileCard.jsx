import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function ProfileCard({ user }) {
  if (!user) return null;

  const roleTitle = user.role === 'admin' ? 'Administrator' : 'Employee';
  const gradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  const adminGradient = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
  const statusColors = {
    active: 'bg-success',
    inactive: 'bg-secondary',
    pending: 'bg-warning',
    vacation: 'bg-info'
  };

  return (
    <div className="card border-0 mb-4 hover-lift" style={{
      borderRadius: '15px',
      overflow: 'hidden',
      boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
      transition: 'all 0.3s ease',
      background: 'rgba(255,255,255,0.8)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.2)'
    }}>
      {/* Glass morphism header with gradient */}
      <div className="card-header p-0 position-relative" style={{
        height: '120px',
        background: user.role === 'admin' ? adminGradient : gradient,
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 100%)'
        }}></div>
      </div>
      
      {/* Profile content with glass effect */}
      <div className="card-body d-flex flex-column align-items-center position-relative" style={{
        marginTop: '-60px',
        paddingBottom: '1rem'
      }}>
        {/* Status indicator */}
        <div className="position-absolute top-0 end-0 mt-3 me-3">
          <span className={`badge rounded-pill ${statusColors[user.status] || 'bg-secondary'} p-2`} style={{
            boxShadow: '0 0 0 3px rgba(255,255,255,0.8)'
          }}>
            <span className="visually-hidden">{user.status}</span>
          </span>
        </div>

        {/* Avatar with glass border */}
        <div
          className="rounded-circle d-flex align-items-center justify-content-center mb-3 shadow-lg"
          style={{
            width: '120px',
            height: '120px',
            background: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(5px)',
            border: '4px solid rgba(255,255,255,0.5)',
            boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
          }}
        >
          {user.avatar ? (
            <img 
              src={user.avatar} 
              alt="Profile" 
              className="rounded-circle w-100 h-100 object-fit-cover"
              style={{
                border: '2px solid rgba(255,255,255,0.8)'
              }}
            />
          ) : (
            <i className="bi bi-person-circle fs-1" style={{
              color: user.role === 'admin' ? '#f5576c' : '#764ba2',
              opacity: 0.8
            }}></i>
          )}
        </div>
        
        {/* User info */}
        <h5 className="fw-bold mb-1 text-center" style={{ color: '#2c3e50' }}>{user.name}</h5>
        
        {/* Role badge with gradient */}
        <span
          className="badge text-white mt-2 fw-normal d-flex align-items-center"
          style={{
            background: user.role === 'admin' ? adminGradient : gradient,
            fontSize: '0.85rem',
            padding: '0.5rem 1.25rem',
            borderRadius: '50px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}
        >
          <i className={`bi ${user.role === 'admin' ? 'bi-shield-lock' : 'bi-person'} me-2`}></i>
          {roleTitle}
        </span>
        
        {/* Details with icons */}
        <div className="w-100 mt-4" style={{ maxWidth: '250px' }}>
          <div className="d-flex align-items-center mb-2">
            <div className="icon-container me-3">
              <i className="bi bi-envelope" style={{ color: '#667eea' }}></i>
            </div>
            <span className="text-muted small text-truncate">{user.email}</span>
          </div>
          
          {user.department && (
            <div className="d-flex align-items-center mb-2">
              <div className="icon-container me-3">
                <i className="bi bi-building" style={{ color: '#667eea' }}></i>
              </div>
              <span className="text-muted small">{user.department}</span>
            </div>
          )}
          
          {user.position && (
            <div className="d-flex align-items-center mb-2">
              <div className="icon-container me-3">
                <i className="bi bi-briefcase" style={{ color: '#667eea' }}></i>
              </div>
              <span className="text-muted small">{user.position}</span>
            </div>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="d-flex mt-4">
          <button className="btn btn-sm btn-pill mx-1 btn-edit">
            <i className="bi bi-pencil-square me-1"></i>
            Edit
          </button>
          <button className="btn btn-sm btn-pill mx-1 btn-message">
            <i className="bi bi-chat-left-text me-1"></i>
            Message
          </button>
        </div>
      </div>
      
      {/* Footer with join date */}
      <div className="card-footer bg-transparent text-center py-3 border-top-0" style={{
        background: 'rgba(255,255,255,0.5)',
        backdropFilter: 'blur(5px)'
      }}>
        <small className="text-muted d-flex align-items-center justify-content-center">
          <i className="bi bi-calendar-check me-2" style={{ color: '#667eea' }}></i>
          Joined {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
        </small>
      </div>

      {/* Custom styles */}
      <style jsx>{`
        .hover-lift:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.12);
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
        
        .btn-pill {
          border-radius: 50px;
          padding: 0.375rem 1rem;
          transition: all 0.3s ease;
          border-width: 1px;
          border-style: solid;
        }
        
        .btn-edit {
          background: rgba(255,255,255,0.7);
          border-color: rgba(0,0,0,0.1);
          color: #6c757d;
        }
        
        .btn-edit:hover {
          background: rgba(248,249,250,0.9);
          color: #495057;
        }
        
        .btn-message {
          background: rgba(102, 126, 234, 0.1);
          border-color: rgba(102, 126, 234, 0.2);
          color: #667eea;
        }
        
        .btn-message:hover {
          background: rgba(102, 126, 234, 0.2);
          color: #5a6fd1;
        }
      `}</style>
    </div>
  );
}   