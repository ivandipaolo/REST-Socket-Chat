const { response } = require('express');

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

const usuariosPost = (req, res = response) => {
    //Esta cosntante body la voy a igualar
    //al body de lo que la persona está solicitando (request)
    const body = req.body;
    //Se puede desestructurar de esto:
    const {nombre} = req.body;

    res.json({
        msg: "Post api - usuariosPost",
        body,
        nombre
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