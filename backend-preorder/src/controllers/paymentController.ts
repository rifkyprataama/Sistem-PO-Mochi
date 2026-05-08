import { Request, Response } from 'express';
import prisma from '../config/database.js';

// Fitur Mengunggah Bukti Pembayaran
export const createPayment = async (req: Request, res: Response) => {
  try {
    // 1. Menerima data dari form upload pembeli
    const { orderId, proofImageUrl } = req.body;

    // 2. Simpan bukti transfer ke tabel Payment
    const newPayment = await prisma.payment.create({
      data: {
        orderId: orderId,
        proofImageUrl: proofImageUrl
        // paymentStatus otomatis menjadi "Menunggu Validasi" (dari schema)
      }
    });

    // 3. Sentuhan Profesional: Otomatis ubah status pesanan di tabel Order
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "Bukti Diunggah - Menunggu Validasi" }
    });

    res.status(201).json({ 
      message: "Bukti pembayaran berhasil dikirim!", 
      data: newPayment 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal memproses pembayaran", error });
  }
};

// Fitur Menampilkan Semua Bukti Pembayaran (Untuk Admin)
export const getPayments = async (req: Request, res: Response) => {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        order: true // Tampilkan juga detail pesanan milik siapa yang dibayar ini
      },
      orderBy: { uploadedAt: 'desc' } // Urutkan dari transferan terbaru
    });
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data pembayaran", error });
  }
};

// Fitur Menghapus Bukti Pembayaran (DELETE)
export const deletePayment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.payment.delete({
      where: { id: Number(id) }
    });
    res.status(200).json({ message: "Bukti pembayaran berhasil dihapus!" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus pembayaran", error });
  }
};