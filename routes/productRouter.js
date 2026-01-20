const express = require('express');
const { productView,productRegister, productFind, updateproduct, deleteproduct } = require('../controller/productController');
const verifyToken = require('../middleware/authMiddleware')

const route = express.Router();

route.post("/create",verifyToken, productRegister);
route.get("/view",verifyToken, productView);
route.get("/find/:id", verifyToken, productFind);
route.put("/update/:id", verifyToken, updateproduct);
route.delete("/delete/:id", verifyToken, deleteproduct);


module.exports= route;