import { DailyFeedback, NoteItem, CalendarEvent, AreaRatingItem, CompanyArea } from './types';

/** Áreas exibidas no formulário para receber avaliações de 0 a 10. */
export const INITIAL_AREAS: CompanyArea[] = [
  { id: 'diretoria', name: 'Diretoria & Alta Liderança', description: 'Visão estratégica, clareza de rumos e empatia com a equipe', leaderTitle: 'Gestão Executiva' },
  { id: 'rh', name: 'Recursos Humanos / Gente & Gestão', description: 'Cuidado com pessoas, clima, suporte e feedbacks', leaderTitle: 'BP & People' },
  { id: 'operacoes', name: 'Operação & Produção', description: 'Processos do dia a dia, ferramentas e fluxo de trabalho', leaderTitle: 'Coordenação Operacional' },
  { id: 'comercial', name: 'Comercial & Vendas', description: 'Metas, pressão do mercado e alinhamento com entregas', leaderTitle: 'Gerência Comercial' },
  { id: 'ti', name: 'Tecnologia & Suporte', description: 'Sistemas estáveis, agilidade e equipamentos adequados', leaderTitle: 'Liderança Técnica' },
  { id: 'atendimento', name: 'Atendimento & Suporte ao Cliente', description: 'Volume de demandas e suporte interdepartamental', leaderTitle: 'Supervisão de CX' },
];

/** A cópia para VS Code começa sem exemplos preenchidos. */
export const INITIAL_NOTES: NoteItem[] = [];
export const INITIAL_EVENTS: CalendarEvent[] = [];
export const INITIAL_FEEDBACKS: DailyFeedback[] = [];
export const INITIAL_AREA_RATINGS: AreaRatingItem[] = [];

const NOTES_KEY = 'trabalhador_notes_vazio_v1';
const EVENTS_KEY = 'trabalhador_events_vazio_v1';
const FEEDBACKS_KEY = 'trabalhador_feedbacks_vazio_v1';
const AREA_RATINGS_KEY = 'trabalhador_area_ratings_vazio_v1';

export function getStoredNotes(): NoteItem[] {
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStoredNotes(notes: NoteItem[]): void {
  try { localStorage.setItem(NOTES_KEY, JSON.stringify(notes)); } catch (err) { console.error('Failed to save notes', err); }
}

export function getStoredEvents(): CalendarEvent[] {
  try {
    const raw = localStorage.getItem(EVENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStoredEvents(events: CalendarEvent[]): void {
  try { localStorage.setItem(EVENTS_KEY, JSON.stringify(events)); } catch (err) { console.error('Failed to save events', err); }
}

export function getStoredFeedbacks(): DailyFeedback[] {
  try {
    const raw = localStorage.getItem(FEEDBACKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStoredFeedbacks(feedbacks: DailyFeedback[]): void {
  try { localStorage.setItem(FEEDBACKS_KEY, JSON.stringify(feedbacks)); } catch (err) { console.error('Failed to save feedbacks', err); }
}

export function getStoredAreaRatings(): AreaRatingItem[] {
  try {
    const raw = localStorage.getItem(AREA_RATINGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStoredAreaRatings(ratings: AreaRatingItem[]): void {
  try { localStorage.setItem(AREA_RATINGS_KEY, JSON.stringify(ratings)); } catch (err) { console.error('Failed to save area ratings', err); }
}
