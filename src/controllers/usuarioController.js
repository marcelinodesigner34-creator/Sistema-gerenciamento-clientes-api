const bcrypt = require("bcryptjs");

const usuarioModel = require("../models/usuarioModel");
const listar = async (req, res) => {
    try {
        const usuarios = await usuarioModel.listar();
        res.json(usuarios);
    } catch (erro) {
        console.error(erro.message)
        res.status(500).json({ mensagem: "Erro ao listar usuarios" })
    }

};


const buscarPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const usuario = await usuarioModel.buscarPorId(id);
        if (!usuario) {
            return res.status(404).json({ mensagem: "Usuário não encontrado" });
        }
        res.json(usuario);
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({ mensagem: "Erro ao buscar usuário" });
    }
}

const cadastrar = async (req, res) => {
    try {
        const { nome, email, senha, tipo } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({ mensagem: "Preencha nome, e-mail e senha" });
        }
        if (!tipo) {
            return res.status(400).json({ mensagem: "Selecione o tipo de usuário" });
        }

        const senhaHash = await bcrypt.hash(senha, 10);
        const usuario = await usuarioModel.cadastrar(nome, email, senhaHash, tipo);
        res.status(201).json(usuario);
    } catch (erro) {
        if (erro.code === "23505") {
            return res.status(409).json({ mensagem: "E-mail já cadastrado no sistema" });
        }
        console.error(erro.mensage);
        res.status(500).json({ mensagem: "Erro ao cadastrar usuário" });
    }

}

module.exports = { listar, buscarPorId, cadastrar }