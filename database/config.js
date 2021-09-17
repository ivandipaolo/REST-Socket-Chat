const mongoose = require('mongoose');
require('dotenv').config();

const dbConnection = async() =>{
//Se crea un trycatch porque puede fallar la base de datos y
// uno no tiene control absoluto
try {
    //Devuelve promise
    await mongoose.connect(process.env.MONGODB_CNN,{
        //Se envian objetos que se piden en mongoose
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log('Base de datos Online')
} catch (error) {
    console.log(error)
    throw new Error('Error en la base de datos \n a la hora de inicializar.')
}
};

module.exports ={
    dbConnection
};