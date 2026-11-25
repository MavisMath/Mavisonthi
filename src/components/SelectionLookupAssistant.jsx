import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  BookMarked,
  BookOpen,
  Calculator,
  CheckCircle2,
  Cpu,
  ExternalLink,
  Globe,
  HelpCircle,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { MODULES } from '../constants/modules.js';
import { lookupTermOnline } from '../utils/termLookup.js';
import {
  addCustomFlashcard,
  upsertCustomGlossaryEntry,
} from '../utils/userStudyStore.js';

function getSelectionContext(selection) {
  try {
    const node = selection.anchorNode;
    const el =
      node?.nodeType === Node.TEXT_NODE ? node.parentElement : node;
    const block =
      el?.closest?.('p, li, h1, h2, h3, h4, article, section, div') || el;
    const text = (block?.textContent || '').replace(/\s+/g, ' ').trim();
    return text.slice(0, 280);
  } catch {
    return '';
  }
}

function isEditableOrDialogTarget(node) {
  const el =
    node?.nodeType === Node.TEXT_NODE ? node.parentElement : node;
  if (!el || typeof el.closest !== 'function') return false;
  return Boolean(
    el.closest('input, textarea, select, [contenteditable="true"], [role="dialog"], [data-selection-ignore="true"]')
  );
}

function slugifyTerm(term) {
  return (
    term
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || `term-${Date.now()}`
  );
}

