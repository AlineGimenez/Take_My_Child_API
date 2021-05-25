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
    const nome_usuario = request.body.user.nome;
    const cpf = request.body.user.cpf;
    const rg = request.body.user.rg;
    const telefone = request.body.user.telefone;
    const usuario_login = request.body.user.login;
    const usuario_senha = request.body.user.senha;
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

server.get('/readmotorista/:login', async function(request, response) {
    const login1 = request.params.login;
    const resultado = await database.readMotorista(login1);
    response.json(resultado);
})

server.put('/updatemotorista/:uuid', async function(request, response) {
    const uuid1 = request.params.uuid;
    const nome_usuario = request.body.user.nome;
    const cpf = request.body.user.cpf;
    const rg = request.body.user.rg;
    const telefone = request.body.user.telefone;
    const usuario_login = request.body.user.login;
    const usuario_senha = request.body.user.senha;

    const cnh = request.body.cnh;
    const placa_van = request.body.placa_van;
    const modelo_van = request.body.modelo_van;
    const cor_van = request.body.cor_van;
    const marca_van = request.body.marca_van;

    const result = await database.updateMotorista(uuid1, nome_usuario, cpf, rg, telefone, usuario_login, usuario_senha, cnh, placa_van, modelo_van, cor_van, marca_van);
    const resultado = await database.readMotorista(usuario_login);
    response.json(resultado);
})

server.delete('/deletemotorista/:uuid', async function(request, response) {
    const uuid1= request.params.uuid;
    const resultado = await database.deleteMotorista(uuid1);
    response.status(200).send();
})

server.post('/cadastrarresponsaveis', async function(request, response) {
    const uuid1 = uuid();
    const nome_usuario = request.body.user.nome;
    const cpf = request.body.user.cpf;
    const rg = request.body.user.rg;
    const telefone = request.body.user.telefone;
    const usuario_login = request.body.user.login;
    const usuario_senha = request.body.user.senha;
    const usuario_tipo = "responsave";
    
    const nome_aluno = request.body.nome_aluno;
    const endereco = request.body.endereco;
    const trajeto = request.body.trajeto;
    const escola = request.body.escola;
    const endereco_escola = request.body.endereco_escola;

    const result = await database.createResponsaveis(uuid1, nome_usuario, cpf, rg, telefone, usuario_login, usuario_senha, usuario_tipo, nome_aluno , endereco , trajeto , escola , endereco_escola);
    response.send(result);
    response.status(200).send();
})

server.get('/readaluno/:login', async function(request, response) {
    const login1 = request.params.login;
    const resultado = await database.readAluno(login1);
    response.json(resultado);
})

server.put('/updatealuno/:uuid', async function(request, response) {
    const uuid1 = request.params.uuid;
    const nome_usuario = request.body.nome;
    const cpf = request.body.cpf;
    const rg = request.body.rg;
    const telefone = request.body.telefone;
    const usuario_login = request.body.login;
    const usuario_senha = request.body.senha;

    const nome_aluno = request.body.nome_aluno;
    const endereco = request.body.endereco;
    const trajeto = request.body.trajeto;
    const escola = request.body.escola;
    const endereco_escola = request.body.endereco_escola;

    const result = await database.updateAluno(uuid1, nome_usuario, cpf, rg, telefone, usuario_login, usuario_senha, nome_aluno , endereco , trajeto , escola , endereco_escola);
    const resultado = await database.readAluno(usuario_login);
    response.json(resultado);
})

server.delete('/deletealuno/:uuid', async function(request, response) {
    const uuid1= request.params.uuid;
    const resultado = await database.deleteAluno(uuid1);
    response.status(200).send();
})

server.get('/listagemalunos/:login', async function(request, response) {
    const login1 = request.params.login;
    const resultado = await database.listAlunos(login1);
    response.json(resultado);
})


server.listen(process.env.PORT || 3000);