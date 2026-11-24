// Regras de negócio do cadastro e gerenciamento de clientes.
const bcrypt = require("bcryptjs");
const clienteModel = require("../models/clienteModel");

function somenteNumeros(valor) {
    return String(valor || "").replace(/\D/g, "");
}

function cpfValido(cpf) {
    cpf = somenteNumeros(cpf);

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false;
    }

    let soma = 0;

    for (let i = 0; i < 9; i++) {
        soma += Number(cpf[i]) * (10 - i);
    }

    let digito = (soma * 10) % 11;
    if (digito === 10) digito = 0;

    if (digito !== Number(cpf[9])) return false;

    soma = 0;

    for (let i = 0; i < 10; i++) {
        soma += Number(cpf[i]) * (11 - i);
    }

    digito = (soma * 10) % 11;
    if (digito === 10) digito = 0;

    return digito === Number(cpf[10]);
}

function dataValida(data) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(data || ""))) {
        return false;
    }

    const d = new Date(`${data}T00:00:00`);
    return !Number.isNaN(d.getTime()) &&
        d.toISOString().slice(0, 10) === data &&
        d < new Date();
}

function dadosValidados(dados) {
    const nome = String(dados.nome || "").trim();
    const cpf = somenteNumeros(dados.cpf);
    const email = String(dados.email || "").trim().toLowerCase();
    const telefone = somenteNumeros(dados.telefone);
    const dataNascimento = dados.dataNascimento;

    if (!nome || nome.length < 3) {
        return { erro: "Informe o nome completo." };
    }

    if (!cpfValido(cpf)) {
        return { erro: "Informe um CPF válido." };
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { erro: "Informe um e-mail válido." };
    }

    if (telefone.length < 10 || telefone.length > 11) {
        return { erro: "Informe um telefone com DDD válido." };
    }

    if (!dataValida(dataNascimento)) {
        return { erro: "Informe uma data de nascimento válida." };
    }

    return {
        dados: { nome, cpf, email, telefone, dataNascimento }
    };
}

async function verificarDuplicidade(dados, id = null) {
    const verificacoes = [
        [clienteModel.buscarPorCpf(dados.cpf), "Este CPF já está cadastrado."],
        [clienteModel.buscarPorEmail(dados.email), "Este e-mail já está cadastrado."],
        [clienteModel.buscarPorTelefone(dados.telefone), "Este telefone já está cadastrado."]
    ];

    for (const [consulta, mensagem] of verificacoes) {
        const existente = await consulta;

        if (existente && String(existente.id) !== String(id)) {
            return mensagem;
        }
    }

    return null;
}

async function cadastrar(dados) {
    const validacao = dadosValidados(dados);
    if (validacao.erro) return validacao;

    const dadosLimpos = validacao.dados;

    const duplicidade = await verificarDuplicidade(dadosLimpos);
    if (duplicidade) return { erro: duplicidade };

    const senha = String(dados.senha || "");

    if (senha.length < 8 || !/[A-Za-z]/.test(senha) || !/\d/.test(senha)) {
        return {
            erro: "A senha deve ter pelo menos 8 caracteres, incluindo letras e números."
        };
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const id = await clienteModel.criar({
        ...dadosLimpos,
        senhaHash
    });

    return { id };
}

async function listar() {
    return await clienteModel.listar();
}

async function buscarPorId(id) {
    return await clienteModel.buscarDadosPorId(id);
}

async function atualizar(id, dados) {
    const cliente = await clienteModel.buscarPorId(id);

    if (!cliente) {
        return { erro: "Cliente não encontrado.", status: 404 };
    }

    const validacao = dadosValidados(dados);
    if (validacao.erro) return validacao;

    const dadosLimpos = validacao.dados;

    const duplicidade = await verificarDuplicidade(dadosLimpos, id);
    if (duplicidade) {
        return { erro: duplicidade, status: 409 };
    }

    await clienteModel.atualizar(id, dadosLimpos);

    return { sucesso: true };
}

async function excluir(id) {
    const cliente = await clienteModel.buscarPorId(id);

    if (!cliente) {
        return false;
    }

    return await clienteModel.excluir(id);
}

module.exports = {
    cadastrar,
    listar,
    buscarPorId,
    atualizar,
    excluir
};