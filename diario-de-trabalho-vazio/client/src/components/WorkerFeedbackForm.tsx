import React, { useState } from 'react';
import { DailyFeedback, AreaRatingItem, MoodType, CompanyArea } from '../types';
import { INITIAL_AREAS } from '../storage';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { 
  HeartHandshake, 
  ShieldCheck, 
  Send, 
  HelpCircle, 
  Smile, 
  Meh, 
  Frown, 
  AlertCircle, 
  Sparkles, 
  Building2, 
  Lock, 
  UserCheck, 
  ThumbsUp, 
  CheckCircle2, 
  SlidersHorizontal 
} from 'lucide-react';
import { toast } from 'sonner';

interface WorkerFeedbackFormProps {
  onSaveFeedback: (feedback: DailyFeedback, areaRatings: AreaRatingItem[]) => void;
  areas?: CompanyArea[];
}

const MOODS: { type: MoodType; label: string; icon: string; desc: string }[] = [
  { type: 'otimo', label: 'Muito Bem', icon: '✨', desc: 'Motivado, energizado e acolhido' },
  { type: 'bem', label: 'Tranquilo', icon: '😊', desc: 'Dia produtivo e em equilíbrio' },
  { type: 'neutro', label: 'Neutro / Estável', icon: '😐', desc: 'Dia comum, sem grandes destaques' },
  { type: 'cansado', label: 'Sobrecarregado', icon: '🥱', desc: 'Cansaço físico ou mental pesado' },
  { type: 'estressado', label: 'Desconfortável', icon: '🌧️', desc: 'Tensão com demandas ou pessoas' },
];

