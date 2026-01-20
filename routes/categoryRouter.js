const express = require('express');
const router = express.Router();
const { createCategory,listCategories,updateCategory,deleteCategory } = require('../controller/categoryController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/create', verifyToken,  createCategory);
router.get('/view', verifyToken, listCategories);
router.put('/update/:id', verifyToken, updateCategory);
router.delete('/delete/:id', verifyToken, deleteCategory);

module.exports = router;