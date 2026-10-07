const express = require ("express")
const clienteController = require("../controllers/clienteController")
const authController = require("../controllers/authController");
const router = express.Router();
router.get("/", clienteController.listar);
router.post("/", clienteController.cadastrar);
router.get("/buscar", clienteController.buscar);
router.put("/:id", clienteController.editar);
router.delete("/:id", clienteController.excluir)
router.post("/", authController.login);



module.exports = router;