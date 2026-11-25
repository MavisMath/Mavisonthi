import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Code2,
  Copy,
  Eye,
  EyeOff,
  RotateCcw,
  Terminal,
} from 'lucide-react';
import {
  loadPythonProgress,
  savePythonProgress,
} from '../utils/storage.js';
import RichInlineText from './RichInlineText.jsx';

export default function PythonTab({ pythonTasks = [], onBackToOverview }) {
  const [progress, setProgress] = useState(() => loadPythonProgress());
  const [selectedTaskId, setSelectedTaskId] = useState(
    () => pythonTasks[0]?.id ?? null
  );
  const [revealedByTask, setRevealedByTask] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  const solutionRef = useRef(null);

  // Persist Python progress (checked criteria + draft code) to localStorage
  useEffect(() => {
    savePythonProgress(progress);
  }, [progress]);

  // Clear copy badge gently
  useEffect(() => {
    if (!copiedId) return undefined;
    const timer = window.setTimeout(() => setCopiedId(null), 1600);
    return () => window.clearTimeout(timer);
  }, [copiedId]);

  const currentTask = useMemo(
    () =>
      pythonTasks.find((t) => t.id === selectedTaskId) ??
      pythonTasks[0] ??
      null,
    [pythonTasks, selectedTaskId]
  );

  // Compute completion metrics across all tasks
  const overallStats = useMemo(() => {
    let completedTasks = 0;
    let totalChecks = 0;
    let tickedChecks = 0;

    for (const task of pythonTasks) {
      const checklistLen = task.checklist?.length ?? 0;
      const savedChecks = (progress[task.id]?.checkedIndices ?? []).filter(
        (idx) => idx >= 0 && idx < checklistLen
      );
      totalChecks += checklistLen;
      tickedChecks += savedChecks.length;
      if (checklistLen > 0 && savedChecks.length === checklistLen) {
        completedTasks += 1;
      }
    }

    const percent =
      pythonTasks.length > 0
        ? Math.round((completedTasks / pythonTasks.length) * 100)
        : 0;

    return {
      completedTasks,
      totalTasks: pythonTasks.length,
      tickedChecks,
      totalChecks,
      percent,
    };
  }, [pythonTasks, progress]);

  if (!currentTask) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
        Chưa có bài tập Code tay Python nào trong <code>src/data/examData.json</code>.
      </div>
    );
  }

  const taskProgress = progress[currentTask.id] ?? {};
  const currentCode =
    typeof taskProgress.code === 'string'
      ? taskProgress.code
      : currentTask.starterCode ?? '';
  const checklist = currentTask.checklist ?? [];
  const checkedSet = new Set(
    (taskProgress.checkedIndices ?? []).filter(
      (idx) => idx >= 0 && idx < checklist.length
    )
  );
  const isRevealed = Boolean(revealedByTask[currentTask.id]);
  const isTaskComplete =
    checklist.length > 0 && checkedSet.size === checklist.length;

  const updateTaskCode = (taskId, nextCode) => {
    setProgress((prev) => ({
      ...prev,
      [taskId]: {
        checkedIndices: prev[taskId]?.checkedIndices ?? [],
        code: nextCode,
      },
    }));
  };

  const handleToggleCheck = (idx) => {
    const taskId = currentTask.id;
    setProgress((prev) => {
      const existing = prev[taskId] ?? { checkedIndices: [] };
      const set = new Set(existing.checkedIndices ?? []);
      if (set.has(idx)) set.delete(idx);
      else set.add(idx);
      return {
        ...prev,
        [taskId]: {
          ...existing,
          checkedIndices: [...set].sort((a, b) => a - b),
        },
      };
    });
  };

  const handleResetStarterCode = () => {
    updateTaskCode(currentTask.id, currentTask.starterCode ?? '');
  };

  const handleToggleReveal = () => {
    const nextOpen = !isRevealed;
    setRevealedByTask((prev) => ({
      ...prev,
      [currentTask.id]: nextOpen,
    }));
    if (nextOpen) {
      window.requestAnimationFrame(() => {
        solutionRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      });
    }
  };

  const handleCopySolution = async () => {
    try {
      await navigator.clipboard.writeText(currentTask.solutionCode ?? '');
      setCopiedId(currentTask.id);
    } catch {
      // Clipboard API unavailable
    }
  };

  // Support Tab (4-space indent) and Shift+Tab (4-space outdent) inside textarea
  const handleCodeKeyDown = (e) => {
    if (e.key !== 'Tab') return;
    e.preventDefault();

    const el = e.currentTarget;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const value = currentCode;

    if (start === end && !e.shiftKey) {
      const nextValue = `${value.slice(0, start)}    ${value.slice(end)}`;
      updateTaskCode(currentTask.id, nextValue);
      window.requestAnimationFrame(() => {
        el.selectionStart = start + 4;
        el.selectionEnd = start + 4;
      });
      return;
    }

    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const lineEndIndex = value.indexOf('\n', end);
    const lineEnd = lineEndIndex === -1 ? value.length : lineEndIndex;
    const block = value.slice(lineStart, lineEnd);
    const lines = block.split('\n');

    if (e.shiftKey) {
      let removedFirst = 0;
      let totalRemoved = 0;
      const updatedLines = lines.map((line, idx) => {
        const match = line.match(/^ {1,4}/);
        const cut = match ? match[0].length : 0;
        if (idx === 0) removedFirst = cut;
        totalRemoved += cut;
        return line.slice(cut);
      });
      const nextValue =
        value.slice(0, lineStart) +
        updatedLines.join('\n') +
        value.slice(lineEnd);
      updateTaskCode(currentTask.id, nextValue);
      window.requestAnimationFrame(() => {
        el.selectionStart = Math.max(lineStart, start - removedFirst);
        el.selectionEnd = Math.max(lineStart, end - totalRemoved);
      });
    } else {
      const updatedLines = lines.map((line) => `    ${line}`);
      const nextValue =
        value.slice(0, lineStart) +
        updatedLines.join('\n') +
        value.slice(lineEnd);
      updateTaskCode(currentTask.id, nextValue);
      window.requestAnimationFrame(() => {
        el.selectionStart = start + 4;
        el.selectionEnd = end + lines.length * 4;
      });
    }
  };

  const lineCount = currentCode.split('\n').length;

  return (
    <div className="space-y-6">
      {/* Header & Overall Progress */}
      <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          {onBackToOverview && (
            <button
              type="button"
              onClick={onBackToOverview}
              className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-slate-900"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Quay lại Tổng quan</span>
            </button>
          )}
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Sân tập Code tay Python
          </h1>
          <p className="mt-0.5 text-sm text-slate-600">
            Gõ code thuần không gợi ý trình duyệt (hỗ trợ phím{' '}
            <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 font-mono text-xs text-slate-700">
              Tab
            </kbd>{' '}
            thụt lề 4 dấu cách), đối chiếu đáp án và tự chấm checklist edge case.
          </p>
        </div>

        {/* Saved Progress Summary Pill */}
        <div className="flex items-center gap-4 self-start rounded-2xl border border-slate-200/90 bg-white px-4 py-3 shadow-2xs lg:self-auto">
          <div>
            <p className="text-[11px] font-medium text-slate-500">
              Hoàn thành bài tập
            </p>
            <p className="font-mono text-base font-bold text-slate-900 tabular-nums">
              {overallStats.completedTasks} / {overallStats.totalTasks} bài
            </p>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div>
            <p className="text-[11px] font-medium text-slate-500">
              Tiêu chí đã tích
            </p>
            <p className="font-mono text-base font-bold text-emerald-700 tabular-nums">
              {overallStats.tickedChecks} / {overallStats.totalChecks}
            </p>
          </div>
        </div>
      </div>

      {/* Task Selector Pills */}
      <section
        aria-label="Danh sách bài tập Python"
        className="flex flex-wrap items-center gap-2"
      >
        {pythonTasks.map((task, idx) => {
          const isSelected = task.id === currentTask.id;
          const total = task.checklist?.length ?? 0;
          const ticked = (progress[task.id]?.checkedIndices ?? []).filter(
            (n) => n >= 0 && n < total
          ).length;
          const done = total > 0 && ticked === total;

          return (
            <button
              key={task.id}
              type="button"
              onClick={() => setSelectedTaskId(task.id)}
              className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all ${
                isSelected
                  ? 'border-slate-900 bg-slate-900 text-white shadow-2xs'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span
                className={`font-mono text-[11px] ${
                  isSelected ? 'text-blue-300' : 'text-slate-400'
                }`}
              >
                Bài {idx + 1}
              </span>
              <span className="max-w-[240px] truncate">{task.title}</span>
              {done ? (
                <CheckCircle2
                  className={`h-3.5 w-3.5 shrink-0 ${
                    isSelected ? 'text-emerald-300' : 'text-emerald-600'
                  }`}
                />
              ) : (
                <span
                  className={`rounded px-1.5 py-0.5 font-mono text-[10px] tabular-nums ${
                    isSelected
                      ? 'bg-white/15 text-slate-200'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {ticked}/{total}
                </span>
              )}
            </button>
          );
        })}
      </section>

      {/* Main 2-Column Workspace: Left = Prompt, Right = Hand-coding Textarea */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Left Column: Task Prompt */}
        <article className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs lg:col-span-5">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-mono text-xs font-semibold text-emerald-700">
                  <Code2 className="h-3.5 w-3.5" />
                  <span>{currentTask.id}</span>
                </span>
                <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-medium text-slate-600">
                  M2 · Python
                </span>
              </div>

              {isTaskComplete && (
                <span className="inline-flex items-center gap-1 rounded-full border border-teal-200 bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-800">
                  <CheckCircle2 className="h-3.5 w-3.5 text-teal-600" />
                  <span>Đã hoàn thành</span>
                </span>
              )}
            </div>

            <h2 className="mt-4 text-lg font-bold leading-snug text-slate-900">
              {currentTask.title}
            </h2>

            <div className="mt-4 text-sm leading-relaxed text-slate-700">
              <RichInlineText text={currentTask.prompt} />
            </div>
          </div>

          <div className="mt-6 space-y-3 border-t border-slate-100 pt-5">
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/75 p-3.5 text-xs leading-relaxed text-slate-600">
              <p className="font-semibold text-slate-800">Lưu ý phòng thi thật:</p>
              <ul className="mt-1.5 list-disc space-y-1 pl-4">
                <li>
                  Ô gõ code đã tắt hoàn toàn gợi ý chỉnh tả/tự điền (
                  <code className="font-mono text-slate-700">spellCheck</code>,{' '}
                  <code className="font-mono text-slate-700">autoComplete</code>,{' '}
                  <code className="font-mono text-slate-700">autoCorrect</code>).
                </li>
                <li>
                  Bấm <code className="font-mono text-slate-700">Tab</code> để thụt
                  lề 4 dấu cách, <code className="font-mono text-slate-700">Shift+Tab</code>{' '}
                  để lùi lề.
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={handleToggleReveal}
              className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                isRevealed
                  ? 'border border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200/80'
                  : 'bg-slate-900 text-white shadow-2xs hover:bg-blue-700'
              }`}
            >
              {isRevealed ? (
                <>
                  <EyeOff className="h-4 w-4" />
                  <span>Ẩn đáp án & Checklist</span>
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  <span>Xem đáp án & Tự chấm</span>
                </>
              )}
            </button>
          </div>
        </article>

        {/* Right Column: JetBrains Mono Hand-coding Textarea */}
        <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs lg:col-span-7">
          {/* Editor Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 bg-slate-50/80 px-4 py-3">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-slate-500" />
              <span className="font-mono text-xs font-semibold text-slate-700">
                solution_{currentTask.id}.py
              </span>
              <span className="rounded bg-white px-2 py-0.5 font-mono text-[11px] text-slate-500 ring-1 ring-slate-200">
                Tab = 4 spaces
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] text-slate-400 tabular-nums">
                {lineCount} dòng
              </span>
              <button
                type="button"
                onClick={handleResetStarterCode}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                title="Khôi phục khung hàm ban đầu"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Khôi phục khung</span>
              </button>
            </div>
          </div>

          {/* Code Textarea */}
          <textarea
            aria-label="Ô nhập code tay Python"
            value={currentCode}
            onChange={(e) => updateTaskCode(currentTask.id, e.target.value)}
            onKeyDown={handleCodeKeyDown}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            rows={15}
            placeholder="# Viết code tay Python của bạn tại đây..."
            className="min-h-[340px] w-full flex-1 resize-y bg-white p-5 font-mono text-sm leading-6 text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />

          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/60 px-4 py-2 text-[11px] text-slate-500">
            <span>Nháp code của bạn được lưu tự động trên trình duyệt.</span>
            <span className="font-mono">JetBrains Mono · UTF-8</span>
          </div>
        </div>
      </section>

      {/* Solution & Self-Grading Checklist Panel */}
      {isRevealed && (
        <section
          ref={solutionRef}
          aria-label="Đáp án mẫu và Checklist tự chấm"
          className="grid grid-cols-1 gap-5 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs lg:grid-cols-12"
        >
          {/* Solution Code */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                Đáp án mẫu (Solution Code)
              </h3>
              <button
                type="button"
                onClick={handleCopySolution}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100"
              >
                {copiedId === currentTask.id ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-teal-600" />
                    <span className="text-teal-700">Đã sao chép</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Sao chép</span>
                  </>
                )}
              </button>
            </div>

            <pre className="mt-3 overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs leading-6 text-slate-800 sm:text-[13px]">
              <code>{currentTask.solutionCode}</code>
            </pre>
          </div>

          {/* Interactive Self-Check Checklist */}
          <div className="flex flex-col justify-between lg:col-span-5">
            <div>
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-slate-900">
                  Checklist tự chấm Edge Case
                </h3>
                <span
                  className={`rounded-md px-2 py-0.5 font-mono text-xs font-semibold tabular-nums ${
                    isTaskComplete
                      ? 'bg-teal-50 text-teal-800 ring-1 ring-inset ring-teal-200'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {checkedSet.size} / {checklist.length} đạt
                </span>
              </div>

              <div className="mt-3 space-y-2.5">
                {checklist.map((criterion, idx) => {
                  const isChecked = checkedSet.has(idx);
                  return (
                    <label
                      key={idx}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 text-sm leading-relaxed transition-all ${
                        isChecked
                          ? 'border-teal-300 bg-teal-50/75 text-teal-950'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/70'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleCheck(idx)}
                        className="mt-1 h-4 w-4 shrink-0 cursor-pointer rounded border-slate-300 accent-teal-600"
                      />
                      <span>
                        <RichInlineText text={criterion} />
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              Tiến độ tích chọn của từng bài được tự động lưu vào{' '}
              <code className="font-mono text-slate-700">localStorage</code>.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
