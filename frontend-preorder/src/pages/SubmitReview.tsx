import { useState } from 'react';
import api from '../api/axios';
import { Star, MessageSquare, User, Hash, Send } from 'lucide-react';

const SubmitReview = () => {
  const [formData, setFormData] = useState({
    productId: '',
    customerName: '',
    rating: 5,
    comment: ''
  });
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/reviews', {
        productId: Number(formData.productId),
        customerName: formData.customerName,
        rating: Number(formData.rating),
        comment: formData.comment
      });
      setIsSuccess(true);
      // Reset form setelah sukses
      setFormData({ productId: '', customerName: '', rating: 5, comment: '' });
    } catch (error) {
      console.error("Gagal mengirim ulasan:", error);
      alert("Gagal mengirim ulasan.");
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-12">
        <div className="bg-emerald-100 text-emerald-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Star size={40} fill="currentColor" />
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Terima Kasih!</h3>
        <p className="text-slate-600 mb-6">Ulasan Anda sangat berarti bagi kami dan sedang menunggu moderasi Admin.</p>
        <button onClick={() => setIsSuccess(false)} className="text-blue-600 hover:underline font-semibold">
          Kirim ulasan lainnya
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <p className="text-slate-500 text-center mb-8">Bagaimana pengalaman Anda membeli produk kami? Bagikan pendapat Anda!</p>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input ID Produk */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Hash size={16} className="text-blue-500" /> ID Produk
            </label>
            <input 
              type="number" required 
              placeholder="Contoh: 1"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-slate-50"
              value={formData.productId} onChange={(e) => setFormData({...formData, productId: e.target.value})} 
            />
          </div>

          {/* Input Nama */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <User size={16} className="text-blue-500" /> Nama Anda
            </label>
            <input 
              type="text" required 
              placeholder="Masukkan nama Anda"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-slate-50"
              value={formData.customerName} onChange={(e) => setFormData({...formData, customerName: e.target.value})} 
            />
          </div>
        </div>

        {/* Input Rating */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Star size={16} className="text-amber-500" /> Rating (Bintang)
          </label>
          <div className="relative">
            <select 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all bg-slate-50 appearance-none font-medium"
              value={formData.rating} onChange={(e) => setFormData({...formData, rating: Number(e.target.value)})}
            >
              <option value={5}>⭐⭐⭐⭐⭐ (Sangat Bagus)</option>
              <option value={4}>⭐⭐⭐⭐ (Bagus)</option>
              <option value={3}>⭐⭐⭐ (Cukup)</option>
              <option value={2}>⭐⭐ (Kurang)</option>
              <option value={1}>⭐ (Sangat Kurang)</option>
            </select>
          </div>
        </div>

        {/* Input Komentar */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <MessageSquare size={16} className="text-blue-500" /> Komentar
          </label>
          <textarea 
            required 
            placeholder="Ceritakan pengalaman Anda dengan produk ini..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-slate-50 min-h-[120px] resize-y"
            value={formData.comment} onChange={(e) => setFormData({...formData, comment: e.target.value})} 
          />
        </div>

        <button 
          type="submit" disabled={loading} 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all shadow-md active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <><Send size={20} /> Kirim Ulasan Sekarang</>
          )}
        </button>
      </form>
    </div>
  );
};

export default SubmitReview;