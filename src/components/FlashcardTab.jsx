import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Globe,
  HelpCircle,
  Plus,
  RotateCcw,
  Shuffle,
  Sparkles,
  Trash2,
  XCircle,
} from 'lucide-react';
import { MODULES } from '../constants/modules.js';
import { STUDY_DAYS, STUDY_DAY_MAP } from '../constants/studyPlan.js';
import {
  loadFlashcardProgress,
  saveFlashcardProgress,
} from '../utils/storage.js';
import { removeCustomFlashcard } from '../utils/userStudyStore.js';
import KeywordText from './KeywordText.jsx';

const MODULE_MAP = Object.fromEntries(MODULES.map((m) => [m.code, m]));

const MODULE_FILTERS = [
  { code: 'ALL', label: 'Tất cả' },
  { code: 'M1', label: 'M1 · Toán' },
  { code: 'M2', label: 'M2 · Python' },
  { code: 'M3', label: 'M3 · AI & MLOps' },
  { code: 'M4', label: 'M4 · Đạo đức' },
];

const RATING_OPTIONS = [
  {
    status: 'unlearned',
    label: 'Chưa thuộc',
    shortcut: '1',
    icon: XCircle,
    baseClass:
      'border-rose-200 bg-rose-50/90 text-rose-700 hover:bg-rose-100 hover:border-rose-300',
    activeClass:
      'border-rose-400 bg-rose-100 text-rose-800 ring-2 ring-rose-300/80 shadow-xs',
    badgeClass: 'border-rose-200 bg-rose-50 text-rose-700',
    kbdClass: 'bg-rose-100/80 text-rose-600 border-rose-200',
  },
  {
    status: 'unsure',
    label: 'Còn lơ mơ',
    shortcut: '2',
    icon: HelpCircle,
    baseClass:
      'border-amber-200 bg-amber-50/90 text-amber-800 hover:bg-amber-100 hover:border-amber-300',
    activeClass:
      'border-amber-400 bg-amber-100 text-amber-900 ring-2 ring-amber-300/80 shadow-xs',
    badgeClass: 'border-amber-200 bg-amber-50 text-amber-800',
    kbdClass: 'bg-amber-100/80 text-amber-700 border-amber-200',
  },
  {
    status: 'mastered',
    label: 'Đã chắc',
    shortcut: '3',
    icon: CheckCircle2,
    baseClass:
      'border-teal-200 bg-teal-50/90 text-teal-800 hover:bg-teal-100 hover:border-teal-300',
    activeClass:
      'border-teal-400 bg-teal-100 text-teal-900 ring-2 ring-teal-300/80 shadow-xs',
    badgeClass: 'border-teal-200 bg-teal-50 text-teal-800',
    kbdClass: 'bg-teal-100/80 text-teal-700 border-teal-200',
  },
];

const RATING_MAP = Object.fromEntries(
  RATING_OPTIONS.map((opt) => [opt.status, opt])
);

