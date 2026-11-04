# api-clientes

API do módulo de Clientes do projeto UtiliStore.

**Escopo atual: apenas autenticação (login).** Cadastro, recuperação de senha,
endereços, pedidos e funcionalidades administrativas foram retirados do
escopo por enquanto e serão adicionados depois.

## O que a API faz hoje

- `POST /api/auth/login` — login de cliente por **e-mail ou telefone** + senha.
- `GET /api/auth/me` — retorna os dados do cliente autenticado (exige token JWT).
- `GET /` — verificação simples de que a API está no ar.

## Estrutura do projeto

```
server.js                      inicia o servidor (porta 3000)
src/
├── app.js                     configura o Express, CORS e as rotas
├── database/
│   ├── database.js            conexão (pool) com o MySQL
│   ├── schema.sql             script para criar o banco e a tabela clientes
│   └── seed.js                cria um cliente de teste para login
├── models/
│   └── clienteModel.js        consultas SQL na tabela clientes
├── services/
│   └── authService.js         regra de negócio do login (senha + token)
├── controllers/
│   └── authController.js      recebe a requisição e devolve a resposta
├── middlewares/
│   └── authMiddleware.js      valida o token JWT nas rotas protegidas
└── routes/
    └── authRoutes.js          define /api/auth/login e /api/auth/me
```

## 1. Instalação

```bash
npm install
```

Isso vai instalar (e gerar/atualizar o `package-lock.json`):
`express`, `mysql2`, `bcryptjs`, `jsonwebtoken`, `dotenv`, `cors` e, como
dependência de desenvolvimento, `nodemon`.

> Este projeto usa **bcryptjs** (não o `bcrypt` nativo) de propósito: é uma
> biblioteca 100% JavaScript, então instala sem precisar de compilador C/C++
> na máquina — mais simples para todo mundo do grupo rodar o projeto.

## 2. Configurar o `.env`

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

E preencha com os dados do seu MySQL local:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=utilistore
DB_PORT=3306

JWT_SECRET=uma_chave_secreta_qualquer
JWT_EXPIRES_IN=2h

PORT=3000

FRONTEND_URL=http://localhost:5173
```

`FRONTEND_URL` é usada na configuração de CORS — ajuste para a porta real
em que o frontend roda localmente (se ficar em branco, a API libera
qualquer origem, o que é aceitável apenas em desenvolvimento).

## 3. Configurar o banco MySQL

Com o MySQL rodando, execute o script de schema:

```bash
mysql -u root -p < src/database/schema.sql
```

Isso cria o banco `utilistore` (ou o nome que você definiu em `DB_NAME`,
ajuste o script se mudar) e a tabela:

```sql
clientes (id, nome, email, telefone, senha_hash, created_at, updated_at)
```

A senha é sempre guardada como hash bcrypt na coluna `senha_hash` — nunca
em texto puro.

## 4. Executar o projeto

```bash
npm start        # produção
npm run dev       # desenvolvimento, com nodemon
```

O servidor sobe em `http://localhost:3000` (ou na porta definida em `PORT`).

## 5. Criar o cliente de teste (seed)

Como o cadastro não faz parte do escopo atual, use o seed para ter um
usuário para testar o login:

```bash
npm run seed
```

Isso insere (se ainda não existir) o cliente:

| Campo    | Valor                  |
|----------|------------------------|
| nome     | Cliente Teste          |
| email    | cliente@utilistore.com |
| telefone | 62999999999            |
| senha    | 123456 (salva como hash bcrypt) |

Rodar o seed novamente não duplica o registro — ele verifica se o e-mail já
existe antes de inserir.

## 6. Testar o login

### Login com e-mail

```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "login": "cliente@utilistore.com",
  "senha": "123456"
}
```

### Login com telefone

```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "login": "62999999999",
  "senha": "123456"
}
```

Resposta esperada (200):

```json
{
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOi...",
  "cliente": {
    "id": 1,
    "nome": "Cliente Teste",
    "email": "cliente@utilistore.com"
  }
}
```

### Consultar o cliente autenticado

```
GET http://localhost:3000/api/auth/me
Authorization: Bearer eyJhbGciOi...
```

## 7. Como o frontend deve chamar a API

```js
const resposta = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ login: valorDoCampo, senha: senhaDigitada })
});

const dados = await resposta.json();

if (resposta.ok) {
    // dados.token, dados.cliente
} else {
    // dados.message
}
```

O campo único "E-mail ou telefone" da tela de login pode ser enviado direto
como `login` — o backend descobre sozinho se é e-mail ou telefone.

## Próximos passos (fora do escopo atual)

Cadastro de cliente, recuperação de senha, endereços, pedidos e painel
administrativo ficam para uma próxima etapa do projeto.
