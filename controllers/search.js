const { response } = require('express');
//Se importa objectId de mongoose Types para poder navegar entre los ids
const { ObjectId } = require('mongoose').Types;
const { User, Category, Product, Role } = require('../models');

const allowedCollections = [
    'categories',
    'products',
    'roles',
    'users',
];

const searchSUsers = async (term = '', res = response) => {
    //Chequea si es id de mongo, no si el id existe, sino que cumple con los requisitos para ser id
    const isMongoID =  ObjectId.isValid(term); //True o false
    if (isMongoID) {
        const user = await User.findById(term);
        res.json({
            Results: (user) ? [user] : []
        })
    }
    
    //Pasamos el term a expresion regular de js, sirve para las busquedas, etc
    const regex = new RegExp ( term, 'i');
    
    const users = await User.find({
        //Expresion or de mongo
        $or: [{name: regex}, {email: regex}],
        $and: [{estate: true}]
    })
    const total = await User.count({
        //Expresion or de mongo
        $or: [{name: regex}, {email: regex}],
        $and: [{estate: true}]
    })
    
    res.json({
        Results: total,
        Users: users
    })
}

const searchProducts = async (term = '', res = response) => {
    const isMongoID =  ObjectId.isValid(term);
    if (isMongoID) {
        const product = await Product.findById(term)
                                .populate('category', 'name');//Hacer un populate de lo que quiero mostrar
        res.json({
            Results: (product) ? [product] : []
        })
    }
    const regex = new RegExp ( term, 'i');
    const products = await Product.find({
        $or: [{name: regex}],
        $and: [{estate: true}]
    })
    .populate('category', 'name');//Hacer un populate de lo que quiero mostrar
    const total = await Product.count({
        $or: [{name: regex}],
        $and: [{estate: true}]
    })
    res.json({
        Results: total,
        Products: products
    })
}

const searchCategories = async (term = '', res = response) => {
    const isMongoID =  ObjectId.isValid(term);
    if (isMongoID) {
        const categories = await Category.findById(term);
        res.json({
            Results: (categories) ? [categories] : []
        })
    }
    const regex = new RegExp ( term, 'i');
    const categoriess = await Category.find({
        $or: [{name: regex}],
        $and: [{estate: true}]
    })
    const total = await Category.count({
        $or: [{name: regex}],
        $and: [{estate: true}]
    })
    res.json({
        Results: total,
        Desc: categoriess
    })
}

const searchRoles = async (term = '', res = response) => {
    const isMongoID =  ObjectId.isValid(term);
    if (isMongoID) {
        const role = await Role.findById(term);
        res.json({
            Results: (role) ? [role] : []
        })
    }
    const regex = new RegExp ( term, 'i');
    const roles = await Role.find({
        $or: [{role: regex}],
        $and: [{estate: true}]
    })
    const total = await Role.count({
        $or: [{role: regex}],
        $and: [{estate: true}]
    })
    res.json({
        Results: total,
        Desc: roles
    })
}

const search = (req, res = response) => {
    
    const { collection, term } = req.params;
    
    if (!allowedCollections.includes(collection)) {
        return res.status(401).json({
            msg: `Collection invalid, options: ${allowedCollections}`
        })
    }


    switch (collection) {
        case 'users':
            searchSUsers(term, res);
            break;
        case 'products':
            searchProducts(term, res);
            break;
        case 'categories':
            searchCategories(term, res);
            break;
        case 'roles':
            searchRoles(term, res);
            break;
        default:
            res.status(500).json({
                msg: 'Internal error'
            })
            break;
    }
};


module.exports = {
    search,

}