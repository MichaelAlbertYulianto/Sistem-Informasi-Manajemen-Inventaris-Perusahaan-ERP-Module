const { db } = require("../../db/db");

const getRequestPage = async (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    res.render("pages/borrowings/requestForm", { today } );
};

const postRequestBorrow = async (req, res) => {
    const { inventory_id } = req.body;
    const user_id = req.session.user.id; // Changed from req.session.userId to req.session.user.id
    const request_date = new Date().toISOString().split('T')[0];
    const status = 'Diajukan';

    let connection; // Declare connection variable

    try {
        connection = await db.getConnection(); // Get a connection from the pool
        await connection.beginTransaction(); // Start transaction

        // 1. Masukkan data pengajuan ke tabel borrowings
        const insertBorrowingSql = `INSERT INTO borrowings (inventory_id, user_id, request_date, status) VALUES (?, ?, ?, ?)`;
        await connection.execute(insertBorrowingSql, [inventory_id, user_id, request_date, status]);

        // 2. Perbarui status barang di tabel inventory
        const updateInventorySql = `UPDATE inventory_statuses SET status = 'Dipinjam' WHERE id = ?`; // Changed 'inventory' to 'inventories'
        await connection.execute(updateInventorySql, [inventory_id]);

        await connection.commit(); // Commit transaction

        req.flash('success', 'Pengajuan pinjaman berhasil diajukan!');
        res.redirect('/requestborrow'); // Redirect kembali ke halaman formulir atau halaman daftar pinjaman
    } catch (error) {
        if (connection) {
            await connection.rollback(); // Rollback transaction if error occurs
        }
        console.error('Error during borrowing request:', error);
        req.flash('error', 'Gagal mengajukan pinjaman: ' + error.message);
        res.redirect('/requestborrow');
    } finally {
        if (connection) {
            connection.release(); // Release the connection back to the pool
        }
    }
};

module.exports = {
  getRequestPage,
  postRequestBorrow,
};