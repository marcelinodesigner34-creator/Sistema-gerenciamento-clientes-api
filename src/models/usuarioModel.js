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

module.exports = {buscarPorEmail, listar}