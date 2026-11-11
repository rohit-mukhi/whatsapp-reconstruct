# WhatsApp Chat Viewer

A privacy-first, browser-based tool that reconstructs exported WhatsApp chats into a pixel-perfect replica of the WhatsApp interface — entirely on your device, with zero data ever leaving your browser.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Privacy](#privacy)
- [Use Cases](#use-cases)
- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Exporting a WhatsApp Chat](#exporting-a-whatsapp-chat)
- [Supported Export Formats](#supported-export-formats)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

WhatsApp allows you to export any chat as a `.txt` file, but the exported file is raw, unformatted text — difficult to read and impossible to share meaningfully. **WhatsApp Chat Viewer** solves this by parsing that export and rendering it in a UI that looks and feels exactly like WhatsApp, complete with chat bubbles, timestamps, media, reactions, date separators, and sender colours.

Everything runs in the browser. No account. No install. No server. Just open the app, upload your file, and your chat is reconstructed instantly.

---

## Features

- **Pixel-perfect WhatsApp UI** — dark theme, green sent bubbles, white received bubbles, bubble tails, double blue ticks, date separators, and system messages
- **Sent vs. received** — enter your name and your messages appear on the right; everyone else's on the left
- **Group & private chat support** — works with both. In group chats, each sender gets a unique colour, just like in WhatsApp
- **Inline media** — upload your exported media files (images, videos, audio, GIFs) and they are matched and displayed inline in the correct position in the chat
- **Emoji reactions** — reactions exported in the chat file are parsed and displayed as pills below the correct bubble
- **Multi-line messages** — long messages that span multiple lines in the export are correctly reconstructed as a single bubble
- **HTML entity decoding** — WhatsApp injects HTML entities (`&#39;`, `&amp;`, `&lt;`, etc.) into exports; these are decoded back to their original characters
- **Responsive design** — works on desktop and mobile. On mobile, the layout mirrors the WhatsApp mobile app with a sidebar/chat toggle
- **Loading animation** — a spinner is shown while large chats are being parsed so the UI never appears frozen
- **Landing page** — explains the app, its privacy guarantees, features, and how to use it

---

## Privacy

> **Your data never leaves your device.**

This is not a marketing claim — it is a technical guarantee enforced by the architecture:

- The app is a **static frontend** with no backend whatsoever
- File reading uses the browser's native **File API** — files are read into memory locally, never uploaded
- There are no API calls, no analytics scripts, no tracking pixels, no cookies, and no `localStorage` usage
- Closing the browser tab destroys all loaded data permanently
- The app can be run fully **offline** after the initial page load

This makes it safe to use with sensitive personal conversations.

---

## Use Cases

- **Archiving memories** — reconstruct old chats with friends, family, or partners in a readable, shareable format
- **Legal or professional documentation** — present exported chat evidence in a clear, readable format that mirrors the original interface
- **Nostalgia** — revisit old group chats, travel conversations, or milestone moments
- **Accessibility** — the raw `.txt` export is hard to read; this tool makes it human-friendly
- **Research & journalism** — analyse chat exports in context without exposing data to third-party tools
- **Gifting** — create a visual reconstruction of a meaningful conversation as a keepsake

---

## How It Works

### 1. Export Parsing

WhatsApp exports chats in a plain text format. Each message line follows a consistent pattern:

```
DD/MM/YYYY, H:MMam - Sender Name: Message text
```

The parser (`src/utils/parseChat.ts`) uses a regular expression to match this pattern across both Android and iOS export formats, handling:

- 12-hour and 24-hour time formats
- Date separators (`/`, `-`, `.`)
- iOS bracket format: `[DD/MM/YYYY, HH:MM:SS]`
- Unicode left-to-right marks prepended by some locales
- En-dash and em-dash separators
- Multi-line messages (continuation lines with no timestamp)
- System messages (no sender colon pattern)
- `<Media omitted>` placeholders
- `filename.jpg (file attached)` patterns
- Reaction lines: `Name reacted 👍 to "message"`
- HTML entity decoding

### 2. Media Matching

WhatsApp exports media files with their original filenames (e.g. `IMG-20250811-WA0001.jpg`). The parser stores the filename from `(file attached)` lines on each media message. When you upload media files, the app builds a `filename → object URL` map and looks up each media message by filename — so order does not matter.

For `<Media omitted>` lines (where no filename is available), a sequential index-based fallback is used.

### 3. Rendering

The parsed message array is passed to `ChatScreen`, which:

- Injects `DateSeparator` components between messages from different days
- Determines sent/received based on a case-insensitive match of the sender name against the user-provided name
- Renders `MessageBubble`, `SystemMessage`, or `DateSeparator` for each item
- Scrolls to the bottom on load
- Builds object URLs for media files and cleans them up on unmount

### 4. Loading

Parsing is synchronous and can block the main thread for large chats. To prevent a frozen UI, the app sets a loading state, then uses a double `requestAnimationFrame` to guarantee the spinner is painted before the parse begins.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Language | TypeScript 6 |
| Build tool | Vite 8 |
| Styling | Plain CSS (no framework) |
| Linting | ESLint 10 + typescript-eslint |
| Runtime | Browser only — no Node.js at runtime |

No UI component libraries, no CSS frameworks, no state management libraries. The entire app is built from scratch to keep the bundle small and the code transparent.

---

## Project Structure

```
src/
├── components/
│   ├── LandingPage.tsx     # Landing page with features, privacy info, how-to
│   ├── SetupScreen.tsx     # File upload form and name input
│   ├── ChatScreen.tsx      # Main WhatsApp layout (sidebar + chat panel)
│   ├── MessageBubble.tsx   # Individual chat bubble with media and reactions
│   ├── SystemMessage.tsx   # Centre-aligned system/info messages
│   └── DateSeparator.tsx   # Date pill between messages from different days
├── utils/
│   └── parseChat.ts        # WhatsApp .txt export parser
├── types.ts                # Shared TypeScript interfaces
├── App.tsx                 # Root component and app state machine
├── App.css                 # All styles
├── index.css               # Base reset
└── main.tsx                # React entry point
```

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm

### Installation

```bash
git clone https://github.com/your-username/whatsapp-reconstruct.git
cd whatsapp-reconstruct
npm install
```

### Development

```bash
npm run dev
```

Opens the app at `http://localhost:5173` with hot module replacement.

### Production Build

```bash
npm run build
```

Output is in `dist/`. Since the app is fully static, it can be served from any static host (GitHub Pages, Vercel, Netlify, S3, etc.).

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

---

## Exporting a WhatsApp Chat

### Android

1. Open the chat in WhatsApp
2. Tap the three-dot menu (⋮) in the top right
3. Tap **More** → **Export chat**
4. Choose **Without media** or **Include media**
5. Share the `.zip` to yourself (email, Google Drive, etc.)
6. Extract the `.zip` — you will find `_chat.txt` and any media files

### iOS

1. Open the chat in WhatsApp
2. Tap the contact/group name at the top
3. Scroll down and tap **Export Chat**
4. Choose **Without media** or **Attach Media**
5. Share the export to yourself
6. Extract — you will find `_chat.txt` and media files

---

## Supported Export Formats

The parser handles all known WhatsApp export variants:

| Format | Example |
|---|---|
| Android 12h | `08/11/2025, 2:26pm - Name: message` |
| Android 24h | `08/11/2025, 14:26 - Name: message` |
| iOS | `[08/11/2025, 14:26:30] Name: message` |
| With Unicode LTR mark | `‎08/11/2025, 2:26pm - Name: message` |
| En-dash separator | `08/11/2025, 2:26pm – Name: message` |
| Dot date separator | `08.11.2025, 2:26pm - Name: message` |

---

## Contributing

Contributions are welcome. Here is how to get involved:

### Reporting Bugs

Open a GitHub issue with:
- The first 3–5 lines of your exported `.txt` file (redact personal content)
- What you expected to happen
- What actually happened

This is especially useful for parser bugs, since export formats vary by region, OS version, and WhatsApp version.

### Suggesting Features

Open a GitHub issue with the `enhancement` label. Good candidates include:
- New export format support
- Search within a reconstructed chat
- Export the reconstructed chat as a PDF or image
- Light theme support
- Starred messages highlighting

### Submitting a Pull Request

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Ensure the build passes: `npm run build`
5. Ensure linting passes: `npm run lint`
6. Open a pull request with a clear description of what changed and why

### Code Style

- TypeScript strict mode is enabled — avoid `any`
- Use `type` imports for type-only imports (`import type { ... }`)
- Keep components small and single-purpose
- CSS is plain — no preprocessors, no CSS-in-JS
- No new dependencies without strong justification — the goal is a lean, transparent bundle

---

## License

MIT License. See [LICENSE](LICENSE) for details.

---

> This project is not affiliated with, endorsed by, or connected to WhatsApp LLC or Meta Platforms, Inc. WhatsApp is a trademark of WhatsApp LLC.
