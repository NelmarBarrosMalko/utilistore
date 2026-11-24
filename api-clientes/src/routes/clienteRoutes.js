const express = require("express");
const router = express.Router();
const clienteController = require("../controllers/clienteController");

// Cadastro
router.post("/", clienteController.cadastrar);

// Consulta
router.get("/", clienteController.listar);
router.get("/:id", clienteController.buscarPorId);

// Alteração e exclusão
router.put("/:id", clienteController.atualizar);
router.delete("/:id", clienteController.excluir);

module.exports = router;
