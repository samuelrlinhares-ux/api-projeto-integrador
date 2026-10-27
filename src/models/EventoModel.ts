import { banco } from '../config/database';

export const EventoModel = {
  async listarPorEmpresa(cnpj: string) {
    const [linhas] = await banco.query('SELECT id, conta_id, cnpj, titulo, DATE_FORMAT(data_evento, \'%Y-%m-%d\') AS data FROM eventos WHERE cnpj = ? ORDER BY data_evento, id', [cnpj]);
    return linhas;
  },
  async criar(contaId: number, cnpj: string, titulo: string, data: string) {
    const [resultado] = await banco.execute('INSERT INTO eventos (conta_id, cnpj, titulo, data_evento) VALUES (?, ?, ?, ?)', [contaId, cnpj, titulo, data]);
    return (resultado as any).insertId;
  },
  async apagar(id: number, contaId: number) {
    await banco.execute('DELETE FROM eventos WHERE id = ? AND conta_id = ?', [id, contaId]);
  }
};
