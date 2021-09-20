const {Router} = require('express');
const {check} = require('express-validator');
const { createCategory,
    getCategories,
    getCategory,
    deleteCategory,
    updateCategory
    } = require('../controllers/categories');
const { categoryValidation } = require('../helpers/db-validators');
const { validateJWT } = require('../middleWares');
const { validate } = require('../middleWares/validations');
const router = Router();

// Get para obtener todas las categorias - publico
router.get('/', getCategories);

// Get para obtener una categoria en especial - publico
router.get('/:id',[
    check('id', 'Its not a valid id').isMongoId(),
    check('id').custom(categoryValidation),
    validate,
], getCategory);

// Post para crear categoria - privado - cualquier persona con token valido
router.post('/',[
    validateJWT,
    check ('name', 'The name is nessesary').not().isEmpty(),
    validate
],createCategory)

// Put para actualizar categoria - privado - cualquier persona con token valido
router.put('/:id',[
    validateJWT,
    check('name', 'The name is nessesary').not().isEmpty(),
    check('id', 'Its not a valid id').isMongoId(),
    check('id').custom(categoryValidation),
    validate
],updateCategory)

// Delete para borrar una categoria - privado - con token valido
router.delete('/:id',[
    validateJWT,
    check('id', 'Its not a valid id').isMongoId(),
    check('id').custom(categoryValidation),
    validate
], deleteCategory)
module.exports = router;