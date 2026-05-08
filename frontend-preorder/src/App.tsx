import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/admin" element={
            <div className="p-8 font-sans">
              <h1 className="text-2xl font-bold">Dashboard Admin</h1>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;