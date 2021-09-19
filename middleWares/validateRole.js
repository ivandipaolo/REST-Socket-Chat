const {response} = require('express')

const validateAdminRole = (req, res = response, next) => {
    if (!req.user){
        return res.status(404).json({
            msg: 'Verify user in order to validate role.'
        })
    };

    const {name, role} = req.user

    if (role !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg: `${name} has not the admin role.`
        })
    };
    
    next();
};

//Se hace un spread de los parametros, en este caso de los roles
//para no estar limitado a la cantidad de roles que le paso
const hasRoles = (...roles) =>{
    return (req, res = response, next) =>{

        if (!req.user) {
            return res.status(500).json({
                msg: 'System error, user not identified.'
            })
        }

        if (roles.includes(req.user.role)){
            console.log('Access allowed.')
        }else{
            return res.status(401).json({
                msg: `User must have one of this roles ${roles}`
            })
        }
        next();
    }
};


module.exports = {
    validateAdminRole,
    hasRoles
}