import { Request, Response } from 'express';
// Ingat: Dalam gaya module modern (NodeNext), kita harus menambahkan akhiran .js saat mengimpor file buatan sendiri
import prisma from '../config/database.js';

// 1. Fitur Menampilkan Semua Produk
export const getProducts = async (req: Request, res: Response) => {
  try {
    // Menangkap kata kunci 'search' dari URL (contoh: ?search=tas)
    const { search } = req.query;

    const products = await prisma.product.findMany({
      // Jika 'search' ada isinya, buat aturan pencarian. Jika kosong, biarkan kosong {}.
      where: search ? {
        name: {
          contains: String(search)
        }
      } : {},
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
    // Mengambil data yang dikirim dari frontend
    const { name, description, price, imageUrl, poCloseDate } = req.body;

    const newProduct = await prisma.product.create({
      data: {
        name: name,
        description: description,
        price: price,
        imageUrl: imageUrl,
        poCloseDate: new Date(poCloseDate), // Ubah teks tanggal jadi format Date
      }
    });

    res.status(201).json({ message: "Produk berhasil ditambahkan!", data: newProduct });
  } catch (error) {
    res.status(500).json({ message: "Gagal menambahkan produk", error });
  }
};

// Fitur Mengubah Data Produk (PUT)
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, imageUrl, poCloseDate, isActive } = req.body;

    // 1. Buat keranjang kosong untuk menampung data yang akan diubah
    const updateData: any = {};

    // 2. Hanya masukkan data ke keranjang JIKA Admin mengirimkannya
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (isActive !== undefined) updateData.isActive = isActive;
    
    // Khusus tanggal, kita ubah formatnya ke Date
    if (poCloseDate !== undefined) {
      updateData.poCloseDate = new Date(poCloseDate);
    }

    // 3. Simpan perubahan ke database
    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: updateData
    });

    res.status(200).json({ 
      message: "Produk berhasil diperbarui!", 
      data: updatedProduct 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal memperbarui produk", error });
  }
};

// Fitur Menghapus Produk (DELETE)
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({
      where: { id: Number(id) }
    });
    res.status(200).json({ message: "Produk berhasil dihapus!" });
  } catch (error) {
    // Jika produk gagal dihapus, biasanya karena produk ini sudah pernah dibeli (ada di tabel OrderItem)
    res.status(500).json({ message: "Gagal menghapus produk. Pastikan produk ini belum ada di data pesanan.", error });
  }
};