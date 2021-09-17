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
        required: true,
        emun: ['ADMIN_ROLE', 'USER_ROLE']
    },
    estate:{
        type: Boolean,
        default: true
    },
    estate:{
        type: Boolean,
        default: false
    },
});
// {
//     name: "",
//     mail:"",
//     password: "",
//     img: "",
//     rol: "",
//     estate: false,
//     google: false
// }

module.exports = model('User' , UserSchema);