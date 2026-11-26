const express = require("express");
const router = express.Router();
const clienteController = require("../controllers/clienteController");

// POST /api/clientes — cadastro público de cliente.
router.post("/", clienteController.cadastrar);

const autenticar = require("../middlewares/authMiddleware");
router.put("/me", autenticar, clienteController.atualizar);
router.put("/me/senha", autenticar, clienteController.alterarSenha);
router.delete("/me", autenticar, clienteController.excluir);
module.exports = router;
