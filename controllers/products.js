const { response } = require("express");
const { Product } = require('../models/index');

const getProduct = async (req, res = response) => {
    const {id} = req.params;
    const product = await Product.findOne(id);
    return res.status(201).json({product})
};

const createProduct = async (req, res = response) => {
    const {user, estate, ...body} = req.body;

    const productDB = await Product.findOne({name: body.name});
    if (productDB){// Si existe, osea que la categoria no es nula
        return res.status(400).json({
            msg: `The category ${productDB.name} already exists.`
        })
    };
    const data = {
        ...body,
        user: req.user._id
    };
    const product = new Product(data);
    await product.save();
    return res.status(201).json({
        msg: `Product ${data.name} added!`,
        data
    })
};

const deleteProduct = async (req, res = response) => {
    const {id} = req.params;
    const product = await Product.findByIdAndUpdate(id, {estate: false});
    return res.status(200).json({
        product
    })
};

const updateProduct = async (req, res = response) => {
    const {id} = req.params;
    const {__v, ...data} = req.body;

    if(data.name){
        data.name = data.name.toUpperCase();
    }

    const product = await Product.findByIdAndUpdate(id, data);
    return res.status(201).json({
        product
    })
};

module.exports = {
    getProduct,
    createProduct,
    deleteProduct,
    updateProduct
}