export const WorkerFeedbackForm: React.FC<WorkerFeedbackFormProps> = ({
  onSaveFeedback,
  areas = INITIAL_AREAS,
}) => {
  const [mood, setMood] = useState<MoodType>('bem');
  const [openComment, setOpenComment] = useState('');
  const [positiveHighlights, setPositiveHighlights] = useState('');
  const [painPoints, setPainPoints] = useState('');
  const [suggestions, setSuggestions] = useState('');

  // Critérios centrais com notas de 0 a 10
  const [treatmentRating, setTreatmentRating] = useState<number>(8);
  const [workQualityRating, setWorkQualityRating] = useState<number>(7);
  const [fairnessRating, setFairnessRating] = useState<number>(8);
  const [autonomyRating, setAutonomyRating] = useState<number>(8);
  const [safetyRating, setSafetyRating] = useState<number>(9);
  const [emotionalEnergy, setEmotionalEnergy] = useState<number>(7);

  // Anonimato e Identificação Opcional
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [workerRole, setWorkerRole] = useState('');
  const [workerDepartment, setWorkerDepartment] = useState('Operação & Produção');

  // Notas de 0 a 10 para cada Área e Posição da Empresa
  const [areaScores, setAreaScores] = useState<Record<string, { score: number; comment: string }>>(
    areas.reduce((acc, curr) => {
      acc[curr.id] = { score: 8, comment: '' };
      return acc;
    }, {} as Record<string, { score: number; comment: string }>)
  );

  const handleAreaScoreChange = (areaId: string, score: number) => {
    setAreaScores((prev) => ({
      ...prev,
      [areaId]: { ...prev[areaId], score },
    }));
  };

  const handleAreaCommentChange = (areaId: string, comment: string) => {
    setAreaScores((prev) => ({
      ...prev,
      [areaId]: { ...prev[areaId], comment },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!openComment.trim()) {
      toast.error('Por favor, escreva um breve comentário sobre como você está se sentindo ou o que se passa na empresa.');
      return;
    }

    const feedbackPayload: DailyFeedback = {
      id: 'fb-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      createdAt: Date.now(),
      mood,
      emotionalEnergy,
      treatmentRating,
      workQualityRating,
      fairnessRating,
      autonomyRating,
      safetyRating,
      openComment,
      positiveHighlights,
      painPoints,
      suggestions,
      isAnonymous,
      workerRole: isAnonymous ? 'Colaborador Anônimo' : workerRole || 'Colaborador',
      workerDepartment,
    };

    const areaRatingsPayload: AreaRatingItem[] = areas.map((area) => {
      const current = areaScores[area.id] || { score: 8, comment: '' };
      return {
        id: 'ar-' + Date.now() + '-' + area.id,
        feedbackId: feedbackPayload.id,
        areaName: area.name,
        category: 'Ambiente de Trabalho',
        score: current.score,
        comment: current.comment,
      };
    });

    onSaveFeedback(feedbackPayload, areaRatingsPayload);
    toast.success('Seu depoimento e suas avaliações foram registrados com segurança!');

    // Limpar campos principais
    setOpenComment('');
    setPositiveHighlights('');
    setPainPoints('');
    setSuggestions('');
  };

  const renderScoreButtons = (
    currentValue: number,
    onChange: (val: number) => void,
    label: string,
    subtext: string
  ) => {
    return (
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2.5">
          <div>
            <span className="font-semibold text-sm text-slate-800">{label}</span>
            <p className="text-xs text-slate-500">{subtext}</p>
          </div>
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full self-start sm:self-auto ${
              currentValue >= 8
                ? 'bg-emerald-100 text-emerald-800'
                : currentValue >= 5
                ? 'bg-amber-100 text-amber-800'
                : 'bg-rose-100 text-rose-800'
            }`}
          >
            Nota: {currentValue} / 10
          </span>
        </div>

        <div className="grid grid-cols-11 gap-1">
          {Array.from({ length: 11 }).map((_, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => onChange(idx)}
              className={`h-9 text-xs font-bold rounded-lg border transition-all ${
                currentValue === idx
                  ? 'bg-teal-700 text-white border-teal-700 ring-2 ring-teal-500/20 scale-105'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {idx}
            </button>
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 px-0.5">
          <span>0 (Muito Insatisfeito / Crítico)</span>
          <span>5 (Neutro / Regular)</span>
          <span>10 (Excelente / Totalmente Positivo)</span>
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Banner de Boas-Vindas & Acolhimento */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-800 via-teal-700 to-emerald-800 text-white p-6 sm:p-8 rounded-3xl shadow-md">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-teal-100 text-xs font-semibold mb-3">
            <Lock className="w-3.5 h-3.5" /> Canal Confortável, Transparente e Seguro
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading">
            O que está se passando na empresa hoje?
          </h2>
          <p className="text-teal-100 text-sm sm:text-base mt-2 leading-relaxed">
            Aqui você tem voz livre. Compartilhe como você está se sentindo, como tem sido o tratamento que recebe no dia a dia, a qualidade do trabalho e avalie com sinceridade as áreas da organização.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-teal-200 font-medium">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-300" /> Opção 100% Anônima
            </span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-amber-300" /> Avaliações de 0 a 10 por área
            </span>
            <span className="flex items-center gap-1">
              <HeartHandshake className="w-4 h-4 text-rose-300" /> Foco em saúde mental e respeito mútuo
            </span>
          </div>
        </div>
      </div>

      {/* Seção 1: Como você está se sentindo agora (Termômetro Emocional) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="border-b border-slate-100 pb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
            Passo 1 de 3
          </span>
          <h3 className="text-lg font-bold text-slate-800 font-heading">
            Como você está se sentindo neste momento?
          </h3>
          <p className="text-xs text-slate-500">
            Selecione o estado que melhor traduz o seu humor e disposição no trabalho.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {MOODS.map((m) => (
            <button
              key={m.type}
              type="button"
              onClick={() => setMood(m.type)}
              className={`p-4 rounded-2xl border text-center transition-all ${
                mood === m.type
                  ? 'border-teal-600 bg-teal-50/70 shadow-sm ring-2 ring-teal-500/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
              }`}
            >
              <span className="text-3xl block mb-2">{m.icon}</span>
              <span className="font-bold text-sm text-slate-800 block">{m.label}</span>
              <span className="text-[11px] text-slate-500 block mt-1 leading-snug">
                {m.desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Seção 2: Perguntas Essenciais de Clima & Relações (0 a 10) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
            Passo 2 de 3
          </span>
          <h3 className="text-lg font-bold text-slate-800 font-heading">
            Como você é tratado e qual a qualidade da sua experiência?
          </h3>
          <p className="text-xs text-slate-500">
            Atribua uma nota de 0 a 10 para cada pilar do seu dia a dia na empresa.
          </p>
        </div>

        <div className="space-y-4">
          {renderScoreButtons(
            treatmentRating,
            setTreatmentRating,
            'Tratamento & Respeito no Ambiente',
            'Como você é tratado pela liderança, chefias imediatas e colegas de trabalho.'
          )}

          {renderScoreButtons(
            workQualityRating,
            setWorkQualityRating,
            'Qualidade & Condições para Trabalhar',
            'Ferramentas adequadas, clareza nas metas, prazos viáveis e suporte operacional.'
          )}

          {renderScoreButtons(
            safetyRating,
            setSafetyRating,
            'Segurança Psicológica & Tranquilidade',
            'Liberdade para tirar dúvidas, admitir dificuldades e opinar sem medo de represálias.'
          )}

          {renderScoreButtons(
            fairnessRating,
            setFairnessRating,
            'Reconhecimento & Justiça Interna',
            'Sensação de que o esforço é notado e que as oportunidades são justas.'
          )}

          {renderScoreButtons(
            autonomyRating,
            setAutonomyRating,
            'Autonomia & Equilíbrio',
            'Possibilidade de gerenciar o próprio tempo e equilibrar o expediente com a vida pessoal.'
          )}
        </div>
      </div>

      {/* Seção 3: Avaliação de 0 a 10 por Área & Posição da Empresa */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5" /> Visão Setorial
          </span>
          <h3 className="text-lg font-bold text-slate-800 font-heading">
            Avalie de 0 a 10 cada Área e Posição da Empresa
          </h3>
          <p className="text-xs text-slate-500">
            Pontue a atuação e colaboração de cada setor com o seu trabalho, adicionando observações construtivas se desejar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {areas.map((area) => {
            const current = areaScores[area.id] || { score: 8, comment: '' };

            return (
              <div
                key={area.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <h4 className="font-bold text-sm text-slate-800">{area.name}</h4>
                      <span className="text-[11px] font-medium text-teal-700">
                        {area.leaderTitle}
                      </span>
                    </div>

                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                        current.score >= 8
                          ? 'bg-emerald-100 text-emerald-800'
                          : current.score >= 5
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      Nota {current.score}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mb-3">{area.description}</p>

                  {/* Seletor rápido 0 a 10 */}
                  <div className="grid grid-cols-11 gap-1 mb-2">
                    {Array.from({ length: 11 }).map((_, n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => handleAreaScoreChange(area.id, n)}
                        className={`h-7 text-[11px] font-bold rounded border transition-colors ${
                          current.score === n
                            ? 'bg-teal-700 text-white border-teal-700'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                <Input
                  value={current.comment}
                  onChange={(e) => handleAreaCommentChange(area.id, e.target.value)}
                  placeholder={`Observação sobre ${area.name} (opcional)`}
                  className="bg-white text-xs mt-2 rounded-lg"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Seção 4: Espaço Aberto para Descrever o que se Passa */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
            Passo 3 de 3
          </span>
          <h3 className="text-lg font-bold text-slate-800 font-heading">
            Descreva com suas palavras o que se passa na empresa
          </h3>
          <p className="text-xs text-slate-500">
            Conte situações reais, percepções sobre o dia a dia, pontos positivos e o que precisa ser ajustado com urgência.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Comentário Principal / Relato do Trabalhador *
            </label>
            <Textarea
              value={openComment}
              onChange={(e) => setOpenComment(e.target.value)}
              placeholder="Exemplo: 'Hoje percebi que nossa equipe está com dificuldade para cumprir os prazos porque os chamados chegam sem as informações básicas. Além disso, o clima com a chefia foi tenso pela manhã, mas melhorou após o alinhamento...'"
              rows={5}
              className="rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                O que funcionou bem hoje? (Pontos Positivos)
              </label>
              <Textarea
                value={positiveHighlights}
                onChange={(e) => setPositiveHighlights(e.target.value)}
                placeholder="Ex: Colega de equipe me deu suporte em um relatório difícil..."
                rows={3}
                className="rounded-xl border-slate-200 bg-slate-50/50 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                O que causou atrito ou desgaste? (Pontos de Atenção)
              </label>
              <Textarea
                value={painPoints}
                onChange={(e) => setPainPoints(e.target.value)}
                placeholder="Ex: Reunião que durou mais de duas horas sem objetivo claro..."
                rows={3}
                className="rounded-xl border-slate-200 bg-slate-50/50 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Sugestão prática de melhoria para a empresa
            </label>
            <Input
              value={suggestions}
              onChange={(e) => setSuggestions(e.target.value)}
              placeholder="Ex: Criar modelo padrão de solicitação e estabelecer horário limite para mensagens"
              className="rounded-xl border-slate-200 bg-slate-50/50 text-xs"
            />
          </div>
        </div>

        {/* Configurações de Identificação & Anonimato */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsAnonymous(!isAnonymous)}
              className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${
                isAnonymous ? 'bg-teal-700 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <div className="bg-white w-4 h-4 rounded-full shadow-md" />
            </button>
            <div>
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                {isAnonymous ? (
                  <>
                    <Lock className="w-3.5 h-3.5 text-teal-700" /> Envio Anônimo (Recomendado para total conforto)
                  </>
                ) : (
                  <>
                    <UserCheck className="w-3.5 h-3.5 text-teal-700" /> Envio com Identificação
                  </>
                )}
              </span>
              <p className="text-[11px] text-slate-500">
                {isAnonymous
                  ? 'Seu nome não será divulgado nas métricas ou listagens.'
                  : 'Você pode especificar seu cargo e setor para acompanhamento.'}
              </p>
            </div>
          </div>

          {!isAnonymous && (
            <div className="flex items-center gap-2">
              <Input
                value={workerRole}
                onChange={(e) => setWorkerRole(e.target.value)}
                placeholder="Seu Cargo (opcional)"
                className="bg-white text-xs h-8 w-44 rounded-lg"
              />
            </div>
          )}
        </div>

        {/* Botão de Envio */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Suas respostas ajudam a mapear melhorias reais nas condições de trabalho.
          </span>

          <Button
            type="submit"
            className="w-full sm:w-auto bg-teal-700 hover:bg-teal-800 text-white rounded-xl px-6 py-2.5 shadow-sm flex items-center justify-center gap-2 font-semibold text-sm"
          >
            <Send className="w-4 h-4" /> Registrar Depoimento & Avaliações
          </Button>
        </div>
      </div>
    </form>
  );
};
