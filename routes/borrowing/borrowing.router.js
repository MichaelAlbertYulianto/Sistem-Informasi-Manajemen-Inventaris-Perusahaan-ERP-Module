const express = require("express");
const router = express.Router();

const borrowing = require("./borrowing.controller");

router.get("/borrowings", borrowing.getBorrowingHistory);
router.get("/borrowings/return", borrowing.getPendingBorrowings);
router.get("/borrowings/add", borrowing.loadBorrowForm);
router.post("/borrowings/add", borrowing.addBorrowing);
router.post("/borrowings/return/:id", borrowing.returnBorrowing);
router.post("/return/:id", borrowing.returnBorrowing);
router.post("/borrowings/take/:id", borrowing.takeBorrowing); // Changed from /take/:id

module.exports = router;
