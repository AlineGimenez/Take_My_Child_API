const  express  =  require ('express') ;  // import express; usando express;
const server = express();
const cors = require ('cors');
const { uuid } = require('uuidv4');

const database = require('./database');

server.use(cors())
server.use(express.json())

server.post('/login', async function(request, response) {
    const login = request.body.login;
    const password = request.body.password;
    const resposta = await database.login(login, password);
    if(resposta != null){
        response.send(resposta);
        response.status(200).send();
    }
    else{
        response.send("SENHA ERRADA");
        response.status(400).send();
    }
})

server.get('/', async function(request, response) {
    const resultado = await database.read();
    response.json(resultado);
})

server.post('/cadastrousuario', async function(request, response) {
    const uuid1 = uuid();
    const nome_usuario = request.body.nome;
    const cpf = request.body.cpf;
    const rg = request.body.rg;
    const telefone = request.body.telefone;
    const usuario_login = request.body.login;
    const usuario_password = request.body.password;
    const tipo_usuario = request.body.tipo;

    const result = await database.createUsuario(uuid1, nome_usuario, cpf, rg, telefone, usuario_login, usuario_password, tipo_usuario);
    response.status(200).send();
})



/*server.get('/', function(request, response) {
    response.send('Hello World!');
})*/

server.listen(process.env.PORT || 3000);