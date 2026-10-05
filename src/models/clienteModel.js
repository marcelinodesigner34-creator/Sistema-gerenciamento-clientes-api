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

const buscar = async (termo)=>{
    const resultado = await pool.query("SELECT id, nome, cpf, telefone FROM clientes WHERE nome ILIKE $1 OR cpf ILIKE $1 ORDER BY nome", [`%${termo}%`]

    );
    return resultado.rows;
};

const editar = async (id, nome, cpf, telefone, email, endereco, data_nascimento) =>{
    const resultado = await pool.query("UPDATE clientes SET nome = $1, cpf = $2, telefone = $3, email= $4, endereco = $5, data_nascimento = $6 WHERE id = $7 RETURNING *",
        [nome, cpf, telefone, email, endereco, data_nascimento, id]
    );
    return resultado.rows[0]
}

const excluir = async (id) =>{
    const resultado = await pool.query("DELETE FROM clientes WHERE id = $1 RETURNING *", [id]);
    return resultado.rows[0]
}
module.exports ={listar, cadastrar, buscar, editar, excluir};