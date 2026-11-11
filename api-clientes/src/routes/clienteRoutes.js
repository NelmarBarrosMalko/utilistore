const express = require("express");
const router = express.Router();
const clienteController = require("../controllers/clienteController");
const autenticar = require("../middlewares/authMiddleware");

// O cliente só enxerga e altera a própria conta (id vem do token).
router.put("/me", autenticar, clienteController.atualizar);
router.put("/me/senha", autenticar, clienteController.alterarSenha);
router.delete("/me", autenticar, clienteController.excluir);

module.exports = router;