export default function SelectionLookupAssistant({
  onOpenCustomFlashcards,
  manualTriggerTerm = null,
  onClearManualTrigger,
}) {
  const [floatingPick, setFloatingPick] = useState(null); // { term, context, top, left }
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lookupMeta, setLookupMeta] = useState(null);
  const [saveFlashcard, setSaveFlashcard] = useState(true);
  const [saveGlossary, setSaveGlossary] = useState(true);
  const [form, setForm] = useState({
    term: '',
    module: 'M3',
    tag: 'Tra mạng · Tự thêm',
    question: '',
    answer: '',
    whatIsIt: '',
    aiRole: '',
    formulaPlain: '',
    sourceUrl: '',
    sourceTitle: '',
  });
  const [toast, setToast] = useState(null);
  const lookupSeqRef = useRef(0);
  const contextRef = useRef('');

  const runOnlineLookup = useCallback(async (termToSearch, contextText = '') => {
    const cleaned = (termToSearch || '').trim();
    if (!cleaned) return;
    const seq = ++lookupSeqRef.current;
    contextRef.current = contextText;

    setModalOpen(true);
    setFloatingPick(null);
    setLoading(true);
    setLookupMeta(null);
    setForm((prev) => ({
      ...prev,
      term: cleaned,
    }));

    const result = await lookupTermOnline(cleaned, contextText);
    if (seq !== lookupSeqRef.current) return;

    setLoading(false);
    setLookupMeta({
      foundOnline: result.foundOnline,
      explainMode: result.explainMode,
      badgeLabel: result.badgeLabel,
      hasLocalMatch: result.hasLocalMatch,
      sourceLabel: result.sourceLabel,
      sourceUrl: result.sourceUrl,
      googleSearchUrl: result.googleSearchUrl,
    });
    setForm({
      term: result.term,
      module: result.module,
      tag: result.tag,
      question: result.question,
      answer: result.answer,
      whatIsIt: result.whatIsIt,
      aiRole: result.aiRole,
      formulaPlain: result.formulaPlain,
      sourceUrl: result.sourceUrl,
      sourceTitle: result.sourceTitle,
    });
  }, []);

  // Support opening modal manually from FlashcardTab "+ Tra & Thêm từ mới"
  useEffect(() => {
    if (manualTriggerTerm === null || manualTriggerTerm === undefined) return;
    if (manualTriggerTerm === '') {
      setModalOpen(true);
      setLoading(false);
      setLookupMeta(null);
      setForm({
        term: '',
        module: 'M3',
        tag: 'Tra mạng · Tự thêm',
        question: '',
        answer: '',
        whatIsIt: '',
        aiRole: '',
        formulaPlain: '',
        sourceUrl: '',
        sourceTitle: '',
      });
    } else {
      runOnlineLookup(manualTriggerTerm, '');
    }
    onClearManualTrigger?.();
  }, [manualTriggerTerm, runOnlineLookup, onClearManualTrigger]);

  // Auto-hide saved toast
  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 4500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  // Listen to global text selection to show floating "Tra mạng & Thêm Flashcard" pill
  useEffect(() => {
    const checkSelection = () => {
      if (modalOpen) return;
      const sel = window.getSelection?.();
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
        setFloatingPick(null);
        return;
      }

      if (
        isEditableOrDialogTarget(sel.anchorNode) ||
        isEditableOrDialogTarget(sel.focusNode)
      ) {
        setFloatingPick(null);
        return;
      }

      const rawText = sel.toString().replace(/\s+/g, ' ').trim();
      const cleaned = rawText.replace(
        /^[.,;:!?()[\]"'“”‘’]+|[.,;:!?()[\]"'“”‘’]+$/g,
        ''
      );

      // Ignore 1-char selections or whole paragraphs
      if (cleaned.length < 2 || cleaned.length > 64 || /\n/.test(rawText)) {
        setFloatingPick(null);
        return;
      }

      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      if (!rect || (rect.width === 0 && rect.height === 0)) {
        setFloatingPick(null);
        return;
      }

      const viewportW = window.innerWidth;
      const centerX = rect.left + rect.width / 2;
      const clampedLeft = Math.max(130, Math.min(viewportW - 130, centerX));
      const placeBelow = rect.top < 64;
      const top = placeBelow ? rect.bottom + 10 : rect.top - 48;

      setFloatingPick({
        term: cleaned,
        context: getSelectionContext(sel),
        top: Math.max(12, top),
        left: clampedLeft,
      });
    };

    const handleMouseUp = () => {
      window.setTimeout(checkSelection, 15);
    };

    const handleKeyUp = (e) => {
      if (e.key === 'Shift' || e.key.startsWith('Arrow')) {
        window.setTimeout(checkSelection, 15);
      } else if (e.key === 'Escape') {
        setFloatingPick(null);
      }
    };

    const handleScroll = () => {
      setFloatingPick(null);
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchend', handleMouseUp);
    document.addEventListener('keyup', handleKeyUp);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleMouseUp);
      document.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [modalOpen]);

  // Capture-phase keyboard guard while modal is open
  useEffect(() => {
    if (!modalOpen) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        setModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () =>
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [modalOpen]);

  const handleSave = (e) => {
    e.preventDefault();
    const term = form.term.trim();
    if (!term) return;
    if (!saveFlashcard && !saveGlossary) return;

    const slug = slugifyTerm(term);

    if (saveFlashcard) {
      addCustomFlashcard({
        id: `custom-${slug}-${Date.now().toString(36).slice(-4)}`,
        module: form.module,
        tag: form.tag.trim() || 'Tra mạng · Tự thêm',
        question:
          form.question.trim() || `${term} là gì và ứng dụng trong AI ra sao?`,
        answer:
          form.answer.trim() ||
          form.whatIsIt.trim() ||
          `${term} — thuật ngữ tự lưu.`,
        sourceUrl: form.sourceUrl,
        sourceTitle: form.sourceTitle,
        isCustom: true,
        createdAt: Date.now(),
      });
    }

    if (saveGlossary) {
      upsertCustomGlossaryEntry({
        id: `custom-kw-${slug}`,
        module: form.module,
        term,
        aliases: [term],
        whatIsIt:
          form.whatIsIt.trim() ||
          form.answer.trim() ||
          `${term} là thuật ngữ chuyên ngành AI/Khoa học dữ liệu.`,
        aiRole:
          form.aiRole.trim() ||
          'Được ứng dụng trực tiếp trong các bài toán xây dựng, tối ưu hoặc đánh giá hệ thống AI.',
        formulaPlain:
          form.formulaPlain.trim() ||
          form.answer.trim() ||
          'Ghi nhớ qua ví dụ thực tế đi kèm trong bài học.',
        sourceUrl: form.sourceUrl,
        sourceTitle: form.sourceTitle,
        isCustom: true,
      });
    }

    window.getSelection?.()?.removeAllRanges?.();
    setModalOpen(false);
    setToast({
      term,
      savedFlashcard: saveFlashcard,
      savedGlossary: saveGlossary,
    });
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <>
      {/* Floating Selection Action Pill */}
      {floatingPick && !modalOpen && (
        <div
          data-selection-ignore="true"
          style={{
            position: 'fixed',
            top: `${floatingPick.top}px`,
            left: `${floatingPick.left}px`,
            transform: 'translateX(-50%)',
          }}
          className="z-50 flex items-center gap-1 rounded-full border border-slate-700/80 bg-slate-900 px-1.5 py-1 text-white shadow-lg"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              runOnlineLookup(floatingPick.term, floatingPick.context);
            }}
            className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-blue-500"
          >
            <Sparkles className="h-3.5 w-3.5 shrink-0" />
            <span className="max-w-[200px] truncate">
              Tra mạng &amp; Thêm Flashcard: &ldquo;{floatingPick.term}&rdquo;
            </span>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setFloatingPick(null);
            }}
            aria-label="Đóng thanh chọn nhanh"
            className="inline-flex h-6 w-6 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Online Lookup + Save to Flashcard & Glossary Modal */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="selection-lookup-title"
          onClick={(e) => {
            e.stopPropagation();
            setModalOpen(false);
          }}
          onMouseDown={(e) => e.stopPropagation()}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-3 backdrop-blur-[2px] sm:p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 bg-slate-50/90 px-5 py-4">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700">
                  <Globe className="h-3 w-3" />
                  <span>Tự động tra cứu trực tuyến &amp; Lưu kho ôn thi</span>
                </div>
                <h2
                  id="selection-lookup-title"
                  className="mt-1.5 text-lg font-bold tracking-tight text-slate-900"
                >
                  Thêm thuật ngữ vào Flashcard &amp; Từ điển gạch chân
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Đóng cửa sổ tra cứu"
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form
              onSubmit={handleSave}
              className="flex flex-1 flex-col overflow-hidden"
            >
              <div className="flex-1 space-y-4 overflow-y-auto p-5">
                {/* Term Search Bar + Module Selector */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
                  <div className="sm:col-span-7">
                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                      Thuật ngữ cần tra &amp; lưu
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={form.term}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, term: e.target.value }))
                        }
                        placeholder="Ví dụ: PCA, Hessian, Embedding, HNSW..."
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        required
                      />
                      <button
                        type="button"
                        disabled={loading || !form.term.trim()}
                        onClick={() =>
                          runOnlineLookup(form.term, contextRef.current)
                        }
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
                        title="Tra cứu lại trực tuyến trên Wikipedia"
                      >
                        {loading ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Search className="h-3.5 w-3.5" />
                        )}
                        <span>Tra mạng</span>
                      </button>
                    </div>
                  </div>

                  <div className="sm:col-span-5">
                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                      Thuộc Module
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {MODULES.map((m) => (
                        <button
                          key={m.code}
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({ ...prev, module: m.code }))
                          }
                          className={`rounded-xl border py-2 font-mono text-xs font-bold transition-all ${
                            form.module === m.code
                              ? 'border-slate-900 bg-slate-900 text-white'
                              : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-white'
                          }`}
                        >
                          {m.code}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Live Online Lookup Status Banner */}
                {loading ? (
                  <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-sm text-blue-900">
                    <Loader2 className="h-5 w-5 shrink-0 animate-spin text-blue-600" />
                    <div>
                      <p className="font-semibold">
                        Đang tra cứu Wikipedia &amp; nhờ AI viết lại dễ hiểu cho &ldquo;{form.term}&rdquo;...
                      </p>
                      <p className="mt-0.5 text-xs text-blue-700">
                        Tự động lấy kiến thức chuẩn từ Wikipedia, nhờ Gemini diễn giải bình dân (timeout tối đa 5 giây — nếu chậm sẽ tự dùng ngay bản Wikipedia).
                      </p>
                    </div>
                  </div>
                ) : (
                  lookupMeta && (
                    <div
                      className={`flex flex-wrap items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-xs ${
                        lookupMeta.explainMode === 'ai'
                          ? 'border-indigo-200 bg-indigo-50/70 text-indigo-950'
                          : lookupMeta.foundOnline
                            ? 'border-teal-200 bg-teal-50/70 text-teal-900'
                            : 'border-amber-200 bg-amber-50/70 text-amber-900'
                      }`}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-semibold ${
                            lookupMeta.explainMode === 'ai'
                              ? 'bg-indigo-600 text-white'
                              : lookupMeta.foundOnline
                                ? 'bg-teal-600 text-white'
                                : 'bg-amber-600 text-white'
                          }`}
                        >
                          {lookupMeta.badgeLabel || '🌐 Wikipedia'}
                        </span>
                        <span className="text-slate-700">
                          {lookupMeta.sourceLabel}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {lookupMeta.sourceUrl && (
                          <a
                            href={lookupMeta.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            <span>Wikipedia</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                        <a
                          href={lookupMeta.googleSearchUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 font-medium text-slate-700 hover:bg-slate-50"
                        >
                          <span>Google</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  )
                )}

                {/* Destination Checkboxes */}
                <div className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200/80 bg-slate-50/70 px-3.5 py-2.5 text-xs">
                  <label className="inline-flex cursor-pointer items-center gap-2 font-semibold text-slate-800">
                    <input
                      type="checkbox"
                      checked={saveFlashcard}
                      onChange={(e) => setSaveFlashcard(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <BookMarked className="h-3.5 w-3.5 text-blue-600" />
                    <span>Thêm vào Tab Flashcard Phản xạ</span>
                  </label>
                  <label className="inline-flex cursor-pointer items-center gap-2 font-semibold text-slate-800">
                    <input
                      type="checkbox"
                      checked={saveGlossary}
                      onChange={(e) => setSaveGlossary(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <BookOpen className="h-3.5 w-3.5 text-teal-600" />
                    <span>Gạch chân giải thích từ này trên toàn web</span>
                  </label>
                </div>

                {/* Flashcard Front & Back Preview/Editor */}
                {saveFlashcard && (
                  <div className="space-y-2.5 rounded-xl border border-slate-200/90 bg-white p-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Nội dung thẻ Flashcard (có thể chỉnh sửa trước khi lưu)
                    </p>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600">
                        Mặt trước (Câu hỏi)
                      </label>
                      <input
                        type="text"
                        value={form.question}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            question: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600">
                        Mặt sau (Đáp án ngắn gọn)
                      </label>
                      <textarea
                        rows={3}
                        value={form.answer}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            answer: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm leading-relaxed text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* 3-Part Non-Tech Glossary Explanation (matches built-in glossary) */}
                {saveGlossary && (
                  <div className="space-y-3 rounded-xl border border-slate-200/90 bg-white p-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      3 phần giải thích khi bấm vào từ gạch chân (giống kho có sẵn)
                    </p>

                    <div className="rounded-xl border border-blue-100 bg-blue-50/45 p-3">
                      <label className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-800">
                        <HelpCircle className="h-3.5 w-3.5 text-blue-600" />
                        <span>1. Nó là gì?</span>
                      </label>
                      <textarea
                        rows={2}
                        value={form.whatIsIt}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            whatIsIt: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-blue-200/70 bg-white px-3 py-2 text-xs leading-relaxed text-slate-800 focus:border-blue-500 focus:outline-none sm:text-sm"
                      />
                    </div>

                    <div className="rounded-xl border border-indigo-100 bg-indigo-50/45 p-3">
                      <label className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-800">
                        <Cpu className="h-3.5 w-3.5 text-indigo-600" />
                        <span>2. Vai trò trong AI</span>
                      </label>
                      <textarea
                        rows={2}
                        value={form.aiRole}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            aiRole: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-indigo-200/70 bg-white px-3 py-2 text-xs leading-relaxed text-slate-800 focus:border-indigo-500 focus:outline-none sm:text-sm"
                      />
                    </div>

                    <div className="rounded-xl border border-teal-200/80 bg-teal-50/45 p-3">
                      <label className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-800">
                        <Calculator className="h-3.5 w-3.5 text-teal-600" />
                        <span>3. Cách tính / Mẹo nhớ nhanh</span>
                      </label>
                      <textarea
                        rows={2}
                        value={form.formulaPlain}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            formulaPlain: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-teal-200/80 bg-white px-3 py-2 text-xs leading-relaxed text-slate-800 focus:border-teal-500 focus:outline-none sm:text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/80 px-5 py-3.5">
                <button
                  type="button"
                  disabled={loading || !form.term.trim()}
                  onClick={() => runOnlineLookup(form.term, contextRef.current)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-45"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Tra cứu lại</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={
                      loading ||
                      !form.term.trim() ||
                      (!saveFlashcard && !saveGlossary)
                    }
                    className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Lưu vào Flashcard &amp; Từ điển</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Save Confirmation Toast */}
      {toast && (
        <div
          data-selection-ignore="true"
          className="fixed right-4 bottom-5 z-50 flex max-w-md items-center gap-3 rounded-2xl border border-teal-200 bg-white px-4 py-3 text-xs text-slate-800 shadow-lg"
        >
          <CheckCircle2 className="h-5 w-5 shrink-0 text-teal-600" />
          <div className="min-w-0 flex-1">
            <p className="font-bold text-slate-900">
              Đã lưu &ldquo;{toast.term}&rdquo; thành công!
            </p>
            <p className="mt-0.5 text-slate-600">
              {toast.savedFlashcard && toast.savedGlossary
                ? 'Đã thêm vào Flashcard và tự động gạch chân giải thích trên web.'
                : toast.savedFlashcard
                  ? 'Đã thêm vào kho Flashcard của bạn.'
                  : 'Đã tự động gạch chân giải thích trên web.'}
            </p>
          </div>
          {toast.savedFlashcard && onOpenCustomFlashcards && (
            <button
              type="button"
              onClick={() => {
                setToast(null);
                onOpenCustomFlashcards();
              }}
              className="shrink-0 rounded-lg bg-slate-900 px-2.5 py-1.5 font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Mở Flashcard
            </button>
          )}
          <button
            type="button"
            onClick={() => setToast(null)}
            aria-label="Đóng thông báo"
            className="text-slate-400 hover:text-slate-700"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </>,
    document.body
  );
}
