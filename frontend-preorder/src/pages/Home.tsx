import { ShoppingBag, ShieldCheck, Star, ThumbsUp, MessageSquare } from 'lucide-react';
import Catalog from './Catalog';
// IMPORT DUA KOMPONEN BARU KITA (Sesuaikan path-nya jika folder Anda berbeda)
import CustomerReviews from '../components/CustomerReviews';
import ReviewForm from '../components/ReviewForm';

const Home = () => {
  // Fungsi untuk scroll halus ke bagian katalog
  const scrollToCatalog = () => {
    document.getElementById('katalog-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* 1. HERO SECTION (Branding UMKM) */}
      <section className="bg-slate-900 text-white py-24 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
            UMKM
        </h1>
        <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          Menyediakan produk berkualitas tinggi dengan sistem Pre-Order yang aman, transparan, dan terpercaya.
        </p>
        <button 
          onClick={scrollToCatalog}
          className="bg-emerald-500 hover:bg-emerald-600 transition-colors text-white font-bold py-3 px-8 rounded-full flex items-center justify-center mx-auto gap-3 shadow-lg hover:shadow-xl"
        >
          <ShoppingBag size={22} />
          Mulai Belanja Sekarang
        </button>
      </section>

      {/* KEUNGGULAN SECTION (Informasi Trust/Kepercayaan) */}
      <section className="py-16 px-6 max-w-5xl mx-auto flex flex-wrap justify-center gap-8 -mt-10 relative z-10">
        <div className="bg-white p-8 border border-slate-100 rounded-2xl shadow-sm max-w-xs text-center flex-1 min-w-[250px] hover:shadow-md transition-shadow">
          <Star className="text-amber-400 mx-auto mb-5" size={40} strokeWidth={1.5} />
          <h3 className="font-bold text-xl mb-3 text-slate-800">Kualitas Terjamin</h3>
          <p className="text-slate-600 leading-relaxed">Dibuat dengan bahan terbaik dan pengerjaan yang sangat teliti.</p>
        </div>
        
        <div className="bg-white p-8 border border-slate-100 rounded-2xl shadow-sm max-w-xs text-center flex-1 min-w-[250px] hover:shadow-md transition-shadow">
          <ShieldCheck className="text-blue-500 mx-auto mb-5" size={40} strokeWidth={1.5} />
          <h3 className="font-bold text-xl mb-3 text-slate-800">Transaksi Aman</h3>
          <p className="text-slate-600 leading-relaxed">Sistem pembayaran DP 50% yang transparan dan aman bagi kedua belah pihak.</p>
        </div>
        
        <div className="bg-white p-8 border border-slate-100 rounded-2xl shadow-sm max-w-xs text-center flex-1 min-w-[250px] hover:shadow-md transition-shadow">
          <ThumbsUp className="text-emerald-500 mx-auto mb-5" size={40} strokeWidth={1.5} />
          <h3 className="font-bold text-xl mb-3 text-slate-800">Terpercaya</h3>
          <p className="text-slate-600 leading-relaxed">Telah dipercaya oleh banyak pelanggan dengan rekam jejak ulasan positif.</p>
        </div>
      </section>

      {/* 2. SECTION KATALOG (Etalase Belanja) */}
      <section id="katalog-section" className="py-12 px-6 max-w-6xl mx-auto">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-3">Katalog Produk</h2>
          <div className="w-24 h-1 bg-emerald-500 mx-auto rounded-full"></div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-10">
          <Catalog />
        </div>
      </section>

      {/* 3. SECTION MENAMPILKAN ULASAN (Testimoni Pelanggan) */}
      <section id="testimoni-section" className="py-16 px-6 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto">
          <CustomerReviews />
        </div>
      </section>

      {/* 4. SECTION MENGISI ULASAN (Review Form) */}
      <section id="review-section" className="py-16 px-6 bg-slate-100 border-t border-slate-200">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10 text-center flex flex-col items-center">
            <div className="bg-blue-100 text-blue-600 p-4 rounded-full mb-4">
              <MessageSquare size={32} />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-3">Pesanan Anda Sudah Sampai?</h2>
            <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full mb-4"></div>
            <p className="text-slate-500">Bantu pelanggan lain dengan membagikan pengalaman Anda berbelanja di toko kami.</p>
          </div>
          
          {/* Form Ulasan versi Terbaru yang meminta Nomor Invoice */}
          <ReviewForm />
        </div>
      </section>

    </div>
  );
};

export default Home;