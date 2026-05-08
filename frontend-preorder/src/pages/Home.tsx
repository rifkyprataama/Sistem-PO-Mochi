import { useState, useEffect } from 'react';
import api from '../api/axios';

// Cetak biru bentuk data produk dari backend
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fungsi untuk mengambil data produk saat halaman pertama kali dibuka
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

  if (loading) return <div style={{ padding: '20px' }}>Memuat katalog produk...</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Katalog Produk Pre-Order</h1>
      <p style={{ textAlign: 'center', color: '#666' }}>Silakan pilih produk unggulan kami</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '30px' }}>
        {products.map((product) => (
          <div key={product.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginTop: '0', color: '#2c3e50' }}>{product.name}</h3>
            <p style={{ fontSize: '14px', color: '#555' }}>{product.description}</p>
            <h4 style={{ color: '#e67e22', fontSize: '18px' }}>Rp {product.price.toLocaleString('id-ID')}</h4>
            <button style={{ width: '100%', padding: '10px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Pesan Sekarang
            </button>
          </div>
        ))}
        {products.length === 0 && <p>Belum ada produk yang tersedia.</p>}
      </div>
    </div>
  );
};

export default Home;