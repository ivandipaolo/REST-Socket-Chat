const path = require('path');
const { v4: uuidv4 } = require('uuid');
uuidv4();
//Al haber tantas validaciones y tanto codigo que puede salir tanto bien como mal
//se hace una promise
const uploaderHelper = (files, validsExtensions = ['png', 'jpg', 'jpeg', 'gif'], dir = '') => {
    return new Promise ((resolve, reject) => {

        const {sampleFile}  = files;
        //Verificamos la extension del archivo
        const fileDivided = sampleFile.name.split('.');
        
        const fileExtension = fileDivided[fileDivided.length-1].toLowerCase();
        if (!validsExtensions.includes(fileExtension)){
            reject('Extension not allowed');
            // return res.status(401).json({
                //     msg: 'Extension not allowed'
                // })
        }
            
        //Le creamos un nombre (id) temporario al archivo q subimos
        const tempName = uuidv4() + '.' + fileExtension;
        
        const uploadPath = path.join(__dirname, '../uploads/', dir, tempName);
        
        sampleFile.mv(uploadPath, (err) => {
            if (err) {
                reject (err)
            }
            resolve(tempName)
        });
    })
}

module.exports = {
    uploaderHelper
}