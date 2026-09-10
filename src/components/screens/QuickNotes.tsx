import React, { useState } from 'react';
import { FileText, List, Plus, Trash2, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function QuickNotes() {
  const { state } = useApp();
  const lang = state.settings.language;
  const [mode, setMode] = useState<'chat' | 'list'>('chat');
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Chat state
  const [chats, setChats] = useState<Array<{
    id: string;
    name: string;
    messages: Array<{ id: string; text: string; timestamp: number }>;
  }>>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatName, setChatName] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  
  // List state
  const [listItems, setListItems] = useState<Array<{
    id: string;
    text: string;
    completed: boolean;
  }>>([]);
  const [newListItem, setNewListItem] = useState('');
  const [showAllList, setShowAllList] = useState(false);

  const activeChat = chats.find(c => c.id === activeChatId);

  // Chat functions
  const createChat = () => {
    const newChat = {
      id: Date.now().toString(),
      name: lang === 'ru' ? 'Новый чат' : 'New chat',
      messages: [],
    };
    setChats([...chats, newChat]);
    setActiveChatId(newChat.id);
    setChatName(newChat.name);
  };

  const deleteChat = (id: string) => {
    setChats(chats.filter(c => c.id !== id));
    if (activeChatId === id) {
      setActiveChatId(null);
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !activeChat) return;
    const updatedChats = chats.map(chat => {
      if (chat.id === activeChatId) {
        return {
          ...chat,
          messages: [...chat.messages, {
            id: Date.now().toString(),
            text: newMessage.trim(),
            timestamp: Date.now(),
          }],
        };
      }
      return chat;
    });
    setChats(updatedChats);
    setNewMessage('');
  };

  const updateChatName = () => {
    if (!chatName.trim() || !activeChat) return;
    const updatedChats = chats.map(chat => {
      if (chat.id === activeChatId) {
        return { ...chat, name: chatName.trim() };
      }
      return chat;
    });
    setChats(updatedChats);
    setIsEditingName(false);
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
        onClick={() => !activeChatId && setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-[var(--hover)] transition-colors"
      >
        <div className="flex items-center gap-2">
          <FileText size={20} className="text-[var(--accent)]" />
          <h3 className="text-base font-semibold text-[var(--text-primary)]">
            {lang === 'ru' ? 'Заметки' : 'Notes'}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMode('chat');
                setActiveChatId(null);
              }}
              className={`p-2 rounded-lg transition-all ${
                mode === 'chat'
                  ? 'bg-[var(--accent)] text-white'
                  : 'bg-[var(--hover)] text-[var(--text-muted)]'
              }`}
            >
              <FileText size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMode('list');
                setActiveChatId(null);
              }}
              className={`p-2 rounded-lg transition-all ${
                mode === 'list'
                  ? 'bg-[var(--accent)] text-white'
                  : 'bg-[var(--hover)] text-[var(--text-muted)]'
              }`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </button>

      {/* Expanded content */}
      {(isExpanded || activeChatId) && (
        <div className="px-4 pb-4">
          {mode === 'chat' ? (
            <div className="space-y-3">
              {!activeChat ? (
                <div className="text-center py-8">
                  <FileText size={40} className="mx-auto text-[var(--text-muted)] mb-3 opacity-30" />
                  <p className="text-sm text-[var(--text-muted)] mb-3">
                    {lang === 'ru' ? 'Нет чатов' : 'No chats'}
                  </p>
                  <button
                    onClick={createChat}
                    className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium flex items-center gap-2 mx-auto hover:opacity-90 transition-opacity"
                  >
                    <Plus size={16} />
                    {lang === 'ru' ? 'Создать чат' : 'Create chat'}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Chat header */}
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)]">
                    {isEditingName ? (
                      <>
                        <input
                          type="text"
                          value={chatName}
                          onChange={(e) => setChatName(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && updateChatName()}
                          className="flex-1 px-2 py-1 rounded bg-transparent text-sm text-[var(--text-primary)] focus:outline-none"
                          autoFocus
                        />
                        <button
                          onClick={updateChatName}
                          className="p-1 rounded hover:bg-[var(--hover)] transition-colors"
                        >
                          <Check size={14} className="text-[var(--accent)]" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setIsEditingName(true);
                            setChatName(activeChat.name);
                          }}
                          className="flex-1 text-left text-sm font-medium text-[var(--text-primary)]"
                        >
                          {activeChat.name}
                        </button>
                        <button
                          onClick={() => deleteChat(activeChat.id)}
                          className="p-1 rounded hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 size={14} className="text-red-400" />
                        </button>
                      </>
                    )}
                  </div>
                  
                  {/* Messages */}
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {activeChat.messages.length === 0 ? (
                      <p className="text-xs text-[var(--text-muted)] text-center py-4">
                        {lang === 'ru' ? 'Нет сообщений' : 'No messages'}
                      </p>
                    ) : (
                      activeChat.messages.map(msg => (
                        <div
                          key={msg.id}
                          className="p-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)]"
                        >
                          <p className="text-sm text-[var(--text-primary)]">{msg.text}</p>
                          <p className="text-xs text-[var(--text-muted)] mt-1">
                            {new Date(msg.timestamp).toLocaleTimeString(lang === 'ru' ? 'ru-RU' : 'en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Message input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder={lang === 'ru' ? 'Написать сообщение...' : 'Write a message...'}
                      className="flex-1 px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                    />
                    <button
                      onClick={sendMessage}
                      className="px-3 py-2 rounded-lg bg-[var(--accent)] text-white hover:opacity-90 transition-opacity"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Back to chats list */}
                  {chats.length > 1 && (
                    <button
                      onClick={() => setActiveChatId(null)}
                      className="w-full py-2 rounded-lg bg-[var(--hover)] text-[var(--text-secondary)] text-sm font-medium hover:bg-[var(--accent)]/10 transition-colors"
                    >
                      {lang === 'ru' ? 'Все чаты' : 'All chats'} ({chats.length})
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="space-y-2 mb-3">
                {(showAllList ? listItems : listItems.slice(0, 4)).map(item => (
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
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                
                {listItems.length > 4 && (
                  <button
                    onClick={() => setShowAllList(!showAllList)}
                    className="w-full py-2 rounded-lg bg-[var(--hover)] text-[var(--text-secondary)] text-sm font-medium flex items-center justify-center gap-2 hover:bg-[var(--accent)]/10 transition-colors"
                  >
                    {showAllList ? (
                      <>
                        <span>↑</span>
                        {lang === 'ru' ? 'Свернуть' : 'Show less'}
                      </>
                    ) : (
                      <>
                        <span>↓</span>
                        {lang === 'ru' ? `Показать все (${listItems.length})` : `Show all (${listItems.length})`}
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newListItem}
                  onChange={(e) => setNewListItem(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addListItem()}
                  placeholder={lang === 'ru' ? 'Добавить пункт...' : 'Add item...'}
                  className="flex-1 px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
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
