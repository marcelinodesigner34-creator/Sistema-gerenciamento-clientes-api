const clienteModel= require("../models/clienteModel") 
const listar = async (req, res)=>{
try{
    const cliente = await clienteModel.listar();
    res.json(cliente);
} catch (erro){
    console.erro(erro.message); 
    res.status(500).json({mensagem: "Erro ao listar clientes"});
}
};
module.exports ={listar};