import express, { Request, Response } from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

// 1. IMPORT MESIN CRON JOB DI SINI (Gunakan akhiran .js menyesuaikan format Anda)
import { initCronJobs } from './services/cronService.js';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Rute Uji Coba Dasar
app.get('/', (req: Request, res: Response) => {
  res.send('Halo! Server Backend Sistem PO UMKM sudah berhasil berjalan! 🚀');
});

// Daftarkan Rute Produk di sini!
// Artinya: Semua alamat yang diawali "/api/products" akan diarahkan ke productRoutes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);

// 2. NYALAKAN MESIN CRON JOB DI SINI
// Dipanggil sebelum app.listen agar langsung siaga saat server berjalan
initCronJobs();

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🚀 Server berjalan di: http://localhost:${PORT}`);
  console.log(`🕒 Mesin Pembersih Otomatis (Cron Job) AKTIF!`);
  console.log(`=========================================`);
});