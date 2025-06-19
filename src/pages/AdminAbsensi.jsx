import { useEffect, useState } from 'react';
import axios from '../api/axios';

export default function AdminAbsensi() {
  const [data, setData] = useState([]);
  const [filterUser, setFilterUser] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const query = filterUser ? `?user_id=${filterUser}` : '';
      const res = await axios.get(`/absensi${query}`);
      setData(res.data);
    } catch (err) {
      alert('Gagal memuat data absensi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterUser]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Data Absensi Semua Karyawan</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter by user_id (opsional)"
          value={filterUser}
          onChange={(e) => setFilterUser(e.target.value)}
          className="border px-2 py-1 rounded"
        />
      </div>

      <a
        href="http://localhost:8000/absensi/export/excel"
        target="_blank"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 inline-block mb-4"
      >
        Export Excel
      </a>

      {loading ? (
        <p>Memuat data...</p>
      ) : (
        <table className="w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Nama</th>
              <th className="p-2 border">Tanggal</th>
              <th className="p-2 border">Clock In</th>
              <th className="p-2 border">Clock Out</th>
            </tr>
          </thead>
          <tbody>
            {data.map((absen) => (
              <tr key={absen.id}>
                <td className="p-2 border">{absen.user?.name}</td>
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

