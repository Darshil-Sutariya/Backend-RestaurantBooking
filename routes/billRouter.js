const express = require("express");
const { createBill, closeBill, viewbills, findbill, updatebill, deletebill } = require("../controller/billController");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", verifyToken, createBill);
router.put("/close/:id", verifyToken, closeBill);
router.get("/view", verifyToken, viewbills);
router.get("/find/:id", verifyToken, findbill);
router.put("/update/:id", verifyToken, updatebill);
router.delete("/delete/:id", verifyToken, deletebill);

module.exports = router;
