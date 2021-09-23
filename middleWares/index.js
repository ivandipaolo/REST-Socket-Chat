//Referencia a todos los middlewares personalizados

const validations = require('../middleWares/validations');
const validateJWT = require('../middleWares/validateJWT');
const validateRoles = require('../middleWares/validateRole');
const  validateFiles = require('./validateFiles');

module.exports = {
    ...validations,
    ...validateFiles,
    ...validateJWT,
    ...validateRoles,
}