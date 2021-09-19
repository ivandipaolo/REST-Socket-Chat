const { response } = require('express');
const bcryptjs = require('bcryptjs');
//La U mayuscula porque me va a permitir crear instancias de este modelo
//Por convencion se le pone mayus a esas palabras
//porque desp se hace user = new User para q no choque
const User = require('../models/user');

const usuariosGet = async (req, res = response) => {
    
    //params se usa para el query desp de una url y el signo ?
    //en la solicitud api x ej, etc.
    // // const params = req.query;

    //se puede desestructurar como:
    //se le puede poner algo por defecto por si no viene un parametro
    //como el nombre:
    // // const {q, nombre = "No Name", page = 1, apikey} = req.query;
    
    //Los argumentos vienen como string
    const {cant = 4, from = 1} = req.query;

    //De la manera de poner 2 await uno abajo del otro se va a esperar q se ejecute uno y desp el otro
    //para solucionarlo hacemos un promise.all y un arreglo de cosas a ejecutarse.
    // // const users = await User.find({estate: true})//condicion dentro de find para mostrar usuarios activos
    // //     .skip(Number(from)-1)//desde q registro
    // //     .limit(Number(cant));//cuantos registros
    // // const total = await User.countDocuments({estate: true}); // misma condicion q find

    //Esto ejecuta las 2 de manera simultanea, si una da error, da error todo
    //Lo ejecutamnos con desestructuracion de arreglos [1,2,3] = [0,1,2]
    const [total,users] = await Promise.all( [
        User.countDocuments({estate: true}),
        User.find({estate: true})
            .skip(Number(from)-1)//desde q registro
            .limit(Number(cant))//cuantos registros
    ]);
    res.status(200).json({ // Mandamos un objeto en formato json
        msg: "Get api - usuariosGet",
        total,
        users
    })
};

const usuariosPut = async (req, res = response) => {

    const id = req.params.id;
    // o
    // const {id} = req.params;

    //Extraigo todo lo que viene que no nocesito del body
    const {_id, password, email, google, ...other} = req.body;

    //Validar id
    if (password){//si manda contraseña es porque la quiere actualizar
        //Encriptar contraseña
        const salt = bcryptjs.genSaltSync();
        other.password = bcryptjs.hashSync(password, salt);
    };

    const user = await User.findByIdAndUpdate(id, other);

    res.json({ 
        msg: "Put api - usuariosPut",
        user
    })
};

const usuariosPost = async (req, res = response) => {
    //Esta cosntante body la voy a igualar
    //al body de lo que la persona está solicitando (request)
    // const body = req.body;

    //Se puede desestructurar de esto:
    const {name, email, password, role} = req.body;
    const user = new User({name, email, password, role});
    
    //Encriptar contraseña:
    //salt es el numero de vueltas para hacer la encriptacion
    //mientras mas alto mas tarda pero mas complicada es
    const salt = bcryptjs.genSaltSync(); // defecto en 10 entre los parentesis
    //actualizamos la contaseña del user.password a la encriptada
    user.password = bcryptjs.hashSync(password, salt);
    
    //Se grava usuario en mongo pero tengo q verificar q le mando bien todos los datos obligatorios.
    await user.save();
    res.json(user);
};

const usuariosDelete = async (req, res = response) => {
    // Manera de borrar un doc
    const {id} = req.params;
    // const user = await User.findByIdAndDelete(id); 

    //Manera de cambiar el valor V
    const user = await User.findByIdAndUpdate(id, {estate: false});

    const authenticatedUser = req.user;

    res.json({user, authenticatedUser})
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