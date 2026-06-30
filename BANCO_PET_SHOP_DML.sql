-- ============================================================
--  PET SHOP – DML (INSERT / UPDATE / DELETE)
--  Compatível com o DDL fornecido (PostgreSQL)
--  Ordem respeitando dependências de chave estrangeira
-- ============================================================

-- ────────────────────────────────────────────────────────────
--  1. CLIENTES
-- ────────────────────────────────────────────────────────────
INSERT INTO cliente (cpf, nome, telefone, endereco) VALUES
  ('123.456.789-00', 'Ana Beatriz Souza',    '(61) 99101-2233', 'Rua das Flores, 45 – Asa Norte, Brasília'),
  ('234.567.890-11', 'Carlos Eduardo Lima',  '(61) 98202-3344', 'Av. W3 Norte, 112 – Asa Norte, Brasília'),
  ('345.678.901-22', 'Fernanda Costa',       '(61) 97303-4455', 'Quadra 204, Bl. B, Apt 301 – Águas Claras'),
  ('456.789.012-33', 'Roberto Alves',        '(61) 96404-5566', 'Rua do Ipê, 78 – Taguatinga Sul'),
  ('567.890.123-44', 'Juliana Martins',      '(61) 95505-6677', 'Rua 10, Lote 22 – Ceilândia Norte'),
  ('678.901.234-55', 'Marcos Henrique Dias', '(61) 94606-7788', 'QI 17, Lote 9 – Guará II'),
  ('789.012.345-66', 'Patricia Ferreira',    '(61) 93707-8899', 'SMPW Quadra 26, Lote 3 – Park Way'),
  ('890.123.456-77', 'Thiago Barbosa',       '(61) 92808-9900', 'Rua Ipanema, 55 – Samambaia Norte');

-- ────────────────────────────────────────────────────────────
--  2. FUNCIONÁRIOS
-- ────────────────────────────────────────────────────────────
INSERT INTO funcionario (cpf, nome, cargo, salario) VALUES
  ('001.002.003-01', 'Luciana Pimentel',   'Gerente',      4800.00),
  ('002.003.004-02', 'Diego Rocha',        'Groomer',      2800.00),
  ('003.004.005-03', 'Sabrina Nunes',      'Groomer',      2800.00),
  ('004.005.006-04', 'Fábio Teixeira',     'Atendente',    2000.00),
  ('005.006.007-05', 'Renata Oliveira',    'Atendente',    2000.00),
  ('006.007.008-06', 'Igor Santos',        'Estoquista',   1900.00),
  ('007.008.009-07', 'Camila Araújo',      'Limpeza',      1600.00),
  ('008.009.010-08', 'Bruno Carvalho',     'Groomer',      2800.00);

-- ────────────────────────────────────────────────────────────
--  3. PETS (vinculados a clientes)
-- ────────────────────────────────────────────────────────────
INSERT INTO pet (nome, raca, porte, faixa_etaria, hist_medico, id_cliente) VALUES
  ('Thor',    'Golden Retriever', 'Grande',  'Adulto',  'Vacinado, castrado',           1),
  ('Luna',    'Poodle',           'Pequeno', 'Filhote', 'Vacinada, saudável',           1),
  ('Rex',     'Labrador',         'Grande',  'Idoso',   'Artrite leve, anti-pulgas',    2),
  ('Mel',     'Shih Tzu',         'Pequeno', 'Adulto',  'Vacinada, castrada',           3),
  ('Buddy',   'Beagle',           'Médio',   'Filhote', 'Primeira vacina aplicada',     4),
  ('Nina',    'Yorkshire',        'Pequeno', 'Adulto',  'Vacinada, histórico limpo',    5),
  ('Max',     'Bulldog Francês',  'Médio',   'Adulto',  'Alergia alimentar registrada', 6),
  ('Bella',   'Border Collie',    'Médio',   'Filhote', 'Vacinada, vermifugada',        7),
  ('Tobias',  'Gato SRD',         'Pequeno', 'Adulto',  'Castrado, vacinado',           8),
  ('Lola',    'Spitz Alemão',     'Pequeno', 'Filhote', 'Saudável',                    2);

-- ────────────────────────────────────────────────────────────
--  4. ANIMAIS PARA ADOÇÃO
-- ────────────────────────────────────────────────────────────
INSERT INTO animal_adocao (nome, raca, porte, faixa_etaria, hist_medico, data_resgate, status, id_cliente_adotante) VALUES
  ('Pipoca',  'SRD',           'Pequeno', 'Filhote', 'Resgatada de rua, vacinada',      '2026-03-10', 'Disponível',    NULL),
  ('Bruto',   'Vira-lata',     'Grande',  'Adulto',  'Castrado, tratamento de sarna',   '2026-01-22', 'Em Tratamento', NULL),
  ('Mimi',    'Gato SRD',      'Pequeno', 'Idoso',   'Vacinada, FIV negativo',          '2025-11-05', 'Adotado',       3),
  ('Farofa',  'Vira-lata',     'Médio',   'Filhote', 'Vacinado, saudável',              '2026-04-01', 'Disponível',    NULL),
  ('Cinza',   'Gato Persa SRD','Pequeno', 'Adulto',  'Castrado, vacinado',              '2026-02-14', 'Disponível',    NULL);

-- ────────────────────────────────────────────────────────────
--  5. SERVIÇOS
-- ────────────────────────────────────────────────────────────
INSERT INTO servico (nome, preco_base) VALUES
  ('Banho Simples',           35.00),
  ('Banho e Tosa',            70.00),
  ('Tosa Higiênica',          45.00),
  ('Consulta Veterinária',   120.00),
  ('Vacina Antirrábica',      80.00),
  ('Aplicação Anti-pulgas',   50.00),
  ('Hidratação de Pelagem',   55.00),
  ('Corte de Unhas',          20.00);

-- ────────────────────────────────────────────────────────────
--  6. AGENDAMENTOS
-- ────────────────────────────────────────────────────────────
INSERT INTO agendamento (id_pet, id_funcionario, data_agendamento, hora, status, valor_total) VALUES
  (1,  2, '2026-06-24', '09:00', 'Confirmado',  70.00),   -- Thor – Diego
  (2,  3, '2026-06-24', '10:00', 'Agendado',    35.00),   -- Luna – Sabrina
  (3,  2, '2026-06-25', '14:00', 'Confirmado', 120.00),   -- Rex  – Diego
  (4,  8, '2026-06-25', '11:00', 'Confirmado',  70.00),   -- Mel  – Bruno
  (5,  3, '2026-06-26', '09:30', 'Agendado',    55.00),   -- Buddy – Sabrina
  (6,  2, '2026-06-10', '08:00', 'Concluído',   90.00),   -- Nina – Diego
  (7,  8, '2026-06-10', '13:00', 'Concluído',   70.00),   -- Max  – Bruno
  (8,  3, '2026-06-11', '15:00', 'Cancelado',   35.00),   -- Bella – Sabrina (cancelado)
  (9,  2, '2026-06-23', '10:30', 'Confirmado',  20.00),   -- Tobias – Diego
  (10, 8, '2026-06-27', '09:00', 'Agendado',    70.00);   -- Lola – Bruno

-- ────────────────────────────────────────────────────────────
--  7. AGENDAMENTO ↔ SERVIÇOS (tabela associativa)
-- ────────────────────────────────────────────────────────────
INSERT INTO agendamento_servico (id_agendamento, id_servico, preco_cobrado) VALUES
  (1, 2, 70.00),   -- Thor: Banho e Tosa
  (2, 1, 35.00),   -- Luna: Banho Simples
  (3, 4, 120.00),  -- Rex: Consulta Veterinária
  (4, 2, 70.00),   -- Mel: Banho e Tosa
  (5, 7, 55.00),   -- Buddy: Hidratação de Pelagem
  (6, 2, 70.00),   -- Nina: Banho e Tosa
  (6, 8, 20.00),   -- Nina: Corte de Unhas (serviço adicional)
  (7, 2, 70.00),   -- Max: Banho e Tosa
  (8, 1, 35.00),   -- Bella: Banho Simples (cancelado)
  (9, 8, 20.00),   -- Tobias: Corte de Unhas
  (10, 2, 70.00);  -- Lola: Banho e Tosa

-- ────────────────────────────────────────────────────────────
--  8. PRONTUÁRIOS
-- ────────────────────────────────────────────────────────────
INSERT INTO prontuario (id_pet, id_funcionario, data_atendimento, descricao) VALUES
  (3, 2, '2026-06-25', 'Rex apresentou dificuldade de locomoção. Recomendado repouso e anti-inflamatório.'),
  (7, 8, '2026-06-10', 'Max relatou coceira frequente. Suspeita de alergia alimentar confirmada. Dieta prescrita.'),
  (1, 2, '2026-06-24', 'Thor em ótimas condições. Banho e tosa realizados sem intercorrências.'),
  (6, 2, '2026-06-10', 'Nina passou por tosa completa e corte de unhas. Pelagem saudável.'),
  (9, 2, '2026-06-23', 'Tobias realizou corte de unhas. Comportamento tranquilo durante o procedimento.');

-- ────────────────────────────────────────────────────────────
--  9. PRODUTOS
-- ────────────────────────────────────────────────────────────
INSERT INTO produto (nome, preco, categoria, estoque_atual) VALUES
  ('Ração Premium Adulto 15kg',   189.90, 'Alimentação', 30),
  ('Ração Filhote Médio 10kg',    139.90, 'Alimentação', 25),
  ('Petisco Dental Stick 200g',    24.90, 'Petisco',     80),
  ('Shampoo Neutro Pet 500ml',     32.00, 'Higiene',     40),
  ('Condicionador Pet 500ml',      34.00, 'Higiene',     35),
  ('Anti-pulgas Spray 200ml',      48.00, 'Saúde',       50),
  ('Coleira Antipulgas M',         55.00, 'Saúde',       20),
  ('Brinquedo Corda Colorida',     18.00, 'Acessório',   60),
  ('Cama Pet G',                  120.00, 'Acessório',   15),
  ('Areia Sanitária Gatos 4kg',    32.00, 'Higiene',     45);

-- ────────────────────────────────────────────────────────────
-- 10. VENDAS
-- ────────────────────────────────────────────────────────────
INSERT INTO venda (data_venda, metodo_pagamento, valor_total) VALUES
  ('2026-06-01', 'PIX',     214.80),
  ('2026-06-05', 'Crédito', 189.90),
  ('2026-06-10', 'Dinheiro', 74.90),
  ('2026-06-12', 'Débito',   86.00),
  ('2026-06-15', 'PIX',     120.00),
  ('2026-06-20', 'Crédito', 209.90),
  ('2026-06-22', 'PIX',      96.00),
  ('2026-06-23', 'Dinheiro', 50.90);

-- ────────────────────────────────────────────────────────────
-- 11. VENDA ↔ PRODUTO
-- ────────────────────────────────────────────────────────────
INSERT INTO venda_produto (id_venda, id_produto, quantidade) VALUES
  (1, 1, 1),  -- Ração Premium
  (1, 3, 1),  -- Petisco Dental
  (2, 1, 1),  -- Ração Premium
  (3, 4, 1),  -- Shampoo
  (3, 3, 2),  -- Petisco Dental x2
  (4, 5, 1),  -- Condicionador
  (4, 4, 1),  -- Shampoo
  (5, 9, 1),  -- Cama Pet G
  (6, 2, 1),  -- Ração Filhote
  (6, 6, 1),  -- Anti-pulgas Spray
  (7, 7, 1),  -- Coleira Antipulgas
  (7, 8, 1),  -- Brinquedo Corda
  (8, 10, 1), -- Areia Sanitária
  (8, 3, 1);  -- Petisco Dental

-- ────────────────────────────────────────────────────────────
-- 12. INSUMOS
-- ────────────────────────────────────────────────────────────
INSERT INTO insumos (nome, quantidade_estoque, quantidade_gasta) VALUES
  ('Shampoo a Granel (L)',       20, 0),
  ('Condicionador a Granel (L)', 15, 0),
  ('Toalha Descartável',        200, 0),
  ('Luva de Proteção',          100, 0),
  ('Algodão (pacote)',           50, 0),
  ('Desinfetante (L)',           10, 0),
  ('Lâmina de Tosa',             30, 0),
  ('Colônia Pet (frasco)',       25, 0);

-- ────────────────────────────────────────────────────────────
-- 13. USO DE INSUMOS (trigger atualiza estoque automaticamente)
-- ────────────────────────────────────────────────────────────
INSERT INTO uso_insumo (id_insumo, quantidade_usada, data_uso) VALUES
  (1, 2, '2026-06-10'),  -- Shampoo p/ Nina e Max
  (2, 1, '2026-06-10'),  -- Condicionador p/ Nina
  (3, 4, '2026-06-10'),  -- Toalhas no dia 10
  (7, 2, '2026-06-10'),  -- Lâminas no dia 10
  (8, 2, '2026-06-10'),  -- Colônia no dia 10
  (1, 1, '2026-06-23'),  -- Shampoo p/ Tobias
  (3, 2, '2026-06-23'),  -- Toalhas dia 23
  (4, 1, '2026-06-23');  -- Luva dia 23


-- ============================================================
--  DML – UPDATES (atualização de dados existentes)
-- ============================================================

-- Atualizar telefone de cliente
UPDATE cliente
SET telefone = '(61) 91111-0000'
WHERE cpf = '123.456.789-00';

-- Reajuste de salário dos Groomers (10%)
UPDATE funcionario
SET salario = ROUND(salario * 1.10, 2)
WHERE cargo = 'Groomer';

-- Atualizar status do agendamento cancelado para histórico
UPDATE agendamento
SET status = 'Cancelado'
WHERE id_agendamento = 8;

-- Atualizar estoque após venda manual de produto
UPDATE produto
SET estoque_atual = estoque_atual - 1
WHERE id_produto = 9;  -- Cama Pet G vendida

-- Animal de adoção: atualizar status após tratamento
UPDATE animal_adocao
SET status = 'Disponível'
WHERE id_animal_adocao = 2;  -- Bruto concluiu tratamento

-- Atualizar preço de serviço
UPDATE servico
SET preco_base = 130.00
WHERE nome = 'Consulta Veterinária';


-- ============================================================
--  DML – DELETES (remoção controlada)
-- ============================================================

-- Remover agendamento cancelado (exemplo de limpeza)
-- OBS: remover primeiro da tabela associativa para evitar violação de FK
DELETE FROM agendamento_servico
WHERE id_agendamento = 8;

DELETE FROM agendamento
WHERE id_agendamento = 8;

-- Remover produto sem estoque e sem vendas associadas (exemplo)
-- (verificar antes se não há referência em venda_produto)
-- DELETE FROM produto WHERE id_produto = 8 AND estoque_atual = 0;

-- Remover animal já adotado do fluxo ativo (movimentação de dados)
-- DELETE FROM animal_adocao WHERE id_animal_adocao = 3 AND status = 'Adotado';


-- ============================================================
--  CONSULTAS DE VERIFICAÇÃO (SELECTs úteis)
-- ============================================================

-- Todos os pets com seus tutores
SELECT c.nome AS tutor, p.nome AS pet, p.raca, p.porte, p.faixa_etaria
FROM pet p
JOIN cliente c ON p.id_cliente = c.id_cliente
ORDER BY c.nome;

-- Agendamentos confirmados com serviços e funcionário responsável
SELECT
    a.id_agendamento,
    p.nome   AS pet,
    f.nome   AS funcionario,
    a.data_agendamento,
    a.hora,
    STRING_AGG(s.nome, ', ') AS servicos,
    a.valor_total,
    a.status
FROM agendamento a
JOIN pet p ON a.id_pet = p.id_pet
JOIN funcionario f ON a.id_funcionario = f.id_funcionario
JOIN agendamento_servico ags ON a.id_agendamento = ags.id_agendamento
JOIN servico s ON ags.id_servico = s.id_servico
WHERE a.status IN ('Agendado', 'Confirmado')
GROUP BY a.id_agendamento, p.nome, f.nome, a.data_agendamento, a.hora, a.valor_total, a.status
ORDER BY a.data_agendamento, a.hora;

-- Estoque de insumos atualizado
SELECT nome, quantidade_estoque, quantidade_gasta
FROM insumos
ORDER BY nome;

-- Animais disponíveis para adoção
SELECT nome, raca, porte, faixa_etaria, data_resgate
FROM animal_adocao
WHERE status = 'Disponível'
ORDER BY data_resgate;

-- Faturamento por método de pagamento
SELECT metodo_pagamento, COUNT(*) AS qtd_vendas, SUM(valor_total) AS total
FROM venda
GROUP BY metodo_pagamento
ORDER BY total DESC;
