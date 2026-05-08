import express from 'express';
import { createPayment, getPayments, deletePayment } from '../controllers/paymentController.js';
import { verifyToken } from '../middlewares/authMiddleware.js'; // <-- Panggil Satpam

const router = express.Router();

// PINTU TERBUKA (Publik / Pembeli)
router.post('/', createPayment);

// PINTU TERGEMBOK (Hanya Admin)
router.get('/', verifyToken, getPayments);
router.delete('/:id', verifyToken, deletePayment);

export default router;