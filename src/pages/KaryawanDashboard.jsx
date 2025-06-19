import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';

export default function KaryawanDashboard() {
const rawUser = localStorage.getItem('user');
const user = rawUser ? JSON.parse(rawUser) : null;

console.log("PC plat", user?.plat); // ✅ Aman walau user null

  const [absenToday, setAbsenToday] = useState(null);
  const [loading, setLoading] = useState(false);

  // Ambil data absensi hari ini
  const fetchToday = async () => {
    try {
      const res = await axios.get('/absensi/today');
      setAbsenToday(res.data);
    } catch (err) {
      setAbsenToday(null);
    }
  };

  const handleClockIn = async () => {
    setLoading(true);
    try {
      await axios.post('/absensi/clock-in');
      await fetchToday();
    } catch (err) {
      alert('Clock-in gagal!');
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    setLoading(true);
    try {
      await axios.post('/absensi/clock-out');
      await fetchToday();
    } catch (err) {
      alert('Clock-out gagal!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchToday();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Dashboard Karyawan</h1>
          <div>
            <Link to="/karyawan/riwayat" className="text-blue-600 hover:underline mr-4">Riwayat Absensi</Link>
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
        </div>
      </nav>
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Dashboard Karyawan</h1>
      <p>Selamat datang, <b>{user?.name}</b>!</p>

      <div className="mt-6 p-4 bg-gray-100 rounded shadow-md w-full max-w-md">
        <h2 className="text-lg font-semibold mb-2">Absensi Hari Ini</h2>
        <p><b>Tanggal:</b> {new Date().toLocaleDateString()}</p>
        <p><b>Clock In:</b> {absenToday?.clock_in || '-'}</p>
        <p><b>Clock Out:</b> {absenToday?.clock_out || '-'}</p>

        <div className="mt-4 flex gap-3">
          {!absenToday?.clock_in && (
            <button
              onClick={handleClockIn}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              disabled={loading}
            >
              Clock In
            </button>
          )}

          {absenToday?.clock_in && !absenToday?.clock_out && (
            <button
              onClick={handleClockOut}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              disabled={loading}
            >
              Clock Out
            </button>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
