import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { CartContext } from '../context/CartContext';
import { ArrowLeft, ShoppingCart, User, Phone, MapPin, CheckCircle } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useContext(CartContext);

  const [formData, setFormData] = useState({
    customerName: '',
    whatsappNumber: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="bg-slate-100 p-6 rounded-full mb-6">
          <ShoppingCart size={64} className="text-slate-400" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Keranjang Anda Kosong</h2>
        <p className="text-slate-500 mb-8 max-w-md">Sepertinya Anda belum memilih produk apa pun. Yuk, lihat katalog kami dan temukan produk menarik!</p>
        <button 
          onClick={() => navigate('/')} 
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-full font-bold transition-all shadow-md"
        >
          Mulai Belanja
        </button>
      </div>
    );
  }

  const dpAmount = cartTotal * 0.5;

  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyNumbers = e.target.value.replace(/[^0-9]/g, '');
    if (onlyNumbers === '' || onlyNumbers.startsWith('0')) {
      setFormData({ ...formData, whatsappNumber: onlyNumbers });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderPayload = {
        customerName: formData.customerName,
        whatsappNumber: formData.whatsappNumber,
        address: formData.address,
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        }))
      };

      const response = await api.post('/orders', orderPayload);
      const resData = response.data.data;

      navigate('/payment', { 
        state: { 
          invoiceNumber: resData.invoiceNumber,
          dpAmount: dpAmount,
          customerName: formData.customerName
        } 
      });

      clearCart();
    } catch (error) {
      console.error("Gagal membuat pesanan:", error);
      alert("Terjadi kesalahan sistem. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-6 font-sans">
      <button 
        onClick={() => navigate('/')} 
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-semibold mb-8 transition-colors"
      >
        <ArrowLeft size={20} /> Lanjut Belanja
      </button>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* BAGIAN KIRI: Form Data Diri */}
        <div className="lg:col-span-3">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <User className="text-blue-500" /> Data Pengiriman
          </h2>
          
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" required placeholder="Masukkan nama sesuai KTP"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white"
                value={formData.customerName} onChange={(e) => setFormData({...formData, customerName: e.target.value})} 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Phone size={16} className="text-blue-500"/> Nomor WhatsApp <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" required placeholder="Contoh: 0812xxxx"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white"
                value={formData.whatsappNumber} onChange={handleWhatsappChange} 
              />
              <p className="text-xs text-slate-500 mt-1">Hanya angka, wajib diawali dengan angka 0.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <MapPin size={16} className="text-blue-500"/> Alamat Lengkap <span className="text-red-500">*</span>
              </label>
              <textarea 
                required placeholder="Tuliskan alamat lengkap pengiriman beserta kodepos"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white min-h-[100px]"
                value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} 
              />
            </div>
          </form>
        </div>

        {/* BAGIAN KANAN: Ringkasan Keranjang */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-6">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <ShoppingCart className="text-emerald-500" /> Ringkasan Pesanan
            </h2>
            
            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
              {cart.map((item, index) => (
                <div key={index} className="flex justify-between items-center pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="max-w-[180px]">
                    <p className="font-semibold text-slate-800 truncate">{item.name}</p>
                    <p className="text-sm text-slate-500">{item.quantity} x Rp {item.price.toLocaleString('id-ID')}</p>
                  </div>
                  <p className="font-bold text-slate-700">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                </div>
              ))}
            </div>

            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-600 font-medium">Total Belanja:</span>
                <span className="text-slate-800 font-bold">Rp {cartTotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-emerald-200">
                <span className="text-emerald-800 font-bold">Wajib DP (50%):</span>
                <span className="text-emerald-600 font-extrabold text-xl">Rp {dpAmount.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <button 
              form="checkout-form"
              type="submit" 
              disabled={loading} 
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <><CheckCircle size={20} /> Selesaikan Pesanan</>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;