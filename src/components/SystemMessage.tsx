interface Props {
  text: string;
}

export default function SystemMessage({ text }: Props) {
  return (
    <div className="system-message-wrapper">
      <span className="system-message">{text}</span>
    </div>
  );
}
