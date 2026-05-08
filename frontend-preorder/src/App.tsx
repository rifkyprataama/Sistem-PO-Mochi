import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; // <-- Tambahkan import ini

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rute untuk Pelanggan */}
        <Route path="/" element={<Home />} /> {/* <-- Ganti bagian ini */}
        
        <Route path="/checkout" element={
          <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h1>Form Pemesanan (PO)</h1>
          </div>
        } />

        <Route path="/admin" element={
          <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h1>Dashboard Admin</h1>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;