import React, { useState } from 'react';
import { NoteItem } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { 
  Pin, 
  Trash2, 
  Plus, 
  Search, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  Tag, 
  Calendar as CalendarIcon 
} from 'lucide-react';
import { toast } from 'sonner';

interface NotesSectionProps {
  notes: NoteItem[];
  onSaveNotes: (notes: NoteItem[]) => void;
}

const COLOR_OPTIONS = [
  { label: 'Âmbar Solar', value: '#fef3c7', border: '#fde68a', text: '#92400e' },
  { label: 'Menta Serena', value: '#ecfdf5', border: '#a7f3d0', text: '#065f46' },
  { label: 'Céu Calmo', value: '#eff6ff', border: '#bfdbfe', text: '#1e40af' },
  { label: 'Lavanda Suave', value: '#f5f3ff', border: '#ddd6fe', text: '#5b21b6' },
  { label: 'Pêssego Acolhedor', value: '#fff1f2', border: '#fecdd3', text: '#9f1239' },
];

const CATEGORY_MAP: Record<string, { label: string; badge: string }> = {
  tarefa: { label: 'Tarefas & Ações', badge: 'bg-emerald-100 text-emerald-800' },
  ideia: { label: 'Ideias & Melhorias', badge: 'bg-amber-100 text-amber-800' },
  registro_diario: { label: 'Desabafo / Registro', badge: 'bg-blue-100 text-blue-800' },
  importante: { label: 'Urgente / Importante', badge: 'bg-rose-100 text-rose-800' },
  alinhamento: { label: 'Pauta com Liderança', badge: 'bg-purple-100 text-purple-800' },
};

