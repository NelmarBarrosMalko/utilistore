## Instalação e configuração

### 1. Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/)
- [MySQL](https://dev.mysql.com/downloads/installer/)
- MySQL Workbench (opcional).

### 2. Instalação das dependências

Entre na pasta `api-clientes` pelo terminal e execute:

```bash
npm install
```

Esse comando instalará as dependências necessárias para executar a API.

### 3. Configuração das variáveis de ambiente

Na pasta `api-clientes`, crie um arquivo chamado `.env`, utilizando o `.env.example` como modelo.

Preencha as variáveis com as configurações do seu ambiente, incluindo:

- Credenciais de acesso ao MySQL.
- Nome do banco de dados.
- Porta de execução da API.
- Chave secreta para geração dos tokens JWT.
- Endereço permitido para acesso do frontend (`FRONTEND_URL`).

**Importante:** o arquivo `.env` contém informações privadas e não deve ser enviado ao GitHub.

### 4. Configuração do banco de dados

Inicie o MySQL e crie o banco de dados `utilistore`.

Depois, execute o script `src/database/schema.sql`, localizado dentro de `api-clientes`, no MySQL Workbench para criar a estrutura das tabelas necessárias.

Caso queira realizar testes de autenticação, cadastre um cliente de teste com uma senha armazenada em formato hash, conforme o padrão utilizado pela API.

### 5. Inicialização da API

Após concluir as configurações, entre na pasta `api-clientes` e execute:

```bash
node server.js
```

Por padrão, a API será iniciada em:

`http://localhost:3000`

Para verificar se está funcionando, acesse o endereço pelo navegador.

### 6. Rotas disponíveis

| Método | Rota | Descrição |
|---|---|---|
| GET | `/` | Verifica se a API está funcionando. |
| POST | `/api/auth/login` | Realiza a autenticação do cliente. |
| GET | `/api/auth/me` | Retorna os dados do cliente autenticado. |

A rota `/api/auth/me` exige um token JWT válido no cabeçalho `Authorization`, no formato `Bearer TOKEN`.

### 7. Integração com o frontend

O frontend deve estar em execução por meio de um servidor local, como o Live Server do VS Code.

Certifique-se de que o endereço utilizado pelo frontend corresponda ao valor configurado em `FRONTEND_URL` no arquivo `.env`, para evitar problemas de CORS.

**Observação:** a pasta `node_modules` não é disponibilizada no repositório. Ela será criada localmente ao executar `npm install`.
