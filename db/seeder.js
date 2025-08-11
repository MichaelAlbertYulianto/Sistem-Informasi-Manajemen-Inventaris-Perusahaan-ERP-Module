const bcrypt = require("bcrypt");
const { db } = require("./db");

const insertUsersQuery = `
    INSERT INTO users (username, email, password_hash, role) VALUES 
    (?, ?, ?, ?);
`;

const usersData = [
  {
    username: "SuperAdmin",
    email: "superadmin@omniflow.id",
    password: "Superadmin12345.",
    role: "SuperAdmin",
  },
  {
    username: "manager",
    email: "manager@omniflow.id",
    password: "Manager12345.",
    role: "Manager",
  },
  {
    username: "admin inventaris",
    email: "admininventaris@omniflow.id",
    password: "AdminInventaris12345.",
    role: "admin",
  },
  // {
  //   username: "user",
  //   email: "user@omniflow.id",
  //   password: "User12345.",
  //   role: "User",
  // },
  {
    username: "support",
    email: "support@omniflow.id",
    password: "Support12345.",
    role: "User",
  },
  {
    username: "logistik",
    email: "logistik@omniflow.id",
    password: "Logistik12345.",
    role: "Manager",
  },
  {
    username: "supervisor",
    email: "supervisor@omniflow.id",
    password: "Supervisor12345.",
    role: "Supervisor",
  },
  {
    username: "teknisi",
    email: "teknisi@omniflow.id",
    password: "Teknisi12345.",
    role: "User",
  },
  {
    username: "audit",
    email: "audit@omniflow.id",
    password: "Audit12345.",
    role: "Manager",
  },
];

const inventoryItems = [
  {
    nama: 'Laptop Asus TUF Gaming',
    deskripsi: 'Laptop gaming dengan GTX 1650 Ti, 16GB RAM, 512GB SSD',
    tanggal_pembelian: '2021-01-15',
    harga_pembelian: 15000000,
    status: 'Tersedia'
  },
  {
    nama: 'Laptop MacBook Pro M1',
    deskripsi: 'Laptop Apple dengan chip M1, 8GB RAM, 256GB SSD',
    tanggal_pembelian: '2021-02-22',
    harga_pembelian: 18000000,
    status: 'Dipinjam'
  },
  {
    nama: 'Smartphone Samsung Galaxy S21',
    deskripsi: 'Smartphone Android dengan Snapdragon 888, 8GB RAM, 128GB Storage',
    tanggal_pembelian: '2021-03-05',
    harga_pembelian: 12000000,
    status: 'Tersedia'
  },
  {
    nama: 'Smartphone iPhone 13',
    deskripsi: 'Smartphone Apple dengan chip A15 Bionic, 128GB Storage',
    tanggal_pembelian: '2021-10-10',
    harga_pembelian: 14000000,
    status: 'Tersedia'
  },
  {
    nama: 'Tablet iPad Pro 2021',
    deskripsi: 'Tablet Apple dengan chip M1, 8GB RAM, 256GB Storage',
    tanggal_pembelian: '2021-04-18',
    harga_pembelian: 13000000,
    status: 'Maintenance'
  },
  {
    nama: 'Tablet Samsung Galaxy Tab S7',
    deskripsi: 'Tablet Android dengan Snapdragon 865+, 6GB RAM, 128GB Storage',
    tanggal_pembelian: '2021-05-20',
    harga_pembelian: 9000000,
    status: 'Tersedia'
  },
  {
    nama: 'Smartwatch Apple Watch Series 7',
    deskripsi: 'Smartwatch dengan layar always-on, GPS, water resistant',
    tanggal_pembelian: '2021-11-05',
    harga_pembelian: 6000000,
    status: 'Dipinjam'
  },
  {
    nama: 'Smartwatch Samsung Galaxy Watch 4',
    deskripsi: 'Smartwatch dengan Wear OS, health monitoring, GPS',
    tanggal_pembelian: '2021-09-15',
    harga_pembelian: 4000000,
    status: 'Tersedia'
  },
  {
    nama: 'Kamera Sony Alpha 7 III',
    deskripsi: 'Kamera mirrorless full-frame dengan 24.2MP',
    tanggal_pembelian: '2021-07-10',
    harga_pembelian: 25000000,
    status: 'Maintenance'
  },
  {
    nama: 'Kamera Canon EOS R6',
    deskripsi: 'Kamera mirrorless full-frame dengan 20.1MP',
    tanggal_pembelian: '2021-08-22',
    harga_pembelian: 28000000,
    status: 'Tersedia'
  },
  {
    nama: 'Printer HP LaserJet Pro',
    deskripsi: 'Printer laser monochrome dengan WiFi',
    tanggal_pembelian: '2021-06-11',
    harga_pembelian: 3500000,
    status: 'Tersedia'
  },
  {
    nama: 'Printer Epson L3150',
    deskripsi: 'Printer inkjet multifungsi dengan tank system',
    tanggal_pembelian: '2022-01-05',
    harga_pembelian: 2800000,
    status: 'Dipinjam'
  },
  {
    nama: 'Monitor Dell Ultrasharp 27"',
    deskripsi: 'Monitor 4K dengan color accuracy tinggi',
    tanggal_pembelian: '2022-02-10',
    harga_pembelian: 7500000,
    status: 'Tersedia'
  },
  {
    nama: 'Monitor LG 34" Ultrawide',
    deskripsi: 'Monitor ultrawide dengan resolusi 3440x1440, 144Hz',
    tanggal_pembelian: '2022-03-18',
    harga_pembelian: 8500000,
    status: 'Tersedia'
  },
  {
    nama: 'Proyektor Epson EB-U05',
    deskripsi: 'Proyektor Full HD dengan 3400 lumens',
    tanggal_pembelian: '2022-04-22',
    harga_pembelian: 9500000,
    status: 'Lost'
  },
  {
    nama: 'Laptop Asus TUF Gaming',
    deskripsi: 'Laptop gaming dengan GTX 1650 Ti, 16GB RAM, 512GB SSD',
    tanggal_pembelian: '2021-01-15',
    harga_pembelian: 15000000,
    status: 'Tersedia'
  },
  {
    nama: 'Laptop MacBook Pro M1',
    deskripsi: 'Laptop Apple dengan chip M1, 8GB RAM, 256GB SSD',
    tanggal_pembelian: '2021-02-22',
    harga_pembelian: 18000000,
    status: 'Dipinjam'
  },
  {
    nama: 'Smartphone Samsung Galaxy S21',
    deskripsi: 'Smartphone Android dengan Snapdragon 888, 8GB RAM, 128GB Storage',
    tanggal_pembelian: '2021-03-05',
    harga_pembelian: 12000000,
    status: 'Tersedia'
  },
  {
    nama: 'Tablet iPad Pro 2021',
    deskripsi: 'Tablet Apple dengan chip M1, 8GB RAM, 256GB Storage',
    tanggal_pembelian: '2021-04-18',
    harga_pembelian: 13000000,
    status: 'Maintenance'
  },
  {
    nama: 'Tablet Samsung Galaxy Tab S7',
    deskripsi: 'Tablet Android dengan Snapdragon 865+, 6GB RAM, 128GB Storage',
    tanggal_pembelian: '2021-05-20',
    harga_pembelian: 9000000,
    status: 'Tersedia'
  },
  {
    nama: 'Smartwatch Apple Watch Series 7',
    deskripsi: 'Smartwatch dengan layar always-on, GPS, water resistant',
    tanggal_pembelian: '2021-11-05',
    harga_pembelian: 6000000,
    status: 'Dipinjam'
  },
  {
    nama: 'Smartwatch Samsung Galaxy Watch 4',
    deskripsi: 'Smartwatch dengan Wear OS, health monitoring, GPS',
    tanggal_pembelian: '2021-09-15',
    harga_pembelian: 4000000,
    status: 'Tersedia'
  },
  {
    nama: 'Kamera Sony Alpha 7 III',
    deskripsi: 'Kamera mirrorless full-frame dengan 24.2MP',
    tanggal_pembelian: '2021-07-10',
    harga_pembelian: 25000000,
    status: 'Maintenance'
  },
  {
    nama: 'Kamera Canon EOS R6',
    deskripsi: 'Kamera mirrorless full-frame dengan 20.1MP',
    tanggal_pembelian: '2021-08-22',
    harga_pembelian: 28000000,
    status: 'Tersedia'
  },
  {
    nama: 'Printer HP LaserJet Pro',
    deskripsi: 'Printer laser monochrome dengan WiFi',
    tanggal_pembelian: '2021-06-11',
    harga_pembelian: 3500000,
    status: 'Tersedia'
  },
  {
    nama: 'Printer Epson L3150',
    deskripsi: 'Printer inkjet multifungsi dengan tank system',
    tanggal_pembelian: '2022-01-05',
    harga_pembelian: 2800000,
    status: 'Tersedia'
  },
  {
    nama: 'Monitor Dell Ultrasharp 27"',
    deskripsi: 'Monitor 4K dengan color accuracy tinggi',
    tanggal_pembelian: '2022-02-10',
    harga_pembelian: 7500000,
    status: 'Maintenance'
  },
  {
    nama: 'Monitor LG 34" Ultrawide',
    deskripsi: 'Monitor ultrawide dengan resolusi 3440x1440, 144Hz',
    tanggal_pembelian: '2022-03-18',
    harga_pembelian: 8500000,
    status: 'Lost'
  },
  {
    nama: 'Proyektor Epson EB-U05',
    deskripsi: 'Proyektor Full HD dengan 3400 lumens',
    tanggal_pembelian: '2022-04-22',
    harga_pembelian: 9500000,
    status: 'Lost'
  }
];

const seedBorrowingLogs = async () => {
  try {
    console.log("Seeding borrowing logs...");

    // Fetch existing inventory and user IDs
    const [inventories] = await db.query("SELECT id FROM inventories");
    const [users] = await db.query("SELECT id FROM users");

    if (inventories.length === 0 || users.length === 0) {
      console.warn("No inventories or users found. Skipping borrowing_logs seeding.");
      return;
    }

    // Move borrowingLogsData definition outside this function if it's used globally
    // For now, it's defined here and used within this function's scope.



  } catch (error) {
    console.error("Error seeding borrowing logs:", error);
  }
};

const createBorrowingsData = () => {
  const borrowings = [];
  
  borrowings.push({
    inventory_id: 2,
    user_id: 3,
    request_date: "2025-03-09 10:00:00", // Perbaikan format tanggal
    take_date: "2025-03-10 09:00:00",
    return_date: null,
    status: 'Dipinjam'
  });
  
  borrowings.push({
    inventory_id: 7,
    user_id: 2,
    request_date: "2025-03-10 14:00:00",
    take_date: "2025-03-12 14:30:00",
    return_date: null,
    status: 'Dipinjam'
  });
  
  borrowings.push({
    inventory_id: 12,
    user_id: 7,
    request_date: "2025-03-11 13:30:00",
    take_date: "2025-03-13 11:15:00",
    return_date: null,
    status: 'Dipinjam'
  });
  
  
  return borrowings;
};



const borrowingsData = createBorrowingsData();

