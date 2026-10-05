const pool= require("../config/database");
const listar = async ()=>{
    const resultado= await pool.query("SELECT id, nome, cpf, telefone FROM clientes ORDER BY nome");
    return resultado.rows;
};

const cadastrar = async (nome, cpf, telefone, email, endereco, data_nascimento)=>{
    const resultado = await pool.query("INSERT INTO clientes (nome, cpf, telefone, email, endereco, data_nascimento) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", [nome, cpf, telefone, email, endereco, data_nascimento]
    );
    return resultado.rows[0];
}

module.exports ={listar, cadastrar};