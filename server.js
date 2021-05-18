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

server.get('/verificarlogin/:login', async function(request, response) {
    const login = request.params.login;

    const resposta = await database.verificarLogin(login);
    if(resposta != null){
        response.send("Já existe este login!");
        response.status(200).send();
    }
    else{
        response.send(null);
        response.status(400).send();
    }
})

server.post('/cadastrarmotorista', async function(request, response) {
    const uuid1 = uuid();
    const nome_usuario = request.body.nome;
    const cpf = request.body.cpf;
    const rg = request.body.rg;
    const telefone = request.body.telefone;
    const usuario_login = request.body.login;
    const usuario_senha = request.body.senha;
    const usuario_tipo = "motorista";
    const cnh = request.body.cnh;
    const placa_van = request.body.placa_van;
    const modelo_van = request.body.modelo_van;
    const cor_van = request.body.cor_van;
    const marca_van = request.body.marca_van;

    const result = await database.createMotorista(uuid1, nome_usuario, cpf, rg, telefone, usuario_login, usuario_senha, usuario_tipo, cnh, placa_van, modelo_van, cor_van, marca_van);
    response.send(result);
    response.status(200).send();
})




/*server.get('/', function(request, response) {
    response.send('Hello World!');
})*/

server.listen(process.env.PORT || 3000);