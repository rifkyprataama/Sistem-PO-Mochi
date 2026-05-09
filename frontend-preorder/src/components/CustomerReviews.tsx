import { useState, useEffect } from 'react';
import { Star, UserCircle, Quote } from 'lucide-react';
import api from '../api/axios';

interface Review {
  id: number;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  product?: {
    name: string;
  };
}

const CustomerReviews = ({ productId }: { productId?: number }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicReviews = async () => {
      try {
        setLoading(true);
        // Tembak ke rute publik yang baru saja kita buat
        // Jika ada productId, kirim sebagai query parameter
        const url = productId ? `/reviews/public?productId=${productId}` : '/reviews/public';
        const response = await api.get(url);
        setReviews(response.data);
      } catch (error) {
        console.error("Gagal mengambil ulasan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicReviews();
  }, [productId]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} size={14} className={star <= rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"} />
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="text-center py-10 text-slate-400 animate-pulse">Memuat ulasan pelanggan...</div>;
  }

  if (reviews.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 text-center">
        <p className="text-slate-500 font-medium">Belum ada ulasan untuk saat ini. Jadilah yang pertama!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-2xl font-bold text-slate-800">Apa Kata Mereka?</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <Quote size={40} className="absolute -top-2 -right-2 text-slate-50 opacity-50 rotate-12" />
            
            <div className="flex items-start gap-4 mb-4">
              <UserCircle size={40} className="text-slate-300" />
              <div>
                <p className="font-bold text-slate-800">{review.customerName}</p>
                <p className="text-xs text-slate-400 mb-1">{new Date(review.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                {renderStars(review.rating)}
              </div>
            </div>
            
            {/* Hanya tampilkan nama produk jika ini adalah tampilan ulasan global */}
            {!productId && review.product && (
              <span className="inline-block bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded-md mb-3">
                Membeli: {review.product.name}
              </span>
            )}
            
            <p className="text-slate-600 italic text-sm leading-relaxed">
              "{review.comment}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerReviews;