const Category = require('../model/categoryModel');

const createCategory = async (req, res) => {
    try {
        const category = new Category(req.body);
        await category.save();
        res.json({ message: "Category created", category });
    } catch (error) {
        res.json({ error: error.message });
    }
};


const listCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        console.log("categories ::", categories);
        
        res.json(categories);
    } catch (error) {
        res.json({ error: error.message });
    }
};


const updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ message: "Category updated", category });
    } catch (error) {
        res.json({ error: error.message });
    }
};


const deleteCategory = async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.json({ message: "Category deleted successfully" });
    } catch (error) {
        res.json({ error: error.message });
    }
};

module.exports = {
    createCategory,
    listCategories,
    updateCategory,
    deleteCategory
}