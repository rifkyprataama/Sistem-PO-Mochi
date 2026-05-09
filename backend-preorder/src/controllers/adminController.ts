import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../config/database.js';

// 1. FITUR LOGIN ADMIN
export const loginAdmin = async (req: Request, res: Response): Promise<any> => {
  try {
    const { username, password } = req.body;

    // Memanggil username dan password dari "Brankas Rahasia" (.env)
    const validUsername = process.env.ADMIN_USERNAME;
    const validPassword = process.env.ADMIN_PASSWORD;

    // Jika .env belum dikonfigurasi, tolak akses demi keamanan
    if (!validUsername || !validPassword) {
      console.error("CRITICAL ERROR: ADMIN_USERNAME atau ADMIN_PASSWORD belum diatur di .env!");
      return res.status(500).json({ success: false, message: "Konfigurasi server tidak lengkap." });
    }

    // Mencocokkan inputan dengan data di .env
    if (username === validUsername && password === validPassword) {
      // Jika cocok, buatkan Token Kunci yang berlaku selama 1 hari (24h)
      const token = jwt.sign(
        { role: 'superadmin', username: username }, 
        process.env.JWT_SECRET || 'rahasia_negara_123',
        { expiresIn: '24h' }
      );

      return res.status(200).json({
        success: true,
        message: "Login berhasil",
        token: token
      });
    }

    // Jika salah password/username
    return res.status(401).json({ success: false, message: "Username atau Password salah!" });

  } catch (error) {
    console.error("Error saat login:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server." });
  }
};

// 2. FITUR MENGAMBIL DATA STATISTIK DASHBOARD (Tetap sama seperti sebelumnya)
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const totalOrders = await prisma.order.count();
    const pendingOrders = await prisma.order.count({
      where: { status: 'PENDING' }
    });
    const uniqueCustomers = await prisma.order.groupBy({
      by: ['whatsappNumber'],
    });
    const totalCustomers = uniqueCustomers.length;
    const successfulOrders = await prisma.order.findMany({
      where: {
        status: { in: ['DIPROSES', 'SELESAI'] }
      },
      select: { totalAmount: true }
    });
    const totalRevenue = successfulOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        totalCustomers,
        totalRevenue
      }
    });

  } catch (error) {
    console.error("Gagal mengambil statistik:", error);
    res.status(500).json({ success: false, message: "Gagal memuat data dashboard" });
  }
};