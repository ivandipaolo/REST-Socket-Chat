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
        throw new Error(`The user with id ${id} doesnt exist.`);  
    }
} 

module.exports = {
    roleValidation,
    emailValidation,
    userValidation,
}