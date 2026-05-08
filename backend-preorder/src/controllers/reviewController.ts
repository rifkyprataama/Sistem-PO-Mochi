import { Request, Response } from 'express';
import prisma from '../config/database.js';

// 1. Pembeli Mengirim Ulasan Baru (POST)
export const createReview = async (req: Request, res: Response) => {
  try {
    const { productId, customerName, rating, comment } = req.body;
    const newReview = await prisma.review.create({
      data: {
        productId: productId,
        customerName: customerName,
        rating: rating,
        comment: comment
        // isPublished otomatis 'false' sesuai schema
      }
    });
    res.status(201).json({ message: "Ulasan berhasil dikirim dan menunggu persetujuan!", data: newReview });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengirim ulasan", error });
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