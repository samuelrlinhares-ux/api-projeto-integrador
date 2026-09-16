import React, { useState } from 'react';
import { CalendarEvent } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Coffee, 
  Users, 
  Briefcase, 
  Bell 
} from 'lucide-react';
import { toast } from 'sonner';

interface CalendarSectionProps {
  events: CalendarEvent[];
  onSaveEvents: (events: CalendarEvent[]) => void;
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

const EVENT_TYPE_MAP: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  reuniao: { label: 'Reunião de Equipe', icon: <Users className="w-3.5 h-3.5" />, color: 'bg-blue-50 text-blue-700 border-blue-200' },
  '1on1': { label: 'Conversa 1 a 1', icon: <Users className="w-3.5 h-3.5" />, color: 'bg-teal-50 text-teal-700 border-teal-200' },
  entrega: { label: 'Entrega / Prazo', icon: <Briefcase className="w-3.5 h-3.5" />, color: 'bg-amber-50 text-amber-800 border-amber-200' },
  pausa: { label: 'Pausa & Descompressão', icon: <Coffee className="w-3.5 h-3.5" />, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  lembrete: { label: 'Lembrete Pessoal', icon: <Bell className="w-3.5 h-3.5" />, color: 'bg-purple-50 text-purple-700 border-purple-200' },
};

export const CalendarSection: React.FC<CalendarSectionProps> = ({
  events,
  onSaveEvents,
  selectedDate,
  onSelectDate,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('14:00');
  const [newEventType, setNewEventType] = useState<CalendarEvent['type']>('reuniao');
  const [newEventDesc, setNewEventDesc] = useState('');

  // Auxiliares do calendário mensal
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Domingo
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const handleDayClick = (day: number) => {
    const formatted = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onSelectDate(formatted);
  };

  const dayEvents = events.filter((e) => e.date === selectedDate);

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) {
      toast.error('Informe o título do compromisso.');
      return;
    }

    const created: CalendarEvent = {
      id: 'event-' + Date.now(),
      title: newEventTitle.trim(),
      date: selectedDate,
      time: newEventTime,
      type: newEventType,
      description: newEventDesc,
      completed: false,
    };

    onSaveEvents([...events, created]);
    toast.success('Compromisso agendado com sucesso!');
    setNewEventTitle('');
    setNewEventDesc('');
    setIsAddingEvent(false);
  };

  const handleToggleComplete = (id: string) => {
    const updated = events.map((e) =>
      e.id === id ? { ...e, completed: !e.completed } : e
    );
    onSaveEvents(updated);
  };

