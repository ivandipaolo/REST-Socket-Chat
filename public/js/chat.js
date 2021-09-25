const url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:8080/api/auth/'
    : 'https://restserver-curso-fher.herokuapp.com/api/auth/';


let user = null;
let socket = null;

//HTML Refs
const txtUid = document.querySelector('#txtUid')
const txtMessage = document.querySelector('#txtMessage')
const ulUsers = document.querySelector('#ulUsers')
const ulMessages = document.querySelector('#ulMessages')
const btnLeave = document.querySelector('#btnLeave')

const validateJWT = async () => {
    const token = localStorage.getItem('token');
    if (token.length < 10) {
        window.location = 'index.html'
        throw new Error('No token on the server');
    }

    const resp = await fetch(url, {
        headers: { 'p-token': token },
    });

    const { user: userDB, token: tokenDB } = await resp.json();

    localStorage.setItem('token', token);
    user = userDB;
    document.title = userDB.name;

    await connectSocket();
}

const connectSocket = async () => {
    // Establece la conexion con nuestro backend server    
    socket = io({
        'extraHeaders': {
            'p-token': localStorage.getItem('token')
        }
    });// Se le manda info en los params 

    //ACA SE CREAN LOS EVENTOS CUANDO SE DISPARE EL SOCKET
    socket.on('connect', () => {
        console.log('Socket online')
    });
    socket.on('disconnect', (id) => {
    });

    //Pensar como q mensajes le voy a escuchar del servidor:
    socket.on('receive-mensajes', conUMsg);

    //ESTO ES IGUAL A
    // socket.on('active-users', (payload) => {
    //     conUsers(payload)
    // });
    //ESTO:
    socket.on('active-users', conUsers);

    socket.on('private-message', (payload) => {
        console.log('Privado,', payload)
    });
}

const conUsers = (users = []) => {
    let usershtml = '';
    users.forEach(({ name, uid }) => {
        usershtml += `
            <li>
                <p>
                <h5 class="text-success"> ${name} </h5>
                <span class="fs-6 text-muted"> ${uid} </span>
                </p>
            </li>
        `
    })
    ulUsers.innerHTML = usershtml;
}

const conUMsg = (messages = []) => {
    let msghtml = '';
    messages.forEach(({ name, message }) => {
        msghtml += `
            <li>
                <p>
                <span class="text-primary"> ${name} </span>
                <span>${message} </span>
                </p>
            </li>
        `
    })
    ulMessages.innerHTML = msghtml;
}


txtMessage.addEventListener('keyup', ({ keyCode }) => {
    const msg = txtMessage.value;
    const uid = txtUid.value;

    if (keyCode !== 13) { return; }//No haga nada

    if (msg.length === 0) { return; }

    socket.emit('send-message', {msg, uid}); // enviar un objeto siempre para q sea mas facil desp

    txtMessage.value = '';
})

const main = async () => {
    await validateJWT();
}

main();