export type MessageType = 'text' | 'media' | 'system';

export type MediaKind = 'image' | 'video' | 'gif' | 'audio' | 'unknown';

export interface Message {
  id: string;
  type: MessageType;
  sender: string;
  timestamp: Date;
  text: string;
  mediaFilename?: string;
  mediaIndex?: number;
  mediaKind?: MediaKind;
  reactions?: string[]; // list of emoji reactions
}

export interface ParsedChat {
  messages: Message[];
  participants: string[];
}
