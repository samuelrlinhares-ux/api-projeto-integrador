import { banco } from '../config/database';
import { TipoUsuario } from '../types';

export const ContaModel = {
  async buscarPorLogin(usuario: string, senhaHash: string) {
    const [linhas] = await banco.query('SELECT id, nome, usuario, tipo, cnpj, senha_hash FROM contas WHERE usuario = ? AND senha_hash = ?', [usuario, senhaHash]);
    return (linhas as any[])[0];
  },
  async criar(dados: { nome: string; usuario: string; senhaHash: string; tipo: TipoUsuario; cnpj: string; ip: string }) {
    const [resultado] = await banco.execute('INSERT INTO contas (nome, usuario, senha_hash, tipo, cnpj, ip_cadastro) VALUES (?, ?, ?, ?, ?, ?)', [dados.nome, dados.usuario, dados.senhaHash, dados.tipo, dados.cnpj, dados.ip]);
    return (resultado as any).insertId;
  },
  async existeIp(ip: string) {
    const [linhas] = await banco.query('SELECT id FROM contas WHERE ip_cadastro = ?', [ip]);
    return (linhas as any[]).length > 0;
  },
  async funcionariosDaEmpresa(cnpj: string) {
    const [linhas] = await banco.query("SELECT id, nome, usuario, tipo FROM contas WHERE cnpj = ? AND tipo = 'funcionario' ORDER BY nome", [cnpj]);
    return linhas;
  }
};
