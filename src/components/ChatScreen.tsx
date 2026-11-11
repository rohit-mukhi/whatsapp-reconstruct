import { useMemo, useEffect, useRef, useState } from 'react';
import type { ParsedChat, Message } from '../types';
import MessageBubble from './MessageBubble';
import SystemMessage from './SystemMessage';
import DateSeparator from './DateSeparator';

interface Props {
  chat: ParsedChat;
  userName: string;
  mediaFiles: File[];
  chatName: string;
  onBack: () => void;
}

// Deterministic color per sender name (WhatsApp uses 20 colors)
const SENDER_COLORS = [
  '#e542a3', '#df7133', '#ad85e4', '#04a784', '#ed4c5c',
  '#0070f3', '#00a5f4', '#7bc15e', '#ff7eb6', '#f28c28',
  '#6bcbef', '#e17055', '#a29bfe', '#fd79a8', '#55efc4',
  '#fdcb6e', '#e84393', '#74b9ff', '#00b894', '#d63031',
];

function getSenderColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return SENDER_COLORS[Math.abs(hash) % SENDER_COLORS.length];
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear();
}

function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

export default function ChatScreen({ chat, userName, mediaFiles, chatName, onBack }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [showSidebar, setShowSidebar] = useState(true);

  // Build two lookup maps: by filename (primary) and by order index (fallback for <Media omitted>)
  const { mediaByName, mediaByIndex } = useMemo(() => {
    const byName: Record<string, string> = {};
    const byIndex: Record<number, string> = {};
    mediaFiles.forEach((file, i) => {
      const url = URL.createObjectURL(file);
      byName[file.name] = url;
      // Also try without extension for loose matching
      byName[file.name.toLowerCase()] = url;
      byIndex[i] = url;
    });
    return { mediaByName: byName, mediaByIndex: byIndex };
  }, [mediaFiles]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      Object.values(mediaByName).forEach(URL.revokeObjectURL);
    };
  }, [mediaByName]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [chat]);

  const isGroup = chat.participants.length > 2;

  // Build render list with date separators injected
  const renderItems = useMemo(() => {
    const items: ({ kind: 'date'; date: Date; key: string } | { kind: 'msg'; message: Message; key: string })[] = [];
    let lastDate: Date | null = null;

    for (const message of chat.messages) {
      if (!lastDate || !isSameDay(lastDate, message.timestamp)) {
        items.push({ kind: 'date', date: message.timestamp, key: `date-${message.id}` });
        lastDate = message.timestamp;
      }
      items.push({ kind: 'msg', message, key: message.id });
    }
    return items;
  }, [chat]);

  const otherParticipants = chat.participants.filter(
    (p) => p.toLowerCase() !== userName.toLowerCase()
  );
  const displayName = chatName || (otherParticipants.length === 1 ? otherParticipants[0] : chatName);

  return (
    <div className="wa-app">
      {/* Sidebar */}
      <aside className={`wa-sidebar${showSidebar ? '' : ' wa-sidebar--hidden'}`}>
        <div className="wa-sidebar-header">
          <div className="wa-avatar wa-avatar-self">
            <span>{getInitials(userName)}</span>
          </div>
          <div className="wa-sidebar-icons">
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
          </div>
        </div>

        <div className="wa-search">
          <div className="wa-search-inner">
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
            <input type="text" placeholder="Search or start new chat" readOnly />
          </div>
        </div>

        <div className="wa-chat-list-item active" onClick={() => setShowSidebar(false)}>
          <div className="wa-avatar" style={{ background: getSenderColor(displayName) }}>
            <span>{getInitials(displayName)}</span>
          </div>
          <div className="wa-chat-list-info">
            <span className="wa-chat-list-name">{displayName}</span>
            <span className="wa-chat-list-preview">
              {chat.messages.filter(m => m.type !== 'system').slice(-1)[0]?.text.slice(0, 40) ?? ''}
            </span>
          </div>
        </div>
      </aside>

      {/* Main chat panel */}
      <main className={`wa-main${showSidebar ? ' wa-main--hidden' : ''}`}>
        {/* Chat header */}
        <div className="wa-chat-header">
          <button className="wa-back-btn" onClick={() => window.innerWidth <= 768 ? setShowSidebar(true) : onBack()} title="Back">
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
          </button>
          <div className="wa-avatar" style={{ background: getSenderColor(displayName) }}>
            <span>{getInitials(displayName)}</span>
          </div>
          <div className="wa-header-info">
            <span className="wa-header-name">{displayName}</span>
            <span className="wa-header-sub">
              {isGroup
                ? chat.participants.join(', ')
                : 'click here for contact info'}
            </span>
          </div>
          <div className="wa-header-icons">
            <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
            <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
          </div>
        </div>

        {/* Messages */}
        <div className="wa-messages">
          {renderItems.map((item) => {
            if (item.kind === 'date') {
              return <DateSeparator key={item.key} date={item.date} />;
            }
            const { message } = item;
            if (message.type === 'system') {
              return <SystemMessage key={item.key} text={message.text} />;
            }
            const isSent = message.sender.toLowerCase() === userName.toLowerCase();
            return (
              <MessageBubble
                key={item.key}
                message={message}
                isSent={isSent}
                isGroup={isGroup}
                mediaUrl={
                  message.mediaFilename
                    ? (mediaByName[message.mediaFilename] ?? mediaByName[message.mediaFilename.toLowerCase()])
                    : message.mediaIndex !== undefined
                    ? mediaByIndex[message.mediaIndex]
                    : undefined
                }
                senderColor={getSenderColor(message.sender)}
              />
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input bar (decorative) */}
        <div className="wa-input-bar">
          <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24 16L12 15.45 7.77 18l1.12-4.81-3.73-3.23 4.92-.42L12 5l1.92 4.53 4.92.42-3.73 3.23L16.23 18z"/></svg>
          <div className="wa-input-field">
            <input type="text" placeholder="Type a message" readOnly />
          </div>
          <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M12 15c1.66 0 2.99-1.34 2.99-3L15 6c0-1.66-1.34-3-3-3S9 4.34 9 6v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 15 6.7 12H5c0 3.42 2.72 6.23 6 6.72V22h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/></svg>
          <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </div>
      </main>
    </div>
  );
}
