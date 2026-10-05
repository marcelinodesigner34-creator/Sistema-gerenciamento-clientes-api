const clienteModel = require("../models/clienteModel")
const listar = async (req, res) => {
    try {
        const cliente = await clienteModel.listar();
        res.json(cliente);
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({ mensagem: "Erro ao listar clientes" });
    }
};

const cadastrar = async (req, res) => {
    try {
        const { nome, cpf, telefone, email, endereco, data_nascimento } = req.body;
        if (!nome) {
            return res.status(400).json({ mensagem: "O campo nome é obrigatório" });
        }
        if (!cpf) {
            return res.status(400).json({ mensagem: "O campo cpf é obrigatório" });
        }
        const cliente = await clienteModel.cadastrar(nome, cpf, telefone, email, endereco, data_nascimento)

        res.status(201).json(cliente);
    } catch (erro) {
        if (erro.code === "23505") {
            return res.status(409).json({ mensagem: "CPF já cadastrado no sistema" });
        }
        console.error(erro.message);
        res.status(500).json({ mensagem: "Erro ao cadastrar clientes" });
    }

}

const buscar = async (req, res) => {
    try {
        const { termo } = req.query;
        if (!termo) {
            return res.status(400).json({ mensagem: "Informe o termo de busca" })
        }
        const cliente = await clienteModel.buscar(termo)
        res.json(cliente)
    }
    catch (erro) {
        console.error(erro.message);
        res.status(500).json({ mensagem: "Erro ao buscar clientes" })
    }
}

const editar = async (req, res)=>{
        try {
            const {id} = req.params;
        const { nome, cpf, telefone, email, endereco, data_nascimento } = req.body;
        if (!nome) {
            return res.status(400).json({ mensagem: "O campo nome é obrigatório" });
        }
        if (!cpf) {
            return res.status(400).json({ mensagem: "O campo cpf é obrigatório" });
        }
        const cliente = await clienteModel.editar(id, nome, cpf, telefone, email, endereco, data_nascimento)

        if(!cliente){
            return res.status(404).json({ mensagem: "Cliente não encontrado" });
        }

        res.json(cliente);
    } catch (erro) {
        if (erro.code === "23505") {
            return res.status(409).json({ mensagem: "CPF já cadastrado no sistema" });
        }
        console.error(erro.message);
        res.status(500).json({ mensagem: "Erro ao editar clientes" });
    }

}
    
module.exports = { listar, cadastrar, buscar, editar };