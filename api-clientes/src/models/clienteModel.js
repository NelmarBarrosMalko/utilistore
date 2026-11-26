// Acesso aos dados da tabela clientes.
const pool = require("../database/database");

async function buscarPorEmailOuTelefone(login) {
    const [linhas] = await pool.query(
        "SELECT * FROM clientes WHERE email = ? OR telefone = ? LIMIT 1",
        [login, login]
    );
    return linhas[0];
}

async function buscarPorId(id) {
    const [linhas] = await pool.query("SELECT * FROM clientes WHERE id = ? LIMIT 1", [id]);
    return linhas[0];
}

async function buscarPorEmail(email) {
    const [linhas] = await pool.query("SELECT id FROM clientes WHERE email = ? LIMIT 1", [email]);
    return linhas[0];
}

async function buscarPorCpf(cpf) {
    const [linhas] = await pool.query("SELECT id FROM clientes WHERE cpf = ? LIMIT 1", [cpf]);
    return linhas[0];
}

async function buscarPorTelefone(telefone) {
    const [linhas] = await pool.query("SELECT id FROM clientes WHERE telefone = ? LIMIT 1", [telefone]);
    return linhas[0];
}

async function criar(dados) {
    const [resultado] = await pool.query(
        `INSERT INTO clientes (nome, cpf, email, telefone, senha_hash)
         VALUES (?, ?, ?, ?, ?)`,
        [dados.nome, dados.cpf, dados.email, dados.telefone, dados.senhaHash]
    );
    return resultado.insertId;
}

async function atualizar(id, dados) {
    await pool.query("UPDATE clientes SET nome = ?, email = ?, telefone = ?, biografia = ? WHERE id = ?", [dados.nome, dados.email, dados.telefone, dados.biografia, id]);
}
async function atualizarSenha(id, hash, hashAtual) {
    const [resultado] = await pool.query("UPDATE clientes SET senha_hash = ? WHERE id = ? AND BINARY senha_hash = ?", [hash, id, hashAtual]);
    return resultado.affectedRows > 0;
}
async function excluir(id, hashAtual) {
    const [resultado] = await pool.query("DELETE FROM clientes WHERE id = ? AND BINARY senha_hash = ?", [id, hashAtual]);
    return resultado.affectedRows > 0;
}
module.exports = { buscarPorEmailOuTelefone, buscarPorId, buscarPorEmail, buscarPorCpf, buscarPorTelefone, criar, atualizar, atualizarSenha, excluir };
