# API do Sistema de Gerenciamento de Clientes

Projeto Integrador II — UESPI/NEAD.

API responsável pelo login de usuários e pelo cadastro, listagem, busca, edição e exclusão de clientes e usuários.

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
| POST | /clientes | Corpo JSON com os dados do cliente e `usuario_id` obrigatório | Registro do cliente cadastrado |
| PUT | /clientes/:id | Identificador na URL e corpo JSON com os dados atualizados | Registro do cliente atualizado |
| DELETE | /clientes/:id | Identificador na URL | Mensagem de confirmação da exclusão |
| GET | /clientes/:id | Identificador na URL | Registro completo do cliente ou erro 404 |
| GET | /usuarios | Nenhum parâmetro | Lista de usuários, sem senha |
| GET | /usuarios/:id | Identificador na URL | Dados do usuário, sem senha |
| POST | /usuarios | Corpo JSON com `nome`, `email`, `senha` e `tipo` | Usuário cadastrado, sem senha |
| PUT | /usuarios/:id | Identificador na URL; `nome`, `email`, `tipo` e `senha` opcional no corpo JSON | Usuário atualizado, sem senha |
| DELETE | /usuarios/:id?logadoId=X | ID a remover na URL e ID do usuário logado no parâmetro `logadoId` | Mensagem de confirmação |
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

Exemplo de corpo para `POST /clientes`:

```json
{
  "nome": "Cliente de Exemplo",
  "cpf": "000.000.000-00",
  "telefone": "(61) 90000-0000",
  "email": "cliente@example.com",
  "endereco": "Endereço de exemplo",
  "data_nascimento": "1995-06-15",
  "usuario_id": 1
}
```

- `nome` e `cpf` são obrigatórios no cadastro e na edição.
- No cadastro (`POST /clientes`), `usuario_id` também é obrigatório e deve identificar um usuário existente, responsável pelo cadastro. Sua ausência ou a indicação de um usuário inexistente retorna `400`.
- Na edição (`PUT /clientes/:id`), envie os mesmos dados do exemplo, exceto `usuario_id`: o responsável pelo cadastro não é alterado por esse endpoint.
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

### Consulta de cliente por ID

`GET /clientes/1` retorna o registro completo do cliente de ID `1`, incluindo `usuario_id`, com código `200`. Se não existir, retorna `404` com `{"mensagem":"Cliente não encontrado"}`.

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

## Gestão de usuários

Os endpoints de usuários retornam `id`, `nome`, `email` e `tipo`. A senha e seu hash não são devolvidos.

### Listar usuários — GET /usuarios

Não recebe corpo nem parâmetros. Retorna `200` com uma lista ordenada por nome:

```json
[
  {
    "id": 1,
    "nome": "Usuário de Exemplo",
    "email": "usuario@example.com",
    "tipo": "administrador"
  }
]
```

Se não houver usuários, retorna `[]`. Em caso de falha interna, retorna `500`.

### Consultar usuário — GET /usuarios/:id

Recebe o identificador na URL, por exemplo, `GET /usuarios/1`.

Retorna `200` com um objeto contendo `id`, `nome`, `email` e `tipo`, no mesmo formato dos itens da listagem. Se não existir, retorna `404`:

```json
{
  "mensagem": "Usuário não encontrado"
}
```

Em caso de falha interna, retorna `500`.

### Cadastrar usuário — POST /usuarios

Recebe os quatro campos obrigatórios no corpo JSON:

```json
{
  "nome": "Usuário de Exemplo",
  "email": "usuario@example.com",
  "senha": "senha-de-exemplo",
  "tipo": "atendente"
}
```

`tipo` deve ser `administrador` ou `atendente`. A senha é transformada em hash bcrypt, com fator de custo 10, antes de ser salva no banco.

Em caso de sucesso, retorna `201` com os dados do usuário cadastrado:

```json
{
  "id": 2,
  "nome": "Usuário de Exemplo",
  "email": "usuario@example.com",
  "tipo": "atendente"
}
```

| Código | Mensagem | Campo retornado |
|---|---|---|
| 400 | Informe o nome | `nome` |
| 400 | Informe o e-mail | `email` |
| 400 | Informe a senha | `senha` |
| 400 | Selecione o tipo de usuário | `tipo` |
| 409 | E-mail já cadastrado no sistema | `email` |
| 500 | Erro ao cadastrar usuário | Não se aplica |

Na implementação atual, um `tipo` não vazio, mas diferente dos valores permitidos, é rejeitado pela restrição do banco e resulta em `500`.

### Editar usuário — PUT /usuarios/:id

Recebe o identificador na URL, por exemplo, `PUT /usuarios/2`, e os dados no corpo JSON:

```json
{
  "nome": "Usuário Atualizado",
  "email": "usuario.atualizado@example.com",
  "tipo": "atendente"
}
```

- `nome`, `email` e `tipo` são obrigatórios.
- `senha` é opcional. Se não for enviada, a senha atual é mantida. Uma string vazia também mantém a senha atual na implementação existente.
- Para alterar a senha, inclua `"senha": "nova-senha-de-exemplo"` no corpo. A nova senha também é salva como hash bcrypt.
- `tipo` deve ser `administrador` ou `atendente`.

Retorna `200` com `id`, `nome`, `email` e `tipo` atualizados, sem senha.

| Código | Mensagem | Campo retornado |
|---|---|---|
| 400 | Informe o nome | `nome` |
| 400 | Informe o e-mail | `email` |
| 400 | Selecione o tipo de usuário | `tipo` |
| 404 | Usuário não encontrado | Não se aplica |
| 409 | E-mail já cadastrado no sistema | `email` |
| 500 | Erro ao editar usuário | Não se aplica |

As validações dos campos obrigatórios ocorrem antes da verificação de existência do usuário. Um `tipo` não vazio e inválido resulta em `500` na implementação atual.

### Remover usuário — DELETE /usuarios/:id?logadoId=X

Recebe:

- `id`: identificador do usuário que será removido, no caminho da URL.
- `logadoId`: identificador do usuário atualmente logado, na consulta da URL.

Exemplo: `DELETE /usuarios/2?logadoId=1` solicita remover o usuário `2`, informando que o usuário logado é o `1`. Não recebe corpo.

Em caso de sucesso, retorna `200`:

```json
{
  "mensagem": "Usuário removido com sucesso"
}
```

| Código | Mensagem | Situação |
|---|---|---|
| 400 | Não é possível remover o usuário atualmente logado | `id` e `logadoId` representam o mesmo usuário |
| 400 | É necessário manter ao menos um administrador cadastrado | O usuário a remover é o último administrador |
| 404 | Usuário não encontrado | O usuário a remover não existe |
| 409 | Usuário possui clientes cadastrados e não pode ser removido | Existem clientes vinculados ao usuário |
| 500 | Erro ao remover usuário | Outra falha interna |

Esses erros retornam apenas `mensagem`, sem `campo`. A verificação de remoção do próprio usuário ocorre primeiro, seguida da consulta de existência e da contagem de administradores.

## Formato das respostas de erro

Os controladores retornam um objeto JSON com `mensagem`. Quando o erro identifica um campo de formulário, a resposta pode incluir `campo`:

```json
{
  "mensagem": "E-mail já cadastrado no sistema",
  "campo": "email"
}
```

Erros gerais não incluem `campo`:

```json
{
  "mensagem": "Usuário não encontrado"
}
```

No código atual, `campo` está presente nas validações obrigatórias do login, do cadastro e da edição de usuários, no e-mail duplicado de usuários e nos erros de nome, CPF e CPF duplicado do cadastro de clientes. A edição de clientes ainda retorna apenas `mensagem`, inclusive nesses erros de formulário. Os erros de usuário responsável no cadastro de clientes também retornam apenas `mensagem`.

## Códigos de resposta

| Código | Significado |
|---|---|
| 200 | Operação realizada com sucesso |
| 201 | Cliente ou usuário cadastrado com sucesso |
| 400 | Campo obrigatório ausente ou vazio, responsável não informado ou inexistente, ou remoção de usuário bloqueada pelas regras descritas |
| 401 | E-mail ou senha inválidos |
| 404 | Cliente ou usuário não encontrado na consulta por ID, edição ou exclusão |
| 409 | CPF ou e-mail de usuário já cadastrado, ou usuário com clientes vinculados na remoção |
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
- As rotas de clientes e usuários não exigem autenticação na implementação documentada.
- `logadoId` é informado por quem faz a requisição; não é obtido de uma sessão autenticada. Envie o ID correto do usuário logado ao solicitar uma remoção.
- A proteção do último administrador descrita acima se aplica à exclusão. A edição atual não verifica se a troca de tipo deixará o sistema sem administrador.
- Esta documentação foi conferida por leitura do código; os exemplos não representam testes executados contra o banco de dados.
