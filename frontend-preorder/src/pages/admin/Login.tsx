import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Lock, User } from 'lucide-react';
import api from '../../api/axios'; // Pastikan path ini benar sesuai struktur Anda

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Menembak API Login di backend Anda
      const response = await api.post('/admin/login', { username, password });
      
      // Mengambil token dari backend
      const { token } = response.data;

      // Menyimpan token ke brankas browser (localStorage)
      localStorage.setItem('adminToken', token);

      // Jika berhasil, arahkan ke Dashboard
      navigate('/admin');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Akses Ditolak',
        text: 'Username atau Password salah!',
        buttonsStyling: false,
        customClass: { confirmButton: 'bg-red-500 text-white font-bold py-2 px-6 rounded-lg' }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
        <div className="bg-slate-900 p-8 text-center">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
            <Lock className="text-emerald-400" size={32} />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Login Admin</h2>
          <p className="text-slate-400 text-sm mt-1">Sistem Manajemen PO UMKM</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <User size={16} className="text-blue-500" /> Username
              </label>
              <input 
                type="text" required 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-slate-50"
                value={username} onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Lock size={16} className="text-blue-500" /> Password
              </label>
              <input 
                type="password" required 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-slate-50"
                value={password} onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-xl font-bold transition-all shadow-md active:scale-[0.98] mt-4"
            >
              {loading ? 'Memverifikasi...' : 'Masuk ke Dashboard'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;