CREATE DATABASE IF NOT EXISTS diario_trabalhador;
USE diario_trabalhador;

CREATE TABLE IF NOT EXISTS contas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  usuario VARCHAR(80) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  tipo ENUM('funcionario', 'gerente', 'dono') NOT NULL,
  cnpj VARCHAR(14) NOT NULL,
  ip_cadastro VARCHAR(64) NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS avaliacoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  conta_id INT NOT NULL,
  cnpj VARCHAR(14) NOT NULL,
  humor VARCHAR(30) NOT NULL,
  nota TINYINT NOT NULL,
  comentario TEXT,
  anonimo BOOLEAN DEFAULT TRUE,
  mes_avaliacao CHAR(7) NOT NULL,
  data_avaliacao DATE NOT NULL,
  FOREIGN KEY (conta_id) REFERENCES contas(id),
  UNIQUE KEY uma_avaliacao_por_mes (conta_id, mes_avaliacao)
);

CREATE TABLE IF NOT EXISTS notas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  conta_id INT NOT NULL,
  titulo VARCHAR(160) NOT NULL,
  texto TEXT NOT NULL,
  data_criacao DATE NOT NULL,
  FOREIGN KEY (conta_id) REFERENCES contas(id)
);

CREATE TABLE IF NOT EXISTS eventos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  conta_id INT NOT NULL,
  cnpj VARCHAR(14) NOT NULL,
  titulo VARCHAR(160) NOT NULL,
  data_evento DATE NOT NULL,
  FOREIGN KEY (conta_id) REFERENCES contas(id)
);