// Define borrowingLogsData globally or pass it as an argument if needed elsewhere
const borrowingLogsData = [
  {
    inventory_id: 1,
    user_id: 4,
    request_date: "2024-08-12 10:00:00",
    take_date: "2024-08-13 11:00:00",
    return_date: "2024-08-16 15:00:00",
    item_condition: "Sempurna",
  },
  {
    inventory_id: 2,
    user_id: 2,
    request_date: "2024-08-18 09:00:00",
    take_date: "2024-08-19 10:00:00",
    return_date: "2024-08-20 10:00:00",
    item_condition: "Sempurna",
  },
  {
    inventory_id: 3,
    user_id: 7,
    request_date: "2024-08-22 14:00:00",
    take_date: "2024-08-23 14:00:00",
    return_date: "2024-08-25 14:00:00",
    item_condition: "Sempurna",
  },
  {
    inventory_id: 4,
    user_id: 8,
    request_date: "2024-08-27 16:00:00",
    take_date: "2024-08-28 09:00:00",
    return_date: "2024-09-01 13:00:00",
    item_condition: "Sempurna",
  },
  {
    inventory_id: 18,
    user_id: 4,
    request_date: "2024-09-05 11:30:00",
    take_date: "2024-09-06 12:00:00",
    return_date: "2024-09-10 14:00:00",
    item_condition: "Rusak",
  },
  {
    inventory_id: 25,
    user_id: 5,
    request_date: "2024-09-08 08:00:00",
    take_date: "2024-09-09 09:00:00",
    return_date: "2024-09-12 10:00:00",
    item_condition: "Sempurna",
  },
  {
    inventory_id: 7,
    user_id: 7,
    request_date: "2024-09-15 15:00:00",
    take_date: "2024-09-16 16:00:00",
    return_date: "2024-09-19 17:00:00",
    item_condition: "Sempurna",
  },
  {
    inventory_id: 12,
    user_id: 8,
    request_date: "2024-09-20 10:00:00",
    take_date: "2024-09-21 11:00:00",
    return_date: "2024-09-24 12:00:00",
    item_condition: "Rusak",
  },
  {
    inventory_id: 29,
    user_id: 4,
    request_date: "2024-09-25 14:00:00",
    take_date: "2024-09-26 15:00:00",
    return_date: "2024-09-26 15:00:00",
    item_condition: "Hilang",
  },
  {
    inventory_id: 20,
    user_id: 5,
    request_date: "2024-10-01 09:00:00",
    take_date: "2024-10-02 10:00:00",
    return_date: "2024-10-05 11:00:00",
    item_condition: "Sempurna",
  },
  {
    inventory_id: 5,
    user_id: 7,
    request_date: "2024-10-06 13:00:00",
    take_date: "2024-10-07 14:00:00",
    return_date: "2024-10-10 15:00:00",
    item_condition: "Rusak",
  },
  {
    inventory_id: 23,
    user_id: 8,
    request_date: "2024-10-12 16:00:00",
    take_date: "2024-10-13 17:00:00",
    return_date: "2024-10-16 18:00:00",
    item_condition: "Sempurna",
  },
  {
    inventory_id: 8,
    user_id: 4,
    request_date: "2024-10-18 10:00:00",
    take_date: "2024-10-19 11:00:00",
    return_date: "2024-10-22 12:00:00",
    item_condition: "Sempurna",
  },
  {
    inventory_id: 2,
    user_id: 5,
    request_date: "2024-10-25 14:00:00",
    take_date: "2024-10-26 15:00:00",
    return_date: "2024-10-29 16:00:00",
    item_condition: "Rusak",
  },
  {
    inventory_id: 15,
    user_id: 7,
    request_date: "2024-11-01 11:00:00",
    take_date: "2024-11-02 12:00:00",
    return_date: "2024-11-02 12:00:00",
    item_condition: "Hilang",
  },
  {
    inventory_id: 26,
    user_id: 8,
    request_date: "2024-11-05 09:00:00",
    take_date: "2024-11-06 10:00:00",
    return_date: "2024-11-09 11:00:00",
    item_condition: "Sempurna",
  },
  {
    inventory_id: 9,
    user_id: 4,
    request_date: "2024-11-12 15:00:00",
    take_date: "2024-11-13 16:00:00",
    return_date: "2024-11-16 17:00:00",
    item_condition: "Sempurna",
  },
  {
    inventory_id: 21,
    user_id: 5,
    request_date: "2024-11-18 12:00:00",
    take_date: "2024-11-19 13:00:00",
    return_date: "2024-11-22 14:00:00",
    item_condition: "Sempurna",
  },
  {
    inventory_id: 10,
    user_id: 7,
    request_date: "2024-11-25 10:00:00",
    take_date: "2024-11-26 11:00:00",
    return_date: "2024-11-29 12:00:00",
    item_condition: "Rusak",
  },
  {
    inventory_id: 28,
    user_id: 8,
    request_date: "2024-12-01 14:00:00",
    take_date: "2024-12-02 15:00:00",
    return_date: "2024-12-02 15:00:00",
    item_condition: "Hilang",
  },
  {
    inventory_id: 4,
    user_id: 4,
    request_date: "2024-12-05 09:00:00",
    take_date: "2024-12-06 10:00:00",
    return_date: "2024-12-09 11:00:00",
    item_condition: "Sempurna",
  },
  {
    inventory_id: 17,
    user_id: 5,
    request_date: "2024-12-11 11:00:00",
    take_date: "2024-12-12 12:00:00",
    return_date: "2024-12-15 13:00:00",
    item_condition: "Sempurna",
  },
  {
    inventory_id: 1,
    user_id: 7,
    request_date: "2024-12-18 15:00:00",
    take_date: "2024-12-19 16:00:00",
    return_date: "2024-12-22 17:00:00",
    item_condition: "Rusak",
  },
  {
    inventory_id: 24,
    user_id: 8,
    request_date: "2024-12-25 10:00:00",
    take_date: "2024-12-26 11:00:00",
    return_date: "2024-12-29 12:00:00",
    item_condition: "Sempurna",
  },
  {
    inventory_id: 13,
    user_id: 4,
    request_date: "2025-01-01 13:00:00",
    take_date: "2025-01-02 14:00:00",
    return_date: "2025-01-05 15:00:00",
    item_condition: "Sempurna",
  },
  {
    inventory_id: 27,
    user_id: 5,
    request_date: "2025-01-08 16:00:00",
    take_date: "2025-01-09 17:00:00",
    return_date: "2025-01-12 18:00:00",
    item_condition: "Sempurna",
  },
  {
    inventory_id: 6,
    user_id: 7,
    request_date: "2025-01-15 09:00:00",
    take_date: "2025-01-16 10:00:00",
    return_date: "2025-01-19 11:00:00",
    item_condition: "Rusak",
  },
  {
    inventory_id: 19,
    user_id: 8,
    request_date: "2025-01-22 11:00:00",
    take_date: "2025-01-23 12:00:00",
    return_date: "2025-01-26 13:00:00",
    item_condition: "Sempurna",
  },
  {
    inventory_id: 2,
    user_id: 4,
    request_date: "2025-01-29 14:00:00",
    take_date: "2025-01-30 15:00:00",
    return_date: "2025-02-02 16:00:00",
    item_condition: "Sempurna",
  },
  {
    inventory_id: 11,
    user_id: 5,
    request_date: "2025-02-05 10:00:00",
    take_date: "2025-02-06 11:00:00",
    return_date: "2025-02-09 12:00:00",
    item_condition: "Sempurna",
  },
  {
    inventory_id: 22,
    user_id: 7,
    request_date: "2025-02-12 13:00:00",
    take_date: "2025-02-13 14:00:00",
    return_date: "2025-02-16 15:00:00",
    item_condition: "Rusak",
  },
  {
    inventory_id: 16,
    user_id: 4,
    request_date: "2025-02-22 10:00:00",
    take_date: "2025-02-23 11:00:00",
    return_date: "2025-02-26 12:00:00",
    item_condition: "Sempurna",
  },
  {
    inventory_id: 25,
    user_id: 5,
    request_date: "2025-03-01 14:00:00",
    take_date: "2025-03-02 15:00:00",
    return_date: "2025-03-05 16:00:00",
    item_condition: "Rusak",
  },
  {
    inventory_id: 8,
    user_id: 7,
    request_date: "2025-03-08 09:00:00",
    take_date: "2025-03-09 10:00:00",
    return_date: "2025-03-12 11:00:00",
    item_condition: "Sempurna",
  },
  {
    inventory_id: 12,
    user_id: 8,
    request_date: "2025-03-15 11:00:00",
    take_date: "2025-03-16 12:00:00",
    return_date: "2025-03-19 13:00:00",
    item_condition: "Sempurna",
  },
  {
    inventory_id: 20,
    user_id: 4,
    request_date: "2025-03-22 15:00:00",
    take_date: "2025-03-23 16:00:00",
    return_date: "2025-03-26 17:00:00",
    item_condition: "Sempurna",
  },
  {
    inventory_id: 5,
    user_id: 5,
    request_date: "2025-03-29 10:00:00",
    take_date: "2025-03-30 11:00:00",
    return_date: "2025-04-02 12:00:00",
    item_condition: "Rusak",
  },
  {
    inventory_id: 14,
    user_id: 8,
    request_date: "2025-04-08 16:00:00",
    take_date: "2025-04-09 17:00:00",
    return_date: "2025-04-12 18:00:00",
    item_condition: "Sempurna",
  },
  {
    inventory_id: 21,
    user_id: 4,
    request_date: "2025-04-15 09:00:00",
    take_date: "2025-04-16 10:00:00",
    return_date: "2025-04-19 11:00:00",
    item_condition: "Sempurna",
  },
  {
    inventory_id: 9,
    user_id: 5,
    request_date: "2025-04-22 11:00:00",
    take_date: "2025-04-23 12:00:00",
    return_date: "2025-04-26 13:00:00",
    item_condition: "Rusak",
  },
  {
    inventory_id: 23,
    user_id: 7,
    request_date: "2025-04-29 15:00:00",
    take_date: "2025-04-30 16:00:00",
    return_date: "2025-05-03 17:00:00",
    item_condition: "Sempurna",
  },
  {
    inventory_id: 18,
    user_id: 8,
    request_date: "2025-05-06 10:00:00",
    take_date: "2025-05-07 11:00:00",
    return_date: "2025-05-10 12:00:00",
    item_condition: "Rusak",
  },
  {
    inventory_id: 2,
    user_id: 4,
    request_date: "2025-05-13 13:00:00",
    take_date: "2025-05-14 14:00:00",
    return_date: "2025-05-17 15:00:00",
    item_condition: "Sempurna",
  },
  {
    inventory_id: 24,
    user_id: 7,
    request_date: "2025-05-23 09:00:00",
    take_date: "2025-05-24 10:00:00",
    return_date: "2025-05-27 11:00:00",
    item_condition: "Sempurna",
  },
  {
    inventory_id: 6,
    user_id: 8,
    request_date: "2025-05-30 11:00:00",
    take_date: "2025-05-31 12:00:00",
    return_date: "2025-06-03 13:00:00",
    item_condition: "Sempurna",
  },
  {
    inventory_id: 19,
    user_id: 4,
    request_date: "2025-06-06 14:00:00",
    take_date: "2025-06-07 15:00:00",
    return_date: "2025-06-10 16:00:00",
    item_condition: "Sempurna",
  },
  {
    inventory_id: 10,
    user_id: 5,
    request_date: "2025-06-13 16:00:00",
    take_date: "2025-06-14 17:00:00",
    return_date: "2025-06-17 18:00:00",
    item_condition: "Rusak",
  },
  {
    inventory_id: 14,
    user_id: 8,
    request_date: "2025-06-22 13:00:00",
    take_date: "2025-06-23 14:00:00",
    return_date: "2025-07-25 15:00:00",
    item_condition: "Sempurna",
  },
  {
    inventory_id: 16,
    user_id: 4,
    request_date: "2025-06-27 16:00:00",
    take_date: "2025-06-28 17:00:00",
    return_date: "2025-07-30 18:00:00",
    item_condition: "Sempurna",
  },
  {
    inventory_id: 9,
    user_id: 2,
    request_date: "2025-07-02 09:00:00",
    take_date: "2025-07-03 10:00:00",
    return_date: "2025-07-06 11:00:00",
    item_condition: "Rusak",
  },
  {
    inventory_id: 13,
    user_id: 7,
    request_date: "2025-07-09 11:00:00",
    take_date: "2025-07-10 12:00:00",
    return_date: "2025-07-13 13:00:00",
    item_condition: "Sempurna",
  },
  {
    inventory_id: 22,
    user_id: 8,
    request_date: "2025-07-15 14:00:00",
    take_date: "2025-07-16 15:00:00",
    return_date: "2025-07-19 16:00:00",
    item_condition: "Rusak",
  },
  {
    inventory_id: 2,
    user_id: 4,
    request_date: "2025-07-22 10:00:00",
    take_date: "2025-07-23 11:00:00",
    return_date: "2025-07-26 12:00:00",
    item_condition: "Sempurna",
  },
  {
    inventory_id: 26,
    user_id: 2,
    request_date: "2025-07-25 13:00:00",
    take_date: "2025-07-26 14:00:00",
    return_date: "2025-07-29 15:00:00",
    item_condition: "Sempurna",
  },
];

async function runSeeder() {
  try {
    console.log("Seeding users table...");
    for (let user of usersData) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await db.query(insertUsersQuery, [
        user.username,
        user.email,
        hashedPassword,
        user.role,
      ]);
    }
    console.log("Seeded users table with hashed passwords.");
    
    console.log("Seeding inventories table...");
    for (let item of inventoryItems) {
      await db.query(
        `INSERT INTO inventories (nama, deskripsi, tanggal_pembelian, harga_pembelian) 
         VALUES (?, ?, ?, ?)`,
        [item.nama, item.deskripsi, item.tanggal_pembelian, item.harga_pembelian]
      );
    }
    console.log("Seeded inventories table.");
    
    console.log("Seeding inventory_statuses table...");
    for (let i = 0; i < inventoryItems.length; i++) {
      await db.query(
        `INSERT INTO inventory_statuses (inventory_id, status) VALUES (?, ?)`,
        [i + 1, inventoryItems[i].status]
      );
    }
    console.log("Seeded inventory_statuses table.");
    
    // console.log("Seeding inventory_logs table...");
    // for (let i = 0; i < inventoryItems.length; i++) {
    //   await db.query(
    //     `INSERT INTO inventory_logs (inventory_id, user_id, activity) VALUES (?, ?, ?)`,
    //     [i + 1, 1, `Added new inventory: ${inventoryItems[i].nama}`]
    //   );
    // }
    // console.log("Seeded inventory_logs table.");
    
    console.log("Seeding borrowings table...");
    for (let borrowing of borrowingsData) {
      await db.query(
        `INSERT INTO borrowings (inventory_id, user_id,request_date, take_date, return_date, status) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          borrowing.inventory_id,
          borrowing.user_id,
          borrowing.request_date, 
          borrowing.take_date,
          borrowing.return_date,
          borrowing.status
        ]
      );
    }
    console.log("Seeded borrowings table.");
    
    for (const log of borrowingLogsData) {
      await db.query(
        "INSERT INTO borrowing_logs (inventory_id, user_id, request_date, take_date, return_date, item_condition) VALUES (?, ?, ?, ?, ?, ?)",
        [
          log.inventory_id,
          log.user_id,
          log.request_date,
          log.take_date,
          log.return_date,
          log.item_condition,
        ]
      );
    }
    console.log("Borrowing logs seeded successfully.");

    console.log("All seeding completed successfully!");

  } catch (err) {
    console.error("Error running seeder:", err);
  } finally {
    await db.end();
    console.log("Database connection closed.");
  }
}



runSeeder();




const seedAll = async () => {
  await seedUsers();
  await seedInventories();
  await seedInventoryStatuses();
  await seedBorrowingLogs(); // Add this line
};

module.exports = {
  seedAll,
};
