import type { Message, ParsedChat, MediaKind } from '../types';

const LINE_REGEX = /^[\u200e\u200f]?\[?(\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4}),\s*(\d{1,2}:\d{2}(?::\d{2})?(?:\s?[AaPp][Mm])?)\]?\s*[-\u2013\u2014]\s*(.*)/;

const MEDIA_OMITTED_KEYWORDS = [
  'media omitted', 'image omitted', 'video omitted', 'audio omitted',
  'gif omitted', 'sticker omitted', 'document omitted', 'photo omitted',
];

const FILE_ATTACHED_REGEX = /^(.+\.(jpg|jpeg|png|gif|mp4|mov|avi|mkv|mp3|ogg|opus|wav|m4a|pdf|doc|docx|vcf|webp|heic))\s*\(file attached\)$/i;

// e.g. "Rohit reacted ❤ to "some text"" or with curly quotes
const REACTION_REGEX = /^.+? reacted (.+?) to ["\u201c].+["\u201d]$/;

function isMediaOmitted(text: string): boolean {
  const lower = text.toLowerCase();
  return MEDIA_OMITTED_KEYWORDS.some((k) => lower.includes(k));
}

function isReaction(text: string): string | null {
  const match = text.match(REACTION_REGEX);
  if (!match) return null;
  const emoji = match[1].trim();
  // emoji should be short (1-8 chars)
  return emoji.length <= 8 ? emoji : null;
}

function guessMediaKindFromText(text: string): MediaKind {
  const t = text.toLowerCase();
  if (t.includes('video') || /\.(mp4|mov|avi|mkv)(\s|$)/i.test(t)) return 'video';
  if (t.includes('gif')) return 'gif';
  if (t.includes('audio') || /\.(mp3|ogg|opus|wav|m4a)(\s|$)/i.test(t)) return 'audio';
  return 'image';
}

function guessMediaKindFromFilename(filename: string): MediaKind {
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';
  if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext)) return 'video';
  if (ext === 'gif') return 'gif';
  if (['mp3', 'ogg', 'opus', 'wav', 'm4a'].includes(ext)) return 'audio';
  if (['jpg', 'jpeg', 'png', 'webp', 'heic'].includes(ext)) return 'image';
  return 'unknown';
}

function decodeEntities(text: string): string {
  return text
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ');
}

function parseTimestamp(datePart: string, timePart: string): Date {
  const normalized = datePart.replace(/[.\-]/g, '/');
  const parts = normalized.split('/').map(Number);
  if (parts.length !== 3) return new Date();
  const [a, b, c] = parts;
  const year = c > 99 ? c : c + 2000;
  const isPM = /pm/i.test(timePart);
  const isAM = /am/i.test(timePart);
  const cleanTime = timePart.replace(/\s?[AaPp][Mm]/, '').trim();
  const tp = cleanTime.split(':');
  let hours = parseInt(tp[0]);
  const minutes = parseInt(tp[1] ?? '0');
  const seconds = parseInt(tp[2] ?? '0');
  if (isPM && hours !== 12) hours += 12;
  if (isAM && hours === 12) hours = 0;
  if (b >= 1 && b <= 12) return new Date(year, b - 1, a, hours, minutes, seconds);
  return new Date(year, a - 1, b, hours, minutes, seconds);
}

export function parseChat(raw: string): ParsedChat {
  const lines = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  const messages: Message[] = [];
  const participantSet = new Set<string>();
  let mediaOmittedCount = 0;
  let current: (Partial<Message> & { type?: Message['type'] }) | null = null;

  const pushCurrent = () => {
    if (!current?.timestamp) return;
    messages.push({
      id: `msg-${messages.length}`,
      type: current.type ?? 'text',
      sender: current.sender ?? '',
      timestamp: current.timestamp,
      text: decodeEntities((current.text ?? '').trim()),
      ...(current.mediaFilename !== undefined && { mediaFilename: current.mediaFilename }),
      ...(current.mediaIndex !== undefined && { mediaIndex: current.mediaIndex }),
      ...(current.mediaKind !== undefined && { mediaKind: current.mediaKind }),
    } as Message);
  };

  for (const line of lines) {
    const match = line.match(LINE_REGEX);

    if (match) {
      pushCurrent();
      const datePart = match[1];
      const timePart = match[2];
      const rest = match[3].trim();
      const timestamp = parseTimestamp(datePart, timePart);
      const colonIdx = rest.indexOf(': ');

      if (colonIdx !== -1 && colonIdx <= 50) {
        const sender = rest.slice(0, colonIdx).trim();
        const text = rest.slice(colonIdx + 2).trim();

        // Check if this is a reaction line
        const emoji = isReaction(text);
        if (emoji) {
          // Attach reaction to the last non-system message
          for (let i = messages.length - 1; i >= 0; i--) {
            if (messages[i].type !== 'system') {
              if (!messages[i].reactions) messages[i].reactions = [];
              messages[i].reactions!.push(emoji);
              break;
            }
          }
          current = null;
          continue;
        }

        participantSet.add(sender);

        if (isMediaOmitted(text)) {
          current = {
            type: 'media', sender, timestamp, text,
            mediaIndex: mediaOmittedCount++,
            mediaKind: guessMediaKindFromText(text),
          };
        } else if (FILE_ATTACHED_REGEX.test(text)) {
          const filenameMatch = text.match(FILE_ATTACHED_REGEX);
          const filename = filenameMatch![1].trim();
          current = {
            type: 'media', sender, timestamp,
            text: filename, mediaFilename: filename,
            mediaKind: guessMediaKindFromFilename(filename),
          };
        } else {
          current = { type: 'text', sender, timestamp, text };
        }
      } else {
        current = { type: 'system', sender: '', timestamp, text: rest };
      }
    } else if (current && line.trim()) {
      current.text = (current.text ?? '') + '\n' + line;
    }
  }

  pushCurrent();
  return { messages, participants: Array.from(participantSet) };
}
