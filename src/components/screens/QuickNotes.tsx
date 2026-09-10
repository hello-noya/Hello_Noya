import React, { useState } from 'react';
import { FileText, List, Plus, Trash2, ArrowLeft, X, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

type NoteMode = 'notebook' | 'list';

interface Notebook {
  id: string;
  name: string;
  content: string;
  createdAt: number;
}

interface ListItem {
  id: string;
  text: string;
  completed: boolean;
}

export function QuickNotes() {
  const { state } = useApp();
  const lang = state.settings.language;
  const [isExpanded, setIsExpanded] = useState(false);
  const [mode, setMode] = useState<NoteMode>('notebook');
  
  // Notebook state
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [activeNotebookId, setActiveNotebookId] = useState<string | null>(null);
  const [newNotebookName, setNewNotebookName] = useState('');
  const [isCreatingNotebook, setIsCreatingNotebook] = useState(false);
  
  // List state
  const [listItems, setListItems] = useState<ListItem[]>([]);
  const [newListItem, setNewListItem] = useState('');

  const activeNotebook = notebooks.find(n => n.id === activeNotebookId);

  // Notebook functions
  const createNotebook = () => {
    if (!newNotebookName.trim()) return;
    const newNotebook: Notebook = {
      id: Date.now().toString(),
      name: newNotebookName.trim(),
      content: '',
      createdAt: Date.now(),
    };
    setNotebooks([...notebooks, newNotebook]);
    setNewNotebookName('');
    setIsCreatingNotebook(false);
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
        ? { ...n, content }
        : n
    ));
  };

  // List functions
  const addListItem = () => {
    if (!newListItem.trim()) return;
    setListItems([...listItems, {
      id: Date.now().toString(),
      text: newListItem.trim(),
      completed: false,
    }]);
    setNewListItem('');
  };

  const toggleListItem = (id: string) => {
    setListItems(listItems.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const deleteListItem = (id: string) => {
    setListItems(listItems.filter(item => item.id !== id));
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
        </div>
      </button>

      {/* Expanded content */}
      {(isExpanded || activeNotebookId) && (
        <div className="px-4 pb-4">
          {/* Mode selector */}
          {!activeNotebookId && (
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setMode('notebook')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === 'notebook'
                    ? 'bg-[var(--accent)] text-white'
                    : 'bg-[var(--hover)] text-[var(--text-muted)]'
                }`}
              >
                {lang === 'ru' ? 'Блокнот' : 'Notebook'}
              </button>
              <button
                onClick={() => setMode('list')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === 'list'
                    ? 'bg-[var(--accent)] text-white'
                    : 'bg-[var(--hover)] text-[var(--text-muted)]'
                }`}
              >
                {lang === 'ru' ? 'Список' : 'List'}
              </button>
            </div>
          )}

          {/* Notebook mode */}
          {mode === 'notebook' && (
            <div className="space-y-3">
              {!activeNotebook ? (
                <>
                  {isCreatingNotebook ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={newNotebookName}
                        onChange={(e) => setNewNotebookName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && createNotebook()}
                        placeholder={lang === 'ru' ? 'Название блокнота' : 'Notebook name'}
                        className="w-full px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={createNotebook}
                          className="flex-1 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium"
                        >
                          {lang === 'ru' ? 'Создать' : 'Create'}
                        </button>
                        <button
                          onClick={() => {
                            setIsCreatingNotebook(false);
                            setNewNotebookName('');
                          }}
                          className="px-4 py-2 rounded-lg bg-[var(--hover)] text-[var(--text-secondary)] text-sm"
                        >
                          {lang === 'ru' ? 'Отмена' : 'Cancel'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {notebooks.length === 0 ? (
                        <div className="text-center py-8">
                          <FileText size={40} className="mx-auto text-[var(--text-muted)] mb-3 opacity-30" />
                          <p className="text-sm text-[var(--text-muted)] mb-3">
                            {lang === 'ru' ? 'Нет блокнотов' : 'No notebooks'}
                          </p>
                          <button
                            onClick={() => setIsCreatingNotebook(true)}
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
                              </div>
                            </button>
                          ))}
                          {notebooks.length < 6 && (
                            <button
                              onClick={() => setIsCreatingNotebook(true)}
                              className="w-full py-2 rounded-lg bg-[var(--hover)] text-[var(--text-secondary)] text-sm font-medium flex items-center justify-center gap-2 hover:bg-[var(--accent)]/10 transition-colors"
                            >
                              <Plus size={16} />
                              {lang === 'ru' ? 'Создать блокнот' : 'Create notebook'}
                            </button>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </>
              ) : (
                <div className="space-y-3">
                  {/* Notebook header */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveNotebookId(null)}
                      className="p-1 rounded hover:bg-[var(--hover)] transition-colors"
                    >
                      <ArrowLeft size={16} className="text-[var(--text-primary)]" />
                    </button>
                    <h4 className="flex-1 text-sm font-medium text-[var(--text-primary)]">
                      {activeNotebook.name}
                    </h4>
                    <button
                      onClick={() => deleteNotebook(activeNotebook.id)}
                      className="p-1 rounded hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 size={16} className="text-red-400" />
                    </button>
                  </div>
                  
                  {/* Content area */}
                  <textarea
                    value={activeNotebook.content}
                    onChange={(e) => updateNotebookContent(e.target.value)}
                    placeholder={lang === 'ru' ? 'Начните писать...' : 'Start writing...'}
                    className="w-full h-64 p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] resize-none"
                  />
                </div>
              )}
            </div>
          )}

          {/* List mode */}
          {mode === 'list' && (
            <div className="space-y-2">
              {listItems.map(item => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 p-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)]"
                >
                  <button
                    onClick={() => toggleListItem(item.id)}
                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                      item.completed
                        ? 'bg-[var(--accent)] text-white'
                        : 'border-2 border-[var(--border)]'
                    }`}
                  >
                    {item.completed && <Check size={12} />}
                  </button>
                  <span className={`flex-1 text-sm ${
                    item.completed ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'
                  }`}>
                    {item.text}
                  </span>
                  <button
                    onClick={() => deleteListItem(item.id)}
                    className="text-[var(--text-muted)] hover:text-red-400 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newListItem}
                  onChange={(e) => setNewListItem(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addListItem()}
                  placeholder={lang === 'ru' ? 'Добавить пункт...' : 'Add item...'}
                  className="flex-1 px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
                />
                <button
                  onClick={addListItem}
                  className="px-3 py-2 rounded-lg bg-[var(--accent)] text-white hover:opacity-90 transition-opacity"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
