import { Request, Response } from 'express';
import { AvaliacaoModel } from '../models/AvaliacaoModel';
import { RequisicaoAutenticada } from '../types';

export const AvaliacaoController = {
  async criar(req: Request, res: Response) {
    try {
      const usuario = (req as RequisicaoAutenticada).usuario!;
      const mes = new Date().toISOString().slice(0, 7);
      const id = await AvaliacaoModel.criar({ contaId: usuario.id, cnpj: usuario.cnpj, humor: req.body.humor, nota: Number(req.body.nota), comentario: req.body.comentario || '', anonimo: Boolean(req.body.anonimo), mes });
      res.status(201).json({ id, mensagem: 'Avaliação salva.' });
    } catch (erro: any) { res.status(409).json({ erro: erro.code === 'ER_DUP_ENTRY' ? 'Você já fez uma avaliação neste mês.' : 'Não foi possível salvar a avaliação.' }); }
  },
  async minhas(req: Request, res: Response) { const usuario = (req as RequisicaoAutenticada).usuario!; res.json(await AvaliacaoModel.daConta(usuario.id)); }
};
