const { response } = require('express');
const bcryptjs = require('bcryptjs');
//La U mayuscula porque me va a permitir crear instancias de este modelo
//Por convencion se le pone mayus a esas palabras
//porque desp se hace user = new User para q no choque
const User = require('../models/user');

const usuariosGet = (req, res = response) => {
    
    //params se usa para el query desp de una url y el signo ?
    //en la solicitud api x ej, etc.
    const params = req.query;
    //se puede desestructurar como:
    //se le puede poner algo por defecto por si no viene un parametro
    //como el nombre:
    const {q, nombre = "No Name", page = 1, apikey} = req.query;
    res.status(200).json({ // Mandamos un objeto en formato json
        msg: "Get api - usuariosGet",
        params,
        q,
        nombre,
        page,
        apikey
    })
};

const usuariosPut = (req, res = response) => {

    const id = req.params.id;
    // o
    // const {id} = req.params;

    res.json({ 
        msg: "Put api - usuariosPut",
        id
    })
};

const usuariosPost = async (req, res = response) => {
    //Esta cosntante body la voy a igualar
    //al body de lo que la persona está solicitando (request)
    // const body = req.body;

    //Se puede desestructurar de esto:
    const {name, email, password, role} = req.body;
    const user = new User({name, email, password, role});
    
    //Verificar si correo existe
    //npm express-validator
    //se hace un findOne del User (va a buscar un usuario que tenga el email...) 
    // seria User.findOne({email: email})
    const existEmail = await User.findOne({email});
    if (existEmail){
        // se hace un return de un json de error (status 400) con msg
        return res.status(400).json({
            msg: "Email already exist."
        })
    }
    //Encriptar contraseña:
    //salt es el numero de vueltas para hacer la encriptacion
    //mientras mas alto mas tarda pero mas complicada es
    const salt = bcryptjs.genSaltSync(); // defecto en 10 entre los parentesis
    //actualizamos la contaseña del user.password a la encriptada
    user.password = bcryptjs.hashSync(password, salt);
    
    //Se grava usuario en mongo pero tengo q verificar q le mando bien todos los datos obligatorios.
    await user.save();
    res.json({
        msg: "Post api - usuariosPost",
        user
    })
};

const usuariosDelete = (req, res = response) => {
    res.json({ 
        msg: "PUT api - usuariosDelete"
    })
};

const usuariosPatch = (req, res = response) => {
    res.json({ 
        msg: "PUT api - usuariosPatch"
    })
};

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
}