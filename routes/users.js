//Desestructurar funciones de un paquete
const {Router} = require('express');
const {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
} = require('../controllers/users');

const router = Router();

//No estoy ejecutando la funcion usuariosGet, estoy enviando
//una referencia a la misma como callback que esta en controllers.
//Se le va a mandar la req y res
router.get('/', usuariosGet);
    // Petición Get
    //res.send('Hello World');// Se manda como text/html

router.put('/:id', usuariosPut);

router.post('/', usuariosPost);

router.delete('/', usuariosDelete);

router.patch('/', usuariosPatch);



module.exports = router;