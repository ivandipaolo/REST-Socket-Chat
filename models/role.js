//Se crea un modelo de la colleccion de roles

const {Schema, model} = require('mongoose');

const RoleSchema = Schema ({
    role: {
        type: String,
        required: [true, 'The role its obligatory']
    }
});

module.exports = model('Role', RoleSchema);