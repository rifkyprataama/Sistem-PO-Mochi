import express from 'express';
import { createOrder, getOrders, updateOrderStatus, deleteOrder, downloadReceipt } from '../controllers/orderController.js';
import { verifyToken } from '../middlewares/authMiddleware.js'; // <-- Panggil Satpam

const router = express.Router();

// PINTU TERBUKA (Publik / Pembeli)
router.post('/', createOrder);

// PINTU TERGEMBOK (Hanya Admin)
router.get('/', verifyToken, getOrders);
router.put('/:id/status', verifyToken, updateOrderStatus);
router.delete('/:id', verifyToken, deleteOrder);
router.get('/:id/receipt', verifyToken, downloadReceipt);

export default router;