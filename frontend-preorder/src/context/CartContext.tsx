import React, { createContext, useState } from 'react';

// Bentuk data barang di keranjang
interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  clearCart: () => void;
  cartTotal: number;
}

export const CartContext = createContext<CartContextType>({} as CartContextType);

// PERBAIKAN DI SINI: Menggunakan React.ReactNode
export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Fungsi menambah barang ke keranjang
  const addToCart = (newItem: CartItem) => {
    setCart((prevCart) => {
      const existing = prevCart.find(item => item.productId === newItem.productId);
      // Jika barang sudah ada, tambah jumlahnya saja
      if (existing) {
        return prevCart.map(item =>
          item.productId === newItem.productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      // Jika barang baru, masukkan ke keranjang
      return [...prevCart, { ...newItem, quantity: 1 }];
    });
  };

  const clearCart = () => setCart([]);

  // Menghitung total belanja otomatis
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, clearCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};