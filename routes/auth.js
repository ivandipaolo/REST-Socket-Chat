const {Router} = require('express');
const {check} = require('express-validator');
const { login, googleSignIn, renewToken } = require('../controllers/auth');
const { validateJWT } = require('../middleWares/validateJWT');
const { validate } = require('../middleWares/validations');
const router = Router();

//Este router te lleva a {{url}}/api/Auth/login
router.post('/login',[
    check('email', 'The email its not valid').isEmail(),
    check('password', 'The password its obligatory').not().isEmpty(),
    validate
], login);

router.post('/google',[
    check('id_token', 'The id_token is neccesary.').not().isEmpty(),
    validate
], googleSignIn);

router.get('/', validateJWT, renewToken);

module.exports = router;