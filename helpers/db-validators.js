const { Category, Product } = require('../models');
const Role = require('../models/role');
const User = require('../models/user');

const roleValidation = async (role = '' /* Se le asigna por defecto nada */) => {
        const roleExist = await Role.findOne({role});//Chequea en la bd de roles si existe
        if(!roleExist){//Este if se lanza antes que el validate de abajo
            throw new Error(`The role ${role} doesnt exist in the database.`);
    }
};

//Verificar si correo existe
//npm express-validator
//se hace un findOne del User (va a buscar un usuario que tenga el email...) 
// seria User.findOne({email: email})
const emailValidation = async (email) => {
    const existEmail = await User.findOne({email});
    if (existEmail){
        // se hace un return de un json de error (status 400) con msg
        throw new Error(`The email ${email} already exists in the database.`);  
    }
} 

const userValidation = async (id) => {
    const existUser = await User.findById(id);
    if (!existUser){
        throw new Error(`The user with id ${id} does not exist.`);  
    }
}

const categoryValidation = async (id) =>{
    const existCategory = await Category.findById(id);
    if(!existCategory){
        throw new Error(`The category with id ${id} does not exist.`);
    }
}

const productValidation = async (id) =>{
    const existProduct = await Product.findById(id);
    if(!existProduct){
        throw new Error(`The product with id ${id} does not exist.`);
    }
}

module.exports = {
    roleValidation,
    emailValidation,
    userValidation,
    categoryValidation,
    productValidation,
}