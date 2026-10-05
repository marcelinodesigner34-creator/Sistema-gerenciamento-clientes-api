const express = require ("express")
const clienteController = require("../controllers/clienteController")
const router = express.Router();
router.get("/", clienteController.listar);
router.post("/", clienteController.cadastrar);
router.get("/buscar", clienteController.buscar);

module.exports = router;