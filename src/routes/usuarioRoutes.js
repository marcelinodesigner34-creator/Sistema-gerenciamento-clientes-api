const express = require ("express");
const usuarioController= require("../controllers/usuarioController")
const router = express.Router();
router.get("/", usuarioController.listar)
router.get("/:id", usuarioController.buscarPorId)

module.exports =router;