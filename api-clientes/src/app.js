const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const clienteRoutes = require("./routes/clienteRoutes");

const app = express();

// Libera o frontend local para chamar a API. Em desenvolvimento, aceita
// a origem configurada em FRONTEND_URL (ou libera geral se não configurada).
app.use(cors({
    origin: process.env.FRONTEND_URL || "*"
}));

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "API do Marketplace funcionando!"
    });
});

// Rotas de autenticação: /api/auth/login, /api/auth/me
app.use("/api/auth", authRoutes);
app.use("/api/clientes", clienteRoutes);

module.exports = app;
