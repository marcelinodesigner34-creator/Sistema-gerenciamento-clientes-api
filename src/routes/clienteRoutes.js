const express = require ("express")
const clienteController = require("../controllers/clienteController")
const router = express.Router();
router.get("/", clienteController.listar);
router.post("/", clienteController.cadastrar);
router.get("/buscar", clienteController.buscar);
router.put("/:id", clienteController.editar);
router.delete("/:id", clienteController.excluir)
router.get("/:id", clienteController.buscarPorId);


module.exports = router;