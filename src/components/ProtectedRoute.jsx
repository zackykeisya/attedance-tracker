import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, role }) {
const token = localStorage.getItem('token');
const rawUser = localStorage.getItem('user');
const user = rawUser ? JSON.parse(rawUser) : null;

if (!token || !user) {
  return <Navigate to="/login" />;
}


  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
}
