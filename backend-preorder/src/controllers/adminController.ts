import { Request, Response } from 'express';
import prisma from '../config/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// 1. Fitur Membuat Akun Admin (Daftar)
export const registerAdmin = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    // Cek apakah email sudah dipakai
    const existingAdmin = await prisma.admin.findUnique({ where: { email } });
    if (existingAdmin) {
      return res.status(400).json({ message: "Email sudah terdaftar!" });
    }

    // Mengacak (Hash) Password sebelum disimpan ke database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await prisma.admin.create({
      data: {
        email: email,
        password: hashedPassword
      }
    });

    res.status(201).json({ message: "Akun Admin berhasil dibuat!" });
  } catch (error) {
    res.status(500).json({ message: "Gagal membuat akun admin", error });
  }
};

// 2. Fitur Login Admin
export const loginAdmin = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    // Cari admin berdasarkan email
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      return res.status(404).json({ message: "Email tidak ditemukan!" });
    }

    // Cocokkan password yang diketik dengan password acak di database
    const isPasswordMatch = await bcrypt.compare(password, admin.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Password salah!" });
    }

    // Jika cocok, buatkan Tiket (Token JWT) yang berlaku selama 1 hari
    const token = jwt.sign(
      { id: admin.id, email: admin.email }, 
      process.env.JWT_SECRET as string, 
      { expiresIn: '1d' }
    );

    res.status(200).json({ 
      message: "Login berhasil!", 
      token: token 
    });
  } catch (error) {
    res.status(500).json({ message: "Gagal melakukan login", error });
  }
};