export const NotesSection: React.FC<NotesSectionProps> = ({ notes, onSaveNotes }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingNote, setEditingNote] = useState<NoteItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<NoteItem['category']>('tarefa');
  const [newColor, setNewColor] = useState('#fef3c7');

  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'all' || n.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.updatedAt - a.updatedAt;
  });

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() && !newContent.trim()) {
      toast.error('Preencha ao menos o título ou conteúdo da nota.');
      return;
    }

    const created: NoteItem = {
      id: 'note-' + Date.now(),
      title: newTitle.trim() || 'Sem título',
      content: newContent,
      category: newCategory,
      colorTag: newColor,
      pinned: false,
      date: new Date().toISOString().split('T')[0],
      updatedAt: Date.now(),
    };

    const updated = [created, ...notes];
    onSaveNotes(updated);
    toast.success('Anotação guardada com sucesso!');

    setNewTitle('');
    setNewContent('');
    setIsCreating(false);
  };

  const handleTogglePin = (id: string) => {
    const updated = notes.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n));
    onSaveNotes(updated);
  };

  const handleDelete = (id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    onSaveNotes(updated);
    toast.success('Nota excluída.');
    if (editingNote?.id === id) setEditingNote(null);
  };

  const handleSaveEdit = () => {
    if (!editingNote) return;
    const updated = notes.map((n) =>
      n.id === editingNote.id ? { ...editingNote, updatedAt: Date.now() } : n
    );
    onSaveNotes(updated);
    toast.success('Nota atualizada!');
    setEditingNote(null);
  };

  return (
    <div className="space-y-6">
      {/* Header do Bloco de Notas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-teal-50 text-teal-700">
              <FileText className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-800 font-heading">
              Bloco de Notas Pessoal & Organizador
            </h2>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Seu espaço privado para planejar a jornada, registrar raciocínios diários e organizar prioridades de trabalho.
          </p>
        </div>

        <Button
          onClick={() => {
            setIsCreating(true);
            setEditingNote(null);
          }}
          className="bg-teal-700 hover:bg-teal-800 text-white rounded-xl shadow-sm flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Nova Anotação
        </Button>
      </div>

      {/* Formulário de Criação Expandido */}
      {isCreating && (
        <form
          onSubmit={handleAddNote}
          className="bg-white rounded-2xl border-2 border-teal-500/30 p-6 shadow-md animate-in fade-in-50 duration-200"
          style={{ backgroundColor: newColor }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-teal-700" /> Escrevendo nova anotação de trabalho
            </span>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-xs font-medium text-slate-500 hover:text-slate-800 bg-white/70 px-2.5 py-1 rounded-lg"
            >
              Cancelar
            </button>
          </div>

          <div className="space-y-3">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Título da nota (ex: 'Checklist de amanhã', 'Reflexão sobre prazo')"
              className="bg-white/80 border-slate-300 font-semibold text-slate-900 rounded-xl"
            />

            <Textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Descreva detalhes, pontos para não esquecer, passos da tarefa ou impressões do dia..."
              rows={4}
              className="bg-white/80 border-slate-300 text-slate-800 rounded-xl resize-y"
            />

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-slate-600" />
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as NoteItem['category'])}
                  aria-label="Categoria da anotação"
                  className="text-xs bg-white/90 border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium text-slate-700"
                >
                  <option value="tarefa">Tarefas & Ações</option>
                  <option value="ideia">Ideias & Melhorias</option>
                  <option value="registro_diario">Desabafo / Registro Diário</option>
                  <option value="importante">Urgente / Importante</option>
                  <option value="alinhamento">Pauta com Liderança</option>
                </select>
              </div>

              {/* Cores */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-500 mr-1">Cor do papel:</span>
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    title={c.label}
                    onClick={() => setNewColor(c.value)}
                    className={`w-6 h-6 rounded-full border transition-transform ${
                      newColor === c.value ? 'scale-125 ring-2 ring-teal-600' : 'opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: c.value, borderColor: c.border }}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreating(false)}
                  className="text-xs bg-white/80 rounded-xl"
                >
                  Fechar
                </Button>
                <Button
                  type="submit"
                  className="bg-teal-700 hover:bg-teal-800 text-white text-xs rounded-xl"
                >
                  Salvar Nota
                </Button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Barra de Filtro e Pesquisa */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar anotações..."
            className="pl-9 bg-white border-slate-200 rounded-xl text-sm"
          />
        </div>

        {/* Categorias Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            Todas ({notes.length})
          </button>
          {Object.entries(CATEGORY_MAP).map(([key, info]) => {
            const count = notes.filter((n) => n.category === key).length;
            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap ${
                  selectedCategory === key
                    ? 'bg-teal-700 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {info.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid de Notas (Estilo Cards Confortáveis de Papel) */}
      {sortedNotes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 mb-3">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-700">Nenhuma anotação encontrada</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Utilize o botão acima para registrar suas tarefas diárias, lembretes de trabalho e pensamentos.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedNotes.map((note) => {
            const catInfo = CATEGORY_MAP[note.category] || {
              label: 'Geral',
              badge: 'bg-slate-100 text-slate-700',
            };

            return (
              <div
                key={note.id}
                className="paper-card rounded-2xl border p-5 flex flex-col justify-between transition-all duration-200 relative group"
                style={{
                  backgroundColor: note.colorTag || '#ffffff',
                  borderColor: 'rgba(0,0,0,0.06)',
                }}
              >
                {/* Header do Card */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${catInfo.badge}`}
                    >
                      {catInfo.label}
                    </span>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleTogglePin(note.id)}
                        title={note.pinned ? 'Desafixar nota' : 'Fixar no topo'}
                        className={`p-1 rounded-md transition-colors ${
                          note.pinned
                            ? 'text-amber-700 bg-amber-100/60'
                            : 'text-slate-400 hover:text-slate-700 hover:bg-black/5'
                        }`}
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(note.id)}
                        title="Excluir nota"
                        className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base leading-snug mb-2 font-heading">
                    {note.title}
                  </h3>

                  <p className="text-slate-700 text-sm whitespace-pre-line leading-relaxed font-sans line-clamp-6">
                    {note.content}
                  </p>
                </div>

                {/* Footer do Card */}
                <div className="pt-4 mt-3 border-t border-black/5 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <CalendarIcon className="w-3 h-3 text-slate-400" />
                    {new Date(note.date + 'T00:00:00').toLocaleDateString('pt-BR')}
                  </span>

                  <button
                    onClick={() => {
                      setEditingNote(note);
                      setIsCreating(false);
                    }}
                    className="font-medium text-slate-600 hover:text-teal-800 hover:underline"
                  >
                    Editar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Edição Simples */}
      {editingNote && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in-50">
          <div
            className="w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-slate-200"
            style={{ backgroundColor: editingNote.colorTag || '#ffffff' }}
          >
            <h3 className="font-bold text-lg text-slate-900 mb-3">Editar Anotação</h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600">Título</label>
                <Input
                  value={editingNote.title}
                  onChange={(e) =>
                    setEditingNote({ ...editingNote, title: e.target.value })
                  }
                  className="bg-white/80 border-slate-300 font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600">Conteúdo</label>
                <Textarea
                  value={editingNote.content}
                  onChange={(e) =>
                    setEditingNote({ ...editingNote, content: e.target.value })
                  }
                  rows={5}
                  className="bg-white/80 border-slate-300"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-1.5">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      title={c.label}
                      onClick={() =>
                        setEditingNote({ ...editingNote, colorTag: c.value })
                      }
                      className={`w-6 h-6 rounded-full border ${
                        editingNote.colorTag === c.value
                          ? 'scale-125 ring-2 ring-teal-600'
                          : 'opacity-70'
                      }`}
                      style={{ backgroundColor: c.value, borderColor: c.border }}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setEditingNote(null)}
                    className="text-xs bg-white/80"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSaveEdit}
                    className="bg-teal-700 hover:bg-teal-800 text-white text-xs"
                  >
                    Salvar Alterações
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
