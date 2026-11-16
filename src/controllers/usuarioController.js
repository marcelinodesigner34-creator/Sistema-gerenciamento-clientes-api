const usuarioModel = require("../models/usuarioModel");
const listar = async (req, res) =>{
    try {
        const usuarios=await usuarioModel.listar();
        res.json(usuarios);
    } catch (erro){
        console.error(erro.message)
        res.status(500).json({mensagem:"Erro ao listar usuarios"})
    }

};

module.exports ={listar};