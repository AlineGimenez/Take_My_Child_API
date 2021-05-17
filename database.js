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
}