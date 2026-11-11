// Controller dos endereços do cliente logado (CRUD).

const enderecoModel = require("../models/enderecoModel");

// Valida e limpa os campos recebidos. Retorna null se faltar algo obrigatório.
function lerEndereco(corpo) {
    const e = {
        apelido: (corpo.apelido || "").trim(),
        cep: (corpo.cep || "").trim(),
        logradouro: (corpo.logradouro || "").trim(),
        numero: (corpo.numero || "").trim(),
        complemento: (corpo.complemento || "").trim() || null,
        bairro: (corpo.bairro || "").trim(),
        cidade: (corpo.cidade || "").trim(),
        uf: (corpo.uf || "").trim().toUpperCase()
    };

    const completo = e.apelido && e.cep && e.logradouro && e.numero && e.bairro && e.cidade && e.uf.length === 2;
    return completo ? e : null;
}

function erroInterno(res, erro) {
    console.error("Erro nos endereços:", erro);
    return res.status(500).json({ message: "Erro interno do servidor." });
}

async function listar(req, res) {
    try {
        return res.status(200).json(await enderecoModel.listar(req.clienteLogado.id));
    } catch (erro) {
        return erroInterno(res, erro);
    }
}

async function criar(req, res) {
    const endereco = lerEndereco(req.body);
    if (!endereco) return res.status(400).json({ message: "Preencha todos os campos obrigatórios." });

    try {
        return res.status(201).json(await enderecoModel.criar(req.clienteLogado.id, endereco));
    } catch (erro) {
        return erroInterno(res, erro);
    }
}

async function atualizar(req, res) {
    const endereco = lerEndereco(req.body);
    if (!endereco) return res.status(400).json({ message: "Preencha todos os campos obrigatórios." });

    try {
        const atualizado = await enderecoModel.atualizar(req.params.id, req.clienteLogado.id, endereco);
        if (!atualizado) return res.status(404).json({ message: "Endereço não encontrado." });
        return res.status(200).json(atualizado);
    } catch (erro) {
        return erroInterno(res, erro);
    }
}

async function excluir(req, res) {
    try {
        const apagou = await enderecoModel.excluir(req.params.id, req.clienteLogado.id);
        if (!apagou) return res.status(404).json({ message: "Endereço não encontrado." });
        return res.status(204).send();
    } catch (erro) {
        return erroInterno(res, erro);
    }
}

module.exports = {
    listar: listar,
    criar: criar,
    atualizar: atualizar,
    excluir: excluir
};
