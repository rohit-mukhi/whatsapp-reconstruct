import type { Message, MediaKind } from '../types';

interface Props {
  message: Message;
  isSent: boolean;
  isGroup: boolean;
  mediaUrl?: string;
  senderColor: string;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function MediaContent({ mediaKind, mediaUrl, text }: { mediaKind?: MediaKind; mediaUrl?: string; text: string }) {
  if (!mediaUrl) {
    return (
      <div className="media-placeholder">
        <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-1.1 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
        </svg>
        <span>{text}</span>
      </div>
    );
  }

  if (mediaKind === 'image' || mediaKind === 'gif') {
    return <img src={mediaUrl} alt="media" className="bubble-media-img" />;
  }

  if (mediaKind === 'video') {
    return <video src={mediaUrl} controls className="bubble-media-video" />;
  }

  if (mediaKind === 'audio') {
    return <audio src={mediaUrl} controls className="bubble-media-audio" />;
  }

  // unknown — try image first
  return <img src={mediaUrl} alt="media" className="bubble-media-img" />;
}

export default function MessageBubble({ message, isSent, isGroup, mediaUrl, senderColor }: Props) {
  const { sender, timestamp, text, type, mediaKind, reactions } = message;

  return (
    <div className={`bubble-row ${isSent ? 'sent' : 'received'}`}>
      <div className="bubble-wrapper">
      <div className={`bubble ${isSent ? 'bubble-sent' : 'bubble-received'} ${type === 'media' ? 'bubble-media' : ''}`}>
        {isGroup && !isSent && (
          <span className="bubble-sender" style={{ color: senderColor }}>{sender}</span>
        )}

        {type === 'media' && (
          <MediaContent mediaKind={mediaKind} mediaUrl={mediaUrl} text={text} />
        )}

        {type === 'text' && text && (
          <span className="bubble-text">{text}</span>
        )}

        <div className="bubble-meta">
          <span className="bubble-time">{formatTime(timestamp)}</span>
          {isSent && (
            <span className="bubble-ticks">
              <svg viewBox="0 0 16 11" width="16" height="11" fill="none">
                <path d="M11.071.653a.75.75 0 0 1 .206 1.04l-5.5 8a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 1 1 1.06-1.06l2.39 2.39 4.958-7.278a.75.75 0 0 1 1.04-.206z" fill="#53bdeb"/>
                <path d="M14.571.653a.75.75 0 0 1 .206 1.04l-5.5 8a.75.75 0 0 1-1.154.114l-.5-.5a.75.75 0 1 1 1.06-1.06l.077.077 4.771-6.965a.75.75 0 0 1 1.04-.206z" fill="#53bdeb"/>
              </svg>
            </span>
          )}
        </div>
      </div>
      {reactions && reactions.length > 0 && (
        <div className={`bubble-reactions ${isSent ? 'reactions-sent' : 'reactions-received'}`}>
          {[...new Set(reactions)].map((emoji, i) => (
            <span key={i} className="reaction-pill">
              {emoji}
              {reactions.filter(r => r === emoji).length > 1 && (
                <span className="reaction-count">{reactions.filter(r => r === emoji).length}</span>
              )}
            </span>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
