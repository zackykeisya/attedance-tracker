import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminStatistik() {
  const [data, setData] = useState([]);

  const fetchStatistik = async () => {
    try {
      const res = await axios.get('/absensi/statistik');
      setData(res.data);
    } catch (err) {
      alert('Gagal memuat data statistik.');
    }
  };

  useEffect(() => {
    fetchStatistik();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Statistik Absensi Bulanan</h1>

      <div className="bg-white p-4 rounded shadow-md max-w-3xl">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.reverse()}>
              <XAxis dataKey="bulan" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p>Tidak ada data grafik.</p>
        )}
      </div>
    </div>
  );
}
