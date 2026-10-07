CREATE TABLE usuarios (
id SERIAL PRIMARY KEY,
nome VARCHAR(100) NOT NULL,
email VARCHAR(150) NOT NULL UNIQUE,
senha VARCHAR(150) NOT NULL,
tipo VARCHAR(20) NOT NULL DEFAULT 'atendente' CHECK (tipo IN ('administrador', 'atendente'))
);

CREATE TABLE clientes (
id SERIAL PRIMARY KEY,
nome VARCHAR(100) NOT NULL,
cpf VARCHAR(14) NOT NULL UNIQUE,
telefone VARCHAR(20),
email VARCHAR(150),
endereco VARCHAR(150),
data_nascimento DATE,
usuario_id INTEGER REFERENCES usuarios(id)
);

