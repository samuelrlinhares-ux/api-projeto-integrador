import React, { useState } from 'react';
import { DailyFeedback, AreaRatingItem, CompanyArea } from '../types';
import { 
  Building2, 
  BarChart3, 
  Smile, 
  Frown, 
  Meh, 
  Clock, 
  MessageSquare, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  Filter, 
  Share2, 
  ShieldCheck 
} from 'lucide-react';

interface CompanyOverviewProps {
  feedbacks: DailyFeedback[];
  areaRatings: AreaRatingItem[];
  areas: CompanyArea[];
}

export const CompanyOverview: React.FC<CompanyOverviewProps> = ({
  feedbacks,
  areaRatings,
  areas,
}) => {
  const [selectedAreaFilter, setSelectedAreaFilter] = useState('all');
  const [expandedFeedbackId, setExpandedFeedbackId] = useState<string | null>(null);

  // Médias Gerais
  const totalFeedbacks = feedbacks.length;

  const avgTreatment = totalFeedbacks
    ? (feedbacks.reduce((acc, f) => acc + f.treatmentRating, 0) / totalFeedbacks).toFixed(1)
    : '0';

  const avgWorkQuality = totalFeedbacks
    ? (feedbacks.reduce((acc, f) => acc + f.workQualityRating, 0) / totalFeedbacks).toFixed(1)
    : '0';

  const avgSafety = totalFeedbacks
    ? (feedbacks.reduce((acc, f) => acc + f.safetyRating, 0) / totalFeedbacks).toFixed(1)
    : '0';

  const avgFairness = totalFeedbacks
    ? (feedbacks.reduce((acc, f) => acc + f.fairnessRating, 0) / totalFeedbacks).toFixed(1)
    : '0';

  // Médias por Área da Empresa
  const areaAverages = areas.map((area) => {
    const ratings = areaRatings.filter((r) => r.areaName === area.name);
    const avg = ratings.length
      ? (ratings.reduce((acc, r) => acc + r.score, 0) / ratings.length).toFixed(1)
      : '8.0';

    return {
      ...area,
      avgScore: parseFloat(avg),
      totalRatings: ratings.length,
      comments: ratings.filter((r) => r.comment && r.comment.trim().length > 0),
    };
  });

  // Distribuição de Humor
  const moodCounts = {
    otimo: feedbacks.filter((f) => f.mood === 'otimo').length,
    bem: feedbacks.filter((f) => f.mood === 'bem').length,
    neutro: feedbacks.filter((f) => f.mood === 'neutro').length,
    cansado: feedbacks.filter((f) => f.mood === 'cansado').length,
    estressado: feedbacks.filter((f) => f.mood === 'estressado').length,
  };

  return (
    <div className="space-y-8">
      {/* Indicadores Principais de Topo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Tratamento & Respeito</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 font-heading">
            {avgTreatment} <span className="text-xs text-slate-400 font-normal">/ 10</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Sentimento de consideração e respeito da liderança.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Condições de Entrega</span>
            <span className="w-2 h-2 rounded-full bg-teal-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 font-heading">
            {avgWorkQuality} <span className="text-xs text-slate-400 font-normal">/ 10</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Ferramentas, apoio técnico e clareza de tarefas.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Segurança Psicológica</span>
            <span className="w-2 h-2 rounded-full bg-blue-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 font-heading">
            {avgSafety} <span className="text-xs text-slate-400 font-normal">/ 10</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Liberdade para opinar e relatar impasses sem medo.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Justiça & Reconhecimento</span>
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 font-heading">
            {avgFairness} <span className="text-xs text-slate-400 font-normal">/ 10</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Percepção de equilíbrio e valorização do esforço.
          </p>
        </div>
      </div>

      {/* Painel de Avaliações por Área e Posição (0 a 10) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-teal-50 text-teal-700 rounded-xl">
                <Building2 className="w-5 h-5" />
              </span>
              <h3 className="text-lg font-bold text-slate-800 font-heading">
                Termômetro Setorial: Avaliação de Cada Área (0 a 10)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Médias ponderadas a partir dos votos dados pelos trabalhadores.
            </p>
          </div>

          <div className="text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl font-medium self-start sm:self-auto">
            Total de {areaRatings.length} avaliações coletadas
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {areaAverages.map((area) => {
            const percentage = (area.avgScore / 10) * 100;
            return (
              <div
                key={area.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{area.name}</h4>
                    <span className="text-[11px] text-slate-500">{area.leaderTitle}</span>
                  </div>

                  <span
                    className={`text-xs font-extrabold px-2.5 py-1 rounded-lg ${
                      area.avgScore >= 8
                        ? 'bg-emerald-100 text-emerald-800'
                        : area.avgScore >= 6
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    Nota {area.avgScore}
                  </span>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-2.5 mb-2 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      area.avgScore >= 8
                        ? 'bg-emerald-600'
                        : area.avgScore >= 6
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                  <span>{area.description}</span>
                  <span className="font-medium">{area.totalRatings} registros</span>
                </div>

                {/* Comentários mais recentes sobre a área */}
                {area.comments.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200/60">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                      Última observação de colaborador:
                    </span>
                    <p className="text-xs text-slate-700 italic bg-white p-2 rounded-lg border border-slate-200/70">
                      "{area.comments[0].comment}"
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Histórico Transparente de Depoimentos & O que se passa */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-amber-50 text-amber-700 rounded-xl">
                <MessageSquare className="w-5 h-5" />
              </span>
              <h3 className="text-lg font-bold text-slate-800 font-heading">
                O que os trabalhadores estão relatando
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Espaço de escuta contínua com depoimentos francos e sugestões de evolução.
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-teal-700 font-semibold bg-teal-50 px-3 py-1.5 rounded-xl">
            <ShieldCheck className="w-4 h-4" /> Anonimato Preservado
          </div>
        </div>

        <div className="space-y-4">
          {feedbacks.map((fb) => {
            const isExpanded = expandedFeedbackId === fb.id;

            return (
              <div
                key={fb.id}
                className="p-5 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all bg-white"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">
                      {fb.mood === 'otimo' ? '✨' : fb.mood === 'bem' ? '😊' : fb.mood === 'cansado' ? '🥱' : fb.mood === 'estressado' ? '🌧️' : '😐'}
                    </span>
                    <div>
                      <span className="font-bold text-sm text-slate-800">
                        {fb.isAnonymous ? 'Colaborador Anônimo' : fb.workerRole || 'Colaborador'}
                      </span>
                      <span className="text-xs text-slate-400 ml-2">
                        • {new Date(fb.date + 'T00:00:00').toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                      Tratamento: {fb.treatmentRating}/10
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                      Qualidade: {fb.workQualityRating}/10
                    </span>
                  </div>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed font-sans mb-3">
                  "{fb.openComment}"
                </p>

                {/* Detalhes extras expansíveis */}
                {(fb.positiveHighlights || fb.painPoints || fb.suggestions) && (
                  <div className="pt-2 border-t border-slate-100">
                    <button
                      onClick={() =>
                        setExpandedFeedbackId(isExpanded ? null : fb.id)
                      }
                      className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-3.5 h-3.5" /> Ocultar sugestões e destaques
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3.5 h-3.5" /> Ver sugestões, pontos positivos e atritos
                        </>
                      )}
                    </button>

                    {isExpanded && (
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/60 animate-in fade-in-50">
                        {fb.positiveHighlights && (
                          <div>
                            <span className="font-bold text-emerald-800 block mb-0.5">
                              ✨ Destaques Positivos:
                            </span>
                            <p className="text-slate-600">{fb.positiveHighlights}</p>
                          </div>
                        )}

                        {fb.painPoints && (
                          <div>
                            <span className="font-bold text-rose-800 block mb-0.5">
                              ⚠️ Dificuldades / Atritos:
                            </span>
                            <p className="text-slate-600">{fb.painPoints}</p>
                          </div>
                        )}

                        {fb.suggestions && (
                          <div>
                            <span className="font-bold text-blue-800 block mb-0.5">
                              💡 Sugestão para a Empresa:
                            </span>
                            <p className="text-slate-600">{fb.suggestions}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
