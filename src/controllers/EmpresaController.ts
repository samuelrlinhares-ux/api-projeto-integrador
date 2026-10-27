import { Request, Response } from 'express';
import { ContaModel } from '../models/ContaModel';
import { AvaliacaoModel } from '../models/AvaliacaoModel';
import { RequisicaoAutenticada } from '../types';

export const EmpresaController = {
  async painel(req: Request, res: Response) { const usuario = (req as RequisicaoAutenticada).usuario!; res.json({ funcionarios: await ContaModel.funcionariosDaEmpresa(usuario.cnpj), avaliacoes: await AvaliacaoModel.daEmpresa(usuario.cnpj) }); }
};
