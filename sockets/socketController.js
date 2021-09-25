const { check } = require("express-validator");
const { Socket } = require("socket.io");
const {checkJWT} = require('../helpers');
const {ChatMessages} = require('../models');

const chatMessages = new ChatMessages();

const socketController = async (socket = new Socket(), io) => { // = new Socket() es algo que no se hace pero en produccion sirve para tener los metodos
    const token = socket.handshake.headers['p-token']; // Extraer info que manda la funcion en chat.js
    const user = await checkJWT(token);
    if(!user){
        return socket.disconnect();
    };

    //Agrega usuario conectado a la sala
    chatMessages.connectUser(user);
    io.emit('active-users', chatMessages.usersArr);
    socket.emit('receive-mensajes', chatMessages.last10);

    //Conecta al usuario a una sala especial
    socket.join(user.id);//Usuario esta conectado a 3 salas, global, usuario.id, socket.id

    //Limpia cuando alguien se desconecta
    socket.on('disconnect', ()=> {
        chatMessages.disconnectUser(user.id)
        io.emit('active-users', chatMessages.usersArr);
    });

    socket.on('send-message', ({msg, uid}) => {
        if(uid){
            //Mensaje privado
            //El servidor funciona como intermediario entre mensajes
            socket.to(uid).emit('private-message', {de: user.name, msg});
        }else{
            chatMessages.sendMessage(user.id, user.name, msg);
            io.emit('receive-mensajes', chatMessages.last10);
        }
    })

}

module.exports = {
    socketController,
}