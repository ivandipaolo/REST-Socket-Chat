const {Router} = require('express');
const {check} = require('express-validator');
const { createProduct,
    getProduct,
    deleteProduct,
    updateProduct
    } = require('../controllers/products');
const { productValidation } = require('../helpers/db-validators');
const { validateJWT } = require('../middleWares');
const { validate } = require('../middleWares/validations');
const router = Router();

router.get('/:id',[
    check('id', 'Its not a valid id').isMongoId(),
    check('id').custom(productValidation),
    validate,
], getProduct);

router.post('/',[
    validateJWT,
    check ('name', 'The name is nessesary').not().isEmpty(),
    validate
], createProduct)

router.put('/:id',[
    validateJWT,
    check('name', 'The name is nessesary').not().isEmpty(),
    check('id', 'Its not a valid id').isMongoId(),
    check('id').custom(productValidation),
    validate
],updateProduct)

router.delete('/:id',[
    validateJWT,
    check('id', 'Its not a valid id').isMongoId(),
    check('id').custom(productValidation),
    validate
], deleteProduct)

module.exports = router;