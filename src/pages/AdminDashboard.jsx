import { Link } from 'react-router-dom';

export default function AdminDashboard() {
const rawUser = localStorage.getItem('user');
const user = rawUser ? JSON.parse(rawUser) : null;

console.log("PC plat", user?.plat); // ✅ Aman walau user null


  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Dashboard Admin</h1>
      <p>Selamat datang, {user?.name}!</p>

      <Link to="/admin/absensi" className="text-blue-600 underline mt-4 inline-block">
        Lihat Data Absensi Semua Karyawan
      </Link>

      <Link to="/admin/statistik" className="text-blue-600 underline block mt-2">
        Lihat Statistik Absensi
      </Link>

      <Link to="/admin/users" className="text-blue-600 underline block mt-2">
        Manajemen User
      </Link>

      <button
        onClick={() => {
          localStorage.clear();
          window.location.href = '/login';
        }}
        className="bg-red-600 text-white px-3 py-1 rounded mt-4"
      >
        Logout
      </button>
    </div>
  );
}

