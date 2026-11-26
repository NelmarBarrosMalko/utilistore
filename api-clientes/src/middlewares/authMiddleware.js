// Middleware que valida o token JWT enviado no header Authorization.
// Formato esperado: Authorization: Bearer <token>

const jwt = require("jsonwebtoken");

function autenticar(req, res, next) {
    const cabecalho = req.headers.authorization;

    if (!cabecalho) {
        return res.status(401).json({ message: "Token não informado." });
    }

    const partes = cabecalho.split(" ");
    const token = partes[1];

    if (partes.length !== 2 || partes[0] !== "Bearer" || !token) {
        return res.status(401).json({ message: "Token mal formatado." });
    }

    jwt.verify(token, process.env.JWT_SECRET, function (erro, dados) {
        if (erro || !Number.isInteger(dados?.id)) {
            return res.status(401).json({ message: "Token inválido ou expirado." });
        }

        req.clienteLogado = dados;
        next();
    });
}

module.exports = autenticar;
