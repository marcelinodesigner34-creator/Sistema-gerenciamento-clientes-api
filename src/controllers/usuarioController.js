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



    const buscarPorId = async (req, res) =>{
    try{
        const {id}= req.params;

        const usuario = await usuarioModel.buscarPorId(id);
        if(!usuario){
             return res.status(404).json({ mensagem: "Usuário não encontrado" });
        }
         res.json(usuario);
    }catch (erro) {
        console.error(erro.message);
        res.status(500).json({ mensagem: "Erro ao buscar usuário" });
    }
}

module.exports ={listar, buscarPorId}