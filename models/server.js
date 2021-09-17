const express = require('express');
//Cors proteje nuestro serv de manera superficial
//a veces navegadores no ejecutan cuando no se tiene
const cors = require('cors');
const {dbConnection} = require('../database/config')

class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.usersPath = '/api/users';
        // Acá middlewares > funciones q se ejecutan cuando levantamos nuestro server
        // los middlewares se usan con app.use
        //Conecto mi servidor a la base de datos
        this.conectarDB();
        
        this.middlewares();
        //Rutas
        this.routes(); //Esto arranca las rutas
    }

    async conectarDB () {
        await dbConnection();
    }


    middlewares(){
        //Directorio publico
        this.app.use(cors())
        this.app.use(express.static('public'));
        
        //Lectura y parseo del body
        //Va a serializar la información entrante (Post, Put, Delete(a veces)) a formato JSON
        this.app.use(express.json());
    }

    routes() {
        //Middleware que le voy a poner cierta ruta
        this.app.use(this.usersPath, require('../routes/users'));

    }

    listen(){
        this.app.listen(this.port, (()=>{
            console.log('Corriendo en el 8080')
        }))
    }

}

module.exports = Server;