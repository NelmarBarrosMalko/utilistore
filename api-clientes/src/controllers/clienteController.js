const clienteService = require("../services/clienteService");

async function cadastrar(req, res) {
    try {
        const resultado = await clienteService.cadastrar(req.body || {});
        if (resultado.erro) return res.status(400).json({ message: resultado.erro });
        return res.status(201).json({ message: "Cadastro realizado com sucesso.", cliente: { id: resultado.id } });
    } catch (erro) {
        // Protege contra duplicidade em caso de duas requisições simultâneas.
        if (erro.code === "ER_DUP_ENTRY") return res.status(409).json({ message: "CPF, e-mail ou telefone já cadastrado." });
        console.error("Erro ao cadastrar cliente:", erro);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
}

// O ID vem exclusivamente do token, nunca do corpo da requisição.
async function executar(req, res, operacao, status) {
    try {
        const resultado = await operacao(req.clienteLogado.id, req.body || {});
        if (resultado.erro) return res.status(resultado.status).json({ message: resultado.erro });
        if (status === 204) return res.status(204).send();
        return res.status(status).json(resultado);
    } catch (erro) {
        if (erro.code === "ER_DUP_ENTRY") return res.status(409).json({ message: "E-mail ou telefone já cadastrado." });
        console.error(erro);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
}
async function atualizar(req, res) { return executar(req, res, clienteService.atualizar, 200); }
async function alterarSenha(req, res) { return executar(req, res, clienteService.alterarSenha, 204); }
async function excluir(req, res) { return executar(req, res, clienteService.excluir, 204); }
module.exports = { cadastrar, atualizar, alterarSenha, excluir };
