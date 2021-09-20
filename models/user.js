const {Schema, model} = require('mongoose');
const UserSchema = Schema({
//Objeto literal ({})
    name: {
        type: String,
        required: [true, 'The name is required.'],
    },
    email: {
        type: String,
        required:[true, 'The email is required.'],
        unique: true
    },
    password:{
        type: String,
        required: [true, 'The password is required.']
    },
    img:{
        type: String,
    },
    role:{
        type: String,
        default: 'USER_ROLE',
        emun: ['ADMIN_ROLE', 'USER_ROLE']
    },
    estate:{
        type: Boolean,
        default: true
    }
});

//Se crea una funcion normal ya que tenemos que usar el this dentro
//de la misma y con funcion flecha el this toma otro valor
UserSchema.methods.toJSON = function() {
    //Le sacamos version y password a lo que devuelve la consola
    const {__v, password, _id, ...user } = this.toObject();
    user.uid = _id;
    return user;
};

module.exports = model('User' , UserSchema);