const express = require("express");
const router = express.Router();
const enderecoController = require("../controllers/enderecoController");
const autenticar = require("../middlewares/authMiddleware");

router.use(autenticar);
router.get("/", enderecoController.listar);
router.post("/", enderecoController.criar);
router.put("/:id", enderecoController.atualizar);
router.delete("/:id", enderecoController.excluir);

module.exports = router;
