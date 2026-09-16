import React, { useState, useEffect } from 'react';
import { 
  getStoredNotes, 
  saveStoredNotes, 
  getStoredEvents, 
  saveStoredEvents, 
  getStoredFeedbacks, 
  saveStoredFeedbacks, 
  getStoredAreaRatings, 
  saveStoredAreaRatings, 
  INITIAL_AREAS 
} from '../storage';
import { NoteItem, CalendarEvent, DailyFeedback, AreaRatingItem } from '../types';
import { NotesSection } from '../components/NotesSection';
import { CalendarSection } from '../components/CalendarSection';
import { WorkerFeedbackForm } from '../components/WorkerFeedbackForm';
import { CompanyOverview } from '../components/CompanyOverview';

import { 
  FileText, 
  Calendar as CalendarIcon, 
  HeartHandshake, 
  BarChart3, 
  ShieldCheck, 
  Download, 
  Sparkles, 
  Coffee, 
  Smile, 
  Users, 
  SunMedium, 
  HelpCircle, 
  Layers 
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

export default function Home() {
  const getInitialTab = (): 'feedback' | 'notes' | 'calendar' | 'overview' => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab === 'notes' || tab === 'calendar' || tab === 'overview') {
      return tab;
    }
    return 'feedback';
  };
  const [activeTab, setActiveTab] = useState<'feedback' | 'notes' | 'calendar' | 'overview'>(getInitialTab);
  
  // Estados principais alimentados pelo LocalStorage
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [feedbacks, setFeedbacks] = useState<DailyFeedback[]>([]);
  const [areaRatings, setAreaRatings] = useState<AreaRatingItem[]>([]);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  useEffect(() => {
    setNotes(getStoredNotes());
    setEvents(getStoredEvents());
    setFeedbacks(getStoredFeedbacks());
    setAreaRatings(getStoredAreaRatings());
  }, []);

  const handleSaveNotes = (updated: NoteItem[]) => {
    setNotes(updated);
    saveStoredNotes(updated);
  };

  const handleSaveEvents = (updated: CalendarEvent[]) => {
    setEvents(updated);
    saveStoredEvents(updated);
  };

  const handleSaveFeedback = (feedback: DailyFeedback, newAreaRatings: AreaRatingItem[]) => {
    const updatedFeedbacks = [feedback, ...feedbacks];
    const updatedAreaRatings = [...newAreaRatings, ...areaRatings];

    setFeedbacks(updatedFeedbacks);
    setAreaRatings(updatedAreaRatings);

    saveStoredFeedbacks(updatedFeedbacks);
    saveStoredAreaRatings(updatedAreaRatings);

    setActiveTab('overview');
  };

  // Exportar dados como JSON para cópia de segurança pessoal
  const handleExportData = () => {
    const payload = {
      exportDate: new Date().toISOString(),
      notes,
      events,
      feedbacks,
      areaRatings,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `diario-trabalhador-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    toast.success('Seus registros foram exportados para backup pessoal com sucesso!');
  };

  return (
    <div className="min-h-screen bg-slate-50/80 flex flex-col">
      {/* Top Navigation Bar Confortável */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-700 to-emerald-600 flex items-center justify-center text-white shadow-sm">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-base sm:text-lg text-slate-900 leading-tight font-heading flex items-center gap-2">
                Diário do Trabalhador
                <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full hidden sm:inline-block">
                  Espaço Seguro & Organizador
                </span>
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">
                Organize sua rotina e avalie com sinceridade o clima da empresa
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportData}
              className="text-xs text-slate-600 rounded-xl hidden sm:flex items-center gap-1.5 border-slate-200 hover:bg-slate-100"
              title="Salvar cópia pessoal dos seus dados"
            >
              <Download className="w-3.5 h-3.5" /> Baixar Cópia
            </Button>

            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Privacidade Ativa</span>
            </div>
          </div>
        </div>
      </header>

      {/* Barra de Abas Principal */}
      <div className="bg-white border-b border-slate-200/80 sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2">
            <button
              onClick={() => setActiveTab('feedback')}
              className={`flex items-center gap-2 py-2.5 px-3.5 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'feedback'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Termômetro & Avaliação da Empresa</span>
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            </button>

            <button
              onClick={() => setActiveTab('notes')}
              className={`flex items-center gap-2 py-2.5 px-3.5 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'notes'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Bloco de Notas</span>
              <span className="text-[11px] px-1.5 py-0.2 rounded-md bg-slate-200 text-slate-700">
                {notes.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('calendar')}
              className={`flex items-center gap-2 py-2.5 px-3.5 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'calendar'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              <span>Calendário de Trabalho</span>
              <span className="text-[11px] px-1.5 py-0.2 rounded-md bg-slate-200 text-slate-700">
                {events.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 py-2.5 px-3.5 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Painel de Resultados & Voz Coletiva</span>
              <span className="text-[11px] px-1.5 py-0.2 rounded-md bg-slate-200 text-slate-700">
                {feedbacks.length}
              </span>
            </button>
          </nav>
        </div>
      </div>

      {/* Conteúdo Dinâmico */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {activeTab === 'feedback' && (
          <WorkerFeedbackForm onSaveFeedback={handleSaveFeedback} areas={INITIAL_AREAS} />
        )}

        {activeTab === 'notes' && (
          <NotesSection notes={notes} onSaveNotes={handleSaveNotes} />
        )}

        {activeTab === 'calendar' && (
          <CalendarSection
            events={events}
            onSaveEvents={handleSaveEvents}
            selectedDate={selectedCalendarDate}
            onSelectDate={setSelectedCalendarDate}
          />
        )}

        {activeTab === 'overview' && (
          <CompanyOverview
            feedbacks={feedbacks}
            areaRatings={areaRatings}
            areas={INITIAL_AREAS}
          />
        )}
      </main>

      {/* Footer Confortável */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Diário do Trabalhador</span>
            <span>—</span>
            <span>Espaço para organizar sua jornada e valorizar sua voz.</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Privacidade garantida</span>
            <span>•</span>
            <span>Armazenamento local seguro</span>
            <span>•</span>
            <button
              onClick={() => setActiveTab('feedback')}
              className="text-teal-700 hover:underline font-medium"
            >
              Enviar avaliação
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
