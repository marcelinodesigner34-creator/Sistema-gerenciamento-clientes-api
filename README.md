# API do Sistema de Gerenciamento de Clientes

Projeto Integrador II — UESPI/NEAD.

API responsável pelo login de usuários e pelo cadastro, listagem, busca, edição e exclusão de clientes.

## Tecnologias

- Node.js
- Express
- PostgreSQL (Supabase)
- pg
- bcryptjs
- cors
- dotenv

## Endpoints da API

| Método | Rota | Recebe | Devolve |
|---|---|---|---|
| POST | /login | Corpo JSON com `email` e `senha` | `id`, `nome` e `tipo` do usuário |
| GET | /clientes | Nenhum parâmetro | Lista de clientes com `id`, `nome`, `cpf` e `telefone` |
| GET | /clientes/buscar?termo= | Parâmetro `termo` com nome ou CPF, completo ou parcial | Lista dos clientes encontrados com `id`, `nome`, `cpf` e `telefone` |
| POST | /clientes | Corpo JSON com os dados do cliente | Registro do cliente cadastrado |
| PUT | /clientes/:id | Identificador na URL e corpo JSON com os dados atualizados | Registro do cliente atualizado |
| DELETE | /clientes/:id | Identificador na URL | Mensagem de confirmação da exclusão |
| GET | / | Nenhum parâmetro | Mensagem "API funcionando" |

### Login

O endpoint `POST /login` recebe:

```json
{
  "email": "usuario@example.com",
  "senha": "senha-do-usuario"
}
```

Em caso de sucesso, retorna os dados do usuário:

```json
{
  "id": 1,
  "nome": "Usuário de Exemplo",
  "tipo": "administrador"
}
```

### Cadastro e edição de clientes

Os endpoints `POST /clientes` e `PUT /clientes/:id` recebem:

```json
{
  "nome": "Cliente de Exemplo",
  "cpf": "000.000.000-00",
  "telefone": "(61) 90000-0000",
  "email": "cliente@example.com",
  "endereco": "Endereço de exemplo",
  "data_nascimento": "1995-06-15"
}
```

- `nome` e `cpf` são obrigatórios no cadastro e na edição.
- `telefone`, `email`, `endereco` e `data_nascimento` são opcionais.
- O CPF deve ser único no banco de dados.
- Na edição, os campos opcionais omitidos passam a ter valor nulo. Para preservá-los, envie seus valores atuais.
- O cadastro e a edição devolvem o registro completo do cliente, incluindo seu `id`.

### Busca de clientes

Exemplo de requisição:

```text
GET /clientes/buscar?termo=Cliente
```

A busca procura o termo no nome ou CPF e retorna uma lista ordenada por nome. Se não houver resultados, retorna uma lista vazia: `[]`.

### Exclusão de clientes

Exemplo de requisição:

```text
DELETE /clientes/1
```

Em caso de sucesso, retorna:

```json
{
  "mensagem": "Cliente excluído com sucesso"
}
```

## Códigos de resposta

| Código | Significado |
|---|---|
| 200 | Operação realizada com sucesso |
| 201 | Cliente cadastrado com sucesso |
| 400 | Campo obrigatório ausente ou vazio, incluindo o termo de busca |
| 401 | E-mail ou senha inválidos |
| 404 | Cliente não encontrado na edição ou exclusão |
| 409 | CPF já cadastrado |
| 500 | Erro interno no servidor ou na operação com o banco de dados |

## Como rodar o projeto

É necessário ter Node.js e npm instalados e acesso ao banco de dados PostgreSQL do projeto.

1. Baixe ou clone o repositório e abra um terminal na pasta do projeto.
2. Instale as dependências:

```bash
npm install
```

3. Crie um arquivo `.env` na raiz do projeto, usando o `.env.example` como modelo, e preencha as variáveis com os dados do ambiente.
4. Inicie o servidor:

```bash
node server.js
```

Por padrão, a API utiliza o endereço:

```text
http://localhost:3000
```

A porta pode ser alterada pela variável de ambiente `PORT`.

## Observações

- As requisições com corpo JSON devem utilizar o cabeçalho `Content-Type: application/json`.
- Os dados apresentados nos exemplos são fictícios.
- O login atual não gera token de autenticação nem cria sessão.
- As rotas de clientes não exigem autenticação na implementação documentada.
