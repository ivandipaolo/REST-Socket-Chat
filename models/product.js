const { Schema, model } = require('mongoose');

const ProductSchema = Schema({
    name: {
        type: String,
        required: [true, 'The product name its obligatory']
    },
    estate: {
        type: Boolean,
        default: true,
        required: true
    },
    user: {
        //Le estamos diciendo q los usuarios de este tipo con ese ref igual al modelo de user es el que va a poder usarlo
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    price: {
        type: Number,
        default: 0
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    description: {
        type: String
    },
    avaliable: {
        type: Boolean,
        default: true
    },
    img: {
        type: String,
    },
});

ProductSchema.methods.toJSON = function () {
    //Le sacamos version y password a lo que devuelve la consola
    const { __v, estate, ...data } = this.toObject();
    return data;
};
module.exports = model('Product', ProductSchema);