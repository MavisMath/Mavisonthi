import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calculator,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Compass,
  Copy,
  Cpu,
  ExternalLink,
  Lightbulb,
  RotateCcw,
  Sparkles,
  Target,
  Trophy,
  Video,
  XCircle,
} from 'lucide-react';
import { TOPIC_GROUPS, TOPICS } from '../data/topicsData.js';
import { loadTopicsProgress, saveTopicsProgress } from '../utils/storage.js';
import KeywordText from './KeywordText.jsx';

const GROUP_MAP = Object.fromEntries(TOPIC_GROUPS.map((g) => [g.id, g]));
const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

const STUDY_STEPS = [
  { num: 1, short: 'Bản chất & Công thức', icon: BookOpen },
  { num: 2, short: 'Keyword & Mẹo nhớ', icon: Lightbulb },
  { num: 3, short: 'Bẫy kinh điển', icon: AlertTriangle },
  { num: 4, short: 'Mini-Quiz (3 câu)', icon: Trophy },
];

export default function TopicsTab({ onPracticeModule }) {
  const [progress, setProgress] = useState(() => loadTopicsProgress());
  const [selectedGroup, setSelectedGroup] = useState('ALL');
  const [activeTopicId, setActiveTopicId] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [copiedQuery, setCopiedQuery] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);

  // Sync passed progress to localStorage
  useEffect(() => {
    saveTopicsProgress(progress);
  }, [progress]);

  // Gently clear copied state
  useEffect(() => {
    if (!copiedQuery) return undefined;
    const timer = window.setTimeout(() => setCopiedQuery(null), 1600);
    return () => window.clearTimeout(timer);
  }, [copiedQuery]);

  const activeTopic = useMemo(
    () => TOPICS.find((t) => t.id === activeTopicId) ?? null,
    [activeTopicId]
  );

  const passedCount = useMemo(
    () => TOPICS.filter((t) => progress[t.id]?.passed).length,
    [progress]
  );

  const passedPercent = Math.round((passedCount / TOPICS.length) * 100);

  const visibleGroups = useMemo(() => {
    if (selectedGroup === 'ALL') return TOPIC_GROUPS;
    return TOPIC_GROUPS.filter((g) => g.id === selectedGroup);
  }, [selectedGroup]);

  const openQuickStudy = (topicId) => {
    setActiveTopicId(topicId);
    setCurrentStep(1);
    setQuizAnswers({});
    setCopiedQuery(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeQuickStudy = () => {
    setActiveTopicId(null);
    setCurrentStep(1);
    setQuizAnswers({});
  };

  const handleCopyYoutubeQuery = async (query) => {
    try {
      await navigator.clipboard.writeText(query);
      setCopiedQuery(query);
    } catch {
      // Clipboard API unavailable
    }
  };

  const handleAnswerMiniQuiz = (topic, questionId, optionIdx) => {
    if (typeof quizAnswers[questionId] === 'number') return;

    const nextAnswers = {
      ...quizAnswers,
      [questionId]: optionIdx,
    };
    setQuizAnswers(nextAnswers);

    const questions = topic.step4.miniQuiz;
    const allAnswered = questions.every(
      (q) => typeof nextAnswers[q.id] === 'number'
    );

    if (allAnswered) {
      const score = questions.reduce(
        (sum, q) => sum + (nextAnswers[q.id] === q.correctIndex ? 1 : 0),
        0
      );
      const passedNow = score >= 2;

      setProgress((prev) => {
        const existing = prev[topic.id] ?? {
          passed: false,
          bestScore: 0,
          lastScore: 0,
        };
        return {
          ...prev,
          [topic.id]: {
            passed: existing.passed || passedNow,
            bestScore: Math.max(existing.bestScore, score),
            lastScore: score,
          },
        };
      });
    }
  };

  const handleRetryMiniQuiz = () => {
    setQuizAnswers({});
  };

  const handleResetAllTopics = () => {
    setProgress({});
    setConfirmReset(false);
  };

  // =====================================================================
  // INTERACTIVE 4-STEP STUDY MODE
  // =====================================================================
  if (activeTopic) {
    const groupMeta = GROUP_MAP[activeTopic.groupId];
    const topicProgress = progress[activeTopic.id];
    const isPassed = Boolean(topicProgress?.passed);
    const questions = activeTopic.step4.miniQuiz;
    const answeredCount = questions.filter(
      (q) => typeof quizAnswers[q.id] === 'number'
    ).length;
    const allAnswered = answeredCount === questions.length;
    const quizScore = questions.reduce(
      (sum, q) => sum + (quizAnswers[q.id] === q.correctIndex ? 1 : 0),
      0
    );
    const activeIdx = TOPICS.findIndex((t) => t.id === activeTopic.id);
    const nextTopic =
      activeIdx >= 0 && activeIdx < TOPICS.length - 1
        ? TOPICS[activeIdx + 1]
        : null;

    return (
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Top Bar: Back + Topic Identity */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={closeQuickStudy}
            className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Quay lại 12 Chuyên đề</span>
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-md border px-2 py-0.5 font-mono text-xs font-semibold ${groupMeta.accentBg} ${groupMeta.accentText} ${groupMeta.accentBorder}`}
            >
              {activeTopic.code} · {activeTopic.module}
            </span>
            {isPassed ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-teal-200 bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-800">
                <CheckCircle2 className="h-3.5 w-3.5 text-teal-600" />
                <span>Đã qua ({topicProgress.bestScore}/3)</span>
              </span>
            ) : (
              <span className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-medium text-slate-500">
                Chưa qua · Đúng ≥ 2/3 câu ở Bước 4
              </span>
            )}
          </div>
        </div>

        {/* Topic Title + Subtopic Weight Strip */}
        <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs sm:p-6">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            {activeTopic.code}: {activeTopic.title}
          </h1>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {activeTopic.subtopics.map((sub) => (
              <span
                key={sub.label}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-slate-50 px-2.5 py-1 text-xs text-slate-700"
              >
                <span>
                  <KeywordText text={sub.label} />
                </span>
                <span className="font-mono text-[11px] font-semibold text-slate-500">
                  {sub.weight}%
                </span>
              </span>
            ))}
          </div>

          <p className="mt-3 text-xs text-slate-500">
            Mẹo: Bấm vào bất kỳ{' '}
            <span className="border-b border-dashed border-blue-500 font-medium text-blue-700">
              từ khóa gạch chân xanh
            </span>{' '}
            nào để xem giải thích, hoặc{' '}
            <strong className="font-semibold text-slate-700">
              bôi đen bất kỳ từ nào khác
            </strong>{' '}
            để tự tra mạng &amp; thêm vào Flashcard.
          </p>

          {/* 4-Step Interactive Stepper */}
          <div className="mt-5 grid grid-cols-2 gap-2 border-t border-slate-100 pt-5 sm:grid-cols-4">
            {STUDY_STEPS.map((st) => {
              const Icon = st.icon;
              const isCurrent = currentStep === st.num;
              const isDoneStep =
                st.num < currentStep || (st.num === 4 && isPassed);

              return (
                <button
                  key={st.num}
                  type="button"
                  onClick={() => setCurrentStep(st.num)}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-xs font-semibold transition-all ${
                    isCurrent
                      ? 'border-slate-900 bg-slate-900 text-white shadow-2xs'
                      : isDoneStep
                        ? 'border-teal-200 bg-teal-50/70 text-teal-900 hover:border-teal-300'
                        : 'border-slate-200 bg-slate-50/60 text-slate-600 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md font-mono text-[11px] font-bold ${
                      isCurrent
                        ? 'bg-blue-500 text-white'
                        : isDoneStep
                          ? 'bg-teal-600 text-white'
                          : 'bg-white text-slate-500 ring-1 ring-slate-200'
                    }`}
                  >
                    {st.num}
                  </span>
                  <span className="truncate">{st.short}</span>
                  <Icon className="ml-auto hidden h-3.5 w-3.5 shrink-0 opacity-60 sm:block" />
                </button>
              );
            })}
          </div>
        </section>

        {/* STEP 1: Bản chất & Công thức cốt lõi */}
        {currentStep === 1 && (
          <section className="space-y-4 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700">
              <BookOpen className="h-4 w-4" />
              <span>Bước 1 / 4 · Bản chất &amp; Công thức cốt lõi</span>
            </div>

            <p className="text-sm leading-relaxed text-slate-700 sm:text-[15px]">
              <KeywordText text={activeTopic.step1.essence} />
            </p>

            {/* Real-World AI Problem Blocks (Plain-Language Breakdown) */}
            {Array.isArray(activeTopic.step1.problemBlocks) &&
              activeTopic.step1.problemBlocks.length > 0 && (
                <div className="space-y-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Hiểu qua bài toán AI thực tế ({activeTopic.step1.problemBlocks.length} công cụ cốt lõi)
                    </h2>
                    <span className="font-mono text-[11px] text-slate-400">
                      Không cần học vẹt ký hiệu
                    </span>
                  </div>

                  <div className="space-y-3.5">
                    {activeTopic.step1.problemBlocks.map((block, idx) => (
                      <article
                        key={idx}
                        className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-2xs"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/80 px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-900 font-mono text-xs font-bold text-white">
                              {idx + 1}
                            </span>
                            <h3 className="text-sm font-bold text-slate-900">
                              <KeywordText text={block.title} />
                            </h3>
                          </div>
                          {block.formulaShort && (
                            <code className="rounded-md border border-slate-200 bg-white px-2 py-0.5 font-mono text-[11px] font-medium text-slate-700">
                              {block.formulaShort}
                            </code>
                          )}
                        </div>

                        <div className="space-y-2.5 p-4 text-sm leading-relaxed">
                          <div className="flex items-start gap-2.5 rounded-lg border border-blue-100 bg-blue-50/45 px-3.5 py-2.5">
                            <Target className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                            <p className="text-slate-800">
                              <strong className="font-semibold text-blue-900">
                                Bài toán thực tế cần giải:{' '}
                              </strong>
                              <KeywordText text={block.realProblem} />
                            </p>
                          </div>

                          <div className="flex items-start gap-2.5 rounded-lg border border-indigo-100 bg-indigo-50/45 px-3.5 py-2.5">
                            <Cpu className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
                            <p className="text-slate-800">
                              <strong className="font-semibold text-indigo-900">
                                Vai trò của công cụ/công thức:{' '}
                              </strong>
                              <KeywordText text={block.aiRole} />
                            </p>
                          </div>

                          <div className="flex items-start gap-2.5 rounded-lg border border-teal-200/75 bg-teal-50/45 px-3.5 py-2.5">
                            <Calculator className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                            <p className="text-slate-800">
                              <strong className="font-semibold text-teal-900">
                                Diễn giải từng bước (+ / − / × / ÷ &amp; thay số):{' '}
                              </strong>
                              <KeywordText text={block.plainSteps} />
                            </p>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}

            {/* Compact Symbol Cheat-Sheet (Collapsible) */}
            <details className="group rounded-xl border border-slate-200 bg-slate-50/70">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-600 transition-colors hover:text-slate-900">
                <span>
                  Bảng tóm tắt ký hiệu rút gọn ({activeTopic.step1.formulas.length} dòng ôn trước giờ thi)
                </span>
                <ChevronDown className="h-4 w-4 text-slate-400 transition-transform group-open:rotate-180" />
              </summary>
              <div className="space-y-2 border-t border-slate-200/70 px-4 py-3.5">
                {activeTopic.step1.formulas.map((formula, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 font-mono text-xs leading-6 text-slate-800 sm:text-[13px]"
                  >
                    <span className="mt-0.5 text-slate-400">▸</span>
                    <span>
                      <KeywordText text={formula} />
                    </span>
                  </div>
                ))}
              </div>
            </details>

            {/* Worked Quick Example */}
            {activeTopic.step1.quickExample && (
              <div className="rounded-xl border-l-3 border-teal-500 bg-teal-50/50 p-4 text-sm leading-relaxed">
                <p className="font-semibold text-slate-900">
                  Ví dụ nhanh:{' '}
                  <span className="font-normal text-slate-700">
                    <KeywordText text={activeTopic.step1.quickExample.problem} />
                  </span>
                </p>
                <p className="mt-2 font-semibold text-teal-900">
                  Lời giải gọn:{' '}
                  <span className="font-normal text-slate-800">
                    <KeywordText text={activeTopic.step1.quickExample.solution} />
                  </span>
                </p>
              </div>
            )}
          </section>
        )}

        {/* STEP 2: Keyword tiếng Anh + Mẹo nhớ nhanh + YouTube copy */}
        {currentStep === 2 && (
          <section className="space-y-5 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-700">
              <Lightbulb className="h-4 w-4" />
              <span>Bước 2 / 4 · Keyword tiếng Anh &amp; Mẹo nhớ nhanh</span>
            </div>

            {/* English Keywords */}
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Từ khóa tiếng Anh cốt lõi hay gặp trong đề
              </h2>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {activeTopic.step2.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 font-mono text-xs font-semibold text-slate-800"
                  >
                    <KeywordText text={kw} />
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Memory Tip */}
            <div className="rounded-xl border border-blue-200/90 bg-blue-50/55 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-800">
                Mẹo nhớ nhanh trong phòng thi
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-800">
                <KeywordText text={activeTopic.step2.memoryTip} />
              </p>
            </div>

            {/* Copyable YouTube Search Queries */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <Video className="h-4 w-4 text-rose-600" />
                <span>Từ khóa tra video YouTube học nhanh</span>
              </div>
              <div className="mt-2.5 space-y-2">
                {activeTopic.step2.youtubeQueries.map((query) => {
                  const isCopied = copiedQuery === query;
                  const ytUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
                    query
                  )}`;
                  return (
                    <div
                      key={query}
                      className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <code className="font-mono text-xs font-medium text-slate-800">
                        {query}
                      </code>
                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopyYoutubeQuery(query)}
                          className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                            isCopied
                              ? 'border-teal-300 bg-teal-50 text-teal-800'
                              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {isCopied ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-teal-600" />
                              <span>Đã sao chép</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              <span>Copy từ khóa</span>
                            </>
                          )}
                        </button>
                        <a
                          href={ytUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-rose-200 hover:text-rose-700"
                          title="Mở tìm kiếm trên YouTube"
                        >
                          <span>YouTube</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* STEP 3: Bẫy kinh điển hay mất điểm */}
        {currentStep === 3 && (
          <section className="space-y-4 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700">
              <AlertTriangle className="h-4 w-4" />
              <span>Bước 3 / 4 · Bẫy kinh điển hay mất điểm</span>
            </div>

            <p className="text-sm text-slate-600">
              Đọc kỹ 3 cái bẫy phổ biến nhất của{' '}
              <strong className="font-semibold text-slate-900">
                {activeTopic.code}
              </strong>{' '}
              để loại ngay phương án nhiễu trước khi vào Mini-Quiz:
            </p>

            <div className="space-y-3">
              {activeTopic.step3.traps.map((trap, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-amber-200/90 bg-amber-50/60 p-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-amber-600 font-mono text-xs font-bold text-white">
                      {idx + 1}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-amber-950">
                        <KeywordText text={trap.title} />
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-amber-900/90">
                        <KeywordText text={trap.detail} />
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* STEP 4: Mini-Quiz 3 câu (đúng >= 2/3 tự đánh dấu "Đã qua") */}
        {currentStep === 4 && (
          <section className="space-y-5 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-700">
                <Trophy className="h-4 w-4" />
                <span>Bước 4 / 4 · Mini-Quiz kiểm tra qua ải (3 câu)</span>
              </div>
              <span className="font-mono text-xs text-slate-500 tabular-nums">
                Đã chọn {answeredCount} / {questions.length} · Cần đúng ≥ 2/3
              </span>
            </div>

            <div className="space-y-5">
              {questions.map((q, qIdx) => {
                const picked = quizAnswers[q.id];
                const isAnswered = typeof picked === 'number';
                const isCorrect = isAnswered && picked === q.correctIndex;

                return (
                  <div
                    key={q.id}
                    className="rounded-xl border border-slate-200/90 bg-slate-50/40 p-4 sm:p-5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500">
                        Câu {qIdx + 1} / 3
                      </span>
                      {isAnswered && (
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-semibold ${
                            isCorrect ? 'text-teal-700' : 'text-rose-700'
                          }`}
                        >
                          {isCorrect ? (
                            <>
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>Đúng</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3.5 w-3.5" />
                              <span>Sai</span>
                            </>
                          )}
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-900">
                      <KeywordText text={q.question} />
                    </p>

                    <div className="mt-3 space-y-2">
                      {q.options.map((opt, optIdx) => {
                        const letter = OPTION_LETTERS[optIdx];
                        const isPicked = picked === optIdx;
                        const isRight = optIdx === q.correctIndex;

                        let optClass =
                          'border-slate-200 bg-white text-slate-800 hover:border-slate-400 hover:bg-slate-50';
                        let badgeClass =
                          'border-slate-200 bg-slate-50 text-slate-600';

                        if (isAnswered) {
                          if (isRight) {
                            optClass =
                              'border-teal-400 bg-teal-50/85 text-teal-950';
                            badgeClass =
                              'border-teal-600 bg-teal-600 text-white';
                          } else if (isPicked && !isRight) {
                            optClass =
                              'border-rose-400 bg-rose-50/85 text-rose-950';
                            badgeClass =
                              'border-rose-600 bg-rose-600 text-white';
                          } else {
                            optClass =
                              'border-slate-200/70 bg-white/60 text-slate-400 opacity-70';
                            badgeClass =
                              'border-slate-200 bg-slate-100 text-slate-400';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            disabled={isAnswered}
                            onClick={() =>
                              handleAnswerMiniQuiz(activeTopic, q.id, optIdx)
                            }
                            className={`flex w-full items-start gap-2.5 rounded-xl border px-3.5 py-2.5 text-left text-xs leading-relaxed transition-all disabled:cursor-default sm:text-sm ${optClass}`}
                          >
                            <span
                              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border font-mono text-[11px] font-bold ${badgeClass}`}
                            >
                              {letter}
                            </span>
                            <span className="flex-1">
                              <KeywordText text={opt} />
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {isAnswered && (
                      <p className="mt-3 rounded-lg border border-slate-200/80 bg-white px-3.5 py-2.5 text-xs leading-relaxed text-slate-700">
                        <strong className="font-semibold text-slate-900">
                          Giải thích:{' '}
                        </strong>
                        <KeywordText text={q.explanation} />
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Result Banner when all 3 answered */}
            {allAnswered && (
              <div
                className={`rounded-2xl border p-5 ${
                  quizScore >= 2
                    ? 'border-teal-300 bg-teal-50/80'
                    : 'border-amber-300 bg-amber-50/80'
                }`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      {quizScore >= 2 ? (
                        <Sparkles className="h-5 w-5 text-teal-700" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-amber-700" />
                      )}
                      <h3 className="text-base font-bold text-slate-900">
                        {quizScore >= 2
                          ? `Xuất sắc! Đạt ${quizScore}/3 câu — Đã qua ${activeTopic.code}`
                          : `Đạt ${quizScore}/3 câu — Chưa đạt ngưỡng qua (cần ≥ 2/3)`}
                      </h3>
                    </div>
                    <p className="mt-1 text-xs text-slate-700">
                      {quizScore >= 2
                        ? `Tiến độ đã được tự động lưu vào localStorage (${passedCount}/12 chuyên đề Đã qua).`
                        : 'Hãy xem nhanh lại Bước 1–3 rồi bấm làm lại Mini-Quiz để mở khóa trạng thái "Đã qua".'}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleRetryMiniQuiz}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Làm lại</span>
                    </button>

                    {onPracticeModule && (
                      <button
                        type="button"
                        onClick={() => onPracticeModule(activeTopic.module)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50"
                      >
                        <ClipboardList className="h-3.5 w-3.5" />
                        <span>Luyện đề {activeTopic.module}</span>
                      </button>
                    )}

                    {quizScore >= 2 && nextTopic && (
                      <button
                        type="button"
                        onClick={() => openQuickStudy(nextTopic.id)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                      >
                        <span>Học tiếp {nextTopic.code}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Bottom Step Prev / Next Bar */}
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
            disabled={currentStep === 1}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Bước trước</span>
          </button>

          <span className="font-mono text-xs text-slate-400">
            Bước {currentStep} / 4
          </span>

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((s) => Math.min(4, s + 1))}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
            >
              <span>Bước tiếp theo</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={closeQuickStudy}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              <span>Về danh sách 12 CĐ</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // =====================================================================
  // QUEST CARD GRID VIEW (12 CHUYÊN ĐỀ)
  // =====================================================================
  return (
    <div className="space-y-6">
      {/* Header & Overall 12-Topic Progress Bar */}
      <section className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              <Compass className="h-3.5 w-3.5" />
              <span>Khung ôn thi AI20K VinUni · SFIA Level 3</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              12 Chuyên đề thực chiến
            </h1>
            <p className="max-w-2xl text-sm text-slate-600">
              Chinh phục từng chuyên đề theo chế độ <strong className="font-semibold text-slate-900">Học nhanh 4 bước</strong> (Bản chất → Keyword &amp; Mẹo → Bẫy kinh điển → Mini-Quiz 3 câu). Đúng từ <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-800">2/3</code> câu sẽ tự mở khóa trạng thái <strong className="font-semibold text-teal-700">Đã qua</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start">
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-right">
              <p className="text-[11px] font-medium text-slate-500">
                Tiến độ chinh phục
              </p>
              <p className="font-mono text-xl font-bold text-teal-700 tabular-nums">
                {passedCount}{' '}
                <span className="text-sm font-medium text-slate-400">
                  / {TOPICS.length} chuyên đề
                </span>
              </p>
            </div>

            {confirmReset ? (
              <div className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs">
                <button
                  type="button"
                  onClick={handleResetAllTopics}
                  className="rounded-md bg-rose-600 px-2 py-1 font-semibold text-white hover:bg-rose-700"
                >
                  Xóa
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="rounded-md px-2 py-1 text-slate-600 hover:bg-white"
                >
                  Hủy
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                disabled={passedCount === 0}
                title="Đặt lại tiến độ 12 chuyên đề"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-600">
              Hoàn thành {passedCount} / {TOPICS.length} chuyên đề
            </span>
            <span className="font-mono font-semibold text-teal-700 tabular-nums">
              {passedPercent}%
            </span>
          </div>
          <div
            className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100"
            role="progressbar"
            aria-valuenow={passedCount}
            aria-valuemin={0}
            aria-valuemax={TOPICS.length}
          >
            <div
              className="h-full rounded-full bg-teal-500 transition-all duration-300 ease-out"
              style={{ width: `${passedPercent}%` }}
            />
          </div>
        </div>

        {/* Group Filter Pills */}
        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={() => setSelectedGroup('ALL')}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
              selectedGroup === 'ALL'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
            }`}
          >
            <span>Tất cả 12 CĐ</span>
            <span
              className={`font-mono text-[11px] tabular-nums ${
                selectedGroup === 'ALL' ? 'text-slate-300' : 'text-slate-400'
              }`}
            >
              {passedCount}/12
            </span>
          </button>

          {TOPIC_GROUPS.map((group) => {
            const groupTopics = TOPICS.filter((t) => t.groupId === group.id);
            const groupPassed = groupTopics.filter(
              (t) => progress[t.id]?.passed
            ).length;
            const isActive = selectedGroup === group.id;

            return (
              <button
                key={group.id}
                type="button"
                onClick={() => setSelectedGroup(group.id)}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                }`}
              >
                <span>{group.title}</span>
                <span
                  className={`font-mono text-[11px] tabular-nums ${
                    isActive ? 'text-slate-300' : 'text-slate-400'
                  }`}
                >
                  {groupPassed}/{groupTopics.length}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4 Grouped Quest Card Sections */}
      <div className="space-y-8">
        {visibleGroups.map((group) => {
          const groupTopics = TOPICS.filter((t) => t.groupId === group.id);
          const groupPassed = groupTopics.filter(
            (t) => progress[t.id]?.passed
          ).length;

          return (
            <section key={group.id} className="space-y-4">
              {/* Group Section Header */}
              <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`rounded-lg border px-2.5 py-0.5 font-mono text-xs font-bold ${group.accentBg} ${group.accentText} ${group.accentBorder}`}
                  >
                    {group.module}
                  </span>
                  <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                    {group.title}
                  </h2>
                </div>
                <span className="font-mono text-xs text-slate-500 tabular-nums">
                  Đã qua {groupPassed} / {groupTopics.length} chuyên đề
                </span>
              </div>

              {/* Quest Cards Grid */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {groupTopics.map((topic) => {
                  const stat = progress[topic.id];
                  const isPassed = Boolean(stat?.passed);

                  return (
                    <article
                      key={topic.id}
                      className={`group flex flex-col justify-between overflow-hidden rounded-2xl border bg-white shadow-2xs transition-all hover:shadow-sm ${
                        isPassed
                          ? 'border-teal-200/90 hover:border-teal-300'
                          : 'border-slate-200/90 hover:border-slate-300'
                      }`}
                    >
                      {/* Top Accent Stripe */}
                      <div
                        className={`h-1 w-full ${
                          isPassed ? 'bg-teal-500' : group.barColor
                        }`}
                      />

                      <div className="flex flex-1 flex-col justify-between p-5">
                        <div>
                          {/* Quest Header Row: Code + Status */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span
                                className={`rounded-md border px-2 py-0.5 font-mono text-xs font-bold ${group.accentBg} ${group.accentText} ${group.accentBorder}`}
                              >
                                {topic.code}
                              </span>
                              <span className="font-mono text-[11px] font-medium text-slate-400">
                                {topic.module}
                              </span>
                            </div>

                            {isPassed ? (
                              <span className="inline-flex items-center gap-1 rounded-full border border-teal-200 bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-800">
                                <CheckCircle2 className="h-3.5 w-3.5 text-teal-600" />
                                <span>Đã qua · {stat.bestScore}/3</span>
                              </span>
                            ) : (
                              <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-500">
                                Chưa học
                              </span>
                            )}
                          </div>

                          {/* Topic Title */}
                          <h3 className="mt-3 text-base font-bold text-slate-900">
                            {topic.title}
                          </h3>

                          {/* Subtopics + Percentage Weight List */}
                          <ul className="mt-3.5 space-y-2">
                            {topic.subtopics.map((sub) => (
                              <li key={sub.label} className="space-y-1">
                                <div className="flex items-center justify-between gap-2 text-xs">
                                  <span className="text-slate-600">
                                    <KeywordText text={sub.label} />
                                  </span>
                                  <span className="shrink-0 font-mono text-[11px] font-semibold text-slate-700 tabular-nums">
                                    {sub.weight}%
                                  </span>
                                </div>
                                <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100">
                                  <div
                                    className={`h-full rounded-full ${
                                      isPassed
                                        ? 'bg-teal-400/80'
                                        : 'bg-slate-300 group-hover:bg-slate-400/80'
                                    } transition-colors`}
                                    style={{ width: `${sub.weight}%` }}
                                  />
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* 2 Quest Action Buttons */}
                        <div className="mt-5 grid grid-cols-2 gap-2.5 border-t border-slate-100 pt-4">
                          <button
                            type="button"
                            onClick={() => openQuickStudy(topic.id)}
                            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2.5 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-blue-700"
                          >
                            <Sparkles className="h-3.5 w-3.5 text-blue-300" />
                            <span>Học nhanh 4 bước</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onPracticeModule?.(topic.module)}
                            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                          >
                            <ClipboardList className="h-3.5 w-3.5 text-slate-400" />
                            <span>Luyện đề {topic.module}</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