  const handleDeleteEvent = (id: string) => {
    const updated = events.filter((e) => e.id !== id);
    onSaveEvents(updated);
    toast.success('Compromisso removido.');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Coluna Esquerda: Calendário Mensal Normal */}
      <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-amber-50 text-amber-700 rounded-xl">
                <CalendarIcon className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-slate-800 font-heading">
                Calendário de Trabalho & Rotina
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Visualize suas entregas, conversas e reserve momentos de autocuidado no expediente.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 hover:bg-white rounded-lg text-slate-600 transition-colors"
              title="Mês anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-800 px-2 min-w-28 text-center">
              {monthNames[month]} {year}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1.5 hover:bg-white rounded-lg text-slate-600 transition-colors"
              title="Próximo mês"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Grade de Dias da Semana */}
        <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
          <div>Dom</div>
          <div>Seg</div>
          <div>Ter</div>
          <div>Qua</div>
          <div>Qui</div>
          <div>Sex</div>
          <div>Sáb</div>
        </div>

        {/* Grade de Dias do Mês */}
        <div className="grid grid-cols-7 gap-2">
          {/* Espaços vazios antes do dia 1 */}
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="h-14 md:h-16 rounded-xl bg-slate-50/50" />
          ))}

          {/* Dias reais */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const formatted = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const isSelected = selectedDate === formatted;
            const isToday =
              new Date().toISOString().split('T')[0] === formatted;

            const dayEvts = events.filter((e) => e.date === formatted);
            const hasEvents = dayEvts.length > 0;

            return (
              <button
                key={dayNum}
                onClick={() => handleDayClick(dayNum)}
                className={`h-14 md:h-16 rounded-xl p-1.5 text-left border flex flex-col justify-between transition-all duration-150 relative group ${
                  isSelected
                    ? 'bg-teal-700 text-white border-teal-700 shadow-md ring-2 ring-teal-500/30'
                    : isToday
                    ? 'bg-amber-50/70 border-amber-300 text-amber-900 font-bold'
                    : 'bg-white border-slate-100 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-xs font-bold ${
                      isSelected
                        ? 'text-white'
                        : isToday
                        ? 'text-amber-800'
                        : 'text-slate-700'
                    }`}
                  >
                    {dayNum}
                  </span>
                  {isToday && (
                    <span className="text-[9px] uppercase px-1 rounded bg-amber-200/60 text-amber-900">
                      Hoje
                    </span>
                  )}
                </div>

                {/* Marcadores de compromissos */}
                {hasEvents && (
                  <div className="flex items-center gap-1 overflow-hidden w-full">
                    {dayEvts.slice(0, 3).map((ev) => (
                      <span
                        key={ev.id}
                        className={`w-1.5 h-1.5 rounded-full ${
                          isSelected
                            ? 'bg-amber-300'
                            : ev.type === 'pausa'
                            ? 'bg-emerald-500'
                            : ev.type === 'entrega'
                            ? 'bg-amber-500'
                            : 'bg-blue-500'
                        }`}
                        title={ev.title}
                      />
                    ))}
                    {dayEvts.length > 3 && (
                      <span
                        className={`text-[9px] font-bold ${
                          isSelected ? 'text-teal-200' : 'text-slate-400'
                        }`}
                      >
                        +{dayEvts.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Coluna Direita: Detalhes do Dia Selecionado */}
      <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
                Dia em Foco
              </span>
              <h3 className="text-lg font-bold text-slate-800 font-heading">
                {new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </h3>
            </div>

            <Button
              size="sm"
              onClick={() => setIsAddingEvent(!isAddingEvent)}
              className="bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Adicionar
            </Button>
          </div>

          {/* Form para adicionar evento */}
          {isAddingEvent && (
            <form
              onSubmit={handleAddEvent}
              className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in-50"
            >
              <div className="text-xs font-bold text-slate-700">Novo Compromisso</div>
              <Input
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                placeholder="Ex: Reunião de alinhamento com liderança"
                className="bg-white text-xs rounded-lg"
              />

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Horário</label>
                  <Input
                    type="time"
                    value={newEventTime}
                    onChange={(e) => setNewEventTime(e.target.value)}
                    className="bg-white text-xs rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Tipo</label>
                  <select
                    value={newEventType}
                    onChange={(e) => setNewEventType(e.target.value as CalendarEvent['type'])}
                    className="w-full bg-white border border-slate-200 text-xs rounded-lg p-2 font-medium"
                  >
                    <option value="reuniao">Reunião de Equipe</option>
                    <option value="1on1">Conversa 1 a 1</option>
                    <option value="entrega">Entrega / Prazo</option>
                    <option value="pausa">Pausa de Bem-Estar</option>
                    <option value="lembrete">Lembrete</option>
                  </select>
                </div>
              </div>

              <Input
                value={newEventDesc}
                onChange={(e) => setNewEventDesc(e.target.value)}
                placeholder="Observações adicionais (opcional)"
                className="bg-white text-xs rounded-lg"
              />

              <div className="flex justify-end gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddingEvent(false)}
                  className="text-xs"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-teal-700 hover:bg-teal-800 text-white text-xs"
                >
                  Salvar
                </Button>
              </div>
            </form>
          )}

          {/* Lista de Compromissos do Dia */}
          <div className="mt-4 space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {dayEvents.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Coffee className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">Nenhum compromisso agendado para esta data.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Aproveite para focar nas prioridades ou planejar seu dia com calma.
                </p>
              </div>
            ) : (
              dayEvents.map((ev) => {
                const typeInfo = EVENT_TYPE_MAP[ev.type] || EVENT_TYPE_MAP.reuniao;
                return (
                  <div
                    key={ev.id}
                    className={`p-3 rounded-xl border flex items-start justify-between gap-3 transition-colors ${
                      ev.completed
                        ? 'bg-slate-50 border-slate-200 opacity-60'
                        : `${typeInfo.color}`
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <button
                        onClick={() => handleToggleComplete(ev.id)}
                        className="mt-0.5 text-slate-400 hover:text-teal-600 transition-colors"
                        title={ev.completed ? 'Marcar como pendente' : 'Marcar como concluído'}
                      >
                        {ev.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                      </button>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-semibold text-xs ${
                              ev.completed ? 'line-through text-slate-500' : 'text-slate-800'
                            }`}
                          >
                            {ev.title}
                          </span>
                        </div>

                        {ev.description && (
                          <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                            {ev.description}
                          </p>
                        )}

                        <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-500 font-medium">
                          {ev.time && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {ev.time}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            {typeInfo.icon}
                            {typeInfo.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteEvent(ev.id)}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                      title="Excluir"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Dica de bem-estar na rotina */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500 bg-teal-50/50 p-2.5 rounded-xl">
          <Coffee className="w-4 h-4 text-teal-700 shrink-0" />
          <span>
            <strong>Dica de saúde:</strong> Lembre-se de beber água e pausar 5 minutos para descansar os olhos a cada duas horas de trabalho contínuo.
          </span>
        </div>
      </div>
    </div>
  );
};
