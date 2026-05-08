import express from 'express';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { verifyToken } from '../middlewares/authMiddleware.js'; // <-- 1. Panggil Satpamnya

const router = express.Router();

// Pintu ini TIDAK DIGEMBOK (Bisa diakses publik/pembeli untuk melihat katalog)
router.get('/', getProducts);

// Pintu-pintu di bawah ini DIGEMBOK (Satpam 'verifyToken' disisipkan di tengah)
router.post('/', verifyToken, createProduct);
router.put('/:id', verifyToken, updateProduct);
router.delete('/:id', verifyToken, deleteProduct);

export default router;