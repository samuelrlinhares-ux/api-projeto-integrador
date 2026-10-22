import { banco } from '../config/database';

export const NotaModel = {
  async listar(contaId: number) { const [linhas] = await banco.query("SELECT id, conta_id, titulo, texto, DATE_FORMAT(data_criacao, '%d/%m/%Y') AS data FROM notas WHERE conta_id = ? ORDER BY id DESC", [contaId]); return linhas; },
  async criar(contaId: number, titulo: string, texto: string) { const [resultado] = await banco.execute('INSERT INTO notas (conta_id, titulo, texto, data_criacao) VALUES (?, ?, ?, CURDATE())', [contaId, titulo, texto]); return (resultado as any).insertId; },
  async apagar(id: number, contaId: number) { await banco.execute('DELETE FROM notas WHERE id = ? AND conta_id = ?', [id, contaId]); }
};
