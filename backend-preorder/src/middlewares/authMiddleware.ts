import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Karena kita menambahkan data baru ke dalam Request, kita sesuaikan tipe datanya
interface AuthRequest extends Request {
  user?: any;
}

// Ini adalah fungsi Satpam kita
export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): any => {
  // 1. Satpam meminta Kunci/Tiket dari header pengunjung
  const authHeader = req.header('Authorization');
  
  // Jika tidak bawa kunci sama sekali
  if (!authHeader) {
    return res.status(401).json({ message: "Akses Ditolak! Anda harus login terlebih dahulu." });
  }

  // 2. Format kunci standar industri adalah: "Bearer <token_acak>"
  // Kita pisahkan kata "Bearer" dan ambil tokennya saja
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: "Akses Ditolak! Format token tidak valid." });
  }

  try {
    // 3. Satpam mengecek keaslian kunci menggunakan sandi rahasia di file .env
    const verified = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = verified; // Simpan identitas admin
    
    // 4. Kunci asli! Persilakan masuk ke Koki (lanjutkan proses)
    next(); 
  } catch (error) {
    // Kunci palsu atau sudah kedaluwarsa
    res.status(403).json({ message: "Token tidak valid atau sudah kedaluwarsa!" });
  }
};