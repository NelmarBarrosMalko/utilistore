// Controller de autenticação: recebe a requisição, valida os dados básicos,
// chama o authService e devolve a resposta HTTP.

const authService = require("../services/authService");
const clienteModel = require("../models/clienteModel");

// POST /api/auth/login
async function login(req, res) {
    const loginRecebido = req.body.login;
    const senha = req.body.senha;

    if (!loginRecebido || !senha) {
        return res.status(400).json({ message: "Informe login (e-mail ou telefone) e senha." });
    }

    try {
        const resultado = await authService.autenticar(loginRecebido, senha);

        if (!resultado.sucesso) {
            return res.status(401).json({ message: "Login ou senha inválidos" });
        }

        return res.status(200).json({
            message: "Login realizado com sucesso",
            token: resultado.token,
            cliente: resultado.cliente
        });
    } catch (erro) {
        console.error("Erro ao processar login:", erro);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
}

// GET /api/auth/me (exige token válido, verificado pelo authMiddleware)
async function me(req, res) {
    try {
        const cliente = await clienteModel.buscarPorId(req.clienteLogado.id);

        if (!cliente) {
            return res.status(404).json({ message: "Cliente não encontrado." });
        }

        return res.status(200).json({
            id: cliente.id,
            nome: cliente.nome,
            email: cliente.email,
            telefone: cliente.telefone
        });
    } catch (erro) {
        console.error("Erro ao buscar cliente autenticado:", erro);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
}

module.exports = {
    login: login,
    me: me
};
