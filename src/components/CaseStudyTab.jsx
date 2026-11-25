import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  BookOpenCheck,
  CheckCircle2,
  Clock,
  Columns2,
  EyeOff,
  Pause,
  Play,
  RotateCcw,
} from 'lucide-react';
import { RATSM_PILLARS } from '../constants/modules.js';
import { formatCountdown } from '../utils/quiz.js';
import {
  loadCaseStudyDrafts,
  saveCaseStudyDrafts,
} from '../utils/storage.js';

const CASE_TIMER_SECONDS = 15 * 60; // 15:00 per case

const PILLAR_HINTS = {
  rootCause:
    'Xác định nguyên nhân gốc rễ (dữ liệu, phân quyền, drift, bias, lỗ hổng hệ thống...)',
  architecture:
    'Đề xuất kiến trúc kỹ thuật cụ thể (metadata, Hybrid Search/Rerank, Shadow Mode, SHAP/LIME...)',
  tradeoffs:
    'Phân tích đánh đổi giữa Độ chính xác, Độ trễ (p95), Chi phí API/Compute và Rủi ro vận hành...',
  safetyEthics:
    'Phòng thủ bảo mật, phân quyền RBAC, bảo vệ PII, công bằng (Fairness), Human-in-the-Loop...',
  metricsRollout:
    'Chỉ số đánh giá (Golden Set, Eval Gate, Recall@K, Faithfulness) và lộ trình Canary / Rollback...',
};

function createEmptyDraft() {
  return {
    rootCause: '',
    architecture: '',
    tradeoffs: '',
    safetyEthics: '',
    metricsRollout: '',
    compared: false,
  };
}