function shuffleArray(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function FlashcardTab({
  flashcards = [],
  initialDay = 'ALL',
  onDayChange,
  onBackToOverview,
  onOpenTermLookup,
}) {
  const [progress, setProgress] = useState(() => loadFlashcardProgress());
  const [selectedDay, setSelectedDay] = useState(initialDay);
  const [selectedModule, setSelectedModule] = useState('ALL');
  const [onlyUnmastered, setOnlyUnmastered] = useState(false);
  const [shuffleOrder, setShuffleOrder] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [lastSavedNotice, setLastSavedNotice] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);

  // Sync external day selection (e.g. clicking a Day card from Overview)
  useEffect(() => {
    setSelectedDay(initialDay);
    setSelectedModule('ALL');
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [initialDay]);

  // Sync progress to localStorage whenever it changes
  useEffect(() => {
    saveFlashcardProgress(progress);
  }, [progress]);

  // Clear saved toast notice gently
  useEffect(() => {
    if (!lastSavedNotice) return undefined;
    const timer = window.setTimeout(() => setLastSavedNotice(null), 1800);
    return () => window.clearTimeout(timer);
  }, [lastSavedNotice]);

  // Apply shuffle order if active
  const orderedCards = useMemo(() => {
    if (!shuffleOrder) return flashcards;
    const byId = new Map(flashcards.map((card) => [card.id, card]));
    const ordered = [];
    for (const id of shuffleOrder) {
      const card = byId.get(id);
      if (card) {
        ordered.push(card);
        byId.delete(id);
      }
    }
    for (const remaining of byId.values()) {
      ordered.push(remaining);
    }
    return ordered;
  }, [flashcards, shuffleOrder]);

  // Scope by Day first (ALL, CUSTOM, or 1..8)
  const dayScopedCards = useMemo(() => {
    if (selectedDay === 'ALL') return orderedCards;
    if (selectedDay === 'CUSTOM') return orderedCards.filter((card) => card.isCustom);
    return orderedCards.filter((card) => card.day === selectedDay);
  }, [orderedCards, selectedDay]);

  const customCardCount = useMemo(
    () => flashcards.filter((c) => c.isCustom).length,
    [flashcards]
  );

  // Scope by Module within selected Day
  const moduleScopedCards = useMemo(() => {
    if (selectedModule === 'ALL') return dayScopedCards;
    return dayScopedCards.filter((card) => card.module === selectedModule);
  }, [dayScopedCards, selectedModule]);

  // Final filtered deck
  const filteredCards = useMemo(() => {
    if (!onlyUnmastered) return moduleScopedCards;
    return moduleScopedCards.filter((card) => progress[card.id] !== 'mastered');
  }, [moduleScopedCards, onlyUnmastered, progress]);

  // Overall progress metrics (across all 350 flashcards)
  const overallMetrics = useMemo(() => {
    const total = flashcards.length;
    let mastered = 0;
    let unsure = 0;
    let unlearned = 0;

    for (const card of flashcards) {
      const status = progress[card.id];
      if (status === 'mastered') mastered += 1;
      else if (status === 'unsure') unsure += 1;
      else if (status === 'unlearned') unlearned += 1;
    }

    const unseen = total - mastered - unsure - unlearned;
    const masteredPercent = total > 0 ? Math.round((mastered / total) * 100) : 0;

    return { total, mastered, unsure, unlearned, unseen, masteredPercent };
  }, [flashcards, progress]);

  // Per-day mastery stats (Day 1..7)
  const dayProgressStats = useMemo(() => {
    return STUDY_DAYS.map((plan) => {
      const cards = flashcards.filter((c) => c.day === plan.day);
      const mastered = cards.filter((c) => progress[c.id] === 'mastered').length;
      return {
        ...plan,
        total: cards.length,
        mastered,
        done: cards.length > 0 && mastered === cards.length,
        percent: cards.length > 0 ? Math.round((mastered / cards.length) * 100) : 0,
      };
    });
  }, [flashcards, progress]);

  // Per-module counts within currently selected Day
  const moduleCounts = useMemo(() => {
    const counts = { ALL: dayScopedCards.length, M1: 0, M2: 0, M3: 0, M4: 0 };
    for (const card of dayScopedCards) {
      if (counts[card.module] !== undefined) {
        counts[card.module] += 1;
      }
    }
    return counts;
  }, [dayScopedCards]);

  // Scoped mastered count
  const scopeMasteredCount = useMemo(
    () =>
      moduleScopedCards.filter((card) => progress[card.id] === 'mastered').length,
    [moduleScopedCards, progress]
  );

  const safeIndex =
    filteredCards.length > 0
      ? Math.min(currentIndex, filteredCards.length - 1)
      : 0;
  const currentCard = filteredCards[safeIndex] ?? null;
  const currentStatus = currentCard ? progress[currentCard.id] : undefined;
  const currentModuleMeta = currentCard ? MODULE_MAP[currentCard.module] : null;
  const currentRatingMeta = currentStatus ? RATING_MAP[currentStatus] : null;
  const selectedDayMeta =
    selectedDay !== 'ALL' && selectedDay !== 'CUSTOM'
      ? STUDY_DAY_MAP[selectedDay]
      : null;
  const selectedDayStat =
    selectedDay !== 'ALL' && selectedDay !== 'CUSTOM'
      ? dayProgressStats.find((d) => d.day === selectedDay)
      : null;

  const handleSelectDay = (dayVal) => {
    setSelectedDay(dayVal);
    onDayChange?.(dayVal);
    setSelectedModule('ALL');
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleSelectModule = (code) => {
    setSelectedModule(code);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleToggleUnmastered = () => {
    setOnlyUnmastered((prev) => !prev);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleToggleShuffle = () => {
    setShuffleOrder((prev) =>
      prev ? null : shuffleArray(flashcards.map((card) => card.id))
    );
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handlePrev = useCallback(() => {
    if (safeIndex <= 0) return;
    setCurrentIndex(safeIndex - 1);
    setIsFlipped(false);
  }, [safeIndex]);

  const handleNext = useCallback(() => {
    if (safeIndex >= filteredCards.length - 1) return;
    setCurrentIndex(safeIndex + 1);
    setIsFlipped(false);
  }, [safeIndex, filteredCards.length]);

  const handleFlip = useCallback(() => {
    if (!currentCard) return;
    // Allow users to drag-select a word on the flashcard without accidentally flipping it
    const selectedText = window.getSelection?.()?.toString().trim();
    if (selectedText) return;
    setIsFlipped((prev) => !prev);
  }, [currentCard]);

  const handleRate = useCallback(
    (status) => {
      if (!currentCard) return;

      const cardId = currentCard.id;
      setProgress((prev) => ({
        ...prev,
        [cardId]: status,
      }));
      setLastSavedNotice({
        id: cardId,
        label: RATING_MAP[status]?.label ?? status,
        status,
      });

      if (onlyUnmastered && status === 'mastered') {
        const nextLength = filteredCards.length - 1;
        setCurrentIndex((prev) =>
          nextLength > 0 ? Math.min(prev, nextLength - 1) : 0
        );
        setIsFlipped(false);
        return;
      }

      if (safeIndex < filteredCards.length - 1) {
        setCurrentIndex(safeIndex + 1);
        setIsFlipped(false);
      }
    },
    [currentCard, onlyUnmastered, filteredCards.length, safeIndex]
  );

  const handleResetProgress = () => {
    setProgress({});
    setCurrentIndex(0);
    setIsFlipped(false);
    setConfirmReset(false);
    setLastSavedNotice(null);
  };

  // Global keyboard shortcuts: Space to flip, ArrowLeft/Right to navigate, 1/2/3 to rate
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = e.target?.tagName;
      if (
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        tag === 'SELECT' ||
        e.target?.isContentEditable
      ) {
        return;
      }

      if (e.code === 'Space') {
        if (!currentCard) return;
        e.preventDefault();
        handleFlip();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === '1' && currentCard) {
        e.preventDefault();
        handleRate('unlearned');
      } else if (e.key === '2' && currentCard) {
        e.preventDefault();
        handleRate('unsure');
      } else if (e.key === '3' && currentCard) {
        e.preventDefault();
        handleRate('mastered');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentCard, handleFlip, handlePrev, handleNext, handleRate]);

  const unmasteredInScope = moduleScopedCards.length - scopeMasteredCount;

  return (
    <div className="space-y-5">
      {/* Top breadcrumb + Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
            Flashcard Phản xạ · Lộ trình {STUDY_DAYS.length} Ngày
          </h1>
          <p className="mt-0.5 text-sm text-slate-600">
            {flashcards.length} thuật ngữ, công thức &amp; hàm cốt lõi chuẩn Level 3 — học gọn 50 thẻ mỗi ngày.
          </p>
        </div>

        {/* Quick Add Custom Term + Reset Progress Actions */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-end">
          {onOpenTermLookup && (
            <button
              type="button"
              onClick={(e) => {
                e.currentTarget.blur();
                onOpenTermLookup('');
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Tra mạng &amp; Thêm thẻ</span>
            </button>
          )}
          {confirmReset ? (
            <div className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs">
              <span className="font-medium text-rose-800">Xóa toàn bộ tiến độ?</span>
              <button
                type="button"
                onClick={handleResetProgress}
                className="rounded-md bg-rose-600 px-2 py-0.5 font-medium text-white hover:bg-rose-700"
              >
                Xác nhận
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="rounded-md px-2 py-0.5 font-medium text-slate-600 hover:bg-white"
              >
                Hủy
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.currentTarget.blur();
                setConfirmReset(true);
              }}
              disabled={
                overallMetrics.mastered +
                  overallMetrics.unsure +
                  overallMetrics.unlearned ===
                0
              }
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-45"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Đặt lại tiến độ</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar Card */}
      <section
        aria-label="Tiến độ học Flashcard"
        className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-sm font-semibold text-slate-900">
              Tổng tiến độ đã thuộc (Đã chắc)
            </span>
            {selectedDayStat && (
              <span className="rounded-md bg-blue-50 px-2 py-0.5 font-mono text-xs font-semibold text-blue-700 tabular-nums">
                Ngày {selectedDayStat.day}: {selectedDayStat.mastered}/
                {selectedDayStat.total} ({selectedDayStat.percent}%)
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-2 font-mono tabular-nums">
            <span className="text-lg font-bold text-teal-700">
              {overallMetrics.mastered}
            </span>
            <span className="text-sm text-slate-400">/</span>
            <span className="text-sm font-semibold text-slate-700">
              {overallMetrics.total} thẻ
            </span>
            <span className="ml-1 rounded-md bg-teal-50 px-2 py-0.5 text-xs font-semibold text-teal-700 ring-1 ring-inset ring-teal-200/80">
              {overallMetrics.masteredPercent}%
            </span>
          </div>
        </div>

        <div
          className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-100"
          role="progressbar"
          aria-valuenow={overallMetrics.mastered}
          aria-valuemin={0}
          aria-valuemax={overallMetrics.total}
          aria-label="Số thẻ đã chắc trên tổng số thẻ"
        >
          <div
            className="h-full rounded-full bg-teal-500 transition-all duration-300 ease-out"
            style={{ width: `${overallMetrics.masteredPercent}%` }}
          />
        </div>

        <div className="mt-3.5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-teal-500" />
            <span>Đã chắc:</span>
            <strong className="font-mono font-semibold text-slate-900 tabular-nums">
              {overallMetrics.mastered}
            </strong>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <span>Còn lơ mơ:</span>
            <strong className="font-mono font-semibold text-slate-900 tabular-nums">
              {overallMetrics.unsure}
            </strong>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-400" />
            <span>Chưa thuộc:</span>
            <strong className="font-mono font-semibold text-slate-900 tabular-nums">
              {overallMetrics.unlearned}
            </strong>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-slate-300" />
            <span>Chưa đánh giá:</span>
            <strong className="font-mono font-semibold text-slate-900 tabular-nums">
              {overallMetrics.unseen}
            </strong>
          </span>
        </div>
      </section>

      {/* 7-Day Selector Bar (50 terms per day) */}
      <section
        aria-label="Chọn ngày học theo lộ trình 7 ngày"
        className="space-y-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs"
      >
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 inline-flex items-center gap-1 text-xs font-semibold text-slate-500">
            <CalendarDays className="h-3.5 w-3.5 text-blue-600" />
            <span>Lịch học:</span>
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.currentTarget.blur();
              handleSelectDay('ALL');
            }}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
              selectedDay === 'ALL'
                ? 'border-blue-700 bg-blue-700 text-white shadow-2xs'
                : 'border-slate-200 bg-slate-50/70 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
            }`}
          >
            <span>Tất cả {STUDY_DAYS.length} ngày</span>
            <span
              className={`font-mono text-[11px] tabular-nums ${
                selectedDay === 'ALL' ? 'text-blue-200' : 'text-slate-400'
              }`}
            >
              {flashcards.length}
            </span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.currentTarget.blur();
              handleSelectDay('CUSTOM');
            }}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
              selectedDay === 'CUSTOM'
                ? 'border-teal-700 bg-teal-700 text-white shadow-2xs'
                : 'border-teal-200 bg-teal-50/70 text-teal-800 hover:border-teal-300 hover:bg-teal-100/70'
            }`}
          >
            <Globe className="h-3.5 w-3.5" />
            <span>Tự thêm</span>
            <span
              className={`font-mono text-[11px] tabular-nums ${
                selectedDay === 'CUSTOM' ? 'text-teal-200' : 'text-teal-700'
              }`}
            >
              {customCardCount}
            </span>
          </button>

          {dayProgressStats.map((d) => {
            const isActive = selectedDay === d.day;
            return (
              <button
                key={d.day}
                type="button"
                onClick={(e) => {
                  e.currentTarget.blur();
                  handleSelectDay(d.day);
                }}
                title={`${d.shortLabel}: ${d.title}`}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'border-blue-700 bg-blue-700 text-white shadow-2xs'
                    : d.done
                      ? 'border-teal-200 bg-teal-50 text-teal-800 hover:border-teal-300'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span>{d.shortLabel}</span>
                <span
                  className={`font-mono text-[10px] tabular-nums ${
                    isActive
                      ? 'text-blue-200'
                      : d.done
                        ? 'text-teal-700'
                        : 'text-slate-400'
                  }`}
                >
                  {d.mastered}/{d.total}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Day Theme Banner */}
        {selectedDayMeta && selectedDayStat && (
          <div className="flex flex-col gap-2 rounded-xl border border-blue-100 bg-blue-50/50 px-4 py-3 text-xs sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-0.5">
              <p className="font-bold text-slate-900">
                {selectedDayMeta.shortLabel}: {selectedDayMeta.title}
              </p>
              <p className="text-slate-600">{selectedDayMeta.dailyAction}</p>
            </div>
            {selectedDay < STUDY_DAYS.length && (
              <button
                type="button"
                onClick={(e) => {
                  e.currentTarget.blur();
                  handleSelectDay(selectedDay + 1);
                }}
                className="inline-flex w-fit shrink-0 items-center gap-1 rounded-lg border border-blue-200 bg-white px-2.5 py-1.5 font-semibold text-blue-700 transition-colors hover:bg-blue-50"
              >
                <span>Sang Ngày {selectedDay + 1}</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Module Pills + Toggle Switch "Chỉ xem thẻ chưa thuộc" + Shuffle */}
        <div className="flex flex-col gap-3 border-t border-slate-100 pt-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-1.5">
            {MODULE_FILTERS.map((mod) => {
              const isActive = selectedModule === mod.code;
              const count = moduleCounts[mod.code];
              return (
                <button
                  key={mod.code}
                  type="button"
                  disabled={mod.code !== 'ALL' && count === 0}
                  onClick={(e) => {
                    e.currentTarget.blur();
                    handleSelectModule(mod.code);
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all disabled:cursor-not-allowed disabled:opacity-35 ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                  }`}
                >
                  <span>{mod.label}</span>
                  <span
                    className={`font-mono text-[11px] tabular-nums ${
                      isActive ? 'text-slate-300' : 'text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={onlyUnmastered}
              onClick={(e) => {
                e.currentTarget.blur();
                handleToggleUnmastered();
              }}
              className="group inline-flex items-center gap-2.5 text-left focus:outline-none"
            >
              <span
                className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                  onlyUnmastered
                    ? 'bg-slate-900'
                    : 'bg-slate-200 group-hover:bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-xs transition-transform ${
                    onlyUnmastered ? 'translate-x-4.5' : 'translate-x-1'
                  }`}
                />
              </span>
              <span className="text-xs font-medium text-slate-700">
                Chỉ xem thẻ chưa thuộc
                <span className="ml-1.5 font-mono text-[11px] text-slate-400 tabular-nums">
                  ({unmasteredInScope})
                </span>
              </span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.currentTarget.blur();
                handleToggleShuffle();
              }}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors ${
                shuffleOrder
                  ? 'border-blue-200 bg-blue-50 text-blue-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
              title="Xáo trộn thứ tự thẻ"
            >
              <Shuffle className="h-3.5 w-3.5" />
              <span>{shuffleOrder ? 'Đang xáo trộn' : 'Xáo trộn'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Flashcard Stage */}
      {currentCard ? (
        <section className="mx-auto max-w-3xl space-y-5">
          {/* Deck Navigation Header */}
          <div className="flex items-center justify-between gap-3 px-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-slate-700 tabular-nums">
                Thẻ {String(safeIndex + 1).padStart(2, '0')} /{' '}
                {String(filteredCards.length).padStart(2, '0')}
              </span>
              {onlyUnmastered && (
                <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-800 ring-1 ring-inset ring-amber-200/80">
                  Lọc chưa thuộc
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {lastSavedNotice && (
                <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] text-slate-600">
                  <Check className="h-3 w-3 text-teal-600" />
                  <span>
                    {lastSavedNotice.id}: {lastSavedNotice.label}
                  </span>
                </span>
              )}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.currentTarget.blur();
                    handlePrev();
                  }}
                  disabled={safeIndex === 0}
                  aria-label="Thẻ trước"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.currentTarget.blur();
                    handleNext();
                  }}
                  disabled={safeIndex >= filteredCards.length - 1}
                  aria-label="Thẻ tiếp theo"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* 3D Flip Card */}
          <div className="flip-scene">
            <div
              key={currentCard.id}
              role="button"
              tabIndex={0}
              aria-pressed={isFlipped}
              aria-label={
                isFlipped
                  ? 'Mặt sau đáp án. Nhấn để lật lại mặt trước.'
                  : 'Mặt trước câu hỏi. Nhấn để lật xem đáp án.'
              }
              onClick={handleFlip}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleFlip();
                }
              }}
              className={`flip-card grid cursor-pointer focus:outline-none ${
                isFlipped ? 'is-flipped' : ''
              }`}
            >
              {/* Front Face (Question) */}
              <div className="flip-face col-start-1 row-start-1 flex min-h-[300px] flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs transition-colors hover:border-slate-300 sm:min-h-[340px] sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {currentCard.isCustom && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-teal-600 px-2 py-0.5 font-mono text-[11px] font-semibold text-white">
                        <Globe className="h-3 w-3" />
                        <span>Tự thêm</span>
                      </span>
                    )}
                    {currentCard.day && (
                      <span className="rounded-md bg-slate-900 px-2 py-0.5 font-mono text-[11px] font-semibold text-white">
                        Ngày {currentCard.day}
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-xs font-semibold ${
                        currentModuleMeta?.badgeClass ??
                        'border-slate-200 bg-slate-100 text-slate-700'
                      }`}
                    >
                      {currentCard.module}
                    </span>
                    {currentCard.tag && (
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                        <KeywordText text={currentCard.tag} />
                      </span>
                    )}
                    <code className="font-mono text-xs text-slate-400">
                      {currentCard.id}
                    </code>
                  </div>

                  {currentRatingMeta ? (
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${currentRatingMeta.badgeClass}`}
                    >
                      <span>{currentRatingMeta.label}</span>
                    </span>
                  ) : (
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs text-slate-400">
                      Chưa đánh giá
                    </span>
                  )}
                </div>

                <div className="my-8 flex flex-col items-center justify-center text-center">
                  <span className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                    Mặt trước · Thuật ngữ / Câu hỏi
                  </span>
                  <h2 className="max-w-xl text-xl font-bold leading-snug tracking-tight text-slate-900 sm:text-2xl">
                    <KeywordText text={currentCard.question} />
                  </h2>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 border-t border-slate-100 pt-4 text-xs text-slate-400">
                  <span>Nhấn vào thẻ hoặc bấm</span>
                  <kbd className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-[11px] font-medium text-slate-600">
                    Space
                  </kbd>
                  <span>để lật xem đáp án · Bấm từ</span>
                  <span className="border-b border-dashed border-blue-500 text-blue-600">
                    gạch chân xanh
                  </span>
                  <span>để xem giải thích nhanh</span>
                </div>
              </div>

              {/* Back Face (Answer) */}
              <div className="flip-face flip-face-back col-start-1 row-start-1 flex min-h-[300px] flex-col justify-between rounded-2xl border border-blue-200/90 bg-gradient-to-b from-white to-blue-50/35 p-6 shadow-xs sm:min-h-[340px] sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center rounded-md bg-blue-600 px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wide text-white">
                      Đáp án
                    </span>
                    {currentCard.day && (
                      <span className="rounded-md bg-slate-900 px-2 py-0.5 font-mono text-[11px] font-semibold text-white">
                        Ngày {currentCard.day}
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-xs font-semibold ${
                        currentModuleMeta?.badgeClass ??
                        'border-slate-200 bg-slate-100 text-slate-700'
                      }`}
                    >
                      {currentCard.module}
                    </span>
                    <code className="font-mono text-xs text-slate-400">
                      {currentCard.id}
                    </code>
                  </div>

                  {currentRatingMeta && (
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${currentRatingMeta.badgeClass}`}
                    >
                      {currentRatingMeta.label}
                    </span>
                  )}
                </div>

                <div className="my-6 flex flex-col items-center justify-center text-center select-text">
                  <p className="mb-3 max-w-lg text-xs font-medium text-slate-500">
                    <KeywordText text={currentCard.question} />
                  </p>
                  <p className="max-w-xl text-base font-medium leading-relaxed text-slate-900 sm:text-lg">
                    <KeywordText text={currentCard.answer} />
                  </p>
                  {currentCard.isCustom && (
                    <div
                      className="mt-4 flex flex-wrap items-center justify-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {currentCard.sourceUrl && (
                        <a
                          href={currentCard.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-white px-2.5 py-1 text-xs font-medium text-blue-700 hover:bg-blue-50"
                        >
                          <Globe className="h-3 w-3" />
                          <span>Nguồn: {currentCard.sourceTitle || 'Wikipedia'}</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          removeCustomFlashcard(currentCard.id);
                          setIsFlipped(false);
                        }}
                        className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Xóa thẻ tự thêm</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center gap-2 border-t border-blue-100/80 pt-4 text-xs text-slate-400">
                  <span>Tự đánh giá mức độ nhớ bên dưới hoặc bấm</span>
                  <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 font-mono text-[11px] font-medium text-slate-600">
                    Space
                  </kbd>
                  <span>để lật lại</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Rating Buttons */}
          <div className="space-y-2.5">
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              {RATING_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = currentStatus === opt.status;

                return (
                  <button
                    key={opt.status}
                    type="button"
                    onClick={(e) => {
                      e.currentTarget.blur();
                      handleRate(opt.status);
                    }}
                    className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold transition-all ${
                      isSelected ? opt.activeClass : opt.baseClass
                    }`}
                  >
                    <span className="inline-flex items-center gap-2">
                      <Icon className="h-4.5 w-4.5 shrink-0" strokeWidth={2} />
                      <span>{opt.label}</span>
                    </span>
                    <kbd
                      className={`rounded border px-1.5 py-0.5 font-mono text-[11px] font-medium ${opt.kbdClass}`}
                    >
                      {opt.shortcut}
                    </kbd>
                  </button>
                );
              })}
            </div>

            <p className="text-center text-xs text-slate-400">
              Phím tắt:{' '}
              <code className="font-mono text-slate-500">Space</code> lật thẻ ·{' '}
              <code className="font-mono text-slate-500">← / →</code> chuyển thẻ ·{' '}
              <code className="font-mono text-slate-500">1 / 2 / 3</code> đánh giá nhanh
            </p>
          </div>
        </section>
      ) : (
        <section className="mx-auto max-w-2xl rounded-2xl border border-teal-200/80 bg-white px-6 py-12 text-center shadow-2xs">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-slate-900">
            {selectedDay === 'CUSTOM' && customCardCount === 0
              ? 'Chưa có thẻ Flashcard tự thêm nào'
              : onlyUnmastered
                ? 'Bạn đã chắc toàn bộ thẻ trong bộ lọc này!'
                : 'Không có flashcard nào trong bộ lọc hiện tại'}
          </h2>
          <p className="mx-auto mt-1.5 max-w-md text-sm text-slate-600">
            {selectedDay === 'CUSTOM' && customCardCount === 0
              ? 'Bạn có thể bôi đen bất kỳ thuật ngữ nào ở Tab 12 Chuyên đề hoặc các tab khác để hệ thống tự lên mạng tra cứu và lưu vào đây.'
              : onlyUnmastered
                ? 'Tuyệt vời! Mọi thẻ thuộc phạm vi đang chọn đều đã đạt trạng thái "Đã chắc". Hãy sang ngày tiếp theo hoặc tắt bộ lọc để ôn lại.'
                : 'Hãy thử chuyển sang bộ lọc "Tất cả" để xem toàn bộ ngân hàng thẻ.'}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
            {selectedDay === 'CUSTOM' && onOpenTermLookup && (
              <button
                type="button"
                onClick={() => onOpenTermLookup('')}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-700 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-800"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Tra mạng &amp; Thêm thẻ đầu tiên</span>
              </button>
            )}
            {selectedDay !== 'ALL' && selectedDay !== 'CUSTOM' && selectedDay < STUDY_DAYS.length && (
              <button
                type="button"
                onClick={() => handleSelectDay(selectedDay + 1)}
                className="rounded-xl bg-blue-700 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-800"
              >
                Sang Ngày {selectedDay + 1} (50 thẻ tiếp theo)
              </button>
            )}
            {onlyUnmastered && (
              <button
                type="button"
                onClick={handleToggleUnmastered}
                className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
              >
                Tắt lọc &ldquo;Chỉ xem thẻ chưa thuộc&rdquo;
              </button>
            )}
            {(selectedModule !== 'ALL' || selectedDay !== 'ALL') && (
              <button
                type="button"
                onClick={() => {
                  handleSelectDay('ALL');
                  handleSelectModule('ALL');
                }}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Xem toàn bộ {flashcards.length} thẻ
              </button>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
