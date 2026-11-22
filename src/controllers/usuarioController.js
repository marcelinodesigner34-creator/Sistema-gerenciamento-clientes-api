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

        if (!nome) {
            return res.status(400).json({ mensagem: "Informe o nome", campo: "nome" });
        }

        if (!email) {
            return res.status(400).json({ mensagem: "Informe o e-mail", campo: "email" });
        }

        if (!senha) {
            return res.status(400).json({ mensagem: "Informe a senha", campo: "senha" });
        }

        if (!tipo) {
            return res.status(400).json({ mensagem: "Selecione o tipo de usuário", campo: "tipo" });
        }

        const senhaHash = await bcrypt.hash(senha, 10);
        const usuario = await usuarioModel.cadastrar(nome, email, senhaHash, tipo);
        res.status(201).json(usuario);
    } catch (erro) {
        if (erro.code === "23505") {
            return res.status(409).json({ mensagem: "E-mail já cadastrado no sistema", campo: "email" });
        }
        console.error(erro.message);
        res.status(500).json({ mensagem: "Erro ao cadastrar usuário" });
    }

}

const editar = async (req, res) => {
    try {
        const { id } = req.params;

        const { nome, email, senha, tipo } = req.body;

        if (!nome) {
            return res.status(400).json({ mensagem: "Informe o nome", campo: "nome" });
        }

        if (!email) {
            return res.status(400).json({ mensagem: "Informe o e-mail", campo: "email" });
        }

        if (!tipo) {
            return res.status(400).json({ mensagem: "Selecione o tipo de usuário", campo: "tipo" });
        }

        const senhaHash = senha ? await bcrypt.hash(senha, 10) : null;
        const usuario = await usuarioModel.editar(id, nome, email, senhaHash, tipo);

        if (!usuario) {
            return res.status(404).json({ mensagem: "Usuário não encontrado" })
        }
        res.json(usuario);

    } catch (erro) {
        if (erro.code === "23505") {
            return res.status(409).json({ mensagem: "E-mail já cadastrado no sistema", campo:"email"});
        }
        console.error(erro.message);
        res.status(500).json({ mensagem: "Erro ao editar usuário" });
    }
};

const excluir = async (req, res) => {
  try {
    const { id } = req.params;
    const { logadoId } = req.query;

    if (Number(id) === Number(logadoId)) {
      return res.status(400).json({ mensagem: "Não é possível remover o usuário atualmente logado" });
    }

    const usuario = await usuarioModel.buscarPorId(id);

    if (!usuario) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    if (usuario.tipo === "administrador") {
      const totalAdmins = await usuarioModel.contarAdministradores();

      if (totalAdmins <= 1) {
        return res.status(400).json({ mensagem: "É necessário manter ao menos um administrador cadastrado" });
      }
    }

    await usuarioModel.excluir(id);
    res.json({ mensagem: "Usuário removido com sucesso" });
  } catch (erro) {
    if(erro.code === "23503"){
        return res.status(409).json({ mensagem: "Usuário possui clientes cadastrados e não pode ser removido" });
    }
    console.error(erro.message);
    res.status(500).json({ mensagem: "Erro ao remover usuário" });
  }
};


module.exports = { listar, buscarPorId, cadastrar, editar, excluir }