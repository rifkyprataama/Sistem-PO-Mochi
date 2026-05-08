import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Receipt, Upload, MessageCircle, AlertCircle, CheckCircle } from 'lucide-react';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { invoiceNumber, dpAmount, customerName } = location.state || {};

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!invoiceNumber) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 font-sans">
        <AlertCircle size={64} className="text-amber-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Data Tidak Ditemukan</h2>
        <p className="text-slate-500 mb-6">Sesi pembayaran Anda mungkin telah kedaluwarsa atau tidak valid.</p>
        <button onClick={() => navigate('/')} className="bg-blue-500 text-white px-6 py-2 rounded-lg font-bold">
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Silakan pilih foto bukti transfer terlebih dahulu.");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('orderId', invoiceNumber);
      formData.append('proofImage', file);

      await api.post('/payments', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setIsSuccess(true);
    } catch (error) {
      console.error("Gagal upload bukti:", error);
      alert("Gagal mengunggah bukti pembayaran. Pastikan ukuran gambar tidak terlalu besar.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FUNGSI BARU: Membatalkan Pesanan
  // ==========================================
  const handleCancelOrder = async () => {
    const confirmCancel = window.confirm("Apakah Anda yakin ingin membatalkan pesanan ini?");
    if (!confirmCancel) return;

    try {
      setLoading(true);
      // Menembak API update status CANCELLED ke backend
      await api.put(`/orders/${invoiceNumber}/cancel`); 
      alert("Pesanan Anda telah dibatalkan.");
      navigate('/'); // Kembalikan pelanggan ke halaman utama
    } catch (error) {
      console.error("Gagal membatalkan pesanan:", error);
      alert("Gagal membatalkan pesanan secara otomatis. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const sendWhatsApp = () => {
    const adminWA = "628123456789"; // Ganti dengan nomor WhatsApp Admin yang sebenarnya
    const message = `Halo Admin, saya ${customerName}. Saya sudah kirim bukti transfer DP untuk Invoice: *${invoiceNumber}*. Mohon segera dicek ya!`;
    window.open(`https://wa.me/${adminWA}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-6 font-sans">
      <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
        
        {/* Header Invoice */}
        <div className="bg-slate-900 text-white p-8 text-center">
          <Receipt size={48} className="mx-auto mb-4 text-emerald-400" />
          <h2 className="text-2xl font-bold mb-2">Konfirmasi Pembayaran</h2>
          <div className="inline-block bg-slate-800 px-4 py-2 rounded-lg text-slate-300 font-mono tracking-widest text-sm mb-4">
            {invoiceNumber}
          </div>
          <p className="text-slate-400">Total DP yang harus dibayar:</p>
          <p className="text-4xl font-extrabold text-emerald-400 mt-2">
            Rp {dpAmount?.toLocaleString('id-ID')}
          </p>
        </div>

        <div className="p-8">
          {!isSuccess ? (
            <>
              {/* Instruksi Transfer & QRIS */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-center mb-8">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Scan QRIS Berikut</p>
                <div className="bg-white p-4 rounded-xl shadow-sm inline-block mb-4 border border-slate-100">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" 
                    alt="QRIS Pembayaran" 
                    className="w-32 h-32 mx-auto" 
                  />
                </div>
                <p className="text-slate-500 text-sm">Atau transfer manual ke:</p>
                <p className="text-slate-800 font-bold text-lg mt-1">BCA 123-456-7890</p>
                <p className="text-slate-600 text-sm">A/N: Rifky Daffa (UMKM)</p>
              </div>

              {/* Form Upload */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Upload Bukti Transfer <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="file" accept="image/*" required onChange={handleFileChange} 
                    className="w-full text-slate-500 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer border border-slate-200 rounded-xl bg-slate-50"
                  />
                </div>
                
                <button 
                  type="submit" disabled={loading} 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  {loading ? (
                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <><Upload size={20} /> Kirim Bukti Pembayaran</>
                  )}
                </button>
                
                {/* ========================================== */}
                {/* TOMBOL BARU: Batalkan Pesanan              */}
                {/* ========================================== */}
                <button 
                  type="button"
                  onClick={handleCancelOrder}
                  disabled={loading}
                  className="w-full mt-2 text-slate-400 hover:text-red-500 text-sm font-semibold transition-colors py-2 active:scale-95"
                >
                  Batalkan Pesanan Ini
                </button>
              </form>
            </>
          ) : (
            /* Tampilan Sukses */
            <div className="text-center py-6">
              <div className="bg-emerald-100 text-emerald-500 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={56} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">Bukti Berhasil Terkirim!</h3>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Terima kasih! Bukti pembayaran Anda sedang kami verifikasi. Silakan klik tombol di bawah untuk konfirmasi langsung ke WhatsApp Admin kami.
              </p>
              <button 
                onClick={sendWhatsApp} 
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg text-lg"
              >
                <MessageCircle size={24} />
                Konfirmasi via WhatsApp
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;