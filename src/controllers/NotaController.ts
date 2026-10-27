import { Request, Response } from 'express';
import { NotaModel } from '../models/NotaModel';
import { RequisicaoAutenticada } from '../types';

export const NotaController = {
  async listar(req: Request, res: Response) { res.json(await NotaModel.listar((req as RequisicaoAutenticada).usuario!.id)); },
  async criar(req: Request, res: Response) { const id = await NotaModel.criar((req as RequisicaoAutenticada).usuario!.id, req.body.titulo, req.body.texto); res.status(201).json({ id }); },
  async apagar(req: Request, res: Response) { await NotaModel.apagar(Number(req.params.id), (req as RequisicaoAutenticada).usuario!.id); res.json({ ok: true }); }
};
