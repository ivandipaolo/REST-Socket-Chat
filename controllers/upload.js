const path = require('path');
const fs = require('fs');
const { response } = require('express');
const { uploaderHelper } = require('../helpers');
const { User, Product } = require('../models');
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)
const uploadFile = async (req, res = response) => {

    //En el helper tengo un reject para extensiones no validas, lo que hace que explote el programa,
    //por lo que acá tendríamos que poner un try catch con res para q no explote todo
    try {
        const fileName = await uploaderHelper(req.files, undefined, 'imgs'); //Undefined para q tire el default de imgs
        res.json({
            path: fileName
        })
    } catch (error) {
        console.log(error)
        res.status(401).json({
            msg: 'Invalid extension'
        })
    }
}

// const updateImage = async (req, res = response) => {
//     const { collection, id } = req.params;
//     let model;
//     switch (collection) {
//         case 'users':
//             model = await User.findById(id);
//             if (!model) {
//                 res.status(401).json({
//                     msg: `User id ${id} not found`
//                 })
//             };
//             break;
//         case 'products':
//             model = await Product.findById(id);
//             if (!model) {
//                 res.status(401).json({
//                     msg: `Product id ${id} not found`
//                 })
//             }
//             break;
//         default:
//             return res.status(500).json({ msg: 'Collection not added to the updateImage function.' });
//     }
//     //Hay que chequear si el modelo ya tiene alguna imagen
//     if (model.img) {
//         const pathImg = path.join(__dirname, '../uploads', collection, model.img);
//         if (fs.existsSync(pathImg)) {
//             fs.unlinkSync(pathImg)
//         }
//     }

//     const name = await uploaderHelper(req.files, undefined, collection);
//     model.img = name;

//     await model.save();

//     res.json(model);
// }

const updateImageCloudinary = async (req, res = response) => {
    const { collection, id } = req.params;
    let model;
    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if (!model) {
                res.status(401).json({
                    msg: `User id ${id} not found`
                })
            };
            break;
        case 'products':
            model = await Product.findById(id);
            if (!model) {
                res.status(401).json({
                    msg: `Product id ${id} not found`
                })
            }
            break;
        default:
            return res.status(500).json({ msg: 'Collection not added to the updateImage function.' });
    }
    //Hay que chequear si el modelo ya tiene alguna imagen subida en cloudinary

    if (model.img) {
        const nameArr = model.img.split('/');
        const name = nameArr[nameArr.length - 1];
        const [public_id] = name.split('.');
        cloudinary.uploader.destroy(public_id)
    }

    //Se crea todo lo de la nueva imagen para subir
    const { tempFilePath } = req.files.sampleFile;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
    model.img = secure_url;

    await model.save();

    res.json(model);
}

const showImg = async (req, res = response) => {
    const { id, collection } = req.params;

    let model;
    switch (collection) {
        //Se puede recibir ese mensaje o una img por defecto
        case 'users':
            model = await User.findById(id);
            if (!model) {
                res.status(401).json({
                    msg: `User id ${id} not found`
                })
            };
            break;
        case 'products':
            model = await Product.findById(id);
            if (!model) {
                res.status(401).json({
                    msg: `Product id ${id} not found`
                })
            }
            break;
        default:
            return res.status(500).json({ msg: 'Collection not added to the updateImage function.' });
    }
    //Hay que chequear si el modelo ya tiene alguna imagen
    if (model.img) {
        const pathImg = path.join(__dirname, '../uploads', collection, model.img);

        if (fs.existsSync(pathImg)) {
            return res.sendFile(pathImg)
        }
    } else {
        const defaultPath = path.join(__dirname, '../uploads', collection, 'default.jpg')
        return res.sendFile(defaultPath)
    }
    res.json({ msg: 'Missing img' })
}

module.exports = {
    uploadFile,
    showImg,
    updateImageCloudinary,
}