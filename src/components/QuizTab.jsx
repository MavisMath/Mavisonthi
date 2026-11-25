import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  Award,
  BookOpenCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Layers,
  Play,
  RotateCcw,
  Send,
  ShieldAlert,
  Sparkles,
  Trash2,
  XCircle,
} from 'lucide-react';
import { MODULES } from '../constants/modules.js';
import {
  MOCK_EXAM_DURATION_SECONDS,
  buildWeightedMockExam,
  formatCountdown,
  gradeMockExam,
} from '../utils/quiz.js';
import { loadWrongQuizIds, saveWrongQuizIds } from '../utils/storage.js';
import RichInlineText from './RichInlineText.jsx';

const MODULE_MAP = Object.fromEntries(MODULES.map((m) => [m.code, m]));
const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

function FeedbackBox({ quiz, isCorrect, extraNotice }) {
  return (
    <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">
      {/* Correct / Wrong status banner */}
      <div
        className={`flex flex-wrap items-center justify-between gap-2 rounded-xl border px-4 py-3 text-sm font-semibold ${
          isCorrect
            ? 'border-teal-200 bg-teal-50/90 text-teal-900'
            : 'border-rose-200 bg-rose-50/90 text-rose-900'
        }`}
      >
        <span className="inline-flex items-center gap-2">
          {isCorrect ? (
            <CheckCircle2 className="h-4.5 w-4.5 text-teal-600" />
          ) : (
            <XCircle className="h-4.5 w-4.5 text-rose-600" />
          )}
          <span>
            {isCorrect
              ? 'Chính xác!'
              : `Chưa chính xác — Đáp án đúng là ${OPTION_LETTERS[quiz.correctIndex]}`}
          </span>
        </span>
        {extraNotice && (
          <span className="font-mono text-xs font-medium opacity-85">
            {extraNotice}
          </span>
        )}
      </div>

      {/* Explanation */}
      {quiz.explanation && (
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-4 text-sm leading-relaxed text-slate-700">
          <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <BookOpenCheck className="h-3.5 w-3.5 text-blue-600" />
            <span>Giải thích chi tiết</span>
          </div>
          <RichInlineText text={quiz.explanation} />
        </div>
      )}

      {/* Trap note */}
      {quiz.trapNote && (
        <div className="rounded-xl border border-amber-200/90 bg-amber-50/75 p-4 text-sm leading-relaxed text-amber-950">
          <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-700">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
            <span>Bẫy kinh điển cần tránh</span>
          </div>
          <RichInlineText text={quiz.trapNote} />
        </div>
      )}
    </div>
  );
}