export default function CaseStudyTab({ caseStudies = [], onBackToOverview }) {
  const [drafts, setDrafts] = useState(() => loadCaseStudyDrafts());
  const [selectedCaseId, setSelectedCaseId] = useState(
    () => caseStudies[0]?.id ?? null
  );
  // Independent 15-minute timer state per case study
  const [timers, setTimers] = useState(() =>
    Object.fromEntries(
      caseStudies.map((cs) => [
        cs.id,
        { remaining: CASE_TIMER_SECONDS, running: false },
      ])
    )
  );
  const [showCompareByCase, setShowCompareByCase] = useState({});
  const comparisonRef = useRef(null);

  // Sync user drafts to localStorage
  useEffect(() => {
    saveCaseStudyDrafts(drafts);
  }, [drafts]);

  const currentCase = useMemo(
    () =>
      caseStudies.find((cs) => cs.id === selectedCaseId) ??
      caseStudies[0] ??
      null,
    [caseStudies, selectedCaseId]
  );

  const activeCaseId = currentCase?.id ?? null;
  const activeTimer = activeCaseId
    ? timers[activeCaseId] ?? { remaining: CASE_TIMER_SECONDS, running: false }
    : { remaining: CASE_TIMER_SECONDS, running: false };

  // Tick active case countdown timer
  useEffect(() => {
    if (!activeCaseId || !activeTimer.running || activeTimer.remaining <= 0) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setTimers((prev) => {
        const cur = prev[activeCaseId] ?? {
          remaining: CASE_TIMER_SECONDS,
          running: false,
        };
        if (!cur.running) return prev;
        const nextRemaining = Math.max(cur.remaining - 1, 0);
        return {
          ...prev,
          [activeCaseId]: {
            remaining: nextRemaining,
            running: nextRemaining > 0,
          },
        };
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [activeCaseId, activeTimer.running, activeTimer.remaining]);

  if (!currentCase) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
        Chưa có tình huống Case Study nào trong <code>src/data/examData.json</code>.
      </div>
    );
  }

  const currentDraft = drafts[currentCase.id] ?? createEmptyDraft();
  const isComparing = Boolean(showCompareByCase[currentCase.id]);
  const filledPillarsCount = RATSM_PILLARS.filter(
    (p) => (currentDraft[p.key] ?? '').trim().length > 0
  ).length;
  const isTimeUp = activeTimer.remaining === 0;

  const handleSelectCase = (nextId) => {
    if (nextId === currentCase.id) return;
    // Pause current timer cleanly when switching case
    setTimers((prev) => {
      const cur = prev[currentCase.id];
      if (!cur?.running) return prev;
      return {
        ...prev,
        [currentCase.id]: { ...cur, running: false },
      };
    });
    setSelectedCaseId(nextId);
  };

  const handleToggleTimer = () => {
    setTimers((prev) => {
      const cur = prev[currentCase.id] ?? {
        remaining: CASE_TIMER_SECONDS,
        running: false,
      };
      const remaining = cur.remaining === 0 ? CASE_TIMER_SECONDS : cur.remaining;
      return {
        ...prev,
        [currentCase.id]: {
          remaining,
          running: !cur.running,
        },
      };
    });
  };

  const handleResetTimer = () => {
    setTimers((prev) => ({
      ...prev,
      [currentCase.id]: {
        remaining: CASE_TIMER_SECONDS,
        running: false,
      },
    }));
  };

  const handleChangeField = (pillarKey, value) => {
    // Auto-start the 15-minute clock on first typing if untouched at 15:00
    setTimers((prev) => {
      const cur = prev[currentCase.id] ?? {
        remaining: CASE_TIMER_SECONDS,
        running: false,
      };
      if (!cur.running && cur.remaining === CASE_TIMER_SECONDS && value.trim()) {
        return {
          ...prev,
          [currentCase.id]: { ...cur, running: true },
        };
      }
      return prev;
    });

    setDrafts((prev) => ({
      ...prev,
      [currentCase.id]: {
        ...(prev[currentCase.id] ?? createEmptyDraft()),
        [pillarKey]: value,
      },
    }));
  };

  const handleToggleCompare = () => {
    const nextOpen = !isComparing;
    setShowCompareByCase((prev) => ({
      ...prev,
      [currentCase.id]: nextOpen,
    }));

    if (nextOpen) {
      // Pause timer and record compared flag
      setTimers((prev) => {
        const cur = prev[currentCase.id];
        if (!cur?.running) return prev;
        return {
          ...prev,
          [currentCase.id]: { ...cur, running: false },
        };
      });
      setDrafts((prev) => ({
        ...prev,
        [currentCase.id]: {
          ...(prev[currentCase.id] ?? createEmptyDraft()),
          compared: true,
        },
      }));
      window.requestAnimationFrame(() => {
        comparisonRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      });
    }
  };

  const handleClearCaseDraft = () => {
    setDrafts((prev) => ({
      ...prev,
      [currentCase.id]: createEmptyDraft(),
    }));
    setShowCompareByCase((prev) => ({
      ...prev,
      [currentCase.id]: false,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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
            Phòng luyện Case Study (R-A-T-S-M)
          </h1>
          <p className="mt-0.5 text-sm text-slate-600">
            Rèn tư duy phân tích tình huống triển khai AI thực chiến theo 5 trụ cột trong khung thời gian 15 phút mỗi case.
          </p>
        </div>

        {/* 15-Minute Countdown Timer Widget */}
        <div className="flex flex-wrap items-center gap-2.5 self-start rounded-2xl border border-slate-200/90 bg-white px-4 py-2.5 shadow-2xs lg:self-auto">
          <div
            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 font-mono text-base font-bold tabular-nums ${
              isTimeUp
                ? 'border-rose-300 bg-rose-50 text-rose-700'
                : activeTimer.remaining <= 180
                  ? 'border-amber-300 bg-amber-50 text-amber-800'
                  : activeTimer.running
                    ? 'border-blue-200 bg-blue-50 text-blue-800'
                    : 'border-slate-200 bg-slate-50 text-slate-900'
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>{formatCountdown(activeTimer.remaining)}</span>
          </div>

          <button
            type="button"
            onClick={handleToggleTimer}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
              activeTimer.running
                ? 'border border-slate-200 bg-slate-100 text-slate-800 hover:bg-slate-200/80'
                : 'bg-slate-900 text-white hover:bg-blue-700'
            }`}
          >
            {activeTimer.running ? (
              <>
                <Pause className="h-3.5 w-3.5" />
                <span>Tạm dừng</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>{isTimeUp ? 'Chạy lại 15:00' : 'Bắt đầu'}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleResetTimer}
            title="Đặt lại đồng hồ 15:00"
            className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Case Selector */}
      <section
        aria-label="Chọn tình huống Case Study"
        className="flex flex-wrap items-center gap-2"
      >
        {caseStudies.map((cs, idx) => {
          const isSelected = cs.id === currentCase.id;
          const draft = drafts[cs.id];
          const isDone = Boolean(draft?.compared);

          return (
            <button
              key={cs.id}
              type="button"
              onClick={() => handleSelectCase(cs.id)}
              className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all ${
                isSelected
                  ? 'border-slate-900 bg-slate-900 text-white shadow-2xs'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span
                className={`font-mono text-[11px] ${
                  isSelected ? 'text-amber-300' : 'text-slate-400'
                }`}
              >
                Case {idx + 1}
              </span>
              <span className="max-w-[280px] truncate">{cs.title}</span>
              {isDone && (
                <CheckCircle2
                  className={`h-3.5 w-3.5 shrink-0 ${
                    isSelected ? 'text-teal-300' : 'text-teal-600'
                  }`}
                />
              )}
            </button>
          );
        })}
      </section>

      {/* Scenario Card */}
      <section className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 font-mono text-xs font-semibold text-amber-800">
              {currentCase.id}
            </span>
            <span className="text-xs font-medium text-slate-500">
              Tình huống đề bài (Scenario)
            </span>
          </div>
          <span className="font-mono text-xs text-slate-500 tabular-nums">
            Đã điền {filledPillarsCount} / 5 trụ cột
          </span>
        </div>

        <h2 className="mt-3 text-lg font-bold leading-snug text-slate-900 sm:text-xl">
          {currentCase.title}
        </h2>
        <p className="mt-2.5 text-sm leading-relaxed text-slate-700">
          {currentCase.scenario}
        </p>

        {isTimeUp && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-semibold text-rose-800">
            Đã hết 15 phút bấm giờ! Bạn hãy bấm nút &ldquo;Đối chiếu bài mẫu&rdquo; bên dưới để tự rà soát các ý còn thiếu.
          </div>
        )}
      </section>

      {/* 5 Separated R-A-T-S-M Inputs */}
      <section aria-label="5 ô phân tích R-A-T-S-M" className="space-y-4">
        {RATSM_PILLARS.map((pillar, idx) => {
          const val = currentDraft[pillar.key] ?? '';
          return (
            <div
              key={pillar.key}
              className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label
                  htmlFor={`ratsm-${currentCase.id}-${pillar.key}`}
                  className="flex items-center gap-2.5 text-sm font-bold text-slate-900"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-900 font-mono text-xs font-bold text-white">
                    {pillar.code}
                  </span>
                  <span>
                    {idx + 1}. {pillar.label} ({pillar.code})
                  </span>
                </label>
                <span className="font-mono text-[11px] text-slate-400 tabular-nums">
                  {val.trim().length} ký tự
                </span>
              </div>

              <textarea
                id={`ratsm-${currentCase.id}-${pillar.key}`}
                value={val}
                onChange={(e) => handleChangeField(pillar.key, e.target.value)}
                rows={3}
                placeholder={PILLAR_HINTS[pillar.key]}
                className="mt-3 w-full resize-y rounded-xl border border-slate-200 bg-slate-50/40 p-3.5 text-sm leading-relaxed text-slate-900 placeholder:text-slate-400 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none"
              />
            </div>
          );
        })}

        {/* Action Row: Compare with Sample Answer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <button
            type="button"
            onClick={handleClearCaseDraft}
            disabled={filledPillarsCount === 0 && !isComparing}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-45"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Xóa nháp case này</span>
          </button>

          <button
            type="button"
            onClick={handleToggleCompare}
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold shadow-2xs transition-colors ${
              isComparing
                ? 'border border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200/80'
                : 'bg-slate-900 text-white hover:bg-blue-700'
            }`}
          >
            {isComparing ? (
              <>
                <EyeOff className="h-4 w-4" />
                <span>Ẩn đối chiếu bài mẫu</span>
              </>
            ) : (
              <>
                <Columns2 className="h-4 w-4" />
                <span>Đối chiếu bài mẫu</span>
              </>
            )}
          </button>
        </div>
      </section>

      {/* Side-by-Side Comparison View (User Writing vs sampleAnswer) */}
      {isComparing && (
        <section
          ref={comparisonRef}
          aria-label="Đối chiếu song song với bài mẫu R-A-T-S-M"
          className="space-y-4 rounded-2xl border border-blue-200/90 bg-white p-6 shadow-2xs"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <BookOpenCheck className="h-5 w-5 text-blue-700" />
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Đối chiếu song song theo khung R-A-T-S-M
                </h3>
                <p className="text-xs text-slate-500">
                  Cột trái là bài viết của bạn, cột phải là bài mẫu chuẩn từ{' '}
                  <code className="font-mono text-slate-700">sampleAnswer</code> để tự rà soát ý còn thiếu.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {RATSM_PILLARS.map((pillar, idx) => {
              const userText = (currentDraft[pillar.key] ?? '').trim();
              const sampleText = currentCase.sampleAnswer?.[pillar.key] ?? '';

              return (
                <div
                  key={pillar.key}
                  className="overflow-hidden rounded-xl border border-slate-200/90"
                >
                  <div className="flex items-center gap-2 border-b border-slate-200/80 bg-slate-50/80 px-4 py-2.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded bg-slate-900 font-mono text-[11px] font-bold text-white">
                      {pillar.code}
                    </span>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      {idx + 1}. {pillar.label}
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 divide-y divide-slate-200/80 md:grid-cols-2 md:divide-x md:divide-y-0">
                    {/* Left: User's Answer */}
                    <div className="bg-white p-4">
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Bài viết của bạn
                      </p>
                      {userText ? (
                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-800">
                          {userText}
                        </p>
                      ) : (
                        <p className="text-sm italic text-slate-400">
                          Bạn chưa nhập nội dung cho phần này.
                        </p>
                      )}
                    </div>

                    {/* Right: Sample Answer */}
                    <div className="bg-teal-50/35 p-4">
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-teal-700">
                        Bài mẫu chuẩn
                      </p>
                      <p className="text-sm leading-relaxed text-slate-800">
                        {sampleText}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
