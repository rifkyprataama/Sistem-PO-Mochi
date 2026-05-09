import { Request, Response } from 'express';
import prisma from '../config/database.js';

// 1. Fitur Menampilkan Semua Produk
export const getProducts = async (req: Request, res: Response) => {
  try {
    // Menangkap kata kunci pencarian dan target (siapa yang meminta data)
    const { search, target } = req.query;
    const now = new Date();

    let whereClause: any = {};

    // LOGIKA PENTING:
    // Jika yang meminta BUKAN admin, terapkan filter ketat 
    // (Hanya tampilkan produk yang Aktif & Masih dalam masa PO)
    if (target !== 'admin') {
      whereClause = {
        isActive: true,
        poOpenDate: { lte: now },
        poCloseDate: { gte: now }
      };
    }
    // Jika target === 'admin', whereClause tetap kosong {}, artinya ambil SEMUA data!

    // Jika ada pencarian nama (berlaku untuk admin maupun pelanggan)
    if (search) {
      whereClause.name = { contains: String(search) };
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });
    
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data produk", error });
  }
};

// 2. Fitur Menambah Produk Baru
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, imageUrl, poOpenDate, poCloseDate, isActive } = req.body;

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        imageUrl: imageUrl || "https://via.placeholder.com/300",
        poOpenDate: new Date(poOpenDate),
        poCloseDate: new Date(poCloseDate),
        isActive: isActive !== undefined ? isActive : true
      }
    });

    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal menambah produk" });
  }
};

// 3. Fitur Mengubah Data Produk (PUT)
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, imageUrl, poOpenDate, poCloseDate, isActive } = req.body;

    const updateData: any = {};

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = Number(price);
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (isActive !== undefined) updateData.isActive = isActive;
    
    // PERBAIKAN: Menambahkan poOpenDate dan poCloseDate pada fitur Edit
    if (poOpenDate) updateData.poOpenDate = new Date(poOpenDate);
    if (poCloseDate) updateData.poCloseDate = new Date(poCloseDate);

    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: updateData
    });

    res.status(200).json({ success: true, message: "Produk diperbarui!", data: updatedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Gagal memperbarui produk", error });
  }
};

// 4. Fitur Menghapus Produk (DELETE)
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({
      where: { id: Number(id) }
    });
    res.status(200).json({ success: true, message: "Produk berhasil dihapus!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal menghapus produk. Pastikan produk ini belum ada di data pesanan.", error });
  }
};