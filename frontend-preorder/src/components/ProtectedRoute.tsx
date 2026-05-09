import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Mengecek apakah ada token admin yang tersimpan di memori browser
  const token = localStorage.getItem('adminToken');

  // Jika tidak ada token, paksa pindah ke halaman login admin
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  // Jika ada token, silakan masuk ke halaman yang dituju
  return <>{children}</>;
};

export default ProtectedRoute;