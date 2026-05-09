import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, MessageSquare, LogOut } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation(); // Untuk mengetahui halaman mana yang sedang aktif

  // Daftar Menu Admin (Mudah ditambah/dikurangi di masa depan)
  const menuItems = [
    { path: '/admin', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/admin/products', name: 'Kelola Produk', icon: <Package size={20} /> },
    { path: '/admin/orders', name: 'Kelola Pesanan', icon: <ShoppingCart size={20} /> },
    { path: '/admin/reviews', name: 'Moderasi Ulasan', icon: <MessageSquare size={20} /> },
  ];

  const handleLogout = () => {
    // 1. Hapus kunci dari brankas browser
    localStorage.removeItem('adminToken');
    // 2. Tendang kembali ke halaman Login
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      
      {/* SIDEBAR (Menu Kiri) */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex">
        <div className="p-6 border-b border-slate-800 text-center">
          <h2 className="text-2xl font-extrabold text-emerald-400 tracking-wider">UMKM<span className="text-white">Admin</span></h2>
          <p className="text-slate-400 text-xs mt-1">Sistem Manajemen CRM</p>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-emerald-500 text-white shadow-md' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="font-semibold">{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-colors font-bold"
          >
            <LogOut size={20} /> Keluar
          </button>
        </div>
      </aside>

      {/* AREA KONTEN UTAMA */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar Atas Header */}
        <header className="bg-white border-b border-slate-200 p-4 sm:p-6 flex justify-between items-center z-10">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
            {menuItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
          </h1>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800">Halo, Rifky UMKM</p>
              <p className="text-xs text-slate-500">Super Admin</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center text-emerald-700 font-bold">
              RD
            </div>
          </div>
        </header>

        {/* Area Render Halaman Dinamis */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 sm:p-8 bg-slate-50 relative">
          {children}
        </div>
      </main>

    </div>
  );
};

export default AdminLayout;