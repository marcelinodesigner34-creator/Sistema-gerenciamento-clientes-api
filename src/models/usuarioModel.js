const pool= require ("../config/database");

const buscarPorEmail = async (email) =>{
    const resultado = await pool.query(
        "SELECT id, nome, email, senha, tipo FROM usuarios WHERE email = $1", [email]
    );
    return resultado.rows[0];
};

const listar = async () =>{
    const resultado = await pool.query("SELECT id, nome, email, tipo FROM usuarios ORDER BY nome");
    return resultado.rows
}



const buscarPorId= async (id)=>{
    const resultado = await pool.query("SELECT id, nome, email, tipo FROM usuarios WHERE id = $1", [id]);
    return resultado.rows[0];
};

const cadastrar = async(nome, email, senha, tipo) =>{
    const resultado = await pool.query("INSERT INTO usuarios(nome, email, senha, tipo) VALUES($1, $2, $3, $4) RETURNING id, nome, email, tipo", [nome, email, senha, tipo]);
    return resultado.rows[0];
};

const editar = async (id, nome, email, senha, tipo)=>{
    const resultado = await pool.query("UPDATE usuarios SET nome = $1, email =$2, senha = COALESCE($3, senha), tipo = $4 WHERE id = $5 RETURNING id, nome, email, tipo", [nome, email, senha, tipo, id]);

    return resultado.rows[0];

}


module.exports = {buscarPorEmail, listar, buscarPorId, cadastrar, editar}