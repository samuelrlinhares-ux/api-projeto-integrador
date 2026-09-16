export type MoodType = 'otimo' | 'bem' | 'neutro' | 'cansado' | 'estressado';

export interface DailyFeedback {
  id: string;
  date: string; // YYYY-MM-DD
  createdAt: number;
  mood: MoodType;
  emotionalEnergy: number; // 0-10
  treatmentRating: number; // 0-10: Como sou tratado pela liderança e colegas
  workQualityRating: number; // 0-10: Condições para entregar um trabalho com qualidade
  fairnessRating: number; // 0-10: Justiça e reconhecimento
  autonomyRating: number; // 0-10: Autonomia e flexibilidade
  safetyRating: number; // 0-10: Segurança psicológica e física
  openComment: string; // O que se passa na empresa
  positiveHighlights?: string;
  painPoints?: string;
  suggestions?: string;
  isAnonymous: boolean;
  workerRole?: string;
  workerDepartment?: string;
}

export interface AreaRatingItem {
  id: string;
  feedbackId?: string;
  areaName: string; // Ex: TI, Comercial, RH, Operações, Diretoria
  category: 'Liderança' | 'Operações' | 'Ambiente de Trabalho' | 'Comunicação' | 'Benefícios & Carga';
  score: number; // 0 a 10
  comment?: string;
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  category: 'tarefa' | 'ideia' | 'registro_diario' | 'importante' | 'alinhamento';
  colorTag: string; // hex ou classe
  pinned: boolean;
  date: string; // YYYY-MM-DD
  updatedAt: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string;
  type: 'reuniao' | 'entrega' | '1on1' | 'lembrete' | 'pausa';
  description?: string;
  completed?: boolean;
}

export interface CompanyArea {
  id: string;
  name: string;
  description: string;
  leaderTitle: string;
}
