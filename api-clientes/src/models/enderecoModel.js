// Acesso à tabela "enderecos". Toda consulta filtra por cliente_id,
// assim um cliente nunca acessa o endereço de outro.

const pool = require("../database/database");

async function listar(clienteId) {
    const resultado = await pool.query("SELECT * FROM enderecos WHERE cliente_id = ? ORDER BY id DESC", [clienteId]);
    return resultado[0];
}

async function buscarPorId(id, clienteId) {
    const resultado = await pool.query("SELECT * FROM enderecos WHERE id = ? AND cliente_id = ? LIMIT 1", [id, clienteId]);
    return resultado[0][0];
}

async function criar(clienteId, e) {
    const sql = "INSERT INTO enderecos (cliente_id, apelido, cep, logradouro, numero, complemento, bairro, cidade, uf) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const resultado = await pool.query(sql, [clienteId, e.apelido, e.cep, e.logradouro, e.numero, e.complemento, e.bairro, e.cidade, e.uf]);
    return buscarPorId(resultado[0].insertId, clienteId);
}

async function atualizar(id, clienteId, e) {
    const sql = "UPDATE enderecos SET apelido = ?, cep = ?, logradouro = ?, numero = ?, complemento = ?, bairro = ?, cidade = ?, uf = ? WHERE id = ? AND cliente_id = ?";
    const resultado = await pool.query(sql, [e.apelido, e.cep, e.logradouro, e.numero, e.complemento, e.bairro, e.cidade, e.uf, id, clienteId]);
    return resultado[0].affectedRows > 0 ? buscarPorId(id, clienteId) : undefined;
}

async function excluir(id, clienteId) {
    const resultado = await pool.query("DELETE FROM enderecos WHERE id = ? AND cliente_id = ?", [id, clienteId]);
    return resultado[0].affectedRows > 0;
}

module.exports = {
    listar: listar,
    criar: criar,
    atualizar: atualizar,
    excluir: excluir
};
