const bcrypt = require("bcryptjs");
const usuarioModel = require("../models/usuarioModel");

const login = async (req, res)=>{
    try{
        const {email, senha} = req.body;
        if(!email){
            return res.status(400).json({mensagem: "Informe o e-mail", campo:"email"});
        }

          if(!senha){
            return res.status(400).json({mensagem: "Informe a senha", campo: "senha"});
        }
        const usuario = await usuarioModel.buscarPorEmail(email);
        if(!usuario){
            return res.status(401).json({mensagem: "E-mail ou senha inválidos"});
        }
        const senhaConfere = await bcrypt.compare(senha, usuario.senha);
        if (!senhaConfere){
            return res.status(401).json({mensagem: "E-mail ou senha inválidos"});
        }
        res.json({id: usuario.id, nome: usuario.nome, tipo: usuario.tipo});
    } catch (erro){
        console.error(erro.message);
        res.status(500).json({mensagem: "Erro ao realizar login"});
    }
};
module.exports= {login};

