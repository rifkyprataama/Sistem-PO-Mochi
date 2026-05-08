import express from 'express';
import { createReview, getAllReviews, publishReview, deleteReview } from '../controllers/reviewController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Pintu Terbuka: Pembeli mengirim ulasan
router.post('/', createReview);

// Pintu Tergembok: Hanya Admin yang bisa melihat semua ulasan, menyetujui, dan menghapusnya
router.get('/', verifyToken, getAllReviews);
router.put('/:id/publish', verifyToken, publishReview);
router.delete('/:id', verifyToken, deleteReview);

export default router;