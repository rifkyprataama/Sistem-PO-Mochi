import { useState, useEffect } from 'react';
import { Plus, Trash2, Package, Tag, Info } from 'lucide-react';
import api from '../../api/axios';
import Swal from 'sweetalert2';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // State untuk form tambah produk
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: ''
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error("Gagal mengambil data produk:", error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal Memuat Data',
        text: 'Tidak dapat terhubung ke server.',
        buttonsStyling: false,
        customClass: { confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg' }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    
    try {
      await api.post('/products', {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Produk baru telah ditambahkan ke etalase.',
        buttonsStyling: false,
        customClass: { confirmButton: 'bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-6 rounded-lg' }
      });
      
      setFormData({ name: '', description: '', price: '' });
      setShowForm(false);
      fetchProducts(); // Refresh tabel
    } catch (error) {
      console.error("Gagal menambah produk:", error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal Menambahkan',
        text: 'Pastikan Anda memiliki akses Admin.',
        buttonsStyling: false,
        customClass: { confirmButton: 'bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg' }
      });
    }
  };

  const handleDelete = async (id: number, name: string) => {
    const token = localStorage.getItem('adminToken');
    
    const result = await Swal.fire({
      title: 'Hapus Produk?',
      text: `Anda yakin ingin menghapus "${name}"? Tindakan ini tidak dapat dibatalkan.`,
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
        await api.delete(`/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        Swal.fire({
          icon: 'success',
          title: 'Terhapus!',
          text: 'Produk telah dihapus dari sistem.',
          buttonsStyling: false,
          customClass: { confirmButton: 'bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-6 rounded-lg' }
        });
        fetchProducts(); // Refresh tabel
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal Menghapus',
          text: 'Produk ini mungkin sedang terikat dengan pesanan pelanggan.',
          buttonsStyling: false,
          customClass: { confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg' }
        });
      }
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Manajemen Produk</h2>
          <p className="text-sm text-slate-500">Kelola etalase barang jualan Anda di sini.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md flex items-center gap-2 active:scale-95"
        >
          {showForm ? 'Batal Tambah' : <><Plus size={20} /> Tambah Produk</>}
        </button>
      </div>

      {/* FORM TAMBAH PRODUK (Muncul jika tombol Tambah diklik) */}
      {showForm && (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Form Tambah Produk Baru</h3>
          <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2"><Package size={16} className="text-blue-500"/> Nama Produk</label>
              <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none bg-slate-50" placeholder="Contoh: Dompet Rajut Eksklusif" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2"><Tag size={16} className="text-blue-500"/> Harga (Rp)</label>
              <input type="number" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none bg-slate-50" placeholder="Contoh: 150000" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2"><Info size={16} className="text-blue-500"/> Deskripsi Produk</label>
              <textarea required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none bg-slate-50 min-h-[100px]" placeholder="Jelaskan detail produk Anda..." />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md">Simpan Produk</button>
            </div>
          </form>
        </div>
      )}

      {/* TABEL PRODUK */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-sm border-b border-slate-200">
                <th className="p-4 font-semibold">ID</th>
                <th className="p-4 font-semibold">Nama Produk</th>
                <th className="p-4 font-semibold">Harga</th>
                <th className="p-4 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="text-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div></td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-10 text-slate-500">Belum ada produk. Silakan tambah produk baru.</td></tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-slate-500">#{product.id}</td>
                    <td className="p-4 font-semibold text-slate-800">{product.name}</td>
                    <td className="p-4 font-bold text-emerald-600">Rp {product.price.toLocaleString('id-ID')}</td>
                    <td className="p-4 text-center">
                      <button onClick={() => handleDelete(product.id, product.name)} className="text-slate-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors">
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

export default ProductManagement;