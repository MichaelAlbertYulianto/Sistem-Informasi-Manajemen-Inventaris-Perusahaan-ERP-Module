const { db } = require("../../db/db");

const getRequestPage = async (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const user_id = req.session.user.id;

    let connection;
    try {
        connection = await db.getConnection();
        const [borrowings] = await connection.execute(
            `SELECT
                b.id,
                b.inventory_id,
                i.nama AS inventory_name,
                DATE_FORMAT(b.request_date, '%d %M %Y') AS formatted_date,
                b.status
            FROM
                borrowings b
            JOIN
                inventories i ON b.inventory_id = i.id
            WHERE
                b.user_id = ?
            ORDER BY
                b.request_date DESC`,
            [user_id]
        );
        res.render("pages/borrowings/requestForm", { today, borrowings });
    } catch (error) {
        console.error('Error fetching borrowing data:', error);
        req.flash('error', 'Gagal mengambil data peminjaman: ' + error.message);
        res.render("pages/borrowings/requestForm", { today, borrowings: [] });
    } finally {
        if (connection) {
            connection.release();
        }
    }
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