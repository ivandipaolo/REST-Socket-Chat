class Msg {
    constructor(uid, name, message) {
        this.uid = uid;
        this.name = name;
        this.message = message;
    };

}

class chatMsg {
    constructor() {
        this.messages = [];
        this.users = {};
    };

    get last10() {
        this.messages = this.messages.splice(0, 10);
        return this.messages;
    };

    get usersArr() {
        return Object.values(this.users); //Devuelve objetos como arreglo
    };

    sendMessage(uid, name, message) {
        this.messages.unshift(
            new Msg(uid, name, message)
        );
    };

    connectUser(user) {
        this.users[user.id] = user;
    };

    disconnectUser(id) {
        delete this.users[id]; // Borra propiedad de objeto
    }
}

module.exports = chatMsg;