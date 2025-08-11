const { db } = require("../../db/db");

const getBorrowingHistory = async (req, res) => {
    try {
        const [borrowings] = await db.query(`
            SELECT bl.id,bl.inventory_id, i.nama AS inventory_name, u.username, bl.request_date, bl.take_date, bl.return_date, bl.item_condition 
            FROM borrowing_logs bl
            JOIN inventories i ON bl.inventory_id = i.id
            JOIN users u ON bl.user_id = u.id
            ORDER BY bl.take_date DESC
        `);

        const formattedBorrowings = borrowings.map(borrow => ({
            ...borrow,
            request_date: borrow.request_date
                ? new Date(borrow.request_date).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                })
                : "-",
            take_date: borrow.take_date
                ? new Date(borrow.take_date).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                })
                : "-",
            return_date: borrow.return_date
                ? new Date(borrow.return_date).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                })
                : "-",
        }));

        res.render("pages/borrowings/listBorrowing", { borrowings: formattedBorrowings });
    } catch (error) {
        console.error("getBorrowingHistory", error);
        res.status(500).send("Internal Server Error");
    }
};

const getPendingBorrowings = async (req, res) => {
    try {
        const [borrowings] = await db.query(`
            SELECT b.id,b.inventory_id, i.nama AS inventory_name, u.username, 
                   b.request_date, b.take_date, b.return_date, b.status
            FROM borrowings b
            JOIN inventories i ON b.inventory_id = i.id
            JOIN users u ON b.user_id = u.id
            WHERE b.status = 'Dipinjam' OR b.status = 'Diajukan'
            ORDER BY b.take_date DESC
        `);

        const formatOptions = {
            day: "2-digit",
            month: "short",
            year: "numeric"
        };

        const formattedBorrowings = borrowings.map(borrow => ({
            ...borrow,
            request_date: borrow.request_date 
                ? new Date(borrow.request_date).toLocaleDateString("id-ID", formatOptions)
                : "-",
            take_date: borrow.take_date 
                ? new Date(borrow.take_date).toLocaleDateString("id-ID", formatOptions)
                : "-",
            return_date: borrow.return_date 
                ? new Date(borrow.return_date).toLocaleDateString("id-ID", formatOptions)
                : "-"
        }));

        res.render("pages/borrowings/listForReturn", { borrowings: formattedBorrowings });
    } catch (error) {
        console.error("getPendingBorrowings", error);
        res.status(500).send("Internal Server Error");
    }
};

const loadBorrowForm = async (req, res) => {
    try {
        const [inventories] = await db.query("SELECT * FROM inventories WHERE id NOT IN (SELECT inventory_id FROM inventory_statuses WHERE status = 'Dipinjam' OR status = 'Maintenance' OR status = 'Lost' OR status = 'Diajukan') ORDER BY nama ASC");
        const [users] = await db.query("SELECT id, username FROM users");
        
        res.render("pages/borrowings/borrowForm", { inventories, users });
    } catch (error) {
        console.error("loadBorrowForm", error);
        res.status(500).send("Internal Server Error");
    }
};

const addBorrowing = async (req, res) => {
    const { inventory_id, user_id } = req.body; // take_date tidak lagi diambil dari req.body di sini
    
    try {
        const request_date = new Date().toISOString().split("T")[0]; // Tanggal pengajuan saat ini
        const status = 'Diajukan'; // Status awal 'Diajukan'

        await db.query(
            "INSERT INTO borrowings (inventory_id, user_id, request_date, status) VALUES (?, ?, ?, ?)",
            [inventory_id, user_id, request_date, status]
        );

        await db.query(
            "UPDATE inventory_statuses SET status = 'Dipinjam' WHERE inventory_id =?",
            [inventory_id]
        );

        // Perbarui status inventaris menjadi 'Dipinjam' hanya jika barang sudah diambil
        // Untuk saat ini, biarkan status inventaris tidak berubah sampai barang diambil
        // atau Anda bisa menambahkan status 'Diajukan' di tabel inventory_statuses jika diperlukan.
        // Jika status 'Dipinjam' hanya berlaku setelah take_date diisi, maka kode ini harus dipindahkan
        // ke fungsi takeBorrowing.
        // await db.query(
        //     "UPDATE inventory_statuses SET status = 'Dipinjam' WHERE inventory_id = ?",
        //     [inventory_id]
        // );

        req.flash("success", "Permintaan peminjaman berhasil diajukan.");
        return res.redirect("/borrowings/return");
    } catch (error) {
        console.error("Error di addBorrowing:", error);
        req.flash("error", "Gagal mengajukan peminjaman.");
        return res.redirect("/borrowings/return");
    }
};

const returnBorrowing = async (req, res) => {
    const { id } = req.params;
    const { return_date, item_condition } = req.body; // Ambil item_condition dari body request

    try {
        const finalReturnDate = return_date || new Date().toISOString().split("T")[0];

        // Tentukan status inventaris berdasarkan kondisi barang
        let inventoryStatus;
        switch (item_condition) {
            case 'Sempurna':
                inventoryStatus = 'Tersedia';
                break;
            case 'Rusak':
                inventoryStatus = 'Maintenance';
                break;
            case 'Hilang':
                inventoryStatus = 'Lost';
                break;
            default:
                inventoryStatus = 'Tersedia'; // Default jika kondisi tidak valid
        }

        await db.query(
            "UPDATE borrowings SET status = 'Dikembalikan', return_date = ? WHERE id = ?",
            [finalReturnDate, id]
        );

        const [borrowing] = await db.query("SELECT inventory_id, user_id, request_date, take_date FROM borrowings WHERE id = ?", [id]);

        if (!borrowing.length) {
            req.flash("error", "Peminjaman tidak ditemukan.");
            return res.redirect("/borrowings");
        }

        // Perbarui status inventaris berdasarkan kondisi barang yang dipilih
        await db.query(
            "UPDATE inventory_statuses SET status = ? WHERE inventory_id = ?",
            [inventoryStatus, borrowing[0].inventory_id]
        );

        // Log activity when item is returned
        await db.query(
            `INSERT INTO borrowing_logs (inventory_id, user_id, request_date, take_date, return_date, item_condition) VALUES (?, ?, ?, ?, ?, ?)`,
            [borrowing[0].inventory_id, borrowing[0].user_id, borrowing[0].request_date, borrowing[0].take_date, finalReturnDate, item_condition]
        );

        await db.query(
            `DELETE FROM borrowings WHERE id =?`,
            [id]
        );

        req.flash("success", "Pengembalian barang berhasil dikonfirmasi.");
        return res.redirect("/borrowings/return");
    } catch (error) {
        console.error("Error di returnBorrowing:", error);
        req.flash("error", "Gagal mengkonfirmasi pengembalian barang.");
        return res.redirect("/borrowings/return");
    }
};

const takeBorrowing = async (req, res) => {
    const { id } = req.params;
    const takeDate = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format

    try {
        await db.query(
            `UPDATE borrowings SET take_date = ?, status = 'Dipinjam' WHERE id = ?`,
            [takeDate, id]
        );

        // Get inventory_id from borrowing_logs to update inventory_statuses
        const [borrowing] = await db.query(
            `SELECT inventory_id FROM borrowings WHERE id = ?`,
            [id]
        );

        if (borrowing.length > 0) {
            const inventoryId = borrowing[0].inventory_id;
            await db.query(
                `UPDATE inventory_statuses SET status = 'Dipinjam' WHERE inventory_id = ?`,
                [inventoryId]
            );
        }

        // Removed activity logging from here

        req.flash('success', 'Peminjaman berhasil diambil.');
        res.redirect('/borrowings/return');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Gagal mengambil peminjaman.');
        res.redirect('/borrowings/return');
    }
};


module.exports = {
    getBorrowingHistory,
    getPendingBorrowings,
    loadBorrowForm,
    addBorrowing,
    returnBorrowing,
    takeBorrowing // Add the new function to exports
};