export default function QuizTab({
  quizzes = [],
  initialModule = 'M1',
  navigationNonce = 0,
  onBackToOverview,
}) {
  // Persisted wrong quiz IDs in localStorage
  const [wrongIds, setWrongIds] = useState(() => loadWrongQuizIds());

  // Top mode: 'practice' | 'mock' | 'wrong'
  const [mode, setMode] = useState('practice');

  // --- Mode 1: Practice by Module ---
  const [selectedModule, setSelectedModule] = useState(initialModule);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practiceAnswers, setPracticeAnswers] = useState({});

  // Sync external navigation from "Luyện đề" button in 12 Chuyên đề
  useEffect(() => {
    if (navigationNonce > 0 && initialModule) {
      setMode('practice');
      setSelectedModule(initialModule);
      setPracticeIndex(0);
    }
  }, [initialModule, navigationNonce]);

  // --- Mode 2: 90-min Weighted Mock Exam ---
  const [mockPreset, setMockPreset] = useState('full'); // 'full' (40q / 90m) | 'quick' (20q / 45m)
  const [mockStatus, setMockStatus] = useState('idle'); // 'idle' | 'running' | 'submitted'
  const [mockQuestions, setMockQuestions] = useState([]);
  const [mockIndex, setMockIndex] = useState(0);
  const [mockAnswers, setMockAnswers] = useState({});
  const [mockDurationSeconds, setMockDurationSeconds] = useState(
    MOCK_EXAM_DURATION_SECONDS
  );
  const [remainingSeconds, setRemainingSeconds] = useState(
    MOCK_EXAM_DURATION_SECONDS
  );
  const [mockResult, setMockResult] = useState(null);
  const [autoSubmitted, setAutoSubmitted] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);

  // --- Mode 3: Wrong Questions Review ---
  const [reviewQueueIds, setReviewQueueIds] = useState([]);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [reviewAnswers, setReviewAnswers] = useState({});
  const [confirmClearWrong, setConfirmClearWrong] = useState(false);

  // Sync wrong IDs to localStorage whenever changed
  useEffect(() => {
    saveWrongQuizIds(wrongIds);
  }, [wrongIds]);

  const quizById = useMemo(
    () => new Map(quizzes.map((q) => [q.id, q])),
    [quizzes]
  );

  // Valid wrong IDs that actually exist in current examData.json
  const validWrongIds = useMemo(
    () => wrongIds.filter((id) => quizById.has(id)),
    [wrongIds, quizById]
  );

  const addWrongIds = useCallback((idsToAdd) => {
    if (!idsToAdd || idsToAdd.length === 0) return;
    setWrongIds((prev) => {
      const next = new Set(prev);
      let changed = false;
      for (const id of idsToAdd) {
        if (!next.has(id)) {
          next.add(id);
          changed = true;
        }
      }
      return changed ? [...next] : prev;
    });
  }, []);

  const removeWrongId = useCallback((idToRemove) => {
    setWrongIds((prev) =>
      prev.includes(idToRemove) ? prev.filter((id) => id !== idToRemove) : prev
    );
  }, []);

  // --- Practice derived values ---
  const moduleQuizCounts = useMemo(() => {
    const counts = { M1: 0, M2: 0, M3: 0, M4: 0 };
    for (const q of quizzes) {
      if (counts[q.module] !== undefined) counts[q.module] += 1;
    }
    return counts;
  }, [quizzes]);

  const practiceQuestions = useMemo(
    () => quizzes.filter((q) => q.module === selectedModule),
    [quizzes, selectedModule]
  );

  const safePracticeIndex =
    practiceQuestions.length > 0
      ? Math.min(practiceIndex, practiceQuestions.length - 1)
      : 0;
  const currentPracticeQuiz = practiceQuestions[safePracticeIndex] ?? null;

  const practiceModuleStats = useMemo(() => {
    let answered = 0;
    let correct = 0;
    for (const q of practiceQuestions) {
      const ans = practiceAnswers[q.id];
      if (typeof ans === 'number') {
        answered += 1;
        if (ans === q.correctIndex) correct += 1;
      }
    }
    return { answered, correct, total: practiceQuestions.length };
  }, [practiceQuestions, practiceAnswers]);

  const handleSelectPracticeModule = (modCode) => {
    setSelectedModule(modCode);
    setPracticeIndex(0);
  };

  const handleSelectPracticeOption = (quiz, optionIndex) => {
    if (typeof practiceAnswers[quiz.id] === 'number') return;
    setPracticeAnswers((prev) => ({
      ...prev,
      [quiz.id]: optionIndex,
    }));
    if (optionIndex !== quiz.correctIndex) {
      addWrongIds([quiz.id]);
    }
  };

  const handleResetPracticeModule = () => {
    setPracticeAnswers((prev) => {
      const next = { ...prev };
      for (const q of practiceQuestions) {
        delete next[q.id];
      }
      return next;
    });
    setPracticeIndex(0);
  };

  // --- Mock Exam preview metadata (for lobby) ---
  const selectedMaxHigh = mockPreset === 'quick' ? 12 : 24;
  const selectedDuration =
    mockPreset === 'quick' ? 45 * 60 : MOCK_EXAM_DURATION_SECONDS;

  const mockPoolPreview = useMemo(() => {
    const sample = buildWeightedMockExam(quizzes, selectedMaxHigh);
    const highCount = sample.filter((q) => (q.weight ?? 1) >= 2).length;
    const stdCount = sample.length - highCount;
    const totalWeight = sample.reduce((s, q) => s + (q.weight ?? 1), 0);
    const highWeightSum = sample
      .filter((q) => (q.weight ?? 1) >= 2)
      .reduce((s, q) => s + (q.weight ?? 1), 0);
    const highWeightShare =
      totalWeight > 0 ? Math.round((highWeightSum / totalWeight) * 100) : 0;

    return {
      total: sample.length,
      highCount,
      stdCount,
      highWeightShare,
    };
  }, [quizzes, selectedMaxHigh]);

  const startNewMockExam = useCallback(() => {
    const generated = buildWeightedMockExam(quizzes, selectedMaxHigh);
    setMockQuestions(generated);
    setMockIndex(0);
    setMockAnswers({});
    setMockDurationSeconds(selectedDuration);
    setRemainingSeconds(selectedDuration);
    setMockResult(null);
    setAutoSubmitted(false);
    setConfirmSubmit(false);
    setMockStatus('running');
  }, [quizzes, selectedMaxHigh, selectedDuration]);

  const finalizeMockExam = useCallback(
    (isAuto = false) => {
      const graded = gradeMockExam(mockQuestions, mockAnswers);
      setMockResult(graded);
      setAutoSubmitted(isAuto);
      setConfirmSubmit(false);
      setMockStatus('submitted');

      const newlyWrongIds = graded.wrongQuestions.map((item) => item.question.id);
      if (newlyWrongIds.length > 0) {
        addWrongIds(newlyWrongIds);
      }
    },
    [mockQuestions, mockAnswers, addWrongIds]
  );

  // Countdown tick — only runs while viewing and actively taking the mock exam
  useEffect(() => {
    if (mode !== 'mock' || mockStatus !== 'running') return undefined;
    const intervalId = window.setInterval(() => {
      setRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(intervalId);
  }, [mode, mockStatus]);

  // Auto-submit when timer hits 00:00
  useEffect(() => {
    if (mockStatus === 'running' && remainingSeconds === 0) {
      finalizeMockExam(true);
    }
  }, [mockStatus, remainingSeconds, finalizeMockExam]);

  const mockAnsweredCount = useMemo(
    () =>
      mockQuestions.filter((q) => typeof mockAnswers[q.id] === 'number').length,
    [mockQuestions, mockAnswers]
  );

  const mockWeightStats = useMemo(() => {
    const high = mockQuestions.filter((q) => (q.weight ?? 1) >= 2).length;
    return { high, std: mockQuestions.length - high };
  }, [mockQuestions]);

  const currentMockQuiz = mockQuestions[mockIndex] ?? null;

  const handleSelectMockOption = (quizId, optionIndex) => {
    if (mockStatus !== 'running') return;
    setMockAnswers((prev) => ({
      ...prev,
      [quizId]: optionIndex,
    }));
  };

  const handleRequestSubmitMock = () => {
    if (mockAnsweredCount < mockQuestions.length) {
      setConfirmSubmit(true);
      return;
    }
    finalizeMockExam(false);
  };

  // --- Wrong Questions Review Mode ---
  const enterWrongReviewMode = useCallback(() => {
    setReviewQueueIds(validWrongIds);
    setReviewIndex(0);
    setReviewAnswers({});
    setConfirmClearWrong(false);
    setMode('wrong');
  }, [validWrongIds]);

  const reviewQuestions = useMemo(
    () => reviewQueueIds.map((id) => quizById.get(id)).filter(Boolean),
    [reviewQueueIds, quizById]
  );

  const safeReviewIndex =
    reviewQuestions.length > 0
      ? Math.min(reviewIndex, reviewQuestions.length - 1)
      : 0;
  const currentReviewQuiz = reviewQuestions[safeReviewIndex] ?? null;

  const handleSelectReviewOption = (quiz, optionIndex) => {
    if (typeof reviewAnswers[quiz.id] === 'number') return;
    setReviewAnswers((prev) => ({
      ...prev,
      [quiz.id]: optionIndex,
    }));
    if (optionIndex === quiz.correctIndex) {
      removeWrongId(quiz.id);
    } else {
      addWrongIds([quiz.id]);
    }
  };

  const handleClearAllWrong = () => {
    setWrongIds([]);
    setReviewQueueIds([]);
    setReviewAnswers({});
    setReviewIndex(0);
    setConfirmClearWrong(false);
  };

  const elapsedSeconds = mockDurationSeconds - remainingSeconds;

  return (
    <div className="space-y-6">
      {/* Header & Top Mode Switcher */}
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
            Trắc nghiệm & Thi thử 90p
          </h1>
          <p className="mt-0.5 text-sm text-slate-600">
            Luyện tình huống chuẩn SFIA kèm phân tích bẫy, hoặc thi thử 90 phút lệch trọng số ưu tiên M2 & M3.
          </p>
        </div>

        {/* Mode Buttons + "Ôn lại câu đã sai" */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setMode('practice')}
            className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all ${
              mode === 'practice'
                ? 'border-slate-900 bg-slate-900 text-white shadow-2xs'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Luyện theo Module</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('mock')}
            className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all ${
              mode === 'mock'
                ? 'border-slate-900 bg-slate-900 text-white shadow-2xs'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>Thi thử 90 phút</span>
            {mockStatus === 'running' && (
              <span className="rounded bg-blue-500 px-1.5 py-0.5 font-mono text-[10px] text-white tabular-nums">
                {formatCountdown(remainingSeconds)}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={enterWrongReviewMode}
            className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all ${
              mode === 'wrong'
                ? 'border-rose-700 bg-rose-700 text-white shadow-2xs'
                : validWrongIds.length > 0
                  ? 'border-rose-200 bg-rose-50 text-rose-700 hover:border-rose-300 hover:bg-rose-100'
                  : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Ôn lại câu đã sai</span>
            <span
              className={`rounded-md px-1.5 py-0.5 font-mono text-[11px] font-bold tabular-nums ${
                mode === 'wrong'
                  ? 'bg-rose-800 text-rose-100'
                  : validWrongIds.length > 0
                    ? 'bg-rose-200/80 text-rose-800'
                    : 'bg-slate-100 text-slate-500'
              }`}
            >
              {validWrongIds.length}
            </span>
          </button>
        </div>
      </div>

      {/* ================================================================= */}
      {/* MODE 1: LUYỆN THEO MODULE                                         */}
      {/* ================================================================= */}
      {mode === 'practice' && (
        <div className="space-y-5">
          {/* Module Selector Bar */}
          <section className="flex flex-col gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {MODULES.map((mod) => {
                const isActive = selectedModule === mod.code;
                return (
                  <button
                    key={mod.code}
                    type="button"
                    onClick={() => handleSelectPracticeModule(mod.code)}
                    className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
                      isActive
                        ? 'border-slate-900 bg-slate-900 text-white shadow-2xs'
                        : 'border-slate-200 bg-slate-50/70 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <span className="font-mono">{mod.code}</span>
                    <span>{mod.shortTitle}</span>
                    <span
                      className={`rounded px-1.5 py-0.5 font-mono text-[10px] ${
                        isActive
                          ? 'bg-white/15 text-slate-100'
                          : 'bg-white text-slate-500 ring-1 ring-slate-200'
                      }`}
                    >
                      ×{mod.defaultWeight} · {moduleQuizCounts[mod.code]}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between gap-3 sm:justify-end">
              <span className="font-mono text-xs text-slate-500 tabular-nums">
                Đúng{' '}
                <strong className="text-slate-900">
                  {practiceModuleStats.correct}/{practiceModuleStats.answered}
                </strong>{' '}
                đã làm
              </span>
              <button
                type="button"
                onClick={handleResetPracticeModule}
                disabled={practiceModuleStats.answered === 0}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Làm lại</span>
              </button>
            </div>
          </section>

          {/* Question Navigator Pills */}
          {practiceQuestions.length > 0 && currentPracticeQuiz ? (
            <div className="mx-auto max-w-3xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 px-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  {practiceQuestions.map((q, idx) => {
                    const ans = practiceAnswers[q.id];
                    const isAnswered = typeof ans === 'number';
                    const isCorrect = isAnswered && ans === q.correctIndex;
                    const isCurrent = idx === safePracticeIndex;

                    let pillStyle =
                      'border-slate-200 bg-white text-slate-600 hover:bg-slate-50';
                    if (isAnswered && isCorrect) {
                      pillStyle =
                        'border-teal-300 bg-teal-50 text-teal-800';
                    } else if (isAnswered && !isCorrect) {
                      pillStyle =
                        'border-rose-300 bg-rose-50 text-rose-800';
                    }

                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setPracticeIndex(idx)}
                        className={`h-8 min-w-8 rounded-lg border px-2 font-mono text-xs font-semibold tabular-nums transition-all ${pillStyle} ${
                          isCurrent ? 'ring-2 ring-slate-900 ring-offset-1' : ''
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                <span className="font-mono text-xs text-slate-500 tabular-nums">
                  Câu {safePracticeIndex + 1} / {practiceQuestions.length}
                </span>
              </div>

              {/* Active Practice Question Card */}
              {(() => {
                const q = currentPracticeQuiz;
                const modMeta = MODULE_MAP[q.module];
                const selectedOpt = practiceAnswers[q.id];
                const isAnswered = typeof selectedOpt === 'number';
                const isCorrect = isAnswered && selectedOpt === q.correctIndex;
                const isSavedWrong = validWrongIds.includes(q.id);

                return (
                  <article className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs sm:p-7">
                    {/* Meta badges */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-md border px-2 py-0.5 font-mono text-xs font-semibold ${
                            modMeta?.badgeClass ??
                            'border-slate-200 bg-slate-100 text-slate-700'
                          }`}
                        >
                          {q.module}
                        </span>
                        <span
                          className={`rounded-md px-2 py-0.5 font-mono text-xs font-semibold ${
                            (q.weight ?? 1) >= 2
                              ? 'bg-slate-900 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          weight: ×{q.weight ?? 1}
                        </span>
                        <code className="font-mono text-xs text-slate-400">
                          {q.id}
                        </code>
                      </div>

                      {isSavedWrong && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-[11px] font-medium text-rose-700">
                          <ShieldAlert className="h-3 w-3" />
                          <span>Trong danh sách câu sai</span>
                        </span>
                      )}
                    </div>

                    {/* Question Prompt */}
                    <h2 className="mt-4 text-base font-semibold leading-relaxed text-slate-900 sm:text-lg">
                      <RichInlineText text={q.question} />
                    </h2>

                    {/* Options */}
                    <div className="mt-5 space-y-2.5">
                      {q.options.map((opt, idx) => {
                        const letter = OPTION_LETTERS[idx] ?? String(idx + 1);
                        const isPicked = selectedOpt === idx;
                        const isRightOption = idx === q.correctIndex;

                        let cardClass =
                          'border-slate-200 bg-white text-slate-800 hover:border-slate-400 hover:bg-slate-50/70';
                        let letterClass =
                          'border-slate-200 bg-slate-50 text-slate-600';

                        if (isAnswered) {
                          if (isRightOption) {
                            cardClass =
                              'border-teal-400 bg-teal-50/80 text-teal-950';
                            letterClass =
                              'border-teal-500 bg-teal-600 text-white';
                          } else if (isPicked && !isRightOption) {
                            cardClass =
                              'border-rose-400 bg-rose-50/85 text-rose-950';
                            letterClass =
                              'border-rose-500 bg-rose-600 text-white';
                          } else {
                            cardClass =
                              'border-slate-200/70 bg-slate-50/40 text-slate-500 opacity-70';
                            letterClass =
                              'border-slate-200 bg-slate-100 text-slate-400';
                          }
                        }

                        return (
                          <button
                            key={idx}
                            type="button"
                            disabled={isAnswered}
                            onClick={() => handleSelectPracticeOption(q, idx)}
                            className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left text-sm leading-relaxed transition-all disabled:cursor-default ${cardClass}`}
                          >
                            <span
                              className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border font-mono text-xs font-bold ${letterClass}`}
                            >
                              {letter}
                            </span>
                            <span className="flex-1">
                              <RichInlineText text={opt} />
                            </span>
                            {isAnswered && isRightOption && (
                              <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-teal-600" />
                            )}
                            {isAnswered && isPicked && !isRightOption && (
                              <XCircle className="mt-0.5 h-4.5 w-4.5 shrink-0 text-rose-600" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Immediate Feedback */}
                    {isAnswered && (
                      <FeedbackBox
                        quiz={q}
                        isCorrect={isCorrect}
                        extraNotice={
                          isCorrect
                            ? undefined
                            : 'Đã lưu vào "Ôn lại câu đã sai"'
                        }
                      />
                    )}

                    {/* Prev / Next */}
                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                      <button
                        type="button"
                        onClick={() =>
                          setPracticeIndex((prev) => Math.max(prev - 1, 0))
                        }
                        disabled={safePracticeIndex === 0}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span>Câu trước</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setPracticeIndex((prev) =>
                            Math.min(prev + 1, practiceQuestions.length - 1)
                          )
                        }
                        disabled={
                          safePracticeIndex >= practiceQuestions.length - 1
                        }
                        className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <span>Câu tiếp theo</span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </article>
                );
              })()}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
              Không có câu hỏi trắc nghiệm nào cho Module {selectedModule}.
            </div>
          )}
        </div>
      )}

      {/* ================================================================= */}
      {/* MODE 2: THI THỬ 90 PHÚT (LỆCH TRỌNG SỐ)                           */}
      {/* ================================================================= */}
      {mode === 'mock' && mockStatus === 'idle' && (
        <section className="mx-auto max-w-3xl rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1 font-mono text-xs font-semibold text-white">
              <Clock className="h-3.5 w-3.5 text-blue-300" />
              <span>90:00 Đếm ngược</span>
            </span>
            <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
              Lệch trọng số · Ưu tiên M2 & M3 (×2)
            </span>
          </div>

          <h2 className="mt-4 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Phòng thi thử 90 phút (Lệch trọng số)
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Hệ thống sẽ tự động xáo trộn câu hỏi và ưu tiên bốc nhiều câu có{' '}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-800">
              weight: 2
            </code>{' '}
            (Module 2 & Module 3) hơn{' '}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-800">
              weight: 1
            </code>{' '}
            (Module 1 & Module 4). Kết quả chỉ được chấm sau khi bấm{' '}
            <strong className="font-semibold text-slate-900">Nộp bài</strong>.
          </p>

          {/* Exam Preset Selector */}
          <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setMockPreset('full')}
              className={`rounded-xl border p-3.5 text-left transition-all ${
                mockPreset === 'full'
                  ? 'border-slate-900 bg-slate-900 text-white shadow-2xs'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <p className="text-xs font-bold">Đề Chuẩn Level 3 · 90 phút</p>
              <p
                className={`mt-0.5 font-mono text-[11px] ${
                  mockPreset === 'full' ? 'text-blue-200' : 'text-slate-500'
                }`}
              >
                40 câu (24 câu ×2 · 16 câu ×1)
              </p>
            </button>

            <button
              type="button"
              onClick={() => setMockPreset('quick')}
              className={`rounded-xl border p-3.5 text-left transition-all ${
                mockPreset === 'quick'
                  ? 'border-slate-900 bg-slate-900 text-white shadow-2xs'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <p className="text-xs font-bold">Đề Luyện Nhanh · 45 phút</p>
              <p
                className={`mt-0.5 font-mono text-[11px] ${
                  mockPreset === 'quick' ? 'text-blue-200' : 'text-slate-500'
                }`}
              >
                20 câu (12 câu ×2 · 8 câu ×1)
              </p>
            </button>
          </div>

          {/* Exam Specs Preview */}
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-4">
              <p className="text-xs font-medium text-slate-500">Số câu mỗi đề</p>
              <p className="mt-1 font-mono text-2xl font-bold text-slate-900 tabular-nums">
                {mockPoolPreview.total} câu
              </p>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Bốc từ {quizzes.length} câu nguồn
              </p>
            </div>

            <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-4">
              <p className="text-xs font-medium text-slate-500">Tỷ lệ trọng số</p>
              <p className="mt-1 font-mono text-2xl font-bold text-indigo-700 tabular-nums">
                {mockPoolPreview.highCount} ×2 · {mockPoolPreview.stdCount} ×1
              </p>
              <p className="mt-0.5 text-[11px] text-slate-500">
                M2 &amp; M3 chiếm {mockPoolPreview.highWeightShare}% điểm
              </p>
            </div>

            <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-4">
              <p className="text-xs font-medium text-slate-500">Thời gian thi</p>
              <p className="mt-1 font-mono text-2xl font-bold text-slate-900 tabular-nums">
                {formatCountdown(selectedDuration)}
              </p>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Tự động nộp khi hết giờ
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-6">
            <p className="text-xs text-slate-500">
              Mọi câu làm sai hoặc bỏ trống sẽ được tự động lưu vào danh sách{' '}
              <strong className="text-slate-700">Ôn lại câu đã sai</strong>.
            </p>
            <button
              type="button"
              onClick={startNewMockExam}
              disabled={quizzes.length === 0}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-45"
            >
              <Play className="h-4 w-4 fill-current" />
              <span>
                Bắt đầu thi thử ({mockPoolPreview.total} câu ·{' '}
                {mockPreset === 'quick' ? '45 phút' : '90 phút'})
              </span>
            </button>
          </div>
        </section>
      )}

      {mode === 'mock' && mockStatus === 'running' && currentMockQuiz && (
        <div className="space-y-5">
          {/* Exam Top Bar: Timer + Progress + Submit */}
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-4">
              {/* Countdown Timer */}
              <div
                className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 font-mono text-base font-bold tabular-nums ${
                  remainingSeconds <= 180
                    ? 'border-rose-300 bg-rose-50 text-rose-700'
                    : remainingSeconds <= 600
                      ? 'border-amber-300 bg-amber-50 text-amber-800'
                      : 'border-slate-200 bg-slate-50 text-slate-900'
                }`}
              >
                <Clock className="h-4 w-4" />
                <span>{formatCountdown(remainingSeconds)}</span>
              </div>

              <div className="text-xs text-slate-600">
                <p className="font-semibold text-slate-900">
                  Đã trả lời{' '}
                  <span className="font-mono tabular-nums">
                    {mockAnsweredCount}/{mockQuestions.length}
                  </span>{' '}
                  câu
                </p>
                <p className="font-mono text-[11px] text-slate-500">
                  Đề gồm {mockWeightStats.high} câu ×2 (M2, M3) ·{' '}
                  {mockWeightStats.std} câu ×1 (M1, M4)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {confirmSubmit ? (
                <div className="flex flex-wrap items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs">
                  <span className="font-medium text-amber-900">
                    Còn {mockQuestions.length - mockAnsweredCount} câu chưa làm. Nộp ngay?
                  </span>
                  <button
                    type="button"
                    onClick={() => finalizeMockExam(false)}
                    className="rounded-lg bg-slate-900 px-2.5 py-1 font-semibold text-white hover:bg-slate-800"
                  >
                    Xác nhận nộp
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmSubmit(false)}
                    className="rounded-lg px-2 py-1 font-medium text-slate-600 hover:bg-white"
                  >
                    Làm tiếp
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleRequestSubmitMock}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-blue-800"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Nộp bài</span>
                </button>
              )}
            </div>
          </div>

          {/* Exam Main 2-Column Layout */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            {/* Active Question Card */}
            <div className="lg:col-span-8">
              {(() => {
                const q = currentMockQuiz;
                const modMeta = MODULE_MAP[q.module];
                const picked = mockAnswers[q.id];

                return (
                  <article className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs sm:p-7">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900 tabular-nums">
                          Câu {mockIndex + 1} / {mockQuestions.length}
                        </span>
                        <span
                          className={`rounded-md border px-2 py-0.5 font-mono text-xs font-semibold ${
                            modMeta?.badgeClass ??
                            'border-slate-200 bg-slate-100 text-slate-700'
                          }`}
                        >
                          {q.module}
                        </span>
                        <span
                          className={`rounded-md px-2 py-0.5 font-mono text-xs font-semibold ${
                            (q.weight ?? 1) >= 2
                              ? 'bg-slate-900 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          ×{q.weight ?? 1}
                        </span>
                      </div>
                      <code className="font-mono text-xs text-slate-400">
                        {q.id}
                      </code>
                    </div>

                    <h2 className="mt-4 text-base font-semibold leading-relaxed text-slate-900 sm:text-lg">
                      <RichInlineText text={q.question} />
                    </h2>

                    <div className="mt-5 space-y-2.5">
                      {q.options.map((opt, idx) => {
                        const letter = OPTION_LETTERS[idx] ?? String(idx + 1);
                        const isSelected = picked === idx;

                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSelectMockOption(q.id, idx)}
                            className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left text-sm leading-relaxed transition-all ${
                              isSelected
                                ? 'border-blue-600 bg-blue-50/70 text-slate-900 ring-1 ring-blue-600'
                                : 'border-slate-200 bg-white text-slate-800 hover:border-slate-400 hover:bg-slate-50/70'
                            }`}
                          >
                            <span
                              className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border font-mono text-xs font-bold ${
                                isSelected
                                  ? 'border-blue-600 bg-blue-600 text-white'
                                  : 'border-slate-200 bg-slate-50 text-slate-600'
                              }`}
                            >
                              {letter}
                            </span>
                            <span className="flex-1">
                              <RichInlineText text={opt} />
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                      <button
                        type="button"
                        onClick={() =>
                          setMockIndex((prev) => Math.max(prev - 1, 0))
                        }
                        disabled={mockIndex === 0}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span>Câu trước</span>
                      </button>

                      {mockIndex < mockQuestions.length - 1 ? (
                        <button
                          type="button"
                          onClick={() =>
                            setMockIndex((prev) =>
                              Math.min(prev + 1, mockQuestions.length - 1)
                            )
                          }
                          className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
                        >
                          <span>Câu tiếp theo</span>
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleRequestSubmitMock}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-700 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-800"
                        >
                          <Send className="h-3.5 w-3.5" />
                          <span>Nộp bài</span>
                        </button>
                      )}
                    </div>
                  </article>
                );
              })()}
            </div>

            {/* Right Sidebar: Question Palette */}
            <aside className="lg:col-span-4">
              <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Danh sách câu hỏi
                  </h3>
                  <span className="font-mono text-xs text-slate-500 tabular-nums">
                    {mockAnsweredCount}/{mockQuestions.length}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-5 gap-2">
                  {mockQuestions.map((q, idx) => {
                    const isAnswered = typeof mockAnswers[q.id] === 'number';
                    const isCurrent = idx === mockIndex;
                    const isHighWeight = (q.weight ?? 1) >= 2;

                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setMockIndex(idx)}
                        title={`Câu ${idx + 1} (${q.module} · ×${q.weight ?? 1})`}
                        className={`relative flex h-10 flex-col items-center justify-center rounded-xl border font-mono text-xs font-semibold tabular-nums transition-all ${
                          isAnswered
                            ? 'border-slate-900 bg-slate-900 text-white'
                            : 'border-slate-200 bg-slate-50/70 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
                        } ${isCurrent ? 'ring-2 ring-blue-600 ring-offset-1' : ''}`}
                      >
                        <span>{idx + 1}</span>
                        {isHighWeight && (
                          <span
                            className={`text-[9px] leading-none ${
                              isAnswered ? 'text-blue-300' : 'text-indigo-600'
                            }`}
                          >
                            ×2
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-5 space-y-1.5 border-t border-slate-100 pt-4 text-[11px] text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded bg-slate-900" />
                    <span>Đã chọn đáp án</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded border border-slate-300 bg-slate-50" />
                    <span>Chưa trả lời</span>
                  </div>
                  <p className="pt-1 font-mono text-[11px] text-indigo-600">
                    Nhãn ×2: Câu trọng số cao (M2, M3)
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      )}

      {mode === 'mock' && mockStatus === 'submitted' && mockResult && (
        <div className="space-y-6">
          {/* Result Summary Banner */}
          <section className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs sm:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-200">
                    <Award className="h-3.5 w-3.5" />
                    <span>Kết quả thi thử 90 phút</span>
                  </span>
                  {autoSubmitted && (
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800 ring-1 ring-inset ring-amber-200">
                      Tự động nộp khi hết giờ
                    </span>
                  )}
                </div>
                <h2 className="mt-3 text-xl font-bold text-slate-900 sm:text-2xl">
                  Điểm tổng kết (Lệch trọng số):{' '}
                  <span className="font-mono text-blue-700 tabular-nums">
                    {mockResult.scoreOutOf10.toFixed(2)} / 10
                  </span>
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Đạt{' '}
                  <strong className="font-mono text-slate-900">
                    {mockResult.weightedEarned}/{mockResult.weightedTotal}
                  </strong>{' '}
                  điểm trọng số ({mockResult.weightedPercent}%) · Trả lời đúng{' '}
                  <strong className="font-mono text-slate-900">
                    {mockResult.correctCount}/{mockResult.totalQuestions}
                  </strong>{' '}
                  câu ({mockResult.accuracyPercent}%) · Thời gian làm:{' '}
                  <strong className="font-mono text-slate-900">
                    {formatCountdown(elapsedSeconds)}
                  </strong>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={startNewMockExam}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Làm đề thi mới</span>
                </button>
                {validWrongIds.length > 0 && (
                  <button
                    type="button"
                    onClick={enterWrongReviewMode}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-100"
                  >
                    <ShieldAlert className="h-3.5 w-3.5" />
                    <span>Ôn lại câu đã sai ({validWrongIds.length})</span>
                  </button>
                )}
              </div>
            </div>

            {/* Per-Module Accuracy Breakdown */}
            <div className="mt-6 border-t border-slate-100 pt-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Phân tích % đúng theo từng Module
              </h3>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {mockResult.moduleBreakdown.map((mod) => {
                  const pct = mod.percent;
                  const barColor =
                    pct === null
                      ? 'bg-slate-200'
                      : pct >= 80
                        ? 'bg-teal-500'
                        : pct >= 50
                          ? 'bg-amber-400'
                          : 'bg-rose-500';

                  return (
                    <div
                      key={mod.code}
                      className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`rounded border px-1.5 py-0.5 font-mono text-xs font-semibold ${mod.badgeClass}`}
                        >
                          {mod.code}
                        </span>
                        <span className="font-mono text-[11px] text-slate-500">
                          ×{mod.defaultWeight}
                        </span>
                      </div>
                      <p className="mt-2 text-xs font-medium text-slate-700">
                        {mod.shortTitle}
                      </p>
                      <div className="mt-2 flex items-baseline justify-between font-mono tabular-nums">
                        <span className="text-lg font-bold text-slate-900">
                          {pct === null ? '—' : `${pct}%`}
                        </span>
                        <span className="text-xs text-slate-500">
                          {mod.correct}/{mod.total} câu
                        </span>
                      </div>
                      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200/80">
                        <div
                          className={`h-full rounded-full transition-all ${barColor}`}
                          style={{ width: `${pct ?? 0}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Wrong Questions List */}
          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-base font-bold text-slate-900">
                Danh sách các câu làm sai ({mockResult.wrongCount})
              </h3>
              {mockResult.wrongCount > 0 && (
                <span className="text-xs text-slate-500">
                  Đã tự động lưu vào{' '}
                  <code className="font-mono text-slate-700">localStorage</code>{' '}
                  để ôn lại
                </span>
              )}
            </div>

            {mockResult.wrongQuestions.length === 0 ? (
              <div className="rounded-2xl border border-teal-200 bg-white p-8 text-center shadow-2xs">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h4 className="mt-3 text-base font-bold text-slate-900">
                  Xuất sắc! Không có câu làm sai nào.
                </h4>
                <p className="mt-1 text-sm text-slate-600">
                  Bạn đã trả lời đúng toàn bộ {mockResult.totalQuestions} câu trong đề thi thử này.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {mockResult.wrongQuestions.map(({ question: q, selectedIndex }) => {
                  const modMeta = MODULE_MAP[q.module];
                  const chosenLetter =
                    selectedIndex !== null
                      ? OPTION_LETTERS[selectedIndex]
                      : null;
                  const rightLetter = OPTION_LETTERS[q.correctIndex];

                  return (
                    <article
                      key={q.id}
                      className="rounded-2xl border border-rose-200/80 bg-white p-5 shadow-2xs sm:p-6"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-md border px-2 py-0.5 font-mono text-xs font-semibold ${
                              modMeta?.badgeClass ??
                              'border-slate-200 bg-slate-100 text-slate-700'
                            }`}
                          >
                            {q.module}
                          </span>
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs font-semibold text-slate-700">
                            ×{q.weight ?? 1}
                          </span>
                          <code className="font-mono text-xs text-slate-400">
                            {q.id}
                          </code>
                        </div>
                        <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700">
                          {selectedIndex === null ? 'Bỏ trống' : 'Trả lời sai'}
                        </span>
                      </div>

                      <h4 className="mt-3 text-sm font-semibold leading-relaxed text-slate-900 sm:text-base">
                        <RichInlineText text={q.question} />
                      </h4>

                      <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                        <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-3.5 text-xs leading-relaxed text-rose-900">
                          <p className="mb-1 font-semibold text-rose-700">
                            Phương án bạn chọn:
                          </p>
                          {selectedIndex === null ? (
                            <span className="italic text-rose-700">
                              Chưa chọn đáp án
                            </span>
                          ) : (
                            <span>
                              <strong className="font-mono">{chosenLetter}.</strong>{' '}
                              <RichInlineText text={q.options[selectedIndex]} />
                            </span>
                          )}
                        </div>

                        <div className="rounded-xl border border-teal-200 bg-teal-50/70 p-3.5 text-xs leading-relaxed text-teal-950">
                          <p className="mb-1 font-semibold text-teal-700">
                            Đáp án đúng:
                          </p>
                          <span>
                            <strong className="font-mono">{rightLetter}.</strong>{' '}
                            <RichInlineText text={q.options[q.correctIndex]} />
                          </span>
                        </div>
                      </div>

                      {q.explanation && (
                        <div className="mt-3 rounded-xl border border-slate-200/80 bg-slate-50/80 p-3.5 text-xs leading-relaxed text-slate-700">
                          <strong className="font-semibold text-slate-900">
                            Giải thích:{' '}
                          </strong>
                          <RichInlineText text={q.explanation} />
                        </div>
                      )}

                      {q.trapNote && (
                        <div className="mt-2.5 rounded-xl border border-amber-200/80 bg-amber-50/70 p-3.5 text-xs leading-relaxed text-amber-950">
                          <strong className="font-semibold text-amber-800">
                            Bẫy cần tránh:{' '}
                          </strong>
                          <RichInlineText text={q.trapNote} />
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODE 3: ÔN LẠI CÂU ĐÃ SAI                                         */}
      {/* ================================================================= */}
      {mode === 'wrong' && (
        <div className="mx-auto max-w-3xl space-y-5">
          {reviewQuestions.length === 0 ? (
            <section className="rounded-2xl border border-teal-200/80 bg-white px-6 py-12 text-center shadow-2xs">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                <Sparkles className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-lg font-bold text-slate-900">
                Danh sách câu làm sai đang trống!
              </h2>
              <p className="mx-auto mt-1.5 max-w-md text-sm text-slate-600">
                Khi bạn chọn nhầm câu nào ở chế độ Luyện theo Module hoặc Thi thử 90 phút, hệ thống sẽ tự động lưu lại tại đây để tập trung vá lỗ hổng.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setMode('practice')}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                >
                  Luyện theo Module
                </button>
                <button
                  type="button"
                  onClick={() => setMode('mock')}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Vào Thi thử 90 phút
                </button>
              </div>
            </section>
          ) : (
            <>
              {/* Wrong Review Header */}
              <div className="flex flex-col gap-3 rounded-2xl border border-rose-200/80 bg-rose-50/40 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Ôn tập trung câu từng làm sai ({reviewQuestions.length} câu trong phiên)
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-600">
                    Trả lời đúng sẽ tự động gỡ câu khỏi danh sách lỗi lưu trong{' '}
                    <code className="font-mono text-slate-700">localStorage</code>{' '}
                    (hiện còn <strong className="font-mono">{validWrongIds.length}</strong> câu).
                  </p>
                </div>

                {confirmClearWrong ? (
                  <div className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-white px-3 py-1.5 text-xs">
                    <span className="font-medium text-rose-800">Xóa hết?</span>
                    <button
                      type="button"
                      onClick={handleClearAllWrong}
                      className="rounded bg-rose-600 px-2 py-0.5 font-semibold text-white hover:bg-rose-700"
                    >
                      Xác nhận
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmClearWrong(false)}
                      className="rounded px-2 py-0.5 text-slate-600 hover:bg-slate-100"
                    >
                      Hủy
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmClearWrong(true)}
                    className="inline-flex items-center gap-1.5 self-start rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-rose-200 hover:text-rose-700 sm:self-auto"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Xóa danh sách sai</span>
                  </button>
                )}
              </div>

              {/* Review Navigator Pills */}
              <div className="flex flex-wrap items-center justify-between gap-2 px-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  {reviewQuestions.map((q, idx) => {
                    const ans = reviewAnswers[q.id];
                    const isAnswered = typeof ans === 'number';
                    const isCorrect = isAnswered && ans === q.correctIndex;
                    const isCurrent = idx === safeReviewIndex;

                    let pillStyle =
                      'border-slate-200 bg-white text-slate-600 hover:bg-slate-50';
                    if (isAnswered && isCorrect) {
                      pillStyle = 'border-teal-300 bg-teal-50 text-teal-800';
                    } else if (isAnswered && !isCorrect) {
                      pillStyle = 'border-rose-300 bg-rose-50 text-rose-800';
                    }

                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setReviewIndex(idx)}
                        className={`h-8 min-w-8 rounded-lg border px-2 font-mono text-xs font-semibold tabular-nums transition-all ${pillStyle} ${
                          isCurrent ? 'ring-2 ring-slate-900 ring-offset-1' : ''
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                <span className="font-mono text-xs text-slate-500 tabular-nums">
                  Câu {safeReviewIndex + 1} / {reviewQuestions.length}
                </span>
              </div>

              {/* Active Review Card */}
              {currentReviewQuiz &&
                (() => {
                  const q = currentReviewQuiz;
                  const modMeta = MODULE_MAP[q.module];
                  const selectedOpt = reviewAnswers[q.id];
                  const isAnswered = typeof selectedOpt === 'number';
                  const isCorrect = isAnswered && selectedOpt === q.correctIndex;

                  return (
                    <article className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs sm:p-7">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-md border px-2 py-0.5 font-mono text-xs font-semibold ${
                              modMeta?.badgeClass ??
                              'border-slate-200 bg-slate-100 text-slate-700'
                            }`}
                          >
                            {q.module}
                          </span>
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs font-semibold text-slate-700">
                            weight: ×{q.weight ?? 1}
                          </span>
                          <code className="font-mono text-xs text-slate-400">
                            {q.id}
                          </code>
                        </div>
                      </div>

                      <h3 className="mt-4 text-base font-semibold leading-relaxed text-slate-900 sm:text-lg">
                        <RichInlineText text={q.question} />
                      </h3>

                      <div className="mt-5 space-y-2.5">
                        {q.options.map((opt, idx) => {
                          const letter = OPTION_LETTERS[idx] ?? String(idx + 1);
                          const isPicked = selectedOpt === idx;
                          const isRightOption = idx === q.correctIndex;

                          let cardClass =
                            'border-slate-200 bg-white text-slate-800 hover:border-slate-400 hover:bg-slate-50/70';
                          let letterClass =
                            'border-slate-200 bg-slate-50 text-slate-600';

                          if (isAnswered) {
                            if (isRightOption) {
                              cardClass =
                                'border-teal-400 bg-teal-50/80 text-teal-950';
                              letterClass =
                                'border-teal-500 bg-teal-600 text-white';
                            } else if (isPicked && !isRightOption) {
                              cardClass =
                                'border-rose-400 bg-rose-50/85 text-rose-950';
                              letterClass =
                                'border-rose-500 bg-rose-600 text-white';
                            } else {
                              cardClass =
                                'border-slate-200/70 bg-slate-50/40 text-slate-500 opacity-70';
                              letterClass =
                                'border-slate-200 bg-slate-100 text-slate-400';
                            }
                          }

                          return (
                            <button
                              key={idx}
                              type="button"
                              disabled={isAnswered}
                              onClick={() => handleSelectReviewOption(q, idx)}
                              className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left text-sm leading-relaxed transition-all disabled:cursor-default ${cardClass}`}
                            >
                              <span
                                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border font-mono text-xs font-bold ${letterClass}`}
                              >
                                {letter}
                              </span>
                              <span className="flex-1">
                                <RichInlineText text={opt} />
                              </span>
                              {isAnswered && isRightOption && (
                                <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-teal-600" />
                              )}
                              {isAnswered && isPicked && !isRightOption && (
                                <XCircle className="mt-0.5 h-4.5 w-4.5 shrink-0 text-rose-600" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {isAnswered && (
                        <FeedbackBox
                          quiz={q}
                          isCorrect={isCorrect}
                          extraNotice={
                            isCorrect
                              ? 'Đã khắc phục · Đã gỡ khỏi danh sách câu sai'
                              : 'Giữ lại trong danh sách câu sai'
                          }
                        />
                      )}

                      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                        <button
                          type="button"
                          onClick={() =>
                            setReviewIndex((prev) => Math.max(prev - 1, 0))
                          }
                          disabled={safeReviewIndex === 0}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          <span>Câu trước</span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setReviewIndex((prev) =>
                              Math.min(prev + 1, reviewQuestions.length - 1)
                            )
                          }
                          disabled={safeReviewIndex >= reviewQuestions.length - 1}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <span>Câu tiếp theo</span>
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </article>
                  );
                })()}
            </>
          )}
        </div>
      )}
    </div>
  );
}
