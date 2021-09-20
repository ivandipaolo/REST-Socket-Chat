const { response } = require("express");
const { Category } = require('../models/index');

const getCategories = async (req, res = response) => {
    const categories = await Category.find({estate: true})
        .populate('user', 'name');
    if (categories){
        return res.status(201).json(
            categories
        );
    }
};

const createCategory = async (req, res = response) => {
    const name = req.body.name.toUpperCase();
    const categoryDB = await Category.findOne({name});
    if (categoryDB){// Si existe, osea que la categoria no es nula
        return res.status(400).json({
            msg: `The category ${categoryDB.name} already exists.`
        })
    };
    const data = {
        name,
        user: req.user._id,
    }
    
    const category = new Category(data);

    await category.save();

    return res.status(201).json({
        msg: `Category ${name} added!`
    })
};

const getCategory = async (req, res = response) => {
    const {id} = req.params;
    const category = await Category.findById(id);
    return res.status(200).json({
        category
    })
};

const updateCategory = async (req, res = response) => {
    const {id} = req.params;
    const {__v, _id, ...data} = req.body;
    
    data.name = data.name.toUpperCase();
    data.user = data.user._id;

    const category = await Category.findByIdAndUpdate(id, data);
    
    return res.status(200).json({
        category
    })
};

const deleteCategory = async (req, res = response) => {
    const {id} = req.params;
    const category = await Category.findByIdAndUpdate(id, {estate: false});
    return res.status(200).json({
        category
    })
};


module.exports = {
    getCategories,
    createCategory,
    getCategory,
    updateCategory,
    deleteCategory
}