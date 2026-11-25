import { useMemo } from 'react';
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Code2,
  Database,
  Zap,
} from 'lucide-react';
import { STUDY_DAYS } from '../constants/studyPlan.js';
import { loadFlashcardProgress } from '../utils/storage.js';

export default function OverviewPage({
  stats,
  flashcards = [],
  onSelectTab,
  onSelectStudyDay,
}) {
  const { moduleRows, totals } = stats;
  const flashcardProgress = useMemo(() => loadFlashcardProgress(), []);

  const dayStats = useMemo(() => {
    return STUDY_DAYS.map((plan) => {
      const dayCards = flashcards.filter((c) => c.day === plan.day);
      const mastered = dayCards.filter(
        (c) => flashcardProgress[c.id] === 'mastered'
      ).length;
      const total = dayCards.length;
      const percent = total > 0 ? Math.round((mastered / total) * 100) : 0;
      return {
        ...plan,
        total,
        mastered,
        percent,
        done: total > 0 && mastered === total,
      };
    });
  }, [flashcards, flashcardProgress]);

  const totalMasteredCards = useMemo(
    () =>
      flashcards.filter((c) => flashcardProgress[c.id] === 'mastered').length,
    [flashcards, flashcardProgress]
  );

  const summaryCards = [
    {
      tabId: 'flashcards',
      label: 'Flashcard Phản xạ',
      count: totals.flashcards,
      unit: `thẻ · ${STUDY_DAYS.length} ngày × 50`,
      icon: Zap,
      iconBg: 'bg-sky-50 text-sky-600',
    },
    {
      tabId: 'quizzes',
      label: 'Trắc nghiệm & Thi thử 90p',
      count: totals.quizzes,
      unit: 'câu SFIA Level 3',
      icon: ClipboardList,
      iconBg: 'bg-indigo-50 text-indigo-600',
    },
    {
      tabId: 'python',
      label: 'Code tay Python',
      count: totals.pythonTasks,
      unit: 'bài Python / Pandas',
      icon: Code2,
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      tabId: 'case-study',
      label: 'Case Study (R-A-T-S-M)',
      count: totals.caseStudies,
      unit: 'tình huống thực chiến',
      icon: BriefcaseBusiness,
      iconBg: 'bg-amber-50 text-amber-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Title & Data Source Info */}
      <section className="flex flex-col gap-4 border-b border-slate-200/80 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 shadow-2xs">
            <Database className="h-3.5 w-3.5 text-blue-600" />
            <span>Nguồn dữ liệu:</span>
            <code className="font-mono font-medium text-slate-900">
              src/data/index.js
            </code>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Lộ trình {STUDY_DAYS.length} ngày chinh phục AI Thực chiến VinUni (Level 3)
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-600">
            Kho ôn thi đầy đủ theo chuẩn{' '}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-800">
              SFIA Level 3
            </code>{' '}
            với <strong className="font-semibold text-slate-900">{totals.flashcards} thuật ngữ &amp; hàm</strong> chia
            đều <strong className="font-semibold text-slate-900">{STUDY_DAYS.length} ngày (50 thẻ/ngày)</strong>,{' '}
            <strong className="font-semibold text-slate-900">{totals.quizzes} câu trắc nghiệm</strong>,{' '}
            <strong className="font-semibold text-slate-900">{totals.pythonTasks} bài code tay</strong> và{' '}
            <strong className="font-semibold text-slate-900">{totals.caseStudies} Case Study</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-2xs sm:self-auto">
          <div className="text-right">
            <p className="text-xs font-medium text-slate-500">Tổng ngân hàng</p>
            <p className="font-mono text-xl font-semibold text-slate-900 tabular-nums">
              {totals.grandTotal}
            </p>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="text-xs text-slate-500">
            <p className="font-medium text-slate-700">Đã chắc Flashcard</p>
            <p className="font-mono font-semibold text-teal-700 tabular-nums">
              {totalMasteredCards} / {totals.flashcards}
            </p>
          </div>
        </div>
      </section>

      {/* 4 Summary Cards */}
      <section aria-label="Tổng quan theo 4 chế độ luyện tập">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {summaryCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.tabId}
                type="button"
                onClick={() => onSelectTab(card.tabId)}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 text-left transition-all hover:border-slate-300 hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${card.iconBg}`}
                  >
                    <Icon className="h-4.5 w-4.5" strokeWidth={1.9} />
                  </span>
                  <ArrowRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-600" />
                </div>

                <div className="mt-4 space-y-1">
                  <p className="text-xs font-medium text-slate-500">{card.label}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-2xl font-bold text-slate-900 tabular-nums">
                      {card.count}
                    </span>
                    <span className="text-xs text-slate-500">{card.unit}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 7-Day Study Plan Grid (50 terms/day = 350 terms) */}
      <section
        aria-labelledby="study-plan-heading"
        className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs"
      >
        <div className="flex flex-col gap-2 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4.5 w-4.5 text-blue-600" />
              <h2
                id="study-plan-heading"
                className="text-base font-semibold text-slate-900"
              >
                Lộ trình học {STUDY_DAYS.length} ngày — 50 thuật ngữ &amp; hàm mỗi ngày
              </h2>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Nhấn vào từng ngày để vào thẳng bộ 50 Flashcard trọng tâm của ngày đó và theo dõi tiến độ thuộc bài.
            </p>
          </div>
          <span className="inline-flex w-fit items-center rounded-lg bg-teal-50 px-3 py-1 font-mono text-xs font-semibold text-teal-800 ring-1 ring-inset ring-teal-200/80 tabular-nums">
            {totalMasteredCards} / {totals.flashcards} thẻ đã chắc
          </span>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3.5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {dayStats.map((item) => (
            <button
              key={item.day}
              type="button"
              onClick={() => onSelectStudyDay?.(item.day)}
              className={`group flex flex-col justify-between rounded-xl border p-4 text-left transition-all hover:shadow-xs ${
                item.done
                  ? 'border-teal-200 bg-teal-50/40 hover:border-teal-300'
                  : 'border-slate-200/90 bg-slate-50/40 hover:border-slate-300 hover:bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="rounded-md bg-slate-900 px-2 py-0.5 font-mono text-[11px] font-bold text-white">
                      {item.shortLabel}
                    </span>
                    {item.modules.map((m) => (
                      <span
                        key={m}
                        className="rounded border border-slate-200 bg-white px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-600"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                  {item.done ? (
                    <CheckCircle2 className="h-4 w-4 text-teal-600" />
                  ) : (
                    <ArrowRight className="h-3.5 w-3.5 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-700" />
                  )}
                </div>

                <h3 className="mt-3 text-sm font-bold leading-snug text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-500">
                  {item.summary}
                </p>
              </div>

              <div className="mt-4 space-y-1.5 border-t border-slate-200/60 pt-3">
                <div className="flex items-center justify-between font-mono text-[11px] tabular-nums">
                  <span className="text-slate-500">Đã chắc</span>
                  <span className="font-semibold text-slate-800">
                    {item.mastered} / {item.total} ({item.percent}%)
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200/70">
                  <div
                    className="h-full rounded-full bg-teal-500 transition-all"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Main Module Statistics Table (M1 - M4) */}
      <section
        aria-labelledby="module-stats-heading"
        className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs"
      >
        <div className="flex flex-col gap-2 border-b border-slate-200/80 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2
              id="module-stats-heading"
              className="text-base font-semibold text-slate-900"
            >
              Thống kê số lượng câu hiện có theo từng Module
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Tổng hợp trực tiếp các mục gắn nhãn{' '}
              <code className="font-mono text-slate-700">M1</code>,{' '}
              <code className="font-mono text-slate-700">M2</code>,{' '}
              <code className="font-mono text-slate-700">M3</code>,{' '}
              <code className="font-mono text-slate-700">M4</code> từ{' '}
              <code className="font-mono text-slate-700">src/data/examData.json</code>
            </p>
          </div>
          <span className="inline-flex w-fit items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 font-mono text-xs font-medium text-slate-700 tabular-nums">
            {totals.moduleItems} câu gắn Module
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/70 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-6 py-3.5">Module</th>
                <th className="px-4 py-3.5 text-center">Trọng số thi</th>
                <th className="px-4 py-3.5 text-right">Flashcard</th>
                <th className="px-4 py-3.5 text-right">Trắc nghiệm</th>
                <th className="px-6 py-3.5 text-right">Tổng số câu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {moduleRows.map((row) => {
                const sharePercent =
                  totals.moduleItems > 0
                    ? Math.round((row.total / totals.moduleItems) * 100)
                    : 0;
                const barWidth = Math.round(
                  (row.total / totals.maxModuleTotal) * 100
                );

                return (
                  <tr
                    key={row.code}
                    className="transition-colors hover:bg-slate-50/70"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <span
                          className={`mt-0.5 inline-flex shrink-0 items-center justify-center rounded-md border px-2 py-0.5 font-mono text-xs font-semibold ${row.badgeClass}`}
                        >
                          {row.code}
                        </span>
                        <div>
                          <p className="font-medium text-slate-900">{row.title}</p>
                          <p className="mt-0.5 text-xs text-slate-500">{row.topics}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-center">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-0.5 font-mono text-xs font-semibold ${
                          row.weight >= 2
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        ×{row.weight}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-right font-mono text-sm font-medium text-slate-700 tabular-nums">
                      {row.flashcardsCount}
                    </td>

                    <td className="px-4 py-4 text-right font-mono text-sm font-medium text-slate-700 tabular-nums">
                      {row.quizzesCount}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col items-end gap-1.5">
                        <div className="flex items-baseline gap-2">
                          <span className="font-mono text-base font-semibold text-slate-900 tabular-nums">
                            {row.total}
                          </span>
                          <span className="font-mono text-xs text-slate-400 tabular-nums">
                            ({sharePercent}%)
                          </span>
                        </div>
                        <div className="h-1.5 w-28 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full ${row.barClass}`}
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t border-slate-200 bg-slate-50/80 font-semibold text-slate-900">
                <td className="px-6 py-3.5 text-sm">Tổng cộng (M1 – M4)</td>
                <td className="px-4 py-3.5 text-center font-mono text-xs font-normal text-slate-500">
                  M2 &amp; M3 ưu tiên ×2
                </td>
                <td className="px-4 py-3.5 text-right font-mono text-sm tabular-nums">
                  {totals.flashcards}
                </td>
                <td className="px-4 py-3.5 text-right font-mono text-sm tabular-nums">
                  {totals.quizzes}
                </td>
                <td className="px-6 py-3.5 text-right font-mono text-base tabular-nums">
                  {totals.moduleItems}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Supplementary cross-module practical sections */}
        <div className="flex flex-col gap-3 border-t border-slate-200/80 bg-slate-50/40 px-6 py-4 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span>Phần Tự luận thực chiến tách riêng:</span>
            <span className="inline-flex items-center gap-1.5">
              <strong className="font-medium text-slate-800">Code tay Python:</strong>
              <code className="rounded bg-white px-1.5 py-0.5 font-mono font-semibold text-emerald-700 ring-1 ring-slate-200">
                {totals.pythonTasks} bài
              </code>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <strong className="font-medium text-slate-800">Case Study R-A-T-S-M:</strong>
              <code className="rounded bg-white px-1.5 py-0.5 font-mono font-semibold text-amber-700 ring-1 ring-slate-200">
                {totals.caseStudies} tình huống
              </code>
            </span>
          </div>

          <span className="font-mono text-xs text-slate-500">
            Font: Be Vietnam Pro / <span className="text-slate-800">JetBrains Mono · O(N²)</span>
          </span>
        </div>
      </section>
    </div>
  );
}
