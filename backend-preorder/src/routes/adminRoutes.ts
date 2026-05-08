// src/routes/adminRoutes.ts
import express from 'express';
import { registerAdmin, loginAdmin } from '../controllers/adminController.js';

const router = express.Router();

router.post('/register', registerAdmin); // <-- Cukup '/register'
router.post('/login', loginAdmin);       // <-- Cukup '/login'

export default router;