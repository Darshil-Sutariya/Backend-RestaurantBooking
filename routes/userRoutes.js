const express = require('express');
const { Signup, Login, updateUser, deleteUser } = require('../controller/userController.js');
const verifyToken = require('../middleware/authMiddleware.js');

const route = express.Router();


route.get('/', verifyToken, (req, res) => {
 res.status(200).json({ message: 'Protected route accessed' });
 });


route.post("/signup", Signup);
route.post("/login", Login);
route.put("/updateUser/:id", verifyToken, updateUser);
route.delete("/deleteUser/:id", verifyToken, deleteUser);


module.exports= route;  