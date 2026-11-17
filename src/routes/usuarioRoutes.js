const express = require ("express");
const usuarioController= require("../controllers/usuarioController")
const router = express.Router();
router.get("/", usuarioController.listar)
router.get("/:id", usuarioController.buscarPorId)
router.post("/", usuarioController.cadastrar)
router.put("/:id", usuarioController.editar)

module.exports =router;