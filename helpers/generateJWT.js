const jwt = require('jsonwebtoken')
const {User} = require('../models')
//El jwt devuelve promise
const generateJWT = (uid = '' /* User identifier */) => {

    return new Promise((resolve, reject) => {
        const payload = {uid};
        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            //Tiempo que expire el jwt
            expiresIn: '4h'
        }, (err, token) => {
            if (err){
                console.log(err);
                reject('Cant generate jwt')
            }else{
                resolve(token);
            }
        })
    })
}

const checkJWT = async (token = '') => {
    try {
        if (token.length < 10) {
            return null
        };
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    
        const user = await User.findById(uid);
        
        if (user && user.estate === true) {
            return user
        }else{
            return null;
        }
    } catch (error) {
        return null;
    }
};

module.exports = {
    generateJWT,
    checkJWT
}