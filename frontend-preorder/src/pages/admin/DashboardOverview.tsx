import { useState, useEffect } from 'react';
import { Users, ShoppingBag, CreditCard, TrendingUp } from 'lucide-react';
import api from '../../api/axios'; // Pastikan path ini sesuai
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const DashboardOverview = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Mengambil kunci token dari brankas browser
        const token = localStorage.getItem('adminToken');
        
        // Menembak API dengan membawa token
        const response = await api.get('/admin/stats', {
          headers: {
            Authorization: `Bearer ${token}` // Menunjukkan identitas ke Satpam Backend
          }
        });

        setStatsData(response.data.data);
      } catch (error: any) {
        console.error("Gagal mengambil statistik:", error);
        // Jika token kedaluwarsa atau tidak valid, tendang ke login
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('adminToken');
          Swal.fire({
            icon: 'error',
            title: 'Sesi Berakhir',
            text: 'Sesi Anda telah habis. Silakan login kembali.',
            // PERBAIKAN: Menggunakan Tailwind Murni, menghapus Hex Code
            buttonsStyling: false,
            customClass: {
              confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-colors'
            }
          });
          navigate('/admin/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [navigate]);

  const stats = [
    { title: 'Total Pesanan', value: statsData.totalOrders, icon: <ShoppingBag size={24} className="text-blue-500" />, bg: 'bg-blue-100' },
    { title: 'Pesanan Menunggu', value: statsData.pendingOrders, icon: <CreditCard size={24} className="text-amber-500" />, bg: 'bg-amber-100' },
    { title: 'Total Pelanggan', value: statsData.totalCustomers, icon: <Users size={24} className="text-emerald-500" />, bg: 'bg-emerald-100' },
    { title: 'Total Omset', value: `Rp ${statsData.totalRevenue.toLocaleString('id-ID')}`, icon: <TrendingUp size={24} className="text-purple-500" />, bg: 'bg-purple-100' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Kartu Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${stat.bg}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-slate-500 font-semibold mb-1">{stat.title}</p>
              <h3 className="text-2xl font-extrabold text-slate-800">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Bagian Konten Tambahan */}
      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-center py-20 mt-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Pusat Kendali Aktif! 🚀</h2>
        <p className="text-slate-500 max-w-lg mx-auto mb-6">
          Semua data yang Anda lihat di atas adalah data *real-time* langsung dari database MySQL Anda.
        </p>
      </div>
    </div>
  );
};

export default DashboardOverview;