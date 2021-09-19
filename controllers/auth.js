const {response} = require('express');
const User = require('../models/user');
const bcryptjs = require ('bcryptjs');
const { generateJWT } = require('../helpers/generateJWT');

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

module.exports = {
    login
}