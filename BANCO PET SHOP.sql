CREATE TABLE cliente (
id_cliente SERIAL PRIMARY KEY,
cpf VARCHAR(14) NOT NULL,
nome VARCHAR(100) NOT NULL,
telefone VARCHAR(15) NOT NULL,
endereco VARCHAR(100) NOT NULL;
email VARCHAR(50) NOT NULL UNIQUE;
);

CREATE TYPE tipo_porte AS ENUM ('Pequeno', 'Médio', 'Grande');
CREATE TYPE tipo_etaria AS ENUM ('Filhote', 'Adulto', 'Idoso');

CREATE TABLE pet (
id_pet SERIAL PRIMARY KEY,
nome VARCHAR(100) NOT NULL,
raca VARCHAR(40),
porte tipo_porte,
faixa_etaria tipo_etaria,
hist_medico VARCHAR(100),
id_cliente INT REFERENCES cliente(id_cliente) NOT NULL
);

CREATE TYPE status_adocao AS ENUM ('Disponível', 'Em Tratamento', 'Adotado');

CREATE TABLE animal_adocao (
    id_animal_adocao SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    raca VARCHAR(40),
    porte tipo_porte,
    faixa_etaria tipo_etaria,
    hist_medico VARCHAR(100),
    data_resgate DATE DEFAULT CURRENT_DATE,
    status status_adocao NOT NULL DEFAULT 'Disponível',
    id_cliente_adotante INT REFERENCES cliente(id_cliente)
);

CREATE TYPE tipo_cargo AS ENUM ('Gerente', 'Atendente', 'Estoquista', 'Limpeza', 'Groomer');

CREATE TABLE funcionario (
id_funcionario SERIAL PRIMARY KEY,
cpf VARCHAR(14) NOT NULL,
nome VARCHAR(100) NOT NULL,
cargo tipo_cargo NOT NULL,
salario DECIMAL(10,2) NOT NULL
);

CREATE TABLE prontuario (
id_prontuario SERIAL PRIMARY KEY,
id_pet INT REFERENCES pet(id_pet) NOT NULL,
id_funcionario INT REFERENCES funcionario(id_funcionario) NOT NULL,
data_atendimento DATE NOT NULL,
descricao TEXT NOT NULL
);

CREATE TYPE status_servico AS ENUM ('Agendado', 'Confirmado', 'Concluído', 'Cancelado');

CREATE TABLE agendamento (
id_agendamento SERIAL PRIMARY KEY, 
id_pet INT REFERENCES pet(id_pet) NOT NULL,
id_funcionario INT REFERENCES funcionario(id_funcionario),
data_agendamento DATE NOT NULL,
hora TIME NOT NULL,
status status_servico NOT NULL,
valor_total DECIMAL(10,2)
);

CREATE TABLE servico (
id_servico SERIAL PRIMARY KEY,
nome VARCHAR(100) NOT NULL,
preco_base DECIMAL(10,2) NOT NULL
);

CREATE TABLE agendamento_servico (
id_agendamento INT REFERENCES agendamento(id_agendamento),
id_servico INT REFERENCES servico(id_servico),
preco_cobrado DECIMAL (10,2) NOT NULL,
PRIMARY KEY (id_agendamento, id_servico)
);

CREATE TYPE tipo_pagamento AS ENUM ('Dinheiro', 'PIX', 'Crédito', 'Débito');

CREATE TABLE venda (
id_venda SERIAL PRIMARY KEY,
data_venda DATE NOT NULL,
metodo_pagamento tipo_pagamento NOT NULL,
valor_total DECIMAL(10,2) NOT NULL
);

CREATE TABLE produto (
    id_produto SERIAL PRIMARY KEY,
    nome VARCHAR (100) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    categoria VARCHAR(20),
    estoque_atual INT DEFAULT 0
);

CREATE TABLE venda_produto (
id_venda_produto SERIAL PRIMARY KEY,
id_venda INT REFERENCES venda(id_venda) NOT NULL,
id_produto INT REFERENCES produto(id_produto) NOT NULL,
quantidade INT NOT NULL
);

CREATE TABLE insumos (
id_insumo SERIAL PRIMARY KEY,
nome VARCHAR(50) NOT NULL,
quantidade_estoque INT NOT NULL,
quantidade_gasta INT DEFAULT 0
);

CREATE TABLE uso_insumo (
    id_uso SERIAL PRIMARY KEY,
    id_insumo INT REFERENCES insumos(id_insumo) NOT NULL,
    quantidade_usada INT NOT NULL,
    data_uso DATE DEFAULT CURRENT_DATE
);

CREATE OR REPLACE FUNCTION atualiza_estoque_insumo()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE insumos
    SET quantidade_estoque = quantidade_estoque - NEW.quantidade_usada,
        quantidade_gasta = quantidade_gasta + NEW.quantidade_usada
    WHERE id_insumo = NEW.id_insumo;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_saida_insumo
AFTER INSERT ON uso_insumo
FOR EACH ROW
EXECUTE FUNCTION atualiza_estoque_insumo();
