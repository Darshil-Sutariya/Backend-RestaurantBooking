const express = require("express");
const { createTable , viewalltable , findtable, updatetable, deletetable, occupyTable } = require("../controller/tableController");
const verifyToken = require("../middleware/authMiddleware");

const route = express.Router();


route.post("/create", verifyToken, createTable);
route.get("/view", verifyToken, viewalltable);
route.get("/find/:id", verifyToken, findtable);
route.put("/update/:id", verifyToken, updatetable);
route.delete("/delete/:id", verifyToken, deletetable);
route.put("/occupy/:id", verifyToken, occupyTable);

module.exports = route;
