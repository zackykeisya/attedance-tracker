import { useEffect, useState } from 'react';
import axios from '../api/axios';

export default function KaryawanRiwayat() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const rawUser = localStorage.getItem('user');
const user = rawUser ? JSON.parse(rawUser) : null;

console.log("PC plat", user?.plat); // ✅ Aman walau user null


  const fetchRiwayat = async () => {
    try {
      const res = await axios.get('/absensi/history');
      setData(res.data);
    } catch (err) {
      alert('Gagal memuat riwayat absensi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiwayat();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Riwayat Absensi Saya</h1>

      {loading ? (
        <p>Memuat data...</p>
      ) : data.length === 0 ? (
        <p>Tidak ada data absensi.</p>
      ) : (
        <table className="w-full border border-gray-300 text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Tanggal</th>
              <th className="p-2 border">Clock In</th>
              <th className="p-2 border">Clock Out</th>
            </tr>
          </thead>
          <tbody>
            {data.map((absen) => (
              <tr key={absen.id}>
                <td className="p-2 border">{absen.date}</td>
                <td className="p-2 border">{absen.clock_in || '-'}</td>
                <td className="p-2 border">{absen.clock_out || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
