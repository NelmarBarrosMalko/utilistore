// Regra de negócio do login: busca o cliente, confere a senha e gera o token.
// O controller só cuida de request/response; a lógica fica aqui.

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const clienteModel = require("../models/clienteModel");

async function autenticar(login, senha) {
    const cliente = await clienteModel.buscarPorEmailOuTelefone(login);

    if (!cliente) {
        // Mensagem genérica: não revela se o login existe ou não.
        return { sucesso: false, motivo: "credenciais_invalidas" };
    }

    const senhaValida = await bcrypt.compare(senha, cliente.senha_hash);

    if (!senhaValida) {
        return { sucesso: false, motivo: "credenciais_invalidas" };
    }

    const token = gerarToken(cliente);

    return {
        sucesso: true,
        token: token,
        cliente: {
            id: cliente.id,
            nome: cliente.nome,
            email: cliente.email
        }
    };
}

function gerarToken(cliente) {
    const payload = { id: cliente.id, email: cliente.email };
    const opcoes = { expiresIn: process.env.JWT_EXPIRES_IN || "2h" };
    return jwt.sign(payload, process.env.JWT_SECRET, opcoes);
}

module.exports = {
    autenticar: autenticar
};
