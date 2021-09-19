const jwt = require('jsonwebtoken')

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

module.exports = {
    generateJWT
}