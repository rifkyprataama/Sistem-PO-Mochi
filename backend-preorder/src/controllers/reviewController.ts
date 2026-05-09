import { Request, Response } from 'express';
import prisma from '../config/database.js';

// 1. Pembeli Mengirim Ulasan Baru (POST)
export const createReview = async (req: Request, res: Response): Promise<any> => {
  try {
    // Kita tambahkan invoiceNumber sebagai syarat wajib
    const { invoiceNumber, productId, customerName, rating, comment } = req.body;

    // TAHAP 1: Cari pesanan berdasarkan Invoice
    const order = await prisma.order.findUnique({
      where: { invoiceNumber: invoiceNumber },
      include: { items: true } // Tarik juga data barang apa saja yang dibeli
    });

    if (!order) {
      return res.status(404).json({ success: false, message: "Nomor Invoice tidak ditemukan dalam sistem." });
    }

    // TAHAP 2: Pastikan status pesanan sudah SELESAI
    if (order.status !== 'SELESAI') {
      return res.status(403).json({ success: false, message: "Ulasan hanya dapat diberikan setelah pesanan berstatus SELESAI." });
    }

    // TAHAP 3: Pastikan produk yang ingin diulas benar-benar dibeli di invoice tersebut
    const hasBoughtProduct = order.items.some(item => item.productId === Number(productId));
    if (!hasBoughtProduct) {
      return res.status(403).json({ success: false, message: "Anda tidak membeli produk ini pada invoice tersebut." });
    }

    // TAHAP 4: Jika lolos semua penyaringan, simpan ulasan ke database!
    const newReview = await prisma.review.create({
      data: {
        productId: Number(productId),
        customerName: customerName,
        rating: Number(rating),
        comment: comment
        // isPublished otomatis 'false'
      }
    });

    res.status(201).json({ success: true, message: "Ulasan berhasil dikirim dan menunggu persetujuan Admin!", data: newReview });
  } catch (error) {
    console.error("Gagal mengirim ulasan:", error);
    res.status(500).json({ success: false, message: "Terjadi kesalahan pada server saat mengirim ulasan." });
  }
};

// 2. Admin Melihat Semua Ulasan (GET)
export const getAllReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await prisma.review.findMany({
      include: { product: true },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data ulasan", error });
  }
};

// 3. Admin Menyetujui/Menampilkan Ulasan (PUT)
export const publishReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isPublished } = req.body; // Mengirimkan true / false

    const updatedReview = await prisma.review.update({
      where: { id: Number(id) },
      data: { isPublished: isPublished }
    });
    res.status(200).json({ message: "Status ulasan berhasil diperbarui!", data: updatedReview });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengubah status ulasan", error });
  }
};

// 4. Admin Menghapus Ulasan (DELETE)
export const deleteReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.review.delete({ where: { id: Number(id) } });
    res.status(200).json({ message: "Ulasan berhasil dihapus!" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus ulasan", error });
  }
};

// 5. Pembeli Melihat Ulasan yang Disetujui (GET - Publik)
export const getPublishedReviews = async (req: Request, res: Response) => {
  try {
    const { productId } = req.query; // Opsional: Jika ingin melihat ulasan per produk tertentu

    const whereClause: any = { isPublished: true }; // LOGIKA UTAMA: Hanya yang True!
    
    // Jika frontend mengirim ID produk, saring berdasarkan produk itu saja
    if (productId) {
      whereClause.productId = Number(productId);
    }

    const reviews = await prisma.review.findMany({
      where: whereClause,
      include: { product: true },
      orderBy: { createdAt: 'desc' } // Ulasan terbaru di atas
    });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil ulasan publik", error });
  }
};