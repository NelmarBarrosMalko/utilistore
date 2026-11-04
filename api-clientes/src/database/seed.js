// Script para inserir um cliente de teste no MySQL, já que o cadastro
// não faz parte do escopo atual. Execute com: npm run seed

require("dotenv").config();
const bcrypt = require("bcryptjs");
const pool = require("./database");

async function seed() {
    const nome = "Cliente Teste";
    const email = "cliente@utilistore.com";
    const telefone = "62999999999";
    const senha = "123456";

    const senhaHash = await bcrypt.hash(senha, 10);

    const sqlVerifica = "SELECT id FROM clientes WHERE email = ? LIMIT 1";
    const resultadoVerifica = await pool.query(sqlVerifica, [email]);
    const clienteExistente = resultadoVerifica[0][0];

    if (clienteExistente) {
        console.log("Cliente de teste já existe (id " + clienteExistente.id + "). Nada foi inserido.");
        await pool.end();
        return;
    }

    const sqlInsere = "INSERT INTO clientes (nome, email, telefone, senha_hash) VALUES (?, ?, ?, ?)";
    const resultadoInsere = await pool.query(sqlInsere, [nome, email, telefone, senhaHash]);

    console.log("Cliente de teste criado com sucesso!");
    console.log("id: " + resultadoInsere[0].insertId);
    console.log("email: " + email);
    console.log("telefone: " + telefone);
    console.log("senha (para testar o login): " + senha);

    await pool.end();
}

seed().catch(function (erro) {
    console.error("Erro ao executar o seed:", erro);
    process.exit(1);
});
