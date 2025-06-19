import { useEffect, useState } from 'react';
import axios from '../api/axios';

export default function AdminUserList() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'karyawan' });
  const [editId, setEditId] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/users');
      setUsers(res.data);
    } catch (err) {
      alert('Gagal memuat data user.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`/users/${editId}`, form);
      } else {
        await axios.post('/users', form);
      }
      setForm({ name: '', email: '', password: '', role: 'karyawan' });
      setEditId(null);
      fetchUsers();
    } catch (err) {
      alert('Gagal menyimpan data.');
    }
  };

  const handleEdit = (user) => {
    setForm({ name: user?.name, email: user?.email, password: '', role: user?.role });
    setEditId(user?.id);
  };

  const handleDelete = async (id) => {
    if (confirm('Hapus user ini?')) {
      await axios.delete(`/users/${id}`);
      fetchUsers();
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Manajemen User</h1>

      <form onSubmit={handleSubmit} className="mb-6 bg-gray-100 p-4 rounded shadow-md max-w-md">
        <h2 className="font-semibold mb-2">{editId ? 'Edit User' : 'Tambah User'}</h2>
        <input
          type="text"
          placeholder="Nama"
          className="w-full p-2 mb-2 border rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-2 border rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-2 border rounded"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required={!editId}
        />
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
        >
          <option value="karyawan">Karyawan</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {editId ? 'Update' : 'Tambah'}
        </button>
      </form>

      <table className="w-full border border-gray-300 text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">Nama</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td className="p-2 border">{u.name}</td>
              <td className="p-2 border">{u.email}</td>
              <td className="p-2 border">{u.role}</td>
              <td className="p-2 border space-x-2">
                <button onClick={() => handleEdit(u)} className="text-blue-600">Edit</button>
                <button onClick={() => handleDelete(u.id)} className="text-red-600">Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
