import { useState, useEffect } from 'react';
import { MessageSquare, Star, Trash2, Eye, EyeOff } from 'lucide-react';
import api from '../../api/axios';
import Swal from 'sweetalert2';

interface Review {
  id: number;
  productId: number;
  customerName: string;
  rating: number;
  comment: string;
  isPublished: boolean;
  createdAt: string;
  product?: {
    name: string;
  };
}

const ReviewManagement = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await api.get('/reviews', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviews(response.data);
    } catch (error) {
      console.error("Gagal mengambil data ulasan:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Fungsi untuk menyembunyikan/menampilkan ulasan
  const handleTogglePublish = async (id: number, currentStatus: boolean) => {
    const token = localStorage.getItem('adminToken');
    const newStatus = !currentStatus;

    try {
      await api.put(`/reviews/${id}/publish`, 
        { isPublished: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update state lokal agar UI langsung berubah tanpa perlu loading ulang
      setReviews(reviews.map(review => 
        review.id === id ? { ...review, isPublished: newStatus } : review
      ));

      Swal.fire({
        icon: 'success',
        title: newStatus ? 'Ulasan Ditampilkan!' : 'Ulasan Disembunyikan!',
        text: newStatus ? 'Ulasan ini sekarang dapat dilihat oleh pembeli lain.' : 'Ulasan ini telah disembunyikan dari halaman publik.',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      Swal.fire({
        icon: 'error', title: 'Gagal', text: 'Gagal mengubah status ulasan.',
        buttonsStyling: false, customClass: { confirmButton: 'bg-red-500 text-white px-6 py-2 rounded-lg' }
      });
    }
  };

  // Fungsi untuk menghapus ulasan (jika spam/kata kasar)
  const handleDelete = async (id: number) => {
    const token = localStorage.getItem('adminToken');
    
    const result = await Swal.fire({
      title: 'Hapus Ulasan?',
      text: 'Ulasan ini akan dihapus permanen dari sistem.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      reverseButtons: true,
      buttonsStyling: false,
      customClass: {
        confirmButton: 'bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg ml-3',
        cancelButton: 'bg-slate-400 hover:bg-slate-500 text-white font-bold py-2 px-6 rounded-lg'
      }
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/reviews/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        Swal.fire({
          icon: 'success', title: 'Terhapus!', text: 'Ulasan berhasil dihapus.',
          buttonsStyling: false, customClass: { confirmButton: 'bg-emerald-500 text-white font-bold py-2 px-6 rounded-lg' }
        });
        fetchReviews();
      } catch (error) {
        Swal.fire({
          icon: 'error', title: 'Gagal', text: 'Gagal menghapus ulasan.',
          buttonsStyling: false, customClass: { confirmButton: 'bg-blue-500 text-white px-6 py-2 rounded-lg' }
        });
      }
    }
  };

  // Fungsi pembantu untuk render bintang
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            size={16} 
            className={star <= rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"} 
          />
        ))}
        <span className="ml-2 font-bold text-slate-700">{rating}/5</span>
      </div>
    );
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <MessageSquare className="text-blue-500"/> Moderasi Ulasan
          </h2>
          <p className="text-sm text-slate-500">Pilih ulasan mana yang layak ditampilkan di halaman toko Anda.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-sm border-b border-slate-200">
                <th className="p-4 font-semibold">Pelanggan & Produk</th>
                <th className="p-4 font-semibold">Ulasan</th>
                <th className="p-4 font-semibold text-center w-32">Status Tampil</th>
                <th className="p-4 font-semibold text-center w-24">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="text-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div></td></tr>
              ) : reviews.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-10 text-slate-500">Belum ada ulasan dari pembeli.</td></tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    
                    <td className="p-4 align-top">
                      <p className="font-bold text-slate-800">{review.customerName}</p>
                      <p className="text-xs font-semibold text-blue-600 bg-blue-50 inline-block px-2 py-1 rounded-md mt-1">
                        📦 {review.product?.name || 'Produk Tidak Diketahui'}
                      </p>
                      <p className="text-xs text-slate-400 mt-2">
                        {new Date(review.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </td>

                    <td className="p-4">
                      <div className="mb-2">{renderStars(review.rating)}</div>
                      <p className="text-sm text-slate-600 max-w-md break-words italic">
                        "{review.comment}"
                      </p>
                    </td>

                    <td className="p-4 text-center align-middle">
                      <button
                        onClick={() => handleTogglePublish(review.id, review.isPublished)}
                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors shadow-inner ${
                          review.isPublished ? 'bg-emerald-500' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-sm transition-transform flex items-center justify-center ${
                            review.isPublished ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        >
                          {review.isPublished ? <Eye size={14} className="text-emerald-500" /> : <EyeOff size={14} className="text-slate-400" />}
                        </span>
                      </button>
                      <p className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-wider">
                        {review.isPublished ? 'PUBLIK' : 'HIDUP'}
                      </p>
                    </td>

                    <td className="p-4 text-center align-middle">
                      <button 
                        onClick={() => handleDelete(review.id)} 
                        className="text-slate-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors"
                        title="Hapus Permanen"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReviewManagement;