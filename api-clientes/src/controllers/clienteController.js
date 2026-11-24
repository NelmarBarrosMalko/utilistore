const clienteService = require("../services/clienteService");

function validarId(id) {
    return /^\d+$/.test(String(id)) && Number(id) > 0;
}

async function cadastrar(req, res) {
    try {
        const resultado = await clienteService.cadastrar(req.body || {});

        if (resultado.erro) {
            return res.status(400).json({ message: resultado.erro });
        }

        return res.status(201).json({
            message: "Cadastro realizado com sucesso.",
            cliente: { id: resultado.id }
        });
    } catch (erro) {
        if (erro.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                message: "CPF, e-mail ou telefone já cadastrado."
            });
        }

        console.error("Erro ao cadastrar cliente:", erro);
        return res.status(500).json({
            message: "Erro interno do servidor."
        });
    }
}

async function listar(req, res) {
    try {
        const clientes = await clienteService.listar();
        return res.status(200).json(clientes);
    } catch (erro) {
        console.error("Erro ao listar clientes:", erro);
        return res.status(500).json({
            message: "Erro ao consultar clientes."
        });
    }
}

async function buscarPorId(req, res) {
    try {
        const { id } = req.params;

        if (!validarId(id)) {
            return res.status(400).json({ message: "ID inválido." });
        }

        const cliente = await clienteService.buscarPorId(id);

        if (!cliente) {
            return res.status(404).json({
                message: "Cliente não encontrado."
            });
        }

        return res.status(200).json(cliente);
    } catch (erro) {
        console.error("Erro ao buscar cliente:", erro);
        return res.status(500).json({
            message: "Erro ao consultar cliente."
        });
    }
}

async function atualizar(req, res) {
    try {
        const { id } = req.params;

        if (!validarId(id)) {
            return res.status(400).json({ message: "ID inválido." });
        }

        const resultado = await clienteService.atualizar(id, req.body || {});

        if (resultado.erro) {
            return res.status(resultado.status || 400).json({
                message: resultado.erro
            });
        }

        return res.status(200).json({
            message: "Cliente atualizado com sucesso."
        });
    } catch (erro) {
        if (erro.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                message: "CPF, e-mail ou telefone já cadastrado."
            });
        }

        console.error("Erro ao atualizar cliente:", erro);
        return res.status(500).json({
            message: "Erro ao atualizar cliente."
        });
    }
}

async function excluir(req, res) {
    try {
        const { id } = req.params;

        if (!validarId(id)) {
            return res.status(400).json({ message: "ID inválido." });
        }

        const excluido = await clienteService.excluir(id);

        if (!excluido) {
            return res.status(404).json({
                message: "Cliente não encontrado."
            });
        }

        return res.status(200).json({
            message: "Cliente excluído com sucesso."
        });
    } catch (erro) {
        console.error("Erro ao excluir cliente:", erro);
        return res.status(500).json({
            message: "Erro ao excluir cliente."
        });
    }
}

module.exports = {
    cadastrar,
    listar,
    buscarPorId,
    atualizar,
    excluir
};
