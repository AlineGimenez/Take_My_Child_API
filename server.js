const express = require('express');  // import express; usando express;
const server = express();
const cors = require('cors');
const { uuid } = require('uuidv4');

const database = require('./database');
var nodemailer = require('nodemailer');

server.use(cors())
server.use(express.json())

var mail = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'takemychildpdm@gmail.com',
        pass: 'takemychild24'
    }
});

server.post('/login', async function (request, response) {
    const login = request.body.login;
    const password = request.body.password;
    const resposta = await database.login(login, password);
    if (resposta != null) {
        response.send(resposta);
        response.status(200).send();
    }
    else {
        response.send("SENHA ERRADA");
        response.status(400).send();
    }
})

server.get('/', async function (request, response) {
    const resultado = await database.read();
    response.json(resultado);
})

server.post('/cadastrousuario', async function (request, response) {
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

server.get('/verificarlogin/:login', async function (request, response) {
    const login = request.params.login;

    const resposta = await database.verificarLogin(login);
    if (resposta != null) {
        response.send("Já existe este login!");
    }
    else {
        response.status(401).send();
    }
})

server.post('/cadastrarmotorista', async function (request, response) {
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

server.get('/readmotorista/:login', async function (request, response) {
    const login1 = request.params.login;
    const resultado = await database.readMotorista(login1);
    response.json(resultado);
})

server.get('/readmotoristauuid/:uuid', async function (request, response) {
    const uuid1 = request.params.uuid;
    const resultado = await database.readMotoristaUUID(uuid1);
    response.json(resultado);
})

server.put('/updatemotorista/:uuid', async function (request, response) {
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

server.put('/updatecodmotorista', async function (request, response) {
    const uuid_aluno = request.body.uuid_aluno;
    const login_motorista = request.body.login_motorista;

    console.log(login_motorista);

    result1 = null;

    if (login_motorista != "") {
        const resultado = await database.readMotorista(login_motorista);

        console.log(resultado);

        if (resultado != "") {
            console.log("PASSOU if");
            result1 = await database.linkMotorista(uuid_aluno, login_motorista);
        }
        else {
            result1 = null;
        }

    }
    else {
        console.log("PASSOU else");
        result1 = await database.linkMotorista(uuid_aluno, login_motorista);
    }

    if (result1 != null) {
        response.json(result1);
    }
    else
        response.status(401).send();
})

server.delete('/deletemotorista/:uuid', async function (request, response) {
    const uuid1 = request.params.uuid;
    const resultado = await database.deleteMotorista(uuid1);
    response.status(200).send();
})

server.post('/cadastrarresponsaveis', async function (request, response) {
    const uuid1 = uuid();
    const nome_usuario = request.body.user.nome;
    const cpf = request.body.user.cpf;
    const rg = request.body.user.rg;
    const telefone = request.body.user.telefone;
    const usuario_login = request.body.user.login;
    const usuario_senha = request.body.user.senha;
    const email = request.body.user.email;
    const usuario_tipo = "responsave";

    const nome_aluno = request.body.nome_aluno;
    const endereco = request.body.endereco;
    const trajeto = request.body.trajeto;
    const escola = request.body.escola;
    const endereco_escola = request.body.endereco_escola;

    const result = await database.createResponsaveis(uuid1, nome_usuario, cpf, rg, telefone, usuario_login, usuario_senha, usuario_tipo, nome_aluno, endereco, trajeto, escola, endereco_escola, email);
    response.send(result);
    response.status(200).send();
})

server.get('/readaluno/:login', async function (request, response) {
    const login1 = request.params.login;
    const resultado = await database.readAluno(login1);
    response.json(resultado);
})

server.put('/updatealuno/:uuid', async function (request, response) {
    const uuid1 = request.params.uuid;
    const nome_usuario = request.body.user.nome;
    const cpf = request.body.user.cpf;
    const rg = request.body.user.rg;
    const telefone = request.body.user.telefone;
    const email = request.body.user.email;
    const usuario_login = request.body.user.login;
    const usuario_senha = request.body.user.senha;

    const nome_aluno = request.body.nome_aluno;
    const endereco = request.body.endereco;
    const trajeto = request.body.trajeto;
    const escola = request.body.escola;
    const endereco_escola = request.body.endereco_escola;

    const result = await database.updateAluno(uuid1, nome_usuario, cpf, rg, telefone, usuario_login, usuario_senha, nome_aluno, endereco, trajeto, escola, endereco_escola, email);
    const resultado = await database.readAluno(usuario_login);
    response.json(resultado);
})

server.delete('/deletealuno/:uuid', async function (request, response) {
    const uuid1 = request.params.uuid;
    const resultado = await database.deleteAluno(uuid1);
    response.status(200).send();
})

server.get('/listagemalunos/:login', async function (request, response) {
    const login1 = request.params.login;
    const resultado = await database.listAlunos(login1);
    response.json(resultado);
})

server.post('/createausente', async function (request, response) {
    const uuid1 = uuid();
    const aluno_codigo = request.body.aluno_codigo;
    const turno_ida = request.body.turno_ida;
    const turno_volta = request.body.turno_volta;
    const data = request.body.data;

    const result = await database.createAusente(uuid1, aluno_codigo, turno_ida, turno_volta, data);
    response.send(result);
    response.status(200).send();
})

server.get('/readausente/', async function (request, response) {
    const resultado = await database.readAusente();
    response.json(resultado);
})

server.put('/readausentelogin/:login', async function (request, response) {
    const login = request.params.login;
    const data = request.body.data;
    console.log(data);
    const resultado = await database.readAusenteLogin(login, data);
    response.json(resultado);
})

server.post('/turno', async function (request, response) {
    const login_motorista = request.body.login_motorista;
    const turno = request.body.turno;

    const result1 = await database.createTurno(login_motorista, turno);
    console.log(result1);
    const result2 = await database.readTurno(result1);
    response.json(result2);
})

server.get('/readturno/:uuid', async function (request, response) {
    const uuid_motorista = request.params.uuid;
    console.log(uuid_motorista);
    const resultado = await database.readTurnoFinalizado(uuid_motorista);
    if (resultado != "") {
        response.json(resultado);
    }
    else
        response.status(401).send();
})

server.get('/readturnoaluno/:login', async function (request, response) {
    const login_aluno = request.params.login;
    const resultado = await database.readTurnoAluno(login_aluno);
    if (resultado != "") {
        response.json(resultado);
    }
    else
        response.status(401).send();
})

server.put('/statusturno', async function (request, response) {
    const motorista_codigo = request.body.motorista_codigo;
    const aluno_codigo = request.body.aluno_codigo;
    const status = request.body.status;

    const result1 = await database.updateStatus(motorista_codigo, aluno_codigo, status);
    console.log(result1);
    const result2 = await database.readEmail(result1);
    console.log(result2);
    response.send(result2);
})

server.delete('/deleteturnomotorista/:uuid', async function (request, response) {
    const uuid_motorista = request.params.uuid;
    const resultado = await database.deleteTurnoMotorista(uuid_motorista);
    response.status(200).send();
})

server.post('/email', async function (request, response) {
    const destinatario = request.body.destinatario;
    const assunto = request.body.assunto;
    const texto = request.body.texto;

    var mailOptions = {
        from: 'takemychildpdm@gmail.com',
        to: destinatario,
        subject: assunto,
        html: texto
    };

    // var mailOptions = {
    //     from: 'takemychildpdm@gmail.com',
    //     to: 'alinegimenezdecastro@hotmail.com',
    //     subject: 'Sending Email via Node.js',
    //     text: 'That was easy!'
    // };

    mail.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email enviado: ' + info.response);
        }
    });
    response.status(200).send();
})


server.listen(process.env.PORT || 3000);