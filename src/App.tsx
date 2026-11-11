import { useState } from 'react';
import LandingPage from './components/LandingPage';
import SetupScreen from './components/SetupScreen';
import ChatScreen from './components/ChatScreen';
import { parseChat } from './utils/parseChat';
import type { ParsedChat } from './types';
import './App.css';

type AppState = 'landing' | 'setup' | 'loading' | 'chat';

export default function App() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [chat, setChat] = useState<ParsedChat | null>(null);
  const [userName, setUserName] = useState('');
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [chatName, setChatName] = useState('');

  const handleStart = (chatFile: File, name: string, media: File[]) => {
    setAppState('loading');
    requestAnimationFrame(() => {
      requestAnimationFrame(async () => {
        const raw = await chatFile.text();
        const parsed = parseChat(raw);
        const match = chatFile.name.match(/WhatsApp Chat with (.+?)(?:\.txt)?$/i);
        setChatName(match?.[1] ?? chatFile.name.replace(/\.txt$/i, ''));
        setUserName(name);
        setMediaFiles(media);
        setChat(parsed);
        setAppState('chat');
      });
    });
  };

  if (appState === 'loading') {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <span>Loading chat…</span>
      </div>
    );
  }

  if (appState === 'chat' && chat) {
    return (
      <ChatScreen
        chat={chat}
        userName={userName}
        mediaFiles={mediaFiles}
        chatName={chatName}
        onBack={() => { setChat(null); setAppState('setup'); }}
      />
    );
  }

  if (appState === 'setup') {
    return <SetupScreen onStart={handleStart} onBack={() => setAppState('landing')} />;
  }

  return <LandingPage onGetStarted={() => setAppState('setup')} />;
}
