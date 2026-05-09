import { useState, useEffect } from 'react';
import { Plus, Trash2, Package, Tag, Info, Calendar, Clock, Image as ImageIcon, Pencil, X } from 'lucide-react';
import api from '../../api/axios';
import Swal from 'sweetalert2';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  poOpenDate: string;
  poCloseDate: string;
  isActive: boolean;
}

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // State untuk melacak apakah Admin sedang Tambah atau Edit
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    poOpenDate: '',
    poCloseDate: '',
    isActive: true
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // PERBAIKAN: Tambahkan ?target=admin agar backend memberikan SEMUA data tanpa disaring
      const response = await api.get('/products?target=admin');
      setProducts(response.data);
    } catch (error) {
      console.error("Gagal mengambil data produk:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Fungsi untuk memformat tanggal dari Database agar cocok dengan input type="datetime-local"
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 16);
  };

  // Saat tombol Pensil (Edit) diklik
  const handleEditClick = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      imageUrl: product.imageUrl || '',
      poOpenDate: formatDateForInput(product.poOpenDate),
      poCloseDate: formatDateForInput(product.poCloseDate),
      isActive: product.isActive
    });
    setEditId(product.id);
    setIsEditing(true);
    setShowForm(true);
    
    // Scroll ke form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fungsi untuk Batal Edit/Tambah
  const handleCancelForm = () => {
    setFormData({ name: '', description: '', price: '', imageUrl: '', poOpenDate: '', poCloseDate: '', isActive: true });
    setIsEditing(false);
    setEditId(null);
    setShowForm(false);
  };

  // Fungsi Submit (Menangani Tambah & Edit)
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const payload = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      imageUrl: formData.imageUrl, // Link foto produk
      poOpenDate: formData.poOpenDate,
      poCloseDate: formData.poCloseDate,
      isActive: formData.isActive
    };
    
    try {
      if (isEditing && editId) {
        // PROSES EDIT (PUT)
        await api.put(`/products/${editId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire({
          icon: 'success', title: 'Diperbarui!', text: 'Perubahan produk berhasil disimpan.',
          buttonsStyling: false, customClass: { confirmButton: 'bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-6 rounded-lg' }
        });
      } else {
        // PROSES TAMBAH (POST)
        await api.post('/products', payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire({
          icon: 'success', title: 'Berhasil!', text: 'Produk baru telah ditambahkan.',
          buttonsStyling: false, customClass: { confirmButton: 'bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-6 rounded-lg' }
        });
      }
      
      handleCancelForm();
      fetchProducts(); 
    } catch (error) {
      Swal.fire({
        icon: 'error', title: 'Gagal Menyimpan', text: 'Periksa kembali isian form Anda.',
        buttonsStyling: false, customClass: { confirmButton: 'bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg' }
      });
    }
  };

  const handleDelete = async (id: number, name: string) => {
    const token = localStorage.getItem('adminToken');
    const result = await Swal.fire({
      title: 'Hapus Produk?', text: `Anda yakin ingin menghapus "${name}"?`, icon: 'warning',
      showCancelButton: true, confirmButtonText: 'Ya, Hapus!', cancelButtonText: 'Batal', reverseButtons: true,
      buttonsStyling: false,
      customClass: { confirmButton: 'bg-red-500 text-white font-bold py-2 px-6 rounded-lg ml-3', cancelButton: 'bg-slate-400 text-white font-bold py-2 px-6 rounded-lg' }
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        Swal.fire({ icon: 'success', title: 'Terhapus!', text: 'Produk telah dihapus.', buttonsStyling: false, customClass: { confirmButton: 'bg-emerald-500 text-white font-bold py-2 px-6 rounded-lg' } });
        fetchProducts(); 
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'Gagal Menghapus', text: 'Produk mungkin terikat pesanan.', buttonsStyling: false, customClass: { confirmButton: 'bg-blue-500 text-white font-bold py-2 px-6 rounded-lg' } });
      }
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Manajemen Produk (PO)</h2>
          <p className="text-sm text-slate-500">Kelola etalase, foto, dan jadwal PO Anda.</p>
        </div>
        {!showForm && (
          <button onClick={() => { setIsEditing(false); setShowForm(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md flex items-center gap-2 active:scale-95">
            <Plus size={20} /> Tambah Produk
          </button>
        )}
      </div>

      {/* FORM DINAMIS (TAMBAH / EDIT) */}
      {showForm && (
        <div className={`bg-white p-6 rounded-2xl border ${isEditing ? 'border-amber-200 shadow-amber-100/50' : 'border-slate-100'} shadow-sm animate-in fade-in slide-in-from-top-4 duration-300`}>
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-3">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Package className={isEditing ? "text-amber-500" : "text-blue-500"} /> 
              {isEditing ? `Edit Produk: #${editId}` : 'Detail Produk Baru'}
            </h3>
            <button onClick={handleCancelForm} className="text-slate-400 hover:bg-slate-100 p-2 rounded-full transition-colors"><X size={20} /></button>
          </div>
          
          <form onSubmit={handleSubmitForm} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">Nama Produk</label>
              <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none bg-slate-50" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2"><Tag size={16} className="text-blue-500"/> Harga (Rp)</label>
              <input type="number" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none bg-slate-50" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2"><ImageIcon size={16} className="text-blue-500"/> URL Foto Produk</label>
              <input type="text" value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none bg-slate-50" placeholder="https://contoh.com/foto.jpg" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2"><Info size={16} className="text-blue-500"/> Deskripsi Produk</label>
              <textarea required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none bg-slate-50 min-h-[100px]" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2"><Calendar size={16} className="text-amber-500"/> Tanggal Buka PO</label>
              <input type="datetime-local" required value={formData.poOpenDate} onChange={(e) => setFormData({...formData, poOpenDate: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 outline-none bg-slate-50" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2"><Clock size={16} className="text-red-500"/> Tanggal Tutup PO</label>
              <input type="datetime-local" required value={formData.poCloseDate} onChange={(e) => setFormData({...formData, poCloseDate: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-red-500 outline-none bg-slate-50" />
            </div>

            <div className="md:col-span-2 flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-xl border border-slate-200 bg-slate-50 mt-2">
              <div>
                <p className="font-bold text-slate-800">Status Penayangan Produk</p>
                <p className="text-xs text-slate-500 mt-1">Matikan toggle ini jika ingin menyembunyikan produk secara manual (Misal: Bahan baku habis).</p>
              </div>
              <button
                type="button"
                onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors mt-3 sm:mt-0 shadow-inner ${formData.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}
              >
                <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-sm transition-transform ${formData.isActive ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>

            <div className="md:col-span-2 flex justify-end mt-4 gap-3">
              <button type="button" onClick={handleCancelForm} className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-3 rounded-xl font-bold transition-colors">Batal</button>
              <button type="submit" className={`${isEditing ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-500 hover:bg-emerald-600'} text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md`}>
                {isEditing ? 'Simpan Perubahan' : 'Simpan Produk Baru'}
              </button>
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
                <th className="p-4 font-semibold">Produk</th>
                <th className="p-4 font-semibold">Harga</th>
                <th className="p-4 font-semibold text-center">Status</th>
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
                    <td className="p-4 flex items-center gap-4">
                      {/* Thumbnail Gambar Produk */}
                      <img 
                        src={product.imageUrl || "https://via.placeholder.com/150"} 
                        alt={product.name} 
                        className="w-12 h-12 rounded-lg object-cover border border-slate-200 shadow-sm"
                      />
                      <div>
                        <p className="font-bold text-slate-800">{product.name}</p>
                        <p className="text-xs text-slate-400">ID: #{product.id}</p>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-emerald-600">Rp {product.price.toLocaleString('id-ID')}</td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {product.isActive ? 'Aktif' : 'Disembunyikan'}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* TOMBOL EDIT */}
                        <button onClick={() => handleEditClick(product)} className="text-blue-500 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                          <Pencil size={18} />
                        </button>
                        {/* TOMBOL HAPUS */}
                        <button onClick={() => handleDelete(product.id, product.name)} className="text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
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