# UtiliStore — módulo Clientes

## Executar
1. No MySQL Workbench, execute `api-clientes/src/database/schema.sql`. Não execute a migration antiga. Em banco existente, o script adiciona CPF se faltar e preserva colunas e registros antigos; não converte tipos nem corrige índices existentes. Faça backup antes de qualquer alteração manual. Se houver colunas antigas obrigatórias sem default, será necessário adaptar o banco. Use um banco novo para testar o esquema limpo.
2. Entre em `api-clientes`, execute `npm install`, copie `.env.example` para `.env` e configure MySQL e uma chave JWT forte e privada.
3. Execute `npm start`. Abra `utilistore/index.html` com Live Server e ajuste FRONTEND_URL no .env para a origem real (reinicie a API).
4. Cadastre um cliente, faça login e abra Perfil ou Configurações no dashboard.

## Rotas
- POST /api/clientes: nome, cpf, email, telefone, senha.
- POST /api/auth/login: login (email ou telefone), senha.
- GET /api/auth/me: dados próprios.
- PUT /api/clientes/me: nome, email, telefone.
- PUT /api/clientes/me/senha: senhaAtual, novaSenha.
- DELETE /api/clientes/me: senha.

Rotas de conta exigem Authorization: Bearer TOKEN. O ID vem do JWT. CPF não é editável. Senhas são armazenadas como hash bcrypt; novas senhas exigem 8 caracteres, letras e números, até 72 bytes. Tokens já emitidos expiram conforme JWT_EXPIRES_IN; alteração de senha não revoga tokens anteriores. Não há rotas administrativas. Produtos, pedidos e carrinho são demonstrativos.

## Testes manuais sugeridos
Cadastro válido e duplicado; login correto e incorreto; consulta sem token; edição com ID/CPF de outro cliente no corpo (não deve alterar esses campos); alteração de senha incorreta/correta; login com nova senha; exclusão com senha incorreta/correta; consulta após exclusão. Use dados fictícios em banco de teste.

Validação realizada: sintaxe JavaScript com node --check. Não executado contra MySQL real nem testado no navegador.
