import React, { useState } from 'react';
import { FileText, Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface Notebook {
  id: string;
  name: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export function QuickNotes() {
  const { state } = useApp();
  const lang = state.settings.language;
  const [isExpanded, setIsExpanded] = useState(false);
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [activeNotebookId, setActiveNotebookId] = useState<string | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState('');

  const activeNotebook = notebooks.find(n => n.id === activeNotebookId);

  // Notebook functions
  const createNotebook = () => {
    const newNotebook: Notebook = {
      id: Date.now().toString(),
      name: lang === 'ru' ? 'Новый блокнот' : 'New notebook',
      content: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setNotebooks([...notebooks, newNotebook]);
    setActiveNotebookId(newNotebook.id);
  };

  const deleteNotebook = (id: string) => {
    setNotebooks(notebooks.filter(n => n.id !== id));
    if (activeNotebookId === id) {
      setActiveNotebookId(null);
    }
  };

  const updateNotebookContent = (content: string) => {
    if (!activeNotebookId) return;
    setNotebooks(notebooks.map(n => 
      n.id === activeNotebookId 
        ? { ...n, content, updatedAt: Date.now() }
        : n
    ));
  };

  const updateNotebookName = () => {
    if (!editName.trim() || !activeNotebookId) return;
    setNotebooks(notebooks.map(n => 
      n.id === activeNotebookId 
        ? { ...n, name: editName.trim(), updatedAt: Date.now() }
        : n
    ));
    setIsEditingName(false);
  };

  return (
    <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--border)] overflow-hidden">
      {/* Header - always visible */}
      <button
        onClick={() => !activeNotebookId && setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-[var(--hover)] transition-colors"
      >
        <div className="flex items-center gap-2">
          <FileText size={20} className="text-[var(--accent)]" />
          <h3 className="text-base font-semibold text-[var(--text-primary)]">
            {lang === 'ru' ? 'Заметки' : 'Notes'}
          </h3>
          {notebooks.length > 0 && (
            <span className="text-xs text-[var(--text-muted)]">
              ({notebooks.length})
            </span>
          )}
        </div>
      </button>

      {/* Expanded content */}
      {(isExpanded || activeNotebookId) && (
        <div className="px-4 pb-4">
          {!activeNotebook ? (
            <div className="space-y-3">
              {notebooks.length === 0 ? (
                <div className="text-center py-8">
                  <FileText size={40} className="mx-auto text-[var(--text-muted)] mb-3 opacity-30" />
                  <p className="text-sm text-[var(--text-muted)] mb-3">
                    {lang === 'ru' ? 'Нет блокнотов' : 'No notebooks'}
                  </p>
                  <button
                    onClick={createNotebook}
                    className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium flex items-center gap-2 mx-auto hover:opacity-90 transition-opacity"
                  >
                    <Plus size={16} />
                    {lang === 'ru' ? 'Создать блокнот' : 'Create notebook'}
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {notebooks.map(notebook => (
                    <button
                      key={notebook.id}
                      onClick={() => setActiveNotebookId(notebook.id)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] hover:border-[var(--accent)]/50 transition-colors text-left"
                    >
                      <FileText size={16} className="text-[var(--accent)] flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                          {notebook.name}
                        </p>
                        <p className="text-xs text-[var(--text-muted)] truncate">
                          {notebook.content || (lang === 'ru' ? 'Пусто' : 'Empty')}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotebook(notebook.id);
                        }}
                        className="text-[var(--text-muted)] hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </button>
                  ))}
                  {notebooks.length < 6 && (
                    <button
                      onClick={createNotebook}
                      className="w-full py-2 rounded-lg bg-[var(--hover)] text-[var(--text-secondary)] text-sm font-medium flex items-center justify-center gap-2 hover:bg-[var(--accent)]/10 transition-colors"
                    >
                      <Plus size={16} />
                      {lang === 'ru' ? 'Создать блокнот' : 'Create notebook'}
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {/* Notebook header */}
              <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)]">
                {isEditingName ? (
                  <>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && updateNotebookName()}
                      className="flex-1 px-2 py-1 rounded bg-transparent text-sm text-[var(--text-primary)] focus:outline-none"
                      autoFocus
                    />
                    <button
                      onClick={updateNotebookName}
                      className="p-1 rounded hover:bg-[var(--hover)] transition-colors"
                    >
                      <Save size={14} className="text-[var(--accent)]" />
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingName(false);
                        setEditName(activeNotebook.name);
                      }}
                      className="p-1 rounded hover:bg-[var(--hover)] transition-colors"
                    >
                      <X size={14} className="text-[var(--text-muted)]" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setIsEditingName(true);
                        setEditName(activeNotebook.name);
                      }}
                      className="flex-1 text-left text-sm font-medium text-[var(--text-primary)]"
                    >
                      {activeNotebook.name}
                    </button>
                    <button
                      onClick={() => deleteNotebook(activeNotebook.id)}
                      className="p-1 rounded hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 size={14} className="text-red-400" />
                    </button>
                    <button
                      onClick={() => setActiveNotebookId(null)}
                      className="p-1 rounded hover:bg-[var(--hover)] transition-colors"
                    >
                      <X size={14} className="text-[var(--text-muted)]" />
                    </button>
                  </>
                )}
              </div>
              
              {/* Content area */}
              <textarea
                value={activeNotebook.content}
                onChange={(e) => updateNotebookContent(e.target.value)}
                placeholder={lang === 'ru' ? 'Начните писать...' : 'Start writing...'}
                className="w-full h-64 p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors resize-none"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
