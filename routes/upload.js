const { Router } = require('express');
const { check } = require('express-validator');
const { uploadFile, updateImageCloudinary, showImg } = require('../controllers/upload');
const { allowedCollections } = require('../helpers');
const { validateFiles } = require('../middleWares');
const { validate } = require('../middleWares/validations');

const router = Router();

router.post('/',validateFiles, uploadFile);

router.put('/:collection/:id', [
    validateFiles,
    check('id', 'The id its invalid').isMongoId(),
    check('collection').custom(c => allowedCollections(c, ['users', 'products'])),
    validate
], updateImageCloudinary);

router.get('/:collection/:id', [
    check('id', 'The id its invalid').isMongoId(),
    check('collection').custom(c => allowedCollections(c, ['users', 'products'])),
    validate
], showImg);

module.exports = router;