const { db } = require("../../db/db");
const Excel = require("exceljs");
const moment = require("moment");

const getOverviewInventory = async (req, res) => {
    try{
        const [inventories] = await db.query("SELECT * FROM inventories");
        const formattedInventories = inventories.map(inv => ({
            id: inv.id,
            nama: inv.nama,
            deskripsi: inv.deskripsi,
            tanggal_pembelian: inv.tanggal_pembelian ? moment(inv.tanggal_pembelian).format('DD MMM YYYY') : '',
            harga_pembelian: inv.harga_pembelian !== null ? `Rp. ${Number(inv.harga_pembelian).toLocaleString('id-ID', { minimumFractionDigits: 0 })}` : ''
        }));
        res.render('pages/inventory/overview', { inventories: formattedInventories });
    } catch (error) {
        console.error("getOverviewInventory", error);
        res.status(500).send("Internal Server Error");
    }
};

const downloadInvData = async (req, res) => {
    try {
        const [inventories] = await db.query("SELECT * FROM inventories");
        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet("Inventories");

        worksheet.columns = [
            { header: "ID", key: "id", width: 10 },
            { header: "Nama", key: "nama", width: 20 },
            { header: "Deskripsi", key: "deskripsi", width: 30 },
            { header: "Tanggal Pembelian", key: "tanggal_pembelian", width: 30 },
            { header: "Harga Pembelian", key: "harga_pembelian", width: 20 },
        ];

        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFE0E0E0" },
        };

        inventories.forEach((inventory) => {
            worksheet.addRow([
                inventory.id,
                inventory.nama,
                inventory.deskripsi,
                inventory.tanggal_pembelian,
                inventory.harga_pembelian,
            ]);
        });
        console.log("Fetched rows:", inventories.length);
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader("Content-Disposition", "attachment; filename=inventories-data.xlsx");

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        const [inventories] = await db.query("SELECT * FROM inventories");
        console.log("Fetched rows:", inventories.length);
        console.error("Error Downloading Inventory Data:", error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = {
    getOverviewInventory,
    downloadInvData,
};