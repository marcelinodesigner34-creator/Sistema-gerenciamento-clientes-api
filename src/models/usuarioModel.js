const pool= require ("../config/database");

const buscarPorEmail = async (email) =>{
    const resultado = await pool.query(
        "SELECT id, nome, email, senha, tipo FROM usuarios WHERE email = $1", [email]
    );
    return resultado.rows[0];
};
module.exports = {buscarPorEmail};