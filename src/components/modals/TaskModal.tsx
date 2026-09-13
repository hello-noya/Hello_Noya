import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/i18n';
import { BottomSheet } from '../ui/BottomSheet';
import { Task } from '../../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  date: string;
}

export function TaskModal({ isOpen, onClose, task, date }: TaskModalProps) {
  const { state, addTask, updateTask, showToast } = useApp();
  const lang = state.settings.language;

  const [text, setText] = useState('');
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (task) {
      setText(task.text);
      setTime(task.time);
      setNote(task.note || '');
      setPriority(task.priority || 'medium');
      setDescription(task.description || '');
    } else {
      setText('');
      setTime('');
      setNote('');
      setPriority('medium');
      setDescription('');
    }
  }, [task, isOpen]);

  const handleSave = () => {
    if (!text.trim()) return;
    const taskData = {
      text,
      time,
      date,
      completed: task?.completed || false,
      note: note || undefined,
      priority,
      description: description || undefined,
    };
    if (task) {
      updateTask({ ...task, ...taskData });
    } else {
      addTask({
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
        ...taskData,
      });
    }
    showToast(t('saved', lang));
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={task ? (lang === 'ru' ? 'Редактировать задачу' : 'Edit Task') : (lang === 'ru' ? 'Создать задачу' : 'Create Task')}>
      <div className="space-y-4">
        {/* Task text */}
        <div>
          <label className="text-sm text-[var(--text-secondary)] mb-1.5 block">
            {lang === 'ru' ? 'Название задачи' : 'Task name'}
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={lang === 'ru' ? 'Введите название задачи' : 'Enter task name'}
            className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
          />
        </div>

        {/* Time */}
        <div>
          <label className="text-sm text-[var(--text-secondary)] mb-1.5 block">
            {lang === 'ru' ? 'Время' : 'Time'}
          </label>
          <div className="relative">
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
            />
            {time && (
              <button
                onClick={() => setTime('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Priority */}
        <div>
          <label className="text-sm text-[var(--text-secondary)] mb-2 block">
            {lang === 'ru' ? 'Приоритет' : 'Priority'}
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setPriority('low')}
              className={`py-2 rounded-lg text-xs font-medium transition-all ${
                priority === 'low'
                  ? 'bg-blue-500 text-white'
                  : 'bg-[var(--hover)] text-[var(--text-muted)]'
              }`}
            >
              {lang === 'ru' ? 'Низкий' : 'Low'}
            </button>
            <button
              onClick={() => setPriority('medium')}
              className={`py-2 rounded-lg text-xs font-medium transition-all ${
                priority === 'medium'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-[var(--hover)] text-[var(--text-muted)]'
              }`}
            >
              {lang === 'ru' ? 'Средний' : 'Medium'}
            </button>
            <button
              onClick={() => setPriority('high')}
              className={`py-2 rounded-lg text-xs font-medium transition-all ${
                priority === 'high'
                  ? 'bg-red-500 text-white'
                  : 'bg-[var(--hover)] text-[var(--text-muted)]'
              }`}
            >
              {lang === 'ru' ? 'Высокий' : 'High'}
            </button>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-sm text-[var(--text-secondary)] mb-1.5 block">
            {lang === 'ru' ? 'Описание' : 'Description'}
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={lang === 'ru' ? 'Добавьте описание задачи' : 'Add task description'}
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors resize-none"
          />
        </div>

        {/* Note */}
        <div>
          <label className="text-sm text-[var(--text-secondary)] mb-1.5 block">
            {lang === 'ru' ? 'Заметка' : 'Note'}
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={lang === 'ru' ? 'Добавьте заметку' : 'Add a note'}
            className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
          />
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          className="w-full py-3 rounded-xl bg-[var(--accent)] text-white font-medium hover:opacity-90 transition-opacity"
        >
          {t('save', lang)}
        </button>
      </div>
    </BottomSheet>
  );
}
