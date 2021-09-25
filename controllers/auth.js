const {response} = require('express');
const User = require('../models/user');
const bcryptjs = require ('bcryptjs');
const { generateJWT } = require('../helpers/generateJWT');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req, res = response) => {
    const {email, password} = req.body;
    try {
        //Email existe
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({
                msg: 'User or password are not correct - Email Wrong'
            })
        };

        //Usuario activo
        if(!user.estate){
            return res.status(400).json({
                msg: 'Invalid user - Estate: false'
            })
        }

        //Verif contrasenia
        const validPassword = bcryptjs.compareSync(password, user.password);
        if(!validPassword){
            return res.status(404).json({
                msg: 'Password not correct - Password'
            })
        }

        //Genrar JWT
        const token = await generateJWT(user.id);

        res.json({
            token,
            user
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Something went wrong, talk with an Admin'
        })
    }
}

const googleSignIn = async (req, res = response) =>{
    const {id_token} = req.body
    
    try {
        //Desestructuramos usuario de googlee que le llega el nombre / picture / email
        const {name, picture, email} = await googleVerify(id_token);
        let user = await User.findOne({email});

        //Si el usuario no existe en la base de datos
        if(!user){
            //Extraemos la data del usuario para mandar a hacer el objeto
            const data = {
                name,
                email,
                //Como el password es obligatorio mando cualquier cosa, igualemnte no va a coincidir con el hash
                password: 'ASD',
                img: picture,
                estate: true,
                google: true
            };
            user = new User(data);
            await user.save();
        }

        //Si el usuario esta en base de datos pero con estado de false:
        if (!user.estate){
            return res.status(401).json({
                msg: 'Talk with an admin to activate your account'
            });
        }

        //Despues generamos el JWT:
        const token = await generateJWT(user.id)

        res.json({
            user,
            id_token,
            token
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Please contact an admin'
        })
    }

}

const renewToken = async (req, res = response) => {
    const {user} = req;
    const token = await generateJWT(user.id);
    res.json({
        user,
        token
    })
}
module.exports = {
    login,
    googleSignIn,
    renewToken
}