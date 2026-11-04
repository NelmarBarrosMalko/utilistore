// Acesso à tabela "clientes". Só consultas — nenhuma regra de negócio aqui.

const pool = require("../database/database");

// Busca o cliente pelo e-mail OU pelo telefone (o front-end envia um único
// campo "login" e o backend descobre se é e-mail ou telefone).
async function buscarPorEmailOuTelefone(login) {
    const sql = "SELECT * FROM clientes WHERE email = ? OR telefone = ? LIMIT 1";
    const resultado = await pool.query(sql, [login, login]);
    const linhas = resultado[0];
    return linhas[0];
}

async function buscarPorId(id) {
    const sql = "SELECT * FROM clientes WHERE id = ? LIMIT 1";
    const resultado = await pool.query(sql, [id]);
    const linhas = resultado[0];
    return linhas[0];
}

module.exports = {
    buscarPorEmailOuTelefone: buscarPorEmailOuTelefone,
    buscarPorId: buscarPorId
};
