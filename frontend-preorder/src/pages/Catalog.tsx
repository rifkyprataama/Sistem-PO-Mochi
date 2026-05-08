import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { CartContext } from '../context/CartContext';
import { ShoppingCart, Package, Info, Plus } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}

const Catalog = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { cart, addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data);
      } catch (error) {
        console.error("Gagal mengambil data produk:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const totalItemsInCart = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
    </div>
  );

  return (
    <div className="w-full">
      {/* HEADER KERANJANG */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-4 border-b border-slate-100 gap-4">
        <p className="text-slate-500 flex items-center gap-2">
          <Package size={20} />
          Pilih produk unggulan kami untuk pre-order
        </p>
        <button 
          onClick={() => navigate('/checkout')}
          className="relative bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-3 shadow-md hover:shadow-lg"
        >
          <ShoppingCart size={20} />
          Lihat Keranjang
          {totalItemsInCart > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white">
              {totalItemsInCart}
            </span>
          )}
        </button>
      </div>
      
      {/* DAFTAR PRODUK (GRID) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between h-full">
            <div>
              <div className="bg-slate-50 rounded-xl p-4 mb-4 border border-slate-100 flex items-center justify-center h-32">
                 <Package size={48} className="text-slate-300 group-hover:text-emerald-400 transition-colors" />
              </div>
              <h3 className="font-bold text-xl text-slate-800 mb-2">{product.name}</h3>
              <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex items-start gap-2">
                <Info size={16} className="shrink-0 mt-0.5 text-slate-400" />
                {product.description}
              </p>
            </div>
            
            <div className="mt-auto">
              <h4 className="text-2xl font-extrabold text-emerald-600 mb-4">
                Rp {product.price.toLocaleString('id-ID')}
              </h4>
              <button 
                onClick={() => addToCart({ productId: product.id, name: product.name, price: product.price, quantity: 1 })} 
                className="w-full bg-emerald-50 hover:bg-emerald-500 hover:text-white text-emerald-600 border border-emerald-200 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Plus size={20} />
                Tambah Keranjang
              </button>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div className="col-span-full text-center py-10 text-slate-500">
            Belum ada produk yang tersedia saat ini.
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;