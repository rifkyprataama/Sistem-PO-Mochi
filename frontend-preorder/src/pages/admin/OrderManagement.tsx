import { useState, useEffect } from 'react';
import { ShoppingCart, Eye, CheckCircle, Package, XCircle, Search, MapPin, Phone, Receipt } from 'lucide-react';
import api from '../../api/axios';
import Swal from 'sweetalert2';

interface OrderItem {
  id: number;
  product: { 
    name: string;
    price?: number;
  };
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  invoiceNumber: string;
  customerName: string;
  whatsappNumber: string;
  address: string;
  totalAmount: number;
  status: 'PENDING' | 'DIPROSES' | 'SELESAI' | 'DIBATALKAN';
  proofImage: string | null;
  createdAt: string;
  items: OrderItem[];
}

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State untuk Modal Detail Pesanan
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      // Menembak endpoint pesanan admin (nanti kita pastikan backendnya siap)
      const response = await api.get('/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Gagal mengambil data pesanan:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Fungsi untuk memperbarui status pesanan
  const handleUpdateStatus = async (orderId: number, newStatus: string, invoice: string) => {
    const token = localStorage.getItem('adminToken');
    
    const result = await Swal.fire({
      title: 'Ubah Status Pesanan?',
      text: `Anda akan mengubah status Invoice ${invoice} menjadi ${newStatus}.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, Ubah!',
      cancelButtonText: 'Batal',
      reverseButtons: true,
      buttonsStyling: false,
      customClass: {
        confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg ml-3',
        cancelButton: 'bg-slate-400 hover:bg-slate-500 text-white font-bold py-2 px-6 rounded-lg'
      }
    });

    if (result.isConfirmed) {
      try {
        await api.put(`/orders/${orderId}/status`, { status: newStatus }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        Swal.fire({
          icon: 'success', title: 'Berhasil!', text: 'Status pesanan telah diperbarui.',
          buttonsStyling: false, customClass: { confirmButton: 'bg-emerald-500 text-white font-bold py-2 px-6 rounded-lg' }
        });
        fetchOrders();
        setSelectedOrder(null); // Tutup modal jika sedang terbuka
      } catch (error) {
        Swal.fire({
          icon: 'error', title: 'Gagal', text: 'Terjadi kesalahan saat memperbarui status.',
          buttonsStyling: false, customClass: { confirmButton: 'bg-red-500 text-white font-bold py-2 px-6 rounded-lg' }
        });
      }
    }
  };

  // Fungsi untuk melihat bukti transfer menggunakan SweetAlert2
  const handleViewProof = (imageUrl: string | null) => {
    if (!imageUrl) {
      return Swal.fire({
        icon: 'info', title: 'Belum Ada Bukti', text: 'Pelanggan belum mengunggah bukti pembayaran.',
        buttonsStyling: false, customClass: { confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg' }
      });
    }
    
    // PERBAIKAN: Gabungkan dengan alamat URL Backend Anda (Port 5000)
    const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `http://localhost:5000${imageUrl}`;
    
    Swal.fire({
      title: 'Bukti Pembayaran',
      imageUrl: fullImageUrl,
      imageAlt: 'Bukti Transfer',
      buttonsStyling: false,
      customClass: { 
        image: 'rounded-xl max-h-[70vh] object-contain shadow-md', 
        confirmButton: 'bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 px-6 rounded-lg mt-4 transition-colors' 
      },
      confirmButtonText: 'Tutup'
    });
  };

  // Filter pencarian
  const filteredOrders = orders.filter(o => 
    o.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><ShoppingCart className="text-blue-500"/> Manajemen Pesanan</h2>
          <p className="text-sm text-slate-500">Pantau pesanan masuk, verifikasi pembayaran, dan perbarui status pengiriman.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <input 
            type="text" 
            placeholder="Cari Invoice / Nama..." 
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none bg-slate-50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search size={18} className="absolute left-3 top-2.5 text-slate-400" />
        </div>
      </div>

      {/* TABEL PESANAN */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-sm border-b border-slate-200">
                <th className="p-4 font-semibold">Invoice & Tanggal</th>
                <th className="p-4 font-semibold">Pelanggan</th>
                <th className="p-4 font-semibold">Total Nilai</th>
                <th className="p-4 font-semibold text-center">Status</th>
                <th className="p-4 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div></td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-slate-500">Tidak ada pesanan ditemukan.</td></tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-slate-800">{order.invoiceNumber}</p>
                      <p className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-slate-700">{order.customerName}</p>
                      <p className="text-xs text-slate-500">{order.whatsappNumber}</p>
                    </td>
                    <td className="p-4 font-bold text-emerald-600">Rp {order.totalAmount.toLocaleString('id-ID')}</td>
                    <td className="p-4 text-center">
                      {order.status === 'PENDING' && <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">Menunggu</span>}
                      {order.status === 'DIPROSES' && <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">Diproses</span>}
                      {order.status === 'SELESAI' && <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">Selesai</span>}
                      {order.status === 'DIBATALKAN' && <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">Dibatalkan</span>}
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => setSelectedOrder(order)} 
                        className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 mx-auto"
                      >
                        <Eye size={16} /> Detail
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DETAIL PESANAN (Tampil jika tombol Detail diklik) */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Header Modal */}
            <div className="bg-slate-50 p-6 border-b border-slate-200 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Detail Pesanan</h3>
                <p className="text-sm font-mono tracking-wider text-slate-500">{selectedOrder.invoiceNumber}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-red-500 transition-colors p-2"><XCircle size={28} /></button>
            </div>

            {/* Konten Modal (Bisa di-scroll) */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Pelanggan</p>
                  <p className="font-semibold text-slate-800">{selectedOrder.customerName}</p>
                  <a 
                    href={`https://wa.me/${selectedOrder.whatsappNumber.startsWith('0') ? '62' + selectedOrder.whatsappNumber.substring(1) : selectedOrder.whatsappNumber}?text=Halo%20kak%20${selectedOrder.customerName},%20saya%20admin%20toko.%20Ingin%20menginfokan%20pesanan%20PO%20dengan%20Invoice%20*${selectedOrder.invoiceNumber}*%20sudah%20selesai%20diproses.%20Total%20sisa%20pelunasan%20adalah%20*Rp%20${(selectedOrder.totalAmount / 2).toLocaleString('id-ID')}*.`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-2 bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Phone size={12}/> Hubungi via WA untuk Pelunasan
                  </a>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Alamat Pengiriman</p>
                  <p className="text-sm text-slate-600 flex items-start gap-1 mt-1"><MapPin size={14} className="min-w-[14px] mt-0.5 text-red-400"/> {selectedOrder.address}</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2 flex items-center gap-2"><Package size={18} className="text-blue-500"/> Produk Dipesan</h4>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <p className="font-semibold text-slate-700">
                        {/* Membaca nama produk dengan aman */}
                        {item.product?.name || 'Produk Tidak Diketahui'} 
                        <span className="text-slate-400 font-normal ml-1">x{item.quantity}</span>
                      </p>
                      <p className="font-bold text-slate-800">
                        {/* PERBAIKAN: Ambil harga dari OrderItem atau langsung dari Product */}
                        Rp {((item.price || item.product?.price || 0) * item.quantity).toLocaleString('id-ID')}
                      </p>
                    </div>
                  ))}
                  {/* RINCIAN KEUANGAN PO */}
                  <div className="pt-4 mt-4 border-t border-slate-200 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <p className="font-semibold text-slate-600">Total Harga Keseluruhan</p>
                      <p className="font-bold text-slate-800">Rp {selectedOrder.totalAmount.toLocaleString('id-ID')}</p>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
                      <p className="font-bold text-blue-800">DP Wajib Dibayar (50%)</p>
                      <p className="font-bold text-blue-800">Rp {(selectedOrder.totalAmount / 2).toLocaleString('id-ID')}</p>
                    </div>

                    <div className="flex justify-between items-center text-sm bg-amber-50 px-3 py-2 rounded-lg border border-amber-100">
                      <p className="font-bold text-amber-800">Sisa Pelunasan</p>
                      <p className="font-bold text-amber-800">Rp {(selectedOrder.totalAmount / 2).toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex justify-between items-center">
                <div>
                  <p className="font-bold text-blue-800">Bukti Pembayaran (DP)</p>
                  <p className="text-xs text-blue-600">Pelanggan harus melampirkan foto struk.</p>
                </div>
                <button 
                  onClick={() => handleViewProof(selectedOrder.proofImage)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
                >
                  <Receipt size={16} /> Cek Struk
                </button>
              </div>

            </div>

            {/* Footer Modal (Aksi) */}
            <div className="p-6 border-t border-slate-200 bg-slate-50 flex flex-wrap gap-3 justify-end">
              {selectedOrder.status === 'PENDING' && (
                <>
                  <button onClick={() => handleUpdateStatus(selectedOrder.id, 'DIBATALKAN', selectedOrder.invoiceNumber)} className="bg-red-100 hover:bg-red-200 text-red-700 px-6 py-2.5 rounded-xl font-bold transition-colors">Tolak/Batal</button>
                  <button onClick={() => handleUpdateStatus(selectedOrder.id, 'DIPROSES', selectedOrder.invoiceNumber)} className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-md">
                    <CheckCircle size={18} /> Verifikasi & Proses
                  </button>
                </>
              )}
              {selectedOrder.status === 'DIPROSES' && (
                <button onClick={() => handleUpdateStatus(selectedOrder.id, 'SELESAI', selectedOrder.invoiceNumber)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-md w-full sm:w-auto">
                  <Package size={18} /> Tandai Pesanan Selesai
                </button>
              )}
              {(selectedOrder.status === 'SELESAI' || selectedOrder.status === 'DIBATALKAN') && (
                <p className="text-sm font-bold text-slate-500 bg-slate-200 px-6 py-2.5 rounded-xl">Pesanan {selectedOrder.status.toLowerCase()}</p>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default OrderManagement;