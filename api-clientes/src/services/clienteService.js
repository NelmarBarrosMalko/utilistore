// Regras de negócio do cadastro de clientes.
const bcrypt = require("bcryptjs");
const clienteModel = require("../models/clienteModel");

function somenteNumeros(valor) { return String(valor || "").replace(/\D/g, ""); }

function cpfValido(cpf) {
    cpf = somenteNumeros(cpf);
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    let soma = 0;
    for (let i = 0; i < 9; i++) soma += Number(cpf[i]) * (10 - i);
    let digito = (soma * 10) % 11; if (digito === 10) digito = 0;
    if (digito !== Number(cpf[9])) return false;
    soma = 0;
    for (let i = 0; i < 10; i++) soma += Number(cpf[i]) * (11 - i);
    digito = (soma * 10) % 11; if (digito === 10) digito = 0;
    return digito === Number(cpf[10]);
}



function tipoPermitido(dados) {
    return [dados.tipo, dados.type, dados.registerType, dados.profType, dados.tipoConta, dados.role].every(tipo => tipo === undefined || tipo === "cliente" || tipo === "usuario");
}

async function cadastrar(dados) {
    if (!tipoPermitido(dados)) return { erro: "Este módulo aceita apenas clientes." };
    const nome = String(dados.nome || "").trim();
    const cpf = somenteNumeros(dados.cpf);
    const email = String(dados.email || "").trim().toLowerCase();
    const telefone = somenteNumeros(dados.telefone);
    const senha = String(dados.senha || "");

    if (!nome || nome.length < 3 || nome.length > 150) return { erro: "Informe o nome completo." };
    if (!cpfValido(cpf)) return { erro: "Informe um CPF válido." };
    if (email.length > 150 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { erro: "Informe um e-mail válido." };
    if (telefone.length < 10 || telefone.length > 11) return { erro: "Informe um telefone com DDD válido." };
    if (Buffer.byteLength(senha, "utf8") > 72 || senha.length < 8 || !/[A-Za-z]/.test(senha) || !/\d/.test(senha)) {
        return { erro: "A senha deve ter pelo menos 8 caracteres, incluindo letras e números." };
    }

    if (await clienteModel.buscarPorEmail(email)) return { erro: "Este e-mail já está cadastrado." };
    if (await clienteModel.buscarPorCpf(cpf)) return { erro: "Este CPF já está cadastrado." };
    if (await clienteModel.buscarPorTelefone(telefone)) return { erro: "Este telefone já está cadastrado." };

    const senhaHash = await bcrypt.hash(senha, 10);
    const id = await clienteModel.criar({ nome, cpf, email, telefone, senhaHash });
    return { id };
}

async function atualizar(id, dados) {
    if (!tipoPermitido(dados)) return { erro: "Este módulo aceita apenas clientes.", status: 400 };
    if (dados.biografia !== undefined && (typeof dados.biografia !== "string" || dados.biografia.length > 200)) return { erro: "Biografia deve ter até 200 caracteres.", status: 400 };
    const nome = String(dados.nome || "").trim();
    const email = String(dados.email || "").trim().toLowerCase();
    const telefone = somenteNumeros(dados.telefone);
    if (nome.length < 3 || nome.length > 150 || email.length > 150 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !/^\d{10,11}$/.test(telefone)) {
        return { erro: "Informe nome, e-mail e telefone válidos.", status: 400 };
    }
    const cliente = await clienteModel.buscarPorId(id);
    if (!cliente) return { erro: "Cliente não encontrado.", status: 404 };
    const porEmail = await clienteModel.buscarPorEmail(email);
    const porTelefone = await clienteModel.buscarPorTelefone(telefone);
    if ((porEmail && porEmail.id !== id) || (porTelefone && porTelefone.id !== id)) {
        return { erro: "E-mail ou telefone já cadastrado.", status: 409 };
    }
    const biografia = dados.biografia === undefined ? cliente.biografia : dados.biografia.trim();
    await clienteModel.atualizar(id, { nome, email, telefone, biografia });
    return { id, nome, email, telefone, biografia };
}

async function alterarSenha(id, dados) {
    const { senhaAtual, novaSenha } = dados;
    if (typeof senhaAtual !== "string" || typeof novaSenha !== "string" || novaSenha.length < 8 || Buffer.byteLength(novaSenha, "utf8") > 72 || !/[A-Za-z]/.test(novaSenha) || !/\d/.test(novaSenha)) {
        return { erro: "Informe a senha atual e uma nova senha de 8 ou mais caracteres, com letras e números (até 72 bytes).", status: 400 };
    }
    const cliente = await clienteModel.buscarPorId(id);
    if (!cliente || !await bcrypt.compare(senhaAtual, cliente.senha_hash)) return { erro: "Senha atual incorreta.", status: 401 };
    const alterou = await clienteModel.atualizarSenha(id, await bcrypt.hash(novaSenha, 10), cliente.senha_hash);
    if (!alterou) return { erro: "Conta alterada. Tente novamente.", status: 409 };
    return {};
}

async function excluir(id, dados) {
    if (typeof dados.senha !== "string" || !dados.senha) return { erro: "Informe sua senha.", status: 400 };
    const cliente = await clienteModel.buscarPorId(id);
    if (!cliente || !await bcrypt.compare(dados.senha, cliente.senha_hash)) return { erro: "Senha incorreta.", status: 401 };
    if (!await clienteModel.excluir(id, cliente.senha_hash)) return { erro: "Conta alterada. Tente novamente.", status: 409 };
    return {};
}

module.exports = { cadastrar, atualizar, alterarSenha, excluir };