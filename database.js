const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'ifgrgkvovihmzf',
    password: '2a3d19362809e05c7fe288ba74be433d10dacdb1a9d46bd8ba21baa2e8234e4a',
    host: 'ec2-52-22-161-59.compute-1.amazonaws.com',
    database: 'ddcf1u8c0om6kl',
    port: 5432,
    ssl: { rejectUnauthorized: false }
});

//const script = 'CREATE TABLE IF NOT EXISTS usuario (uuid char(36) not null,	nome_usuario varchar(50) not null, cpf char(11) not null, rg char(9) not null, telefone char(11) not null, usuario_login varchar(25) not null, usuario_password varchar(20) not null, usuario_tipo char(10), constraint user_pk_uuid primary key(uuid),	constraint user_login_uk unique(usuario_login))';
//const script = 'CREATE TABLE IF NOT EXISTS motorista (usuario_codigo char(36) not null,	cnh char(11) not null, placa_van char(7) not null, modelo_van varchar(20) not null,	cor_van varchar(20) not null, marca_van varchar(20) not null, constraint moto_pk_usuario_cod primary key(usuario_codigo), constraint moto_fk_usuario_cod foreign key(usuario_codigo) references usuario, constraint moto_cnh_uk unique(cnh), constraint moto_placa_van_uk unique(placa_van))';
//const script = 'CREATE TABLE IF NOT EXISTS aluno (usuario_codigo char(36) not null,	nome_aluno varchar(50) not null, endereco varchar(50) not null,	trajeto int not null, escola varchar(20) not null, endereco_escola varchar(50) not null, codigo_motorista char(36),	constraint aluno_pk_usuario_cod primary key(usuario_codigo), constraint aluno_fk_usuario_cod foreign key(usuario_codigo) references usuario, constraint aluno_fk_motorista_cod foreign key(codigo_motorista) references motorista, constraint aluno_valida_trajeto check(trajeto in (1,2,3)))';
//const script = 'CREATE TABLE IF NOT EXISTS ausente (uuid char(36) not null, aluno_codigo char(36) not null, turno_ida int not null, turno_volta int not null, constraint ausente_pk primary key(uuid), constraint ausente_fk_aluno_cod foreign key(aluno_codigo) references aluno, constraint ausente_valida_turno_ida check(turno_ida in (0,1)), constraint ausente_valida_turno_volta check(turno_volta in (0,1)))';
//const script = 'CREATE TABLE IF NOT EXISTS turno (uuid char(36) not null, aluno_codigo char(36) not null, motorista_codigo char(36) not null, turno varchar(20) not null, status_turno int not null, constraint turno_pk primary key(uuid), constraint turno_fk_aluno_cod foreign key(aluno_codigo) references aluno, constraint turno_fk_motorista_cod foreign key(motorista_codigo) references motorista, constraint turno_valida_status check(status_turno in (0,1,2,3)))';
//const script = 'DELETE FROM usuario WHERE uuid = $1';

/*pool.query(script, function (error, result) {
    if (error)
        throw error;
    else
        console.log("Tabela criada com sucesso.");
})*/

module.exports = {

    async login(login, senha) {
        const sql = `SELECT usuario_tipo FROM usuario WHERE usuario_login = $1 and usuario_password = $2`;
        const result = await pool.query(sql, [login, senha]);
        //print(result);
        if (result.rows[0]!= null){
            return result.rows[0].usuario_tipo;
        }
        else{
            return result.rows[0];
        }
    },

    async createUsuario(uuid, nome_usuario, cpf, rg, telefone, usuario_login, usuario_password, usuario_tipo) {
        try {
            const sql = `INSERT INTO usuario (uuid, nome_usuario, cpf, rg, telefone, usuario_login, usuario_password, usuario_tipo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
            const result = await pool.query(sql, [uuid, nome_usuario, cpf, rg, telefone, usuario_login, usuario_password, usuario_tipo]);
            return result.rows;

        }catch(error) {
            console.log(error);
            return -1;
        }
    },

    async read() {
        const sql = `SELECT * FROM usuario`;
        const result = await pool.query(sql);
        return result.rows;
    },

    async verificarLogin(login) {
        const sql = `SELECT uuid FROM usuario WHERE usuario_login = $1`;
        const result = await pool.query(sql, [login]);
        //print(result);
        if (result.rows[0]!= null){
            return result.rows[0].uuid;
        }
        else{
            return result.rows[0];
        }
    },

    async createMotorista(uuid, nome_usuario, cpf, rg, telefone, usuario_login, usuario_senha, usuario_tipo, cnh, placa_van, modelo_van, cor_van, marca_van) {
        try {
            const sql1 = `INSERT INTO usuario (uuid, nome_usuario, cpf, rg, telefone, usuario_login, usuario_password, usuario_tipo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING usuario_login`;
            const result1 = await pool.query(sql1, [uuid, nome_usuario, cpf, rg, telefone, usuario_login, usuario_senha, usuario_tipo]);
            
            if(result1!=null)
            {
                const sql2 = `INSERT INTO motorista (usuario_codigo, cnh, placa_van, modelo_van, cor_van, marca_van) VALUES ($1, $2, $3, $4, $5, $6)`;
                const result2 = await pool.query(sql2, [uuid, cnh, placa_van, modelo_van, cor_van, marca_van]);
                return result1.rows[0].usuario_login
            }
            return result1.rows;

        }catch(error) {
            console.log(error);
            return -1;
        }
    },

    async readMotorista(login) {
        const sql = `select * from usuario u, motorista m where u.usuario_login = $1 and u.uuid = m.usuario_codigo`;
        const result = await pool.query(sql, [login]);
        return result.rows;
    },

    async updateMotorista(uuid, nome_usuario, cpf, rg, telefone, usuario_login, usuario_senha, cnh, placa_van, modelo_van, cor_van, marca_van) {
        const sql1 = `UPDATE usuario SET nome_usuario=$2, cpf=$3, rg=$4, telefone=$5, usuario_login=$6, usuario_password=$7 where uuid = $1`;
        const result1 = await pool.query(sql1, [uuid, nome_usuario, cpf, rg, telefone, usuario_login, usuario_senha]);
            
        if(result1!=null)
        {
            const sql2 = `UPDATE motorista SET cnh=$2, placa_van=$3, modelo_van=$4, cor_van=$5, marca_van=$6 where usuario_codigo = $1`;
            const result2 = await pool.query(sql2, [uuid, cnh, placa_van, modelo_van, cor_van, marca_van]);
        }
        return result1;
    },

    async deleteMotorista(uuid) {
        sql = `UPDATE aluno SET codigo_motorista = null WHERE usuario_codigo = $1`;
        result = await pool.query(sql, [uuid]);
        sql = `delete from motorista where usuario_codigo = $1`;
        result = await pool.query(sql, [uuid]);
        sql = `delete from usuario where uuid = $1`;
        result = await pool.query(sql, [uuid]);
        return result.rows;
    },

    async createResponsaveis(uuid, nome_usuario, cpf, rg, telefone, usuario_login, usuario_senha, usuario_tipo, nome_aluno , endereco , trajeto , escola , endereco_escola ) {
        try {
            const sql1 = `INSERT INTO usuario (uuid, nome_usuario, cpf, rg, telefone, usuario_login, usuario_password, usuario_tipo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING usuario_login`;
            const result1 = await pool.query(sql1, [uuid, nome_usuario, cpf, rg, telefone, usuario_login, usuario_senha, usuario_tipo]);
            
            if(result1!=null)
            {
                const sql2 = `INSERT INTO aluno (usuario_codigo, nome_aluno , endereco , trajeto , escola , endereco_escola) VALUES ($1, $2, $3, $4, $5, $6)`;
                const result2 = await pool.query(sql2, [uuid, nome_aluno , endereco , trajeto , escola , endereco_escola]);
                return result1.rows[0].usuario_login
            }
            return result1.rows;

        }catch(error) {
            console.log(error);
            return -1;
        }
    },

    async readAluno(login) {
        const sql = `select * from usuario u, aluno a where u.usuario_login = $1 and u.uuid = a.usuario_codigo`;
        const result = await pool.query(sql, [login]);
        return result.rows;
    },

    async updateAluno(uuid, nome_usuario, cpf, rg, telefone, usuario_login, usuario_senha, nome_aluno , endereco , trajeto , escola , endereco_escola) {
        const sql1 = `UPDATE usuario SET nome_usuario=$2, cpf=$3, rg=$4, telefone=$5, usuario_login=$6, usuario_password=$7 where uuid = $1`;
        const result1 = await pool.query(sql1, [uuid, nome_usuario, cpf, rg, telefone, usuario_login, usuario_senha]);
            
        if(result1!=null)
        {
            const sql2 = `UPDATE aluno SET nome_aluno=$2, endereco=$3, trajeto=$4, escola=$5, endereco_escola=$6 where usuario_codigo = $1`;
            const result2 = await pool.query(sql2, [uuid, nome_aluno, endereco, trajeto, escola, endereco_escola]);
        }
        return result1;
    },

    async deleteAluno(uuid) {
        sql = `delete from aluno where usuario_codigo = $1`;
        result = await pool.query(sql, [uuid]);
        sql = `delete from usuario where uuid = $1`;
        result = await pool.query(sql, [uuid]);
        return result.rows;
    },
}