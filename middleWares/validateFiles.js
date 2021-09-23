const { response } = require("express");


const validateFiles = (req, res = response, next) => {
    if (!req.files || !req.files.sampleFile || Object.keys(req.files).length === 0) {
        res.status(400).send('No files to upload.');
        return;
    }
    next();
}

module.exports = {
    validateFiles,
}