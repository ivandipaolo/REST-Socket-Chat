const { validationResult } = require('express-validator');

//Al igual q los controladores de las rutas se usan req y res como params
//como es un middleware tiene un tercer argumento q se llama next
const validate = ( req, res, next ) => {
    //Creamos un validationResult, verifica los check que vienen de la ruta y
    //crea el array con los errores
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json(errors);
    }
    
    //se ejecuta el next si va todo bien (es el tercer param de si todo sale bien)
    next();
};

module.exports = {
    validate
}