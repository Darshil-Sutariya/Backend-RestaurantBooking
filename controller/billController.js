const productModel = require("../model/productModel");
const Bill = require("../model/billModel");
const Table = require("../model/tableModel");

const createBill = async (req, res) => {
  try {
    const { tableId, items } = req.body;

    if (!tableId || !Array.isArray(items) || items.length === 0) {
      return res.send({
        success: false,
        message: "tableId and items are required"
      });
    }

    const table = await Table.findById(tableId);

    if (!table) {
      return res.send({
        success: false,
        message: "Table not found"
      });
    }

    let billItems = [];
    let grandTotal = 0;

    for (let i = 0; i < items.length; i++) {
      const { productId, quantity } = items[i];

      const product = await productModel.findById(productId);
      if (!product) {
        return res.send({
          success: false,
          message: `Product not found at index ${i}`
        });
      }

      const total = product.productprice * quantity;
      grandTotal += total;

      billItems.push({
        product: product._id,
        productName: product.productname,
        quantity,
        productImg: product.productimage,
        price: product.productprice,
        total
      });
    }

    const bill = new Bill({
      user: req.user.id,
      table: table._id,
      items: billItems,
      grandTotal
    });

    await bill.save();

    table.status = "occupied";
    table.activeBill = bill._id;
    await table.save();

    res.send({
      success: true,
      message: "Bill created & table occupied",
      data: bill
    });

  } catch (error) {
    res.send({
      success: false,
      message: error.message
    });
  }
};

const closeBill = async (req, res) => {
  try {
    const billId = req.params.id;

    const bill = await Bill.findById(billId);
    if (!bill) {
      return res.send({ success: false, message: "Bill not found" });
    }

    bill.status = "closed";
    await bill.save();

    await Table.findByIdAndUpdate(bill.table, {
      status: "available",
      activeBill: null
    });

    res.send({
      success: true,
      message: "Bill closed & table freed"
    });

  } catch (error) {
    res.send({ success: false, message: error.message });
  }
};


const viewbills = async (req, res) => {
  try {
    const bills = await Bill.find();

    if (bills.length === 0) {
      return res.send({ success: false, message: "No bills found" });
    }

    res.send({ success: true, data: bills });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
};


const findbill = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);

    if (!bill) {
      return res.send({ success: false, message: "Bill not found" });
    }

    res.send({ success: true, data: bill });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
};

const updatebill = async (req, res) => {
  try {
    const { items } = req.body;
    const billId = req.params.id;

    if (!Array.isArray(items)) {
      return res.send({ success: false, message: "Items must be array" });
    }

    const bill = await Bill.findById(billId);
    if (!bill) {
      return res.send({ success: false, message: "Bill not found" });
    }

    if (bill.status === "closed") {
      return res.send({ success: false, message: "Cannot update a closed bill" });
    }

    // 🔥 If all items removed → close bill
    if (items.length === 0) {
      bill.status = "closed";
      bill.items = [];
      bill.grandTotal = 0;
      await bill.save();

      await Table.findByIdAndUpdate(bill.table, {
        status: "available",
        activeBill: null
      });

      return res.send({
        success: true,
        message: "Bill closed (cart empty)",
        data: bill
      });
    }

    let updatedBillItems = [];
    let newGrandTotal = 0;

    for (let i = 0; i < items.length; i++) {
      const { productId, quantity } = items[i];
      const product = await productModel.findById(productId);

      if (!product) {
        return res.send({
          success: false,
          message: `Product not found at index ${i}`
        });
      }

      const total = product.productprice * quantity;
      newGrandTotal += total;

      updatedBillItems.push({
        product: product._id,
        productName: product.productname,
        productImg: product.productimage,
        quantity,
        price: product.productprice,
        total
      });
    }

    bill.items = updatedBillItems;
    bill.grandTotal = newGrandTotal;
    bill.updatedBy = req.user.id;

    await bill.save();

    res.send({
      success: true,
      message: "Bill updated successfully",
      data: bill
    });

  } catch (error) {
    res.send({ success: false, message: error.message });
  }
};


const deletebill = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) {
      return res.send({ success: false, message: "Bill not found" });
    }

    await Bill.findByIdAndDelete(req.params.id);

    // free table if active
    await Table.findByIdAndUpdate(bill.table, {
      status: "available",
      activeBill: null
    });

    res.send({
      success: true,
      message: "Bill deleted permanently"
    });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
};






module.exports = { createBill, closeBill, viewbills, findbill, updatebill, deletebill };