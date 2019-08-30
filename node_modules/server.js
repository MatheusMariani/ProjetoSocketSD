const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname,'public')));
app.set('views', path.join(__dirname,'public'));  //configuração para usar html. 
app.engine('html', require('ejs').renderFile);  //configuração para usar html.
app.set('view engine', 'html');  //configuração para usar html.

app.use('/', (req, res) => {
    res.render('index.html');
});

let messages = [];


io.on('connection', socket => {  //sempre que alguém entrar aparece a id do socket no console.
    console.log(`Socket conectado: ${socket.id}`);

    socket.emit('previousMessages', messages); // função para sempre que um socket conectar, ele receber as mensagens de antes.

    socket.on('sendMessage', data => { //função do socket para receber os dados da mensagem do front-end.
        console.log(data);
        messages.push(data);
        socket.broadcast.emit('receivedMessage' , data); //função para enviar para todos os sockets conectados.
    });
});


server.listen(3000);

