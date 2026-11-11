interface Props {
  onGetStarted: () => void;
}

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93-2.67-1.14-5-4.43-5-7.93V7.18L12 5zm-1 4v4h2V9h-2zm0 6v2h2v-2h-2z"/>
      </svg>
    ),
    title: '100% Private',
    desc: 'Your chat data never leaves your device. All parsing and rendering happens entirely in your browser — no servers, no uploads, no tracking.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.38 1.26 4.8L2.05 22l5.43-1.43c1.37.73 2.92 1.15 4.56 1.15 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.52 14.15c-.23.63-1.35 1.21-1.85 1.27-.5.06-1.01.24-3.39-.71-2.84-1.12-4.65-4.01-4.79-4.2-.14-.19-1.13-1.5-1.13-2.86 0-1.36.71-2.03.96-2.3.25-.27.55-.34.73-.34l.53.01c.17 0 .4-.06.63.48l.85 2.04c.07.14.12.3.02.48l-.29.45c-.14.16-.3.36-.43.48-.14.13-.29.27-.12.53.17.26.74 1.22 1.59 1.97 1.09.97 2.01 1.27 2.27 1.41.26.14.41.12.56-.07l.81-1.01c.17-.26.34-.21.57-.13l1.72.82c.25.13.42.19.48.3.06.11.06.63-.17 1.26z"/>
      </svg>
    ),
    title: 'Familiar WhatsApp UI',
    desc: 'Pixel-perfect recreation of the WhatsApp interface — dark theme, green bubbles, timestamps, double ticks, date separators, and system messages.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-1.1 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
      </svg>
    ),
    title: 'Media Support',
    desc: 'Upload your exported media files alongside the chat. Images, videos, audio, and GIFs are matched and displayed inline in the correct order.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
      </svg>
    ),
    title: 'Group & Private Chats',
    desc: 'Works with both private and group chats. Sender names are colour-coded in group chats, just like in the real app.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
      </svg>
    ),
    title: 'Reactions & Timestamps',
    desc: 'Emoji reactions appear as pills below the correct bubble. Every message shows its exact timestamp, just as WhatsApp displays it.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
        <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>
      </svg>
    ),
    title: 'Mobile Responsive',
    desc: 'Fully responsive design that works on any screen size. The layout adapts to mobile just like the real WhatsApp app.',
  },
];

const steps = [
  {
    num: '1',
    title: 'Export your chat',
    desc: 'In WhatsApp, open the chat → tap ⋮ → More → Export chat. Choose "Without media" or "Include media".',
  },
  {
    num: '2',
    title: 'Upload the .txt file',
    desc: 'Click "Get Started" and upload the exported _chat.txt file. Enter your name exactly as it appears in the chat.',
  },
  {
    num: '3',
    title: 'Add media (optional)',
    desc: 'If you exported with media, select all the media files. They will be matched and displayed inline automatically.',
  },
  {
    num: '4',
    title: 'Relive your chat',
    desc: 'Your chat is reconstructed instantly in a pixel-perfect WhatsApp interface — all on your device.',
  },
];

export default function LandingPage({ onGetStarted }: Props) {
  return (
    <div className="landing">

      {/* ── Hero ── */}
      <header className="landing-hero">
        <div className="landing-hero-inner">
          <div className="landing-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" width="52" height="52">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.38 1.26 4.8L2.05 22l5.43-1.43c1.37.73 2.92 1.15 4.56 1.15 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.52 14.15c-.23.63-1.35 1.21-1.85 1.27-.5.06-1.01.24-3.39-.71-2.84-1.12-4.65-4.01-4.79-4.2-.14-.19-1.13-1.5-1.13-2.86 0-1.36.71-2.03.96-2.3.25-.27.55-.34.73-.34l.53.01c.17 0 .4-.06.63.48l.85 2.04c.07.14.12.3.02.48l-.29.45c-.14.16-.3.36-.43.48-.14.13-.29.27-.12.53.17.26.74 1.22 1.59 1.97 1.09.97 2.01 1.27 2.27 1.41.26.14.41.12.56-.07l.81-1.01c.17-.26.34-.21.57-.13l1.72.82c.25.13.42.19.48.3.06.11.06.63-.17 1.26z"/>
            </svg>
          </div>
          <h1 className="landing-title">WhatsApp Chat Viewer</h1>
          <p className="landing-tagline">
            Reconstruct your exported WhatsApp chats in a pixel-perfect interface —<br className="landing-br" />
            entirely on your device, with zero data ever leaving your browser.
          </p>
          <div className="landing-privacy-badge">
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
            </svg>
            No servers &nbsp;·&nbsp; No uploads &nbsp;·&nbsp; No tracking
          </div>
          <button className="landing-cta" onClick={onGetStarted}>
            Get Started
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>
        </div>
      </header>

      {/* ── Privacy callout ── */}
      <section className="landing-privacy">
        <div className="landing-section-inner">
          <div className="privacy-card">
            <svg viewBox="0 0 24 24" fill="currentColor" width="36" height="36" className="privacy-icon">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93-2.67-1.14-5-4.43-5-7.93V7.18L12 5zm-1 4v4h2V9h-2zm0 6v2h2v-2h-2z"/>
            </svg>
            <div>
              <p className="privacy-heading">Your privacy is guaranteed by design</p>
              <p className="privacy-body">
                This app runs entirely in your browser. When you upload a chat file or media,
                it is read directly by your browser's File API and processed in JavaScript —
                nothing is transmitted over the network. There is no backend, no database,
                no analytics, and no cookies. Close the tab and everything is gone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="landing-features">
        <div className="landing-section-inner">
          <h2 className="landing-section-title">Everything you'd expect</h2>
          <div className="features-grid">
            {features.map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="landing-steps">
        <div className="landing-section-inner">
          <h2 className="landing-section-title">How it works</h2>
          <div className="steps-list">
            {steps.map((s, i) => (
              <div key={s.num} className="step">
                <div className="step-num">{s.num}</div>
                {i < steps.length - 1 && <div className="step-line" />}
                <div className="step-body">
                  <p className="step-title">{s.title}</p>
                  <p className="step-desc">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="landing-bottom-cta">
        <div className="landing-section-inner">
          <h2>Ready to relive your chats?</h2>
          <p>No sign-up. No install. Just upload and view.</p>
          <button className="landing-cta" onClick={onGetStarted}>
            Open a Chat
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>
        </div>
      </section>

    </div>
  );
}
