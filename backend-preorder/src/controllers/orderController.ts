import { Request, Response } from 'express';
import prisma from '../config/database.js';
import { buildReceiptPDF } from '../services/pdfService.js';

// Fitur Membuat Pesanan Baru (Checkout)
export const createOrder = async (req: Request, res: Response) => {
  try {
    // 1. Menerima data dari form pembeli (sesuai nama di database)
    const { customerName, whatsappNumber, address, items } = req.body;
    
    // 2. Menghitung Total Belanjaan
    let totalAmount = 0;
    for (const item of items) {
      totalAmount += item.price * item.quantity;
    }

    // 3. Menghitung DP 50%
    const dpAmount = totalAmount / 2;

    // 4. Membuat Nomor Invoice Otomatis (Contoh: INV-1683948302)
    const invoiceNumber = `INV-${Date.now()}`;

    // 5. Menyimpan data ke tabel Order DAN OrderItem sekaligus!
    const newOrder = await prisma.order.create({
      data: {
        invoiceNumber: invoiceNumber,
        customerName: customerName,
        whatsappNumber: whatsappNumber,
        address: address,
        totalAmount: totalAmount,
        dpAmount: dpAmount,
        // Status otomatis menggunakan default "Menunggu Pembayaran" dari schema
        
        items: { // <-- Menggunakan 'items' sesuai schema relasi Anda
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            subtotal: item.price * item.quantity // <-- Menggunakan 'subtotal'
          }))
        }
      },
      include: {
        items: true // Meminta Prisma mengembalikan data detail item juga
      }
    });

    res.status(201).json({ 
      message: "Pesanan Pre-Order berhasil dibuat!", 
      data: newOrder 
    });
  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: "Gagal memproses pesanan", error });
  }
};

// Fitur Menampilkan Semua Pesanan (Untuk Admin melihat orderan masuk)
export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true // Tampilkan juga detail barang apa saja yang dibeli
      },
      orderBy: { createdAt: 'desc' } // Urutkan dari pesanan paling baru
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data pesanan", error });
  }
};

// Fitur Admin Mengubah Status Pesanan
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Mengambil ID dari URL (misal: /api/orders/1/status)
    const { status } = req.body; // Mengambil teks status baru dari form admin

    const updatedOrder = await prisma.order.update({
      where: { id: Number(id) }, // Ubah id dari teks (URL) menjadi angka
      data: { status: status }
    });

    res.status(200).json({ 
      message: "Status pesanan berhasil diperbarui!", 
      data: updatedOrder 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengubah status pesanan", error });
  }
};

// Fitur Menghapus Pesanan Beserta Detail & Pembayarannya (DELETE)
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // 1. Hapus detail barangnya dulu (Tabel OrderItem)
    await prisma.orderItem.deleteMany({ where: { orderId: Number(id) } });
    
    // 2. Hapus bukti pembayarannya jika ada (Tabel Payment)
    await prisma.payment.deleteMany({ where: { orderId: Number(id) } });
    
    // 3. Baru hapus Induk Pesanannya (Tabel Order)
    await prisma.order.delete({ where: { id: Number(id) } });

    res.status(200).json({ message: "Pesanan beserta seluruh detailnya berhasil dihapus bersih!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menghapus pesanan", error });
  }
};

// Fitur Download Struk PDF
export const downloadReceipt = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    // 1. Cari data pesanan beserta item-nya
    const order = await prisma.order.findUnique({
      where: { id: Number(id) },
      include: { items: true }
    });

    if (!order) {
      return res.status(404).json({ message: "Pesanan tidak ditemukan!" });
    }

    // 2. Lempar data pesanan ke dapur (Service) untuk dibuatkan PDF
    const pdfBuffer = await buildReceiptPDF(order);

    // 3. Kirim file PDF ke pengguna (browser/Postman)
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${order.invoiceNumber}.pdf`);
    res.send(pdfBuffer);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal membuat struk PDF", error });
  }
};