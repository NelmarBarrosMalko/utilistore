// Controller do perfil: atualizar os próprios dados e excluir a própria conta.

const bcrypt = require("bcryptjs");
const clienteModel = require("../models/clienteModel");

// PUT /api/clientes/me
async function atualizar(req, res) {
    const nome = (req.body.nome || "").trim();
    const email = (req.body.email || "").trim();
    const telefone = (req.body.telefone || "").trim();

    if (!nome || !email || !telefone) {
        return res.status(400).json({ message: "Informe nome, e-mail e telefone." });
    }

    try {
        await clienteModel.atualizar(req.clienteLogado.id, { nome: nome, email: email, telefone: telefone });
        return res.status(200).json({ id: req.clienteLogado.id, nome: nome, email: email, telefone: telefone });
    } catch (erro) {
        if (erro.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ message: "E-mail ou telefone já cadastrado." });
        }
        console.error("Erro ao atualizar cliente:", erro);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
}

// PUT /api/clientes/me/senha
async function alterarSenha(req, res) {
    const senhaAtual = req.body.senhaAtual;
    const novaSenha = req.body.novaSenha;

    if (!senhaAtual || !novaSenha || novaSenha.length < 6) {
        return res.status(400).json({ message: "Informe a senha atual e uma nova senha com no mínimo 6 caracteres." });
    }

    try {
        const cliente = await clienteModel.buscarPorId(req.clienteLogado.id);
        const senhaValida = cliente && await bcrypt.compare(senhaAtual, cliente.senha_hash);

        if (!senhaValida) {
            return res.status(401).json({ message: "Senha atual incorreta." });
        }

        await clienteModel.atualizarSenha(cliente.id, await bcrypt.hash(novaSenha, 10));
        return res.status(204).send();
    } catch (erro) {
        console.error("Erro ao alterar senha:", erro);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
}

// DELETE /api/clientes/me (exige a senha no corpo, por segurança)
async function excluir(req, res) {
    const senha = req.body.senha;

    if (!senha) {
        return res.status(400).json({ message: "Informe sua senha para excluir a conta." });
    }

    try {
        const cliente = await clienteModel.buscarPorId(req.clienteLogado.id);
        const senhaValida = cliente && await bcrypt.compare(senha, cliente.senha_hash);

        if (!senhaValida) {
            return res.status(401).json({ message: "Senha incorreta." });
        }

        await clienteModel.excluir(cliente.id);
        return res.status(204).send();
    } catch (erro) {
        console.error("Erro ao excluir cliente:", erro);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
}

module.exports = {
    atualizar: atualizar,
    alterarSenha: alterarSenha,
    excluir: excluir
};
