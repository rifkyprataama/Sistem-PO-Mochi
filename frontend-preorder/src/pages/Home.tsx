import { ShoppingBag, ShieldCheck, Star, ThumbsUp } from 'lucide-react';
import Catalog from './Catalog';
import SubmitReview from './SubmitReview';

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
        
        {/* Kita panggil file Catalog.tsx di sini agar muncul di bawah Home */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-10">
          <Catalog />
        </div>
      </section>

      {/* 3. SECTION ULASAN (Form Review) */}
      <section id="review-section" className="py-16 px-6 bg-slate-100 border-t border-slate-200">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-slate-800 mb-3">Tinggalkan Ulasan</h2>
            <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
          </div>
          
          {/* Kita panggil file SubmitReview.tsx di sini agar muncul di bawah Katalog */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-10">
            <SubmitReview />
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;