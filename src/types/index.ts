export type TipoUsuario = 'funcionario' | 'gerente' | 'dono';

export interface UsuarioSessao {
  id: number;
  nome: string;
  usuario: string;
  tipo: TipoUsuario;
  cnpj: string;
}

export interface RequisicaoAutenticada extends Express.Request {
  usuario?: UsuarioSessao;
  ipCadastro?: string;
}
