const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'ifgrgkvovihmzf',
    password: '2a3d19362809e05c7fe288ba74be433d10dacdb1a9d46bd8ba21baa2e8234e4a',
    host: 'ec2-52-22-161-59.compute-1.amazonaws.com',
    database: 'ddcf1u8c0om6kl',
    port: 5432,
    ssl: { rejectUnauthorized: false }
});

//const script = 'CREATE TABLE IF NOT EXISTS usuario (uuid char(36) not null,	nome_usuario varchar(50) not null, cpf char(11) not null, rg char(9) not null, telefone char(11) not null, usuario_login varchar(25) not null, usuario_password varchar(20) not null, usuario_tipo char(10), email varchar(50) constraint user_pk_uuid primary key(uuid),	constraint user_login_uk unique(usuario_login))';
//const script = 'CREATE TABLE IF NOT EXISTS motorista (usuario_codigo char(36) not null,	cnh char(11) not null, placa_van char(7) not null, modelo_van varchar(20) not null,	cor_van varchar(20) not null, marca_van varchar(20) not null, constraint moto_pk_usuario_cod primary key(usuario_codigo), constraint moto_fk_usuario_cod foreign key(usuario_codigo) references usuario, constraint moto_cnh_uk unique(cnh), constraint moto_placa_van_uk unique(placa_van))';
//const script = 'CREATE TABLE IF NOT EXISTS aluno (usuario_codigo char(36) not null,	nome_aluno varchar(50) not null, endereco varchar(50) not null,	trajeto int not null, escola varchar(20) not null, endereco_escola varchar(50) not null, codigo_motorista char(36),	constraint aluno_pk_usuario_cod primary key(usuario_codigo), constraint aluno_fk_usuario_cod foreign key(usuario_codigo) references usuario, constraint aluno_fk_motorista_cod foreign key(codigo_motorista) references motorista, constraint aluno_valida_trajeto check(trajeto in (1,2,3)))';
//const script = 'CREATE TABLE IF NOT EXISTS ausente (uuid char(36) not null, aluno_codigo char(36) not null, turno_ida int not null, turno_volta int not null, constraint ausente_pk primary key(uuid), constraint ausente_fk_aluno_cod foreign key(aluno_codigo) references aluno, constraint ausente_valida_turno_ida check(turno_ida in (0,1)), constraint ausente_valida_turno_volta check(turno_volta in (0,1)))';
//const script = 'CREATE TABLE IF NOT EXISTS turno (uuid char(36) not null, aluno_codigo char(36) not null, motorista_codigo char(36) not null, turno varchar(20) not null, status_turno int not null, constraint turno_pk primary key(uuid), constraint turno_fk_aluno_cod foreign key(aluno_codigo) references aluno, constraint turno_fk_motorista_cod foreign key(motorista_codigo) references motorista, constraint turno_valida_status check(status_turno in (0,1,2,3)))';
//const script = 'DELETE FROM usuario WHERE uuid = $1';
//const script = 'ALTER TABLE ausente ADD data date not null';
//const script = 'ALTER TABLE usuario ADD email varchar(50)';
// const script = 'DROP TABLE turno';
// const script = 'CREATE TABLE IF NOT EXISTS turno (aluno_codigo char(36) not null, motorista_codigo char(36) not null, aluno_nome varchar(50) not null, aluno_endereco varchar(50) not null, turno int not null, status_turno int not null, data date not null, constraint turno_pk primary key(aluno_codigo,motorista_codigo), constraint turno_fk_aluno_cod foreign key(aluno_codigo) references aluno, constraint turno_fk_motorista_cod foreign key(motorista_codigo) references motorista, constraint turno_valida_turno check(turno in (1,2)), constraint turno_valida_status check(status_turno in (0,1,2,3)))';

// pool.query(script, function (error, result) {
//     if (error)
//         throw error;
//     else
//         console.log("Tabela criada com sucesso.");
// })

module.exports = {

    async login(login, senha) {
        const sql = `SELECT usuario_tipo FROM usuario WHERE usuario_login = $1 and usuario_password = $2`;
        const result = await pool.query(sql, [login, senha]);
        //print(result);
        if (result.rows[0] != null) {
            return result.rows[0].usuario_tipo;
        }
        else {
            return result.rows[0];
        }
    },

    async createUsuario(uuid, nome_usuario, cpf, rg, telefone, usuario_login, usuario_password, usuario_tipo) {
        try {
            const sql = `INSERT INTO usuario (uuid, nome_usuario, cpf, rg, telefone, usuario_login, usuario_password, usuario_tipo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
            const result = await pool.query(sql, [uuid, nome_usuario, cpf, rg, telefone, usuario_login, usuario_password, usuario_tipo]);
            return result.rows;

        } catch (error) {
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
        if (result.rows[0] != null) {
            return result.rows[0].uuid;
        }
        else {
            return result.rows[0];
        }
    },

    async createMotorista(uuid, nome_usuario, cpf, rg, telefone, usuario_login, usuario_senha, usuario_tipo, cnh, placa_van, modelo_van, cor_van, marca_van) {
        try {
            const sql1 = `INSERT INTO usuario (uuid, nome_usuario, cpf, rg, telefone, usuario_login, usuario_password, usuario_tipo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING usuario_login`;
            const result1 = await pool.query(sql1, [uuid, nome_usuario, cpf, rg, telefone, usuario_login, usuario_senha, usuario_tipo]);

            if (result1 != null) {
                const sql2 = `INSERT INTO motorista (usuario_codigo, cnh, placa_van, modelo_van, cor_van, marca_van) VALUES ($1, $2, $3, $4, $5, $6)`;
                const result2 = await pool.query(sql2, [uuid, cnh, placa_van, modelo_van, cor_van, marca_van]);
                return result1.rows[0].usuario_login
            }
            return result1.rows;

        } catch (error) {
            console.log(error);
            return -1;
        }
    },

    async readMotorista(login) {
        const sql = `select * from usuario u, motorista m where u.usuario_login = $1 and u.uuid = m.usuario_codigo`;
        const result = await pool.query(sql, [login]);
        return result.rows;
    },

    async readMotoristaUUID(uuid) {
        const sql = `select * from usuario where uuid = $1 and usuario_tipo = 'motorista'`;
        const result = await pool.query(sql, [uuid]);
        return result.rows;
    },

    async updateMotorista(uuid, nome_usuario, cpf, rg, telefone, usuario_login, usuario_senha, cnh, placa_van, modelo_van, cor_van, marca_van) {
        const sql1 = `UPDATE usuario SET nome_usuario=$2, cpf=$3, rg=$4, telefone=$5, usuario_login=$6, usuario_password=$7 where uuid = $1`;
        const result1 = await pool.query(sql1, [uuid, nome_usuario, cpf, rg, telefone, usuario_login, usuario_senha]);

        if (result1 != null) {
            const sql2 = `UPDATE motorista SET cnh=$2, placa_van=$3, modelo_van=$4, cor_van=$5, marca_van=$6 where usuario_codigo = $1`;
            const result2 = await pool.query(sql2, [uuid, cnh, placa_van, modelo_van, cor_van, marca_van]);
        }
        return result1;
    },

    async deleteMotorista(uuid) {
        sql = `UPDATE aluno SET codigo_motorista = null WHERE codigo_motorista = $1`;
        result = await pool.query(sql, [uuid]);
        sql = `delete from motorista where usuario_codigo = $1`;
        result = await pool.query(sql, [uuid]);
        sql = `delete from usuario where uuid = $1`;
        result = await pool.query(sql, [uuid]);
        return result.rows;
    },

    async linkMotorista(uuid_aluno, login_motorista) {
        const sql1 = `UPDATE aluno SET codigo_motorista = (SELECT u.uuid FROM usuario u WHERE u.usuario_login = $1 AND u.usuario_tipo = 'motorista') WHERE usuario_codigo = $2 RETURNING codigo_motorista`;
        const result1 = await pool.query(sql1, [login_motorista, uuid_aluno]);
        return result1.rows[0].codigo_motorista;
    },

    async createResponsaveis(uuid, nome_usuario, cpf, rg, telefone, usuario_login, usuario_senha, usuario_tipo, nome_aluno, endereco, trajeto, escola, endereco_escola, email) {
        try {
            const sql1 = `INSERT INTO usuario (uuid, nome_usuario, cpf, rg, telefone, usuario_login, usuario_password, usuario_tipo, email) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING usuario_login`;
            const result1 = await pool.query(sql1, [uuid, nome_usuario, cpf, rg, telefone, usuario_login, usuario_senha, usuario_tipo, email]);

            if (result1 != null) {
                const sql2 = `INSERT INTO aluno (usuario_codigo, nome_aluno , endereco , trajeto , escola , endereco_escola) VALUES ($1, $2, $3, $4, $5, $6)`;
                const result2 = await pool.query(sql2, [uuid, nome_aluno, endereco, trajeto, escola, endereco_escola]);
                return result1.rows[0].usuario_login
            }
            return result1.rows;

        } catch (error) {
            console.log(error);
            return -1;
        }
    },

    async readAluno(login) {
        const sql = `select * from usuario u, aluno a where u.usuario_login = $1 and u.uuid = a.usuario_codigo`;
        const result = await pool.query(sql, [login]);
        return result.rows;
    },

    async updateAluno(uuid, nome_usuario, cpf, rg, telefone, usuario_login, usuario_senha, nome_aluno, endereco, trajeto, escola, endereco_escola, email) {
        const sql1 = `UPDATE usuario SET nome_usuario=$2, cpf=$3, rg=$4, telefone=$5, usuario_login=$6, usuario_password=$7, email = $8 where uuid = $1`;
        const result1 = await pool.query(sql1, [uuid, nome_usuario, cpf, rg, telefone, usuario_login, usuario_senha, email]);

        if (result1 != null) {
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

    async listAlunos(loginmotorista) {
        uuid_motorista = await this.readMotorista(loginmotorista);
        console.log(uuid_motorista);
        uuid_motorista = uuid_motorista[0].uuid;
        const sql = `select u.nome_usuario,a.nome_aluno,u.telefone,a.endereco,a.endereco_escola, a.escola  from usuario u INNER JOIN aluno a on a.usuario_codigo = u.uuid INNER JOIN motorista m on m.usuario_codigo = $1 where m.usuario_codigo = a.codigo_motorista`;
        const result = await pool.query(sql, [uuid_motorista]);
        return result.rows;
    },

    async createAusente(uuid, aluno_codigo, turno_ida, turno_volta, data) {
        try {
            const sql1 = `INSERT INTO ausente (uuid, aluno_codigo, turno_ida, turno_volta, data) VALUES ($1, $2, $3, $4, $5) RETURNING aluno_codigo`;
            const result1 = await pool.query(sql1, [uuid, aluno_codigo, turno_ida, turno_volta, data]);

            return result1.rows[0];

        } catch (error) {
            console.log(error);
            return -1;
        }
    },

    async readAusente() {
        const sql = `select uuid, aluno_codigo, turno_ida, turno_volta, to_char(data, 'dd-mm-yyyy') as data from ausente`;
        const result = await pool.query(sql);
        return result.rows;
    },

    async readAusenteLogin(login, data) {
        const sql = `select * from ausente where aluno_codigo = $1 and data::date = $2`;
        const result = await pool.query(sql, [login, data]);
        return result.rows;
    },

    async createTurno(login_motorista, turno) {
        try {
            uuid_motorista = await this.readMotorista(login_motorista);
            // console.log(uuid_motorista);
            uuid_motorista = uuid_motorista[0].uuid;

            console.log(turno);

            if (turno == 1) {
                process.env.TZ = 'America/Sao_Paulo';
                var data = new Date();
                data.toLocaleTimeString();
                console.log(data);

                sql3 = `insert into turno(aluno_codigo, motorista_codigo, aluno_nome, aluno_endereco, turno, status_turno, data) select usuario_codigo, codigo_motorista, nome_aluno, endereco, 1, 0, NOW() - interval '3 hours' from aluno where codigo_motorista = $1 and usuario_codigo not in (select a.aluno_codigo from ausente a where data::date = $2::date and turno_ida = 1)`+' RETURNING motorista_codigo';
                //sql3 = `select a.aluno_codigo from ausente a where data::date = $1::date and turno_ida = 1`;
                result3 = await pool.query(sql3, [uuid_motorista,data]);
            }
            else {
                sql3 = `insert into turno(aluno_codigo, motorista_codigo, aluno_nome, aluno_endereco, turno, status_turno, data) select usuario_codigo, codigo_motorista, nome_aluno, endereco, 2, 0, NOW() - interval '3 hours' from aluno where codigo_motorista = $1 and usuario_codigo not in (select a.aluno_codigo from ausente a where data::date = $2::date and turno_volta = 1)`+' RETURNING motorista_codigo';
                result3 = await pool.query(sql3, [uuid_motorista,data]);
            }
            return result3.rows[0].motorista_codigo;

        } catch (error) {
            console.log(error);
            return -1;
        }
    },

    async readTurno(uuid_motorista) {
        const sql1 = `select * from turno where motorista_codigo = $1`;
        const result1 = await pool.query(sql1, [uuid_motorista]);
        return result1.rows
    },

    async readTurnoFinalizado(uuid_motorista) {
        const sql1 = `select * from turno where motorista_codigo = $1 and status_turno = 1 or status_turno = 0`;
        const result1 = await pool.query(sql1, [uuid_motorista]);
        return result1.rows
    },

    async updateStatus(motorista_codigo, aluno_codigo, status) {
        const sql1 = `UPDATE turno SET status_turno = $1 where aluno_codigo = $2 and motorista_codigo = $3 RETURNING aluno_codigo`;
        const result1 = await pool.query(sql1, [status, aluno_codigo, motorista_codigo]);
        return result1.rows[0].aluno_codigo;
    },

    async readEmail(uuid_aluno) {
        const sql1 = `select email from usuario where uuid = $1`;
        const result1 = await pool.query(sql1, [uuid_aluno]);
        return result1.rows[0].email;
    },

    async deleteTurnoMotorista(uuid_motorista) {
        sql = `delete from turno where motorista_codigo = $1`;
        result = await pool.query(sql, [uuid_motorista]);
        return result.rows;
    },
}