USE diario_trabalhador;

-- Execute este arquivo uma vez no DBeaver.
-- Ele permite várias contas no mesmo computador.
ALTER TABLE contas DROP INDEX ip_cadastro;

SELECT id, nome, usuario, tipo, cnpj, ip_cadastro
FROM contas;
