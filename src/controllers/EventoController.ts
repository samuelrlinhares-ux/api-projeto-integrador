import { Request, Response } from 'express';
import { EventoModel } from '../models/EventoModel';
import { RequisicaoAutenticada } from '../types';

export const EventoController = {
  async listar(req: Request, res: Response) { const usuario = (req as RequisicaoAutenticada).usuario!; res.json(await EventoModel.listarPorEmpresa(usuario.cnpj)); },
  async criar(req: Request, res: Response) { const usuario = (req as RequisicaoAutenticada).usuario!; const id = await EventoModel.criar(usuario.id, usuario.cnpj, req.body.titulo, req.body.data); res.status(201).json({ id }); },
  async apagar(req: Request, res: Response) { const usuario = (req as RequisicaoAutenticada).usuario!; await EventoModel.apagar(Number(req.params.id), usuario.id); res.json({ ok: true }); }
};
