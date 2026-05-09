import { useState, useEffect } from 'react';
import { Star, Send, Receipt } from 'lucide-react';
import api from '../api/axios';
import Swal from 'sweetalert2';

interface Product {
  id: number;
  name: string;
}

// Komponen ini bisa menerima "defaultProductId" jika diletakkan di halaman Detail Produk tertentu
const ReviewForm = ({ defaultProductId }: { defaultProductId?: number }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    productId: defaultProductId || '',
    customerName: '',
    rating: 5, // Default bintang 5
    comment: ''
  });

  // Ambil daftar produk untuk pilihan dropdown (jika tidak ada defaultProductId)
  useEffect(() => {
    if (!defaultProductId) {
      const fetchProducts = async () => {
        try {
          const response = await api.get('/products');
          setProducts(response.data);
        } catch (error) {
          console.error("Gagal mengambil produk:", error);
        }
      };
      fetchProducts();
    }
  }, [defaultProductId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.productId) {
      return Swal.fire({ icon: 'warning', title: 'Pilih Produk', text: 'Silakan pilih produk yang ingin diulas.' });
    }

    try {
      setLoading(true);
      // Mengirim data (payload) ke backend
      const response = await api.post('/reviews', {
        invoiceNumber: formData.invoiceNumber,
        productId: Number(formData.productId),
        customerName: formData.customerName,
        rating: formData.rating,
        comment: formData.comment
      });

      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: response.data.message || 'Ulasan Anda telah dikirim dan menunggu moderasi Admin.',
        confirmButtonColor: '#10b981'
      });

      // Reset form setelah berhasil
      setFormData({
        invoiceNumber: '',
        productId: defaultProductId || '',
        customerName: '',
        rating: 5,
        comment: ''
      });
    } catch (error: any) {
      // Menangkap pesan error dari backend (misal: Invoice tidak ditemukan / Belum Selesai)
      const errorMsg = error.response?.data?.message || 'Gagal mengirim ulasan. Pastikan koneksi Anda stabil.';
      Swal.fire({
        icon: 'error',
        title: 'Gagal Mengirim',
        text: errorMsg,
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-slate-800">Tulis Ulasan Anda</h3>
        <p className="text-sm text-slate-500 mt-2">Puas dengan pesanan Anda? Bagikan pengalaman Anda!</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Input Invoice */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
            <Receipt size={16} className="text-blue-500"/> Nomor Invoice
          </label>
          <input 
            type="text" 
            required 
            placeholder="Contoh: INV-123456"
            value={formData.invoiceNumber}
            onChange={(e) => setFormData({...formData, invoiceNumber: e.target.value})}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
          />
          <p className="text-xs text-slate-400 mt-1">Hanya pesanan berstatus SELESAI yang dapat memberi ulasan.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Input Nama */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Nama Anda</label>
            <input 
              type="text" 
              required 
              placeholder="Nama yang akan ditampilkan"
              value={formData.customerName}
              onChange={(e) => setFormData({...formData, customerName: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>

          {/* Pilihan Produk (Sembunyi jika sudah di halaman detail produk) */}
          {!defaultProductId && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Produk yang Diulas</label>
              <select 
                required
                value={formData.productId}
                onChange={(e) => setFormData({...formData, productId: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none bg-white"
              >
                <option value="" disabled>-- Pilih Produk --</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Input Rating Bintang Interaktif */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Penilaian Anda</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setFormData({...formData, rating: star})}
                className="focus:outline-none transform hover:scale-110 transition-transform"
              >
                <Star size={32} className={star <= formData.rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"} />
              </button>
            ))}
          </div>
        </div>

        {/* Input Komentar */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Ceritakan Pengalaman Anda</label>
          <textarea 
            required 
            rows={4}
            placeholder="Bagaimana kualitas bahan, jahitan, atau pelayanannya?"
            value={formData.comment}
            onChange={(e) => setFormData({...formData, comment: e.target.value})}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
          />
        </div>

        {/* Tombol Kirim */}
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors shadow-md flex justify-center items-center gap-2 disabled:bg-slate-400"
        >
          {loading ? 'Mengirim...' : <><Send size={18}/> Kirim Ulasan</>}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;