const {request,response} = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const validateJWT = async (req = request , res = response , next) => {
    //Ponemos el header q tiene q enviar el front.
    const token = req.header('p-token');
    if (!token){
        return res.status(401).json({
            msg: 'There is no token to validate'
        })
    }

    try {

        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const user = await User.findById(uid);
        //Guardo la info  en la request para poder acceder desde otro lado
        req.user = user;
        //Se verifica q el usuario tenga estado en true y que exista
        if (!user){
            return res.status(401).json({
                msg: 'User doesnt exist.'
            })
        }
        
        if (!user.estate){
            return res.status(401).json({
                msg: 'Your estate is false.'
            })
        }

        //EL NEXT SUPER IMPORTANTE PARA QUE SIGA CON EL SIGUIETNE MIDDLEWARE O SIGA CON LA FUNCION QUE CORRESPONDE
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Invalid token',
        })
    }
}

module.exports = {
    validateJWT
}