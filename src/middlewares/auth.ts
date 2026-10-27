import { Request, Response, NextFunction } from 'express';
import { RequisicaoAutenticada, UsuarioSessao } from '../types';

export const sessoes = new Map<string, UsuarioSessao>();

export function autenticar(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const usuario = token ? sessoes.get(token) : undefined;
  if (!usuario) return res.status(401).json({ erro: 'Faça login para continuar.' });
  (req as RequisicaoAutenticada).usuario = usuario;
  next();
}

export function somenteGestor(req: Request, res: Response, next: NextFunction) {
  const usuario = (req as RequisicaoAutenticada).usuario;
  if (!usuario || !['dono', 'gerente'].includes(usuario.tipo)) return res.status(403).json({ erro: 'Apenas dono e gerente têm acesso.' });
  next();
}
