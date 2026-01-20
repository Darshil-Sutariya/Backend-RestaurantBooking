const Table = require("../model/tableModel");

const createTable = async (req, res) => {
  try {
    const { tableNumber, capacity } = req.body;

    if (!tableNumber || !capacity) {
      return res.send({
        success: false,
        message: "tableNumber and capacity are required"
      });
    }

    const existingTable = await Table.findOne({ tableNumber });
    if (existingTable) {
      return res.send({
        success: false,
        message: "Table already exists"
      });
    }

    const table = new Table({
      tableNumber,
      capacity
    });

    await table.save();

    res.send({
      success: true,
      message: "Table created successfully",
      data: table
    });

  } catch (error) {
    res.send({
      success: false,
      message: error.message
    });
  }
};

const viewalltable = async (req, res) => {
  try {
    const tables = await Table.find();
    res.send({
      success: true,
      data: tables
    });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
};


const findtable = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) {
      return res.send({ success: false, message: "Table not found" });
    }
    res.send({ success: true, data: table });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
};



const updatetable = async (req, res) => {
  try {
    const table = await Table.findByIdAndUpdate(
      req.params.id,
      { ...req.body }, 
      { new: true }
    );

    if (!table) {
      return res.send({ success: false, message: "Table not found" });
    }

    res.send({
      success: true,
      message: "Table updated successfully",
      data: table
    });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
};


const deletetable = async (req, res) => {
  try {
    const table = await Table.findByIdAndDelete(req.params.id);
    if (!table) {
      return res.send({ success: false, message: "Table not found" });
    }
    res.send({
      success: true,
      message: "Table deleted successfully"
    });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
};


const occupyTable = async (req, res) => {
  try {
    const tableId = req.params.id;

    const table = await Table.findById(tableId);
    if (!table) {
      return res.send({
        success: false,
        message: "Table not found"
      });
    }

    if (table.status === "occupied") {
      return res.send({
        success: false,
        message: "Table already occupied"
      });
    }

    table.status = "occupied";
    await table.save();

    res.send({
      success: true,
      message: "Table occupied successfully",
      data: table
    });

  } catch (error) {
    res.send({
      success: false,
      message: error.message
    });
  }
};



module.exports = { createTable, viewalltable, findtable, updatetable, deletetable, occupyTable   };
