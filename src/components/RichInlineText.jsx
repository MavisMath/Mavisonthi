export default function RichInlineText({ text, className = '' }) {
  if (!text || typeof text !== 'string') return null;

  const parts = text.split(/(`[^`]+`)/g);

  return (
    <span className={`whitespace-pre-line ${className}`}>
      {parts.map((part, idx) => {
        if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
          return (
            <code
              key={idx}
              className="mx-0.5 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.86em] font-medium text-slate-800"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        return <span key={idx}>{part}</span>;
      })}
    </span>
  );
}
