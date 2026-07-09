-- ---------------------------------------------------------------------
-- CLIENTE
-- ---------------------------------------------------------------------
CREATE TABLE cliente (
    id_cliente SERIAL PRIMARY KEY,
    cpf        VARCHAR(14) NOT NULL UNIQUE,
    nome       VARCHAR(100) NOT NULL,
    telefone   VARCHAR(15) NOT NULL,
    endereco   VARCHAR(100) NOT NULL
);


-- ---------------------------------------------------------------------
-- AUTENTICAÇÃO DE CLIENTE (login/cadastro do front)
-- ---------------------------------------------------------------------
CREATE TABLE usuario (
    id_usuario   SERIAL PRIMARY KEY,
    id_cliente   INT REFERENCES cliente(id_cliente) UNIQUE,
    email        VARCHAR(100) NOT NULL UNIQUE,
    senha_hash   VARCHAR(255) NOT NULL,
    criado_em    TIMESTAMP NOT NULL DEFAULT now(),
    ultimo_login TIMESTAMP
);
-- senha_hash deve ser gerado com bcrypt/argon2 no backend, nunca texto puro.


-- ---------------------------------------------------------------------
-- PET
-- ---------------------------------------------------------------------
CREATE TYPE tipo_porte AS ENUM ('Pequeno', 'Médio', 'Grande');
CREATE TYPE tipo_etaria AS ENUM ('Filhote', 'Adulto', 'Idoso');

CREATE TABLE pet (
    id_pet       SERIAL PRIMARY KEY,
    nome         VARCHAR(100) NOT NULL,
    raca         VARCHAR(40),
    porte        tipo_porte,
    faixa_etaria tipo_etaria,
    hist_medico  VARCHAR(100),
    id_cliente   INT REFERENCES cliente(id_cliente) NOT NULL
);


-- ---------------------------------------------------------------------
-- ANIMAL PARA ADOÇÃO
-- ---------------------------------------------------------------------
CREATE TYPE status_adocao AS ENUM ('Disponível', 'Em Tratamento', 'Adotado');

CREATE TABLE animal_adocao (
    id_animal_adocao    SERIAL PRIMARY KEY,
    nome                VARCHAR(100) NOT NULL,
    raca                VARCHAR(40),
    porte               tipo_porte,
    faixa_etaria        tipo_etaria,
    hist_medico         VARCHAR(100),
    data_resgate        DATE DEFAULT CURRENT_DATE,
    status              status_adocao NOT NULL DEFAULT 'Disponível',
    id_cliente_adotante INT REFERENCES cliente(id_cliente),
    imagem_url          VARCHAR(255)
);


-- ---------------------------------------------------------------------
-- SOLICITAÇÃO DE ADOÇÃO (formulário Adotar.jsx)
-- ---------------------------------------------------------------------
CREATE TYPE status_solicitacao AS ENUM ('Pendente', 'Em Análise', 'Aprovada', 'Recusada');
CREATE TYPE tipo_moradia AS ENUM ('Casa com quintal', 'Casa sem quintal', 'Apartamento com tela', 'Apartamento sem tela');

CREATE TABLE solicitacao_adocao (
    id_solicitacao    SERIAL PRIMARY KEY,
    id_animal_adocao  INT REFERENCES animal_adocao(id_animal_adocao) NOT NULL,
    id_cliente        INT REFERENCES cliente(id_cliente), -- nulo se visitante não logado
    nome_solicitante  VARCHAR(100) NOT NULL,
    telefone          VARCHAR(15) NOT NULL,
    email             VARCHAR(100) NOT NULL,
    idade_solicitante INT CHECK (idade_solicitante >= 18),
    tipo_moradia      tipo_moradia NOT NULL,
    status            status_solicitacao NOT NULL DEFAULT 'Pendente',
    criado_em         TIMESTAMP NOT NULL DEFAULT now()
);


-- ---------------------------------------------------------------------
-- FUNCIONÁRIO
-- ---------------------------------------------------------------------
CREATE TYPE tipo_cargo AS ENUM ('Gerente', 'Atendente', 'Estoquista', 'Limpeza', 'Groomer');

CREATE TABLE funcionario (
    id_funcionario SERIAL PRIMARY KEY,
    cpf            VARCHAR(14) NOT NULL UNIQUE,
    nome           VARCHAR(100) NOT NULL,
    cargo          tipo_cargo NOT NULL,
    salario        DECIMAL(10,2) NOT NULL
);


-- ---------------------------------------------------------------------
-- PRONTUÁRIO
-- ---------------------------------------------------------------------
CREATE TABLE prontuario (
    id_prontuario    SERIAL PRIMARY KEY,
    id_pet           INT REFERENCES pet(id_pet) NOT NULL,
    id_funcionario   INT REFERENCES funcionario(id_funcionario) NOT NULL,
    data_atendimento DATE NOT NULL,
    descricao        TEXT NOT NULL
);


-- ---------------------------------------------------------------------
-- SERVIÇO (conteúdo rico exibido em Servicos.jsx)
-- ---------------------------------------------------------------------
CREATE TABLE servico (
    id_servico   SERIAL PRIMARY KEY,
    nome         VARCHAR(100) NOT NULL UNIQUE,
    preco_base   DECIMAL(10,2) NOT NULL,
    descricao    TEXT,
    imagem_url   VARCHAR(255)
);

CREATE TABLE servico_beneficio (
    id_servico INT REFERENCES servico(id_servico) ON DELETE CASCADE,
    ordem      INT NOT NULL,
    beneficio  VARCHAR(150) NOT NULL,
    PRIMARY KEY (id_servico, ordem)
);


-- ---------------------------------------------------------------------
-- AGENDAMENTO
-- ---------------------------------------------------------------------
CREATE TYPE status_servico AS ENUM ('Agendado', 'Confirmado', 'Concluído', 'Cancelado');

CREATE TABLE agendamento (
    id_agendamento   SERIAL PRIMARY KEY,
    id_pet           INT REFERENCES pet(id_pet) NOT NULL,
    id_funcionario   INT REFERENCES funcionario(id_funcionario),
    data_agendamento DATE NOT NULL,
    hora             TIME NOT NULL,
    status           status_servico NOT NULL,
    valor_total      DECIMAL(10,2)
);

CREATE TABLE agendamento_servico (
    id_agendamento INT REFERENCES agendamento(id_agendamento),
    id_servico     INT REFERENCES servico(id_servico),
    preco_cobrado  DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (id_agendamento, id_servico)
);


-- ---------------------------------------------------------------------
-- PRODUTO (taxonomia real usada em Produtos.jsx)
-- ---------------------------------------------------------------------
CREATE TYPE especie_pet AS ENUM ('Cachorro', 'Gato', 'Pássaro', 'Hamster');
CREATE TYPE secao_produto AS ENUM ('Alimentação', 'Banho', 'Brinquedos', 'Acessórios', 'Roupinhas');

CREATE TABLE produto (
    id_produto     SERIAL PRIMARY KEY,
    nome           VARCHAR(100) NOT NULL UNIQUE,
    preco          DECIMAL(10,2) NOT NULL,
    categoria      VARCHAR(20), -- subtipo textual: Ração, Petisco, Higiene, Brinquedo...
    estoque_atual  INT DEFAULT 0,
    especie        especie_pet,
    secao          secao_produto,
    imagem_url     VARCHAR(255)
);


-- ---------------------------------------------------------------------
-- VENDA
-- ---------------------------------------------------------------------
CREATE TYPE tipo_pagamento AS ENUM ('Dinheiro', 'PIX', 'Crédito', 'Débito');

CREATE TABLE venda (
    id_venda         SERIAL PRIMARY KEY,
    data_venda       DATE NOT NULL,
    metodo_pagamento tipo_pagamento NOT NULL,
    valor_total      DECIMAL(10,2) NOT NULL
);

CREATE TABLE venda_produto (
    id_venda_produto SERIAL PRIMARY KEY,
    id_venda         INT REFERENCES venda(id_venda) NOT NULL,
    id_produto       INT REFERENCES produto(id_produto) NOT NULL,
    quantidade       INT NOT NULL,
    preco_unitario   DECIMAL(10,2) NOT NULL -- congela o preço no momento da venda
);


-- ---------------------------------------------------------------------
-- INSUMOS
-- ---------------------------------------------------------------------
CREATE TABLE insumos (
    id_insumo          SERIAL PRIMARY KEY,
    nome               VARCHAR(50) NOT NULL UNIQUE,
    quantidade_estoque INT NOT NULL,
    quantidade_gasta   INT DEFAULT 0
);

CREATE TABLE uso_insumo (
    id_uso           SERIAL PRIMARY KEY,
    id_insumo        INT REFERENCES insumos(id_insumo) NOT NULL,
    quantidade_usada INT NOT NULL,
    data_uso         DATE DEFAULT CURRENT_DATE
);


-- =====================================================================
-- FUNÇÕES E TRIGGERS
-- =====================================================================

-- Baixa automática de estoque de insumo ao registrar uso
CREATE OR REPLACE FUNCTION atualiza_estoque_insumo()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE insumos
    SET quantidade_estoque = quantidade_estoque - NEW.quantidade_usada,
        quantidade_gasta   = quantidade_gasta + NEW.quantidade_usada
    WHERE id_insumo = NEW.id_insumo;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_saida_insumo
AFTER INSERT ON uso_insumo
FOR EACH ROW
EXECUTE FUNCTION atualiza_estoque_insumo();


-- Ao aprovar uma solicitação de adoção, marca o animal como adotado
CREATE OR REPLACE FUNCTION aprova_adocao()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'Aprovada' AND OLD.status IS DISTINCT FROM 'Aprovada' THEN
        UPDATE animal_adocao
        SET status = 'Adotado',
            id_cliente_adotante = NEW.id_cliente
        WHERE id_animal_adocao = NEW.id_animal_adocao;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_aprova_adocao
AFTER UPDATE ON solicitacao_adocao
FOR EACH ROW
EXECUTE FUNCTION aprova_adocao();


-- =====================================================================
-- ÍNDICES DE APOIO
-- =====================================================================
CREATE INDEX idx_pet_id_cliente         ON pet(id_cliente);
CREATE INDEX idx_prontuario_id_pet      ON prontuario(id_pet);
CREATE INDEX idx_agendamento_id_pet     ON agendamento(id_pet);
CREATE INDEX idx_agendamento_data       ON agendamento(data_agendamento);
CREATE INDEX idx_venda_data             ON venda(data_venda);
CREATE INDEX idx_venda_produto_id_venda ON venda_produto(id_venda);
CREATE INDEX idx_solicitacao_animal     ON solicitacao_adocao(id_animal_adocao);
CREATE INDEX idx_produto_especie_secao  ON produto(especie, secao);
