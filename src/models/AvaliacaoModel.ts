import { banco } from '../config/database';

export const AvaliacaoModel = {
  async criar(dados: { contaId: number; cnpj: string; humor: string; nota: number; comentario: string; anonimo: boolean; mes: string }) {
    const [resultado] = await banco.execute('INSERT INTO avaliacoes (conta_id, cnpj, humor, nota, comentario, anonimo, mes_avaliacao, data_avaliacao) VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE())', [dados.contaId, dados.cnpj, dados.humor, dados.nota, dados.comentario, dados.anonimo, dados.mes]);
    return (resultado as any).insertId;
  },
  async daConta(contaId: number) {
    const [linhas] = await banco.query("SELECT id, conta_id, cnpj, humor, nota, comentario, anonimo, mes_avaliacao, DATE_FORMAT(data_avaliacao, '%d/%m/%Y') AS data FROM avaliacoes WHERE conta_id = ? ORDER BY id DESC", [contaId]);
    return linhas;
  },
  async daEmpresa(cnpj: string) {
    const [linhas] = await banco.query("SELECT a.id, a.conta_id, a.cnpj, a.humor, a.nota, a.comentario, a.anonimo, DATE_FORMAT(a.data_avaliacao, '%d/%m/%Y') AS data, c.nome FROM avaliacoes a JOIN contas c ON c.id = a.conta_id WHERE a.cnpj = ? ORDER BY a.id DESC", [cnpj]);
    return linhas;
  }
};
