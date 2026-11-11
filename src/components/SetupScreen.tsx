import { useRef, useState } from 'react';

interface Props {
  onStart: (chatFile: File, userName: string, mediaFiles: File[]) => void;
  onBack: () => void;
}

export default function SetupScreen({ onStart, onBack }: Props) {
  const [userName, setUserName] = useState('');
  const [chatFile, setChatFile] = useState<File | null>(null);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatFile || !userName.trim()) return;
    onStart(chatFile, userName.trim(), mediaFiles);
  };

  return (
    <div className="setup-screen">
      <div className="setup-card">
        <button className="setup-back-btn" onClick={onBack}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
          Back
        </button>
        <div className="setup-logo">
          <svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.38 1.26 4.8L2.05 22l5.43-1.43c1.37.73 2.92 1.15 4.56 1.15 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.52 14.15c-.23.63-1.35 1.21-1.85 1.27-.5.06-1.01.24-3.39-.71-2.84-1.12-4.65-4.01-4.79-4.2-.14-.19-1.13-1.5-1.13-2.86 0-1.36.71-2.03.96-2.3.25-.27.55-.34.73-.34.18 0 .37.01.53.01.17 0 .4-.06.63.48.23.54.78 1.9.85 2.04.07.14.12.3.02.48-.1.18-.15.29-.29.45-.14.16-.3.36-.43.48-.14.13-.29.27-.12.53.17.26.74 1.22 1.59 1.97 1.09.97 2.01 1.27 2.27 1.41.26.14.41.12.56-.07.15-.19.64-.75.81-1.01.17-.26.34-.21.57-.13.23.08 1.47.69 1.72.82.25.13.42.19.48.3.06.11.06.63-.17 1.26z" />
          </svg>
        </div>
        <h1>WhatsApp Chat Viewer</h1>
        <p className="setup-subtitle">Reconstruct your exported WhatsApp chat</p>

        <form onSubmit={handleSubmit} className="setup-form">
          <div className="setup-field">
            <label>Your Name</label>
            <input
              type="text"
              placeholder="Enter your name as it appears in the chat"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>

          <div className="setup-field">
            <label>Chat Export File (.txt)</label>
            <div
              className={`file-drop ${chatFile ? 'has-file' : ''}`}
              onClick={() => chatInputRef.current?.click()}
            >
              {chatFile ? (
                <span className="file-name">✓ {chatFile.name}</span>
              ) : (
                <span>Click to upload <code>_chat.txt</code></span>
              )}
            </div>
            <input
              ref={chatInputRef}
              type="file"
              accept=".txt"
              style={{ display: 'none' }}
              onChange={(e) => setChatFile(e.target.files?.[0] ?? null)}
            />
          </div>

          <div className="setup-field">
            <label>Media Files <span className="optional">(optional)</span></label>
            <div
              className={`file-drop ${mediaFiles.length > 0 ? 'has-file' : ''}`}
              onClick={() => mediaInputRef.current?.click()}
            >
              {mediaFiles.length > 0 ? (
                <span className="file-name">✓ {mediaFiles.length} file{mediaFiles.length > 1 ? 's' : ''} selected</span>
              ) : (
                <span>Click to upload images, videos, audio, GIFs</span>
              )}
            </div>
            <input
              ref={mediaInputRef}
              type="file"
              accept="image/*,video/*,audio/*,.gif"
              multiple
              style={{ display: 'none' }}
              onChange={(e) => setMediaFiles(Array.from(e.target.files ?? []))}
            />
          </div>

          <button
            type="submit"
            className="setup-btn"
            disabled={!chatFile || !userName.trim()}
          >
            Open Chat
          </button>
        </form>
      </div>
    </div>
  );
}
