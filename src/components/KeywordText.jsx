import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  BookOpen,
  Calculator,
  Cpu,
  ExternalLink,
  Globe,
  HelpCircle,
  Trash2,
  X,
} from 'lucide-react';
import { MODULES } from '../constants/modules.js';
import {
  removeCustomGlossaryEntry,
  useGlossaryMatcher,
} from '../utils/userStudyStore.js';
import RichInlineText from './RichInlineText.jsx';

const MODULE_MAP = Object.fromEntries(MODULES.map((m) => [m.code, m]));

export function KeywordModal({ entry, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      } else if (
        e.code === 'Space' ||
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowRight' ||
        e.key === '1' ||
        e.key === '2' ||
        e.key === '3'
      ) {
        // Prevent background Flashcard keyboard shortcuts while reading explanation
        e.preventDefault();
        e.stopPropagation();
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () =>
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [onClose]);

  if (typeof document === 'undefined') return null;

  const modMeta = MODULE_MAP[entry.module];

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="keyword-modal-title"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
      onMouseDown={(e) => e.stopPropagation()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-[2px]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 bg-slate-50/80 px-5 py-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-[11px] font-semibold ${
                  modMeta?.badgeClass ??
                  'border-slate-200 bg-slate-100 text-slate-700'
                }`}
              >
                {entry.module}
              </span>
              {entry.isCustom ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-teal-200 bg-teal-50 px-2 py-0.5 text-[11px] font-semibold text-teal-800">
                  <Globe className="h-3 w-3" />
                  <span>Tự thêm · Tra mạng</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-blue-700">
                  <BookOpen className="h-3 w-3" />
                  <span>Giải thích nhanh cho Non-tech</span>
                </span>
              )}
            </div>
            <h3
              id="keyword-modal-title"
              className="mt-1.5 text-lg font-bold tracking-tight text-slate-900"
            >
              {entry.term}
            </h3>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Đóng giải thích"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* 3 Core Explanation Sections */}
        <div className="max-h-[75vh] space-y-3.5 overflow-y-auto p-5 text-left">
          {/* 1. Nó là gì? */}
          <div className="rounded-xl border border-blue-100 bg-blue-50/55 p-3.5">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-800">
              <HelpCircle className="h-3.5 w-3.5 text-blue-600" />
              <span>Nó là gì?</span>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-800">
              <RichInlineText text={entry.whatIsIt} />
            </p>
          </div>

          {/* 2. Vai trò trong AI */}
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/55 p-3.5">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-800">
              <Cpu className="h-3.5 w-3.5 text-indigo-600" />
              <span>Vai trò trong AI</span>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-800">
              <RichInlineText text={entry.aiRole} />
            </p>
          </div>

          {/* 3. Cách tính (lấy gì +/-/×/÷ gì) */}
          <div className="rounded-xl border border-teal-200/80 bg-teal-50/55 p-3.5">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-800">
              <Calculator className="h-3.5 w-3.5 text-teal-600" />
              <span>Cách tính (lấy gì + / − / × / ÷ gì)</span>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-800">
              <RichInlineText text={entry.formulaPlain} />
            </p>
          </div>

          {/* External Source Link for Custom Online-Fetched Entries */}
          {entry.sourceUrl && (
            <div className="flex items-center justify-between gap-2 rounded-xl border border-slate-200/80 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-600">
              <span className="truncate">
                Nguồn trực tuyến: <strong>{entry.sourceTitle || 'Wikipedia'}</strong>
              </span>
              <a
                href={entry.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex shrink-0 items-center gap-1 font-semibold text-blue-700 hover:underline"
              >
                <span>Mở bài viết</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/60 px-5 py-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            {entry.isCustom ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeCustomGlossaryEntry(entry.id);
                  onClose();
                }}
                className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-100"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Xóa từ tự thêm</span>
              </button>
            ) : (
              <span>
                Nhấn{' '}
                <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 font-mono text-[11px] font-medium text-slate-700">
                  Esc
                </kbd>{' '}
                hoặc bấm ra ngoài để đóng
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

function renderWithKeywords(segment, keyPrefix, matcher, onPickEntry) {
  if (!segment || !matcher?.regex) return segment || null;
  const parts = segment.split(matcher.regex);

  return parts.map((part, idx) => {
    if (!part) return null;
    const key = part.trim().toLowerCase().replace(/\s*\+\s*/g, '+');
    const entry = matcher.lookup.get(key);
    if (!entry) {
      return <span key={`${keyPrefix}-p-${idx}`}>{part}</span>;
    }

    return (
      <span
        key={`${keyPrefix}-kw-${idx}`}
        role="button"
        tabIndex={0}
        title={`Bấm để xem giải thích: ${entry.term}`}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onPickEntry(entry);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            onPickEntry(entry);
          }
        }}
        className={`border-b border-dashed cursor-pointer rounded-[2px] font-medium text-inherit transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400/60 ${
          entry.isCustom
            ? 'border-teal-500 hover:bg-teal-50/90 hover:text-teal-700'
            : 'border-blue-500 hover:bg-blue-50/90 hover:text-blue-700'
        }`}
      >
        {part}
      </span>
    );
  });
}

function renderInlineFormatted(segment, keyPrefix, matcher, onPickEntry) {
  const codeParts = segment.split(/(`[^`]+`)/g);
  return codeParts.map((part, idx) => {
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      const inner = part.slice(1, -1);
      return (
        <code
          key={`${keyPrefix}-code-${idx}`}
          className="mx-0.5 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.86em] font-medium text-slate-800"
        >
          {renderWithKeywords(inner, `${keyPrefix}-code-${idx}`, matcher, onPickEntry)}
        </code>
      );
    }
    return renderWithKeywords(part, `${keyPrefix}-txt-${idx}`, matcher, onPickEntry);
  });
}

export default function KeywordText({ text, className = '' }) {
  const matcher = useGlossaryMatcher();
  const [activeEntry, setActiveEntry] = useState(null);

  if (!text || typeof text !== 'string') return null;

  const tokens = text.split(/(`[^`]+`|\*\*[^\n]+?\*\*)/g);

  return (
    <>
      <span className={`whitespace-pre-line ${className}`}>
        {tokens.map((token, idx) => {
          if (token.startsWith('`') && token.endsWith('`') && token.length > 2) {
            const inner = token.slice(1, -1);
            return (
              <code
                key={`c-${idx}`}
                className="mx-0.5 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.86em] font-medium text-slate-800"
              >
                {renderWithKeywords(inner, `c-${idx}`, matcher, setActiveEntry)}
              </code>
            );
          }
          if (token.startsWith('**') && token.endsWith('**') && token.length > 4) {
            return (
              <strong key={`b-${idx}`} className="font-semibold text-slate-900">
                {renderInlineFormatted(
                  token.slice(2, -2),
                  `b-${idx}`,
                  matcher,
                  setActiveEntry
                )}
              </strong>
            );
          }
          return (
            <span key={`t-${idx}`}>
              {renderWithKeywords(token, `t-${idx}`, matcher, setActiveEntry)}
            </span>
          );
        })}
      </span>

      {activeEntry && (
        <KeywordModal
          entry={activeEntry}
          onClose={() => setActiveEntry(null)}
        />
      )}
    </>
  );
}
