const express = require('express');
//Cors proteje nuestro serv de manera superficial
//a veces navegadores no ejecutan cuando no se tiene
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { dbConnection } = require('../database/config')

const { socketController } = require('../sockets/socketController');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        //Servidor de socket: El que tengo q poner a escuchar en el listen abajo de todo
        this.server = require('http').createServer(this.app);
        // O puede ir this.server = createServer (this.app); y arriba implementar: const {createServer} = require('http')
        //Servidor de sockets:
        this.io = require('socket.io')(this.server);

        //Para dejar esto mejor lo hacemos con objeto
        // this.categoriesPath = '/api/categories'
        // this.usersPath = '/api/users';
        // this.authPath = '/api/auth';
        this.paths = {
            categories: '/api/categories',
            users: '/api/users',
            auth: '/api/auth',
            products: '/api/products',
            search: '/api/search',
            upload: '/api/upload'
        }

        // Acá middlewares > funciones q se ejecutan cuando levantamos nuestro server
        // los middlewares se usan con app.use
        //Conecto mi servidor a la base de datos
        this.conectarDB();

        this.middlewares();
        //Rutas
        this.routes(); //Esto arranca las rutas

        //Sockets
        this.sockets();
    }

    async conectarDB() {
        await dbConnection();
    }

    //Middlewares para ejecutarse antes de abrir el server
    middlewares() {
        this.app.use(cors())
        //Directorio publico
        this.app.use(express.static('public'));

        //Lectura y parseo del body
        //Va a serializar la información entrante (Post, Put, Delete(a veces)) a formato JSON
        this.app.use(express.json());

        //Middleware para manejar el fileUpload
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            //Condicion para q cree carpetas si se expecifican en la subida de archivos
            createParentPath: true
        }));
    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'));
        //Middleware que le voy a poner cierta ruta
        this.app.use(this.paths.users, require('../routes/users'));
        this.app.use(this.paths.categories, require('../routes/categories'));
        this.app.use(this.paths.products, require('../routes/products'));
        this.app.use(this.paths.search, require('../routes/search'));
        this.app.use(this.paths.upload, require('../routes/upload'));
    };

    sockets() {
        // this.io.on('connection', socketController); hay que pasarle el io (todo el servidor de sockets al controlador):
        this.io.on('connection', (socket) => socketController(socket, this.io));
    };

    listen() {
        this.server.listen(this.port, (() => {
            console.log('Corriendo en el 8080')
        }))
    };


}

module.exports = Server;