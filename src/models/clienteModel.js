const pool= require("../config/database");
const listar = async ()=>{
    const resultado= await pool.query("SELECT id, nome, cpf, telefone FROM clientes ORDER BY nome");
    return resultado.rows;
};

module.exports ={listar};