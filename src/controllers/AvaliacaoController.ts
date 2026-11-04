import { Request, Response } from 'express';
import { AvaliacaoModel } from '../models/AvaliacaoModel';
import { RequisicaoAutenticada } from '../types';

export const AvaliacaoController = {
  async criar(req: Request, res: Response) {
    try {
      const usuario = (req as RequisicaoAutenticada).usuario!;

      const mes = new Date().toISOString().slice(0, 7);

      const id = await AvaliacaoModel.criar({
        contaId: usuario.id,
        cnpj: usuario.cnpj,
        humor: req.body.humor,
        nota: Number(req.body.nota),
        comentario: req.body.comentario || '',
        anonimo: Boolean(req.body.anonimo),
        mes
      });

      return res.status(201).json({
        id,
        mensagem: 'Avaliação salva.'
      });
    } catch (erro: any) {
      if (erro.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          erro: 'Você já fez uma avaliação neste mês.'
        });
      }

      return res.status(500).json({
        erro: 'Não foi possível salvar a avaliação.'
      });
    }
  },

  async minhas(req: Request, res: Response) {
    const usuario = (req as RequisicaoAutenticada).usuario!;

    const avaliacoes = await AvaliacaoModel.daConta(usuario.id);

    return res.json(avaliacoes);
  },

  async removerComentario(req: Request, res: Response) {
    const usuario = (req as RequisicaoAutenticada).usuario!;

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        erro: 'Avaliação inválida.'
      });
    }

    const removido = await AvaliacaoModel.removerComentario(
      id,
      usuario.id
    );

    if (!removido) {
      return res.status(404).json({
        erro: 'Comentário não encontrado ou não pertence a você.'
      });
    }

    return res.json({
      mensagem: 'Comentário removido. A nota da avaliação foi mantida.'
    });
  }
};
