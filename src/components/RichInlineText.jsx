function renderCodeSpans(segment, keyPrefix) {
  const parts = segment.split(/(`[^`]+`)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code
          key={`${keyPrefix}-c-${idx}`}
          className="mx-0.5 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.86em] font-medium text-slate-800"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={`${keyPrefix}-t-${idx}`}>{part}</span>;
  });
}

export default function RichInlineText({ text, className = '' }) {
  if (!text || typeof text !== 'string') return null;

  const tokens = text.split(/(`[^`]+`|\*\*[^\n]+?\*\*)/g);

  return (
    <span className={`whitespace-pre-line ${className}`}>
      {tokens.map((token, idx) => {
        if (token.startsWith('`') && token.endsWith('`') && token.length > 2) {
          return (
            <code
              key={`c-${idx}`}
              className="mx-0.5 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.86em] font-medium text-slate-800"
            >
              {token.slice(1, -1)}
            </code>
          );
        }
        if (token.startsWith('**') && token.endsWith('**') && token.length > 4) {
          return (
            <strong key={`b-${idx}`} className="font-semibold text-slate-900">
              {renderCodeSpans(token.slice(2, -2), `b-${idx}`)}
            </strong>
          );
        }
        return <span key={`t-${idx}`}>{token}</span>;
      })}
    </span>
  );
}
