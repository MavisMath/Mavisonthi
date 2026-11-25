import { useEffect, useState } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Eye,
  EyeOff,
  Flame,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  XCircle,
  Zap,
} from 'lucide-react';
import { MODULES } from '../constants/modules.js';
import { QUICK_TRAP_LESSONS } from '../data/trapCardsData.js';
import {
  loadLastHtmlTrapLessonId,
  saveLastHtmlTrapLessonId,
} from '../utils/storage.js';
import BroadcastingTrapLesson from './BroadcastingTrapLesson.jsx';
import RichInlineText from './RichInlineText.jsx';

const MODULE_MAP = Object.fromEntries(MODULES.map((m) => [m.code, m]));

const INTERACTIVE_HTML_LESSONS = [
  {
    id: 'cau-01',
    number: '01',
    title: 'Tiền xử lý dữ liệu bằng NumPy',
    file: 'n_thi_c_u_01_ti_n_x_l_d_li_u_b_ng_numpy.html',
  },
  {
    id: 'cau-02',
    number: '02',
    title: 'Gradient Descent & Broadcasting',
    file: 'n_thi_c_u_02_gradient_descent_broadcasting.html',
  },
  {
    id: 'cau-03',
    number: '03',
    title: 'Autograd, Detach & Gradient cộng dồn',
    file: 'n_thi_c_u_03_autograd_detach_gradient_c_ng_d_n.html',
  },
  {
    id: 'cau-04',
    number: '04',
    title: 'Batch Normalization (Train vs Eval)',
    file: 'n_thi_c_u_04_batch_normalization_train_eval.html',
  },
  {
    id: 'cau-05',
    number: '05',
    title: 'Causal Attention & Trục Softmax',
    file: 'n_thi_c_u_05_causal_attention_tr_c_softmax.html',
  },
  {
    id: 'cau-06',
    number: '06',
    title: 'CNN, Pooling & Thứ tự Flatten',
    file: 'n_thi_c_u_06_cnn_pooling_th_t_flatten.html',
  },
  {
    id: 'cau-07',
    number: '07',
    title: 'SGD, Momentum & Gradient bằng None',
    file: 'n_thi_c_u_07_sgd_momentum_gradient_b_ng_none.html',
  },
  {
    id: 'cau-08',
    number: '08',
    title: 'Reshape kiểu MATLAB & Chia sẻ bộ nhớ',
    file: 'n_thi_c_u_08_reshape_ki_u_matlab_chia_s_b_nh.html',
  },
  {
    id: 'cau-09',
    number: '09',
    title: 'KNN, Pipeline & Rò rỉ dữ liệu',
    file: 'n_thi_c_u_09_knn_pipeline_r_r_d_li_u.html',
  },
  {
    id: 'cau-10',
    number: '10',
    title: 'Cross-Entropy, Label Smoothing & Masking',
    file: 'n_thi_c_u_10_cross_entropy_label_smoothing_masking.html',
  },
];

const INTERACTIVE_HTML_LESSON_IDS = INTERACTIVE_HTML_LESSONS.map((l) => l.id);

const LESSON_NAV = [
  {
    id: 'broadcasting',
    number: '01',
    module: 'M2',
    label: 'Bẫy Broadcasting (3×3 vs 3×1)',
    tag: 'Tương tác 4 tab',
  },
  ...QUICK_TRAP_LESSONS.map((l) => ({
    id: l.id,
    number: l.number,
    module: l.module,
    label: l.shortTitle,
    tag: 'Mẹo 15s + Quiz',
  })),
];

function QuickTrapLessonView({ lesson }) {
  const [showExplanations, setShowExplanations] = useState(true);
  const [quizAnswers, setQuizAnswers] = useState({});
  const modMeta = MODULE_MAP[lesson.module];

  const score = lesson.miniQuiz.reduce(
    (sum, q) => sum + (quizAnswers[q.id] === q.correctIndex ? 1 : 0),
    0
  );

  const stepToneStyles = {
    blue: 'border-blue-200 bg-blue-50/70 text-blue-900',
    amber: 'border-amber-200 bg-amber-50/70 text-amber-900',
    indigo: 'border-indigo-200 bg-indigo-50/70 text-indigo-900',
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-lg bg-slate-900 px-2.5 py-0.5 font-mono text-xs font-bold text-white">
            Bài {lesson.number}
          </span>
          <span
            className={`rounded-md border px-2 py-0.5 font-mono text-xs font-semibold ${
              modMeta?.badgeClass ??
              'border-slate-200 bg-slate-100 text-slate-700'
            }`}
          >
            {lesson.module}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-200">
            <Zap className="h-3.5 w-3.5" />
            <span>Mẹo khoanh 15 giây</span>
          </span>
        </div>

        <h2 className="mt-3 text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
          {lesson.title}
        </h2>
        <p className="mt-1 text-sm text-slate-600">{lesson.subtitle}</p>

        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 font-mono text-xs leading-relaxed text-slate-800">
          <strong className="font-sans text-slate-500">Quy tắc bỏ túi: </strong>
          {lesson.coreRule}
        </div>
      </section>

      {/* 3-Step 15s Elimination + Sample Question with Toggleable Explanation */}
      <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs sm:p-6">
        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-base font-bold text-slate-900 sm:text-lg">
              3 bước loại trừ nhanh trong 15 giây
            </h3>
            <p className="text-xs text-slate-500">
              Áp dụng ngay vào đề bẫy mẫu bên dưới — bấm Ẩn giải thích để tự luyện phản xạ.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowExplanations((v) => !v)}
            className="inline-flex w-fit items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
          >
            {showExplanations ? (
              <>
                <EyeOff className="h-3.5 w-3.5" />
                <span>Ẩn giải thích</span>
              </>
            ) : (
              <>
                <Eye className="h-3.5 w-3.5" />
                <span>Hiện giải thích</span>
              </>
            )}
          </button>
        </div>

        {/* 3 Steps */}
        <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
          {lesson.steps15s.map((st, idx) => (
            <div
              key={idx}
              className={`rounded-xl border p-3.5 ${
                stepToneStyles[st.tone] ?? stepToneStyles.blue
              }`}
            >
              <p className="text-xs font-bold">{st.label}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-700">
                <RichInlineText text={st.text} />
              </p>
            </div>
          ))}
        </div>

        {/* Sample Exam Scenario */}
        <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Đề bẫy kinh điển
          </p>
          <p className="mt-1.5 text-sm font-semibold leading-relaxed text-slate-900">
            <RichInlineText text={lesson.sampleQuestion.prompt} />
          </p>
        </div>

        {/* 4 Options with Toggleable Elimination Verdict */}
        <div className="space-y-3">
          {lesson.sampleQuestion.options.map((opt) => (
            <div
              key={opt.letter}
              className={`rounded-2xl border p-4 transition-all ${
                showExplanations && opt.isCorrect
                  ? 'border-2 border-teal-400 bg-teal-50/40'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-lg font-mono text-xs font-bold ${
                      showExplanations && opt.isCorrect
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {opt.letter}
                  </span>
                  <span className="text-sm font-bold text-slate-900">
                    Phương án {opt.letter}
                  </span>
                </div>

                {showExplanations && (
                  <span
                    className={`rounded-full px-3 py-0.5 text-xs font-bold ${
                      opt.isCorrect
                        ? 'bg-teal-600 text-white'
                        : 'border border-rose-200 bg-rose-50 text-rose-700'
                    }`}
                  >
                    {opt.verdict}
                  </span>
                )}
              </div>

              <p className="mt-2.5 text-sm leading-relaxed text-slate-800">
                <RichInlineText text={opt.text} />
              </p>

              {showExplanations && (
                <p
                  className={`mt-2.5 rounded-lg border px-3 py-2 text-xs leading-relaxed ${
                    opt.isCorrect
                      ? 'border-teal-200 bg-white text-teal-900'
                      : 'border-rose-200/70 bg-rose-50/50 text-rose-800'
                  }`}
                >
                  <strong>{opt.isCorrect ? 'Vì sao chọn: ' : 'Lý do loại: '}</strong>
                  <RichInlineText text={opt.reason} />
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Mini-Quiz 2 Questions */}
      <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs sm:p-6">
        <div className="mb-4 flex flex-col justify-between gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center">
          <div>
            <span className="mb-1 inline-flex items-center rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-bold text-teal-800 ring-1 ring-inset ring-teal-200">
              Kiểm tra phản xạ né bẫy
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Mini-Quiz 2 câu ({lesson.shortTitle})
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 font-mono text-xs font-bold text-blue-800 tabular-nums">
              Điểm: {score} / {lesson.miniQuiz.length}
            </span>
            <button
              type="button"
              onClick={() => setQuizAnswers({})}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Làm lại</span>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {lesson.miniQuiz.map((q, qIdx) => {
            const chosen = quizAnswers[q.id];
            const hasAnswered = chosen !== undefined;
            const isCorrect = chosen === q.correctIndex;

            return (
              <div
                key={q.id}
                className="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-4 sm:p-5"
              >
                <p className="mb-3 text-sm font-bold leading-relaxed text-slate-900">
                  Câu {qIdx + 1}: <RichInlineText text={q.question} />
                </p>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {q.options.map((opt, optIdx) => {
                    let btnClass =
                      'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-slate-50';
                    if (hasAnswered) {
                      if (optIdx === q.correctIndex) {
                        btnClass =
                          'border-teal-500 bg-teal-50 font-semibold text-teal-900';
                      } else if (optIdx === chosen && optIdx !== q.correctIndex) {
                        btnClass =
                          'border-rose-500 bg-rose-50 font-semibold text-rose-900';
                      } else {
                        btnClass = 'border-slate-200 bg-slate-50 text-slate-400';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() =>
                          setQuizAnswers((prev) => ({
                            ...prev,
                            [q.id]: optIdx,
                          }))
                        }
                        className={`rounded-xl border-2 px-3.5 py-2.5 text-left text-xs leading-relaxed transition sm:text-sm ${btnClass}`}
                      >
                        <RichInlineText text={opt} />
                      </button>
                    );
                  })}
                </div>

                {hasAnswered && (
                  <div
                    className={`mt-3 flex items-start gap-2 rounded-xl border p-3 text-xs leading-relaxed ${
                      isCorrect
                        ? 'border-teal-200 bg-teal-50 text-teal-900'
                        : 'border-rose-200 bg-rose-50 text-rose-900'
                    }`}
                  >
                    {isCorrect ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                    ) : (
                      <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
                    )}
                    <p>
                      <strong>{isCorrect ? 'Chính xác! ' : 'Chưa đúng! '}</strong>
                      <RichInlineText text={q.explanation} />
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default function TrapsTab() {
  const [selectedLessonId, setSelectedLessonId] = useState('broadcasting');
  const [selectedHtmlLessonId, setSelectedHtmlLessonId] = useState(() =>
    loadLastHtmlTrapLessonId(INTERACTIVE_HTML_LESSON_IDS, 'cau-01')
  );

  useEffect(() => {
    saveLastHtmlTrapLessonId(selectedHtmlLessonId);
  }, [selectedHtmlLessonId]);

  const activeHtmlIndex = Math.max(
    0,
    INTERACTIVE_HTML_LESSONS.findIndex((l) => l.id === selectedHtmlLessonId)
  );
  const activeHtmlLesson =
    INTERACTIVE_HTML_LESSONS[activeHtmlIndex] ?? INTERACTIVE_HTML_LESSONS[0];
  const activeHtmlUrl = `/lessons/${activeHtmlLesson.file}`;

  const activeQuickLesson = QUICK_TRAP_LESSONS.find(
    (l) => l.id === selectedLessonId
  );

  const handleStepHtmlLesson = (delta) => {
    const nextIdx =
      (activeHtmlIndex + delta + INTERACTIVE_HTML_LESSONS.length) %
      INTERACTIVE_HTML_LESSONS.length;
    setSelectedHtmlLessonId(INTERACTIVE_HTML_LESSONS[nextIdx].id);
  };

  return (
    <div className="space-y-8">
      {/* =================================================================
          KHU VỰC MỚI: 10 BÀI LUYỆN BẪY TƯƠNG TÁC (CÂU 01 – 10)
         ================================================================= */}
      <section className="rounded-2xl border border-indigo-200/90 bg-white p-5 shadow-2xs sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Bộ bài học HTML tương tác chuyên sâu · Tự lưu bài đang xem</span>
            </div>
            <h1 className="mt-2.5 text-2xl font-bold tracking-tight text-slate-900">
              10 Bài Luyện Bẫy Tương Tác (Câu 01 – 10)
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Chọn bất kỳ câu nào dưới đây để thực hành trực tiếp mô phỏng code, bắt lỗi hình khối &amp; gỡ bẫy ngay trong trang hoặc mở toàn màn hình.
            </p>
          </div>

          <a
            href={activeHtmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-indigo-700"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Mở toàn màn hình (Tab mới)</span>
          </a>
        </div>

        {/* 10 Lesson Selector Cards */}
        <div className="mt-5 grid grid-cols-1 gap-2.5 border-t border-slate-100 pt-4 sm:grid-cols-2 lg:grid-cols-5">
          {INTERACTIVE_HTML_LESSONS.map((item) => {
            const isActive = activeHtmlLesson.id === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedHtmlLessonId(item.id)}
                className={`flex flex-col justify-between rounded-xl border p-3 text-left transition-all ${
                  isActive
                    ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-200'
                    : 'border-slate-200 bg-slate-50/70 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/40'
                }`}
              >
                <div className="flex items-center justify-between gap-1.5">
                  <span
                    className={`rounded-md px-1.5 py-0.5 font-mono text-[11px] font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-indigo-100/80 text-indigo-700'
                    }`}
                  >
                    Câu {item.number}
                  </span>
                  {isActive && (
                    <span className="font-mono text-[10px] font-semibold text-indigo-100">
                      Đang xem
                    </span>
                  )}
                </div>
                <p className="mt-2 text-xs font-bold leading-snug">
                  {item.title}
                </p>
              </button>
            );
          })}
        </div>

        {/* Active HTML Lesson Viewer Toolbar + Iframe */}
        <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
          <div className="flex flex-col gap-2.5 rounded-xl border border-slate-200/80 bg-slate-50/80 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 font-mono text-xs font-bold text-white">
                {activeHtmlLesson.number}
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
                  Đang mở · Câu {activeHtmlLesson.number} / 10
                </p>
                <h2 className="text-sm font-bold text-slate-900">
                  {activeHtmlLesson.title}
                </h2>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleStepHtmlLesson(-1)}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Câu trước</span>
              </button>
              <button
                type="button"
                onClick={() => handleStepHtmlLesson(1)}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
              >
                <span>Câu sau</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
              <a
                href={activeHtmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition-colors hover:bg-indigo-100"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Mở toàn màn hình (Tab mới)</span>
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
            <iframe
              key={activeHtmlLesson.id}
              src={activeHtmlUrl}
              title={`Câu ${activeHtmlLesson.number}: ${activeHtmlLesson.title}`}
              className="h-[80vh] min-h-[750px] w-full border-0 bg-white"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* =================================================================
          NỘI DUNG HIỆN CÓ: MẸO 15S & 5 BÀI GỠ BẪY TRỌNG TÂM
         ================================================================= */}
      <div className="space-y-6">
        {/* Page Header & 5-Lesson Interactive Selector */}
        <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
                <Flame className="h-3.5 w-3.5" />
                <span>Gỡ bẫy kinh điển phòng thi 90 phút</span>
              </div>
              <h2 className="mt-2.5 text-2xl font-bold tracking-tight text-slate-900">
                Mẹo 15s &amp; Gỡ Bẫy
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Chọn 1 trong 5 bài phân tích bẫy tương tác để nhìn thấu cấu trúc đề và loại trừ 3 đáp án nhiễu trong 15 giây.
              </p>
            </div>
            <span className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 font-mono text-xs font-semibold text-slate-600">
              <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />
              <span>5 bài gỡ bẫy trọng tâm</span>
            </span>
          </div>

          {/* 5 Lesson Selector Cards */}
          <div className="mt-5 grid grid-cols-1 gap-2.5 border-t border-slate-100 pt-4 sm:grid-cols-2 lg:grid-cols-5">
            {LESSON_NAV.map((item) => {
              const isActive = selectedLessonId === item.id;
              const modMeta = MODULE_MAP[item.module];

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedLessonId(item.id)}
                  className={`flex flex-col justify-between rounded-xl border p-3 text-left transition-all ${
                    isActive
                      ? 'border-slate-900 bg-slate-900 text-white shadow-2xs'
                      : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1.5">
                    <span
                      className={`font-mono text-[11px] font-bold ${
                        isActive ? 'text-blue-300' : 'text-slate-400'
                      }`}
                    >
                      Bài {item.number}
                    </span>
                    <span
                      className={`rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold ${
                        isActive
                          ? 'border-white/20 bg-white/15 text-white'
                          : modMeta?.badgeClass ??
                            'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      {item.module}
                    </span>
                  </div>
                  <p className="mt-2 text-xs font-bold leading-snug">
                    {item.label}
                  </p>
                  <p
                    className={`mt-1.5 font-mono text-[10px] ${
                      isActive ? 'text-slate-300' : 'text-slate-400'
                    }`}
                  >
                    {item.tag}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Active Lesson Content */}
        {selectedLessonId === 'broadcasting' ? (
          <BroadcastingTrapLesson />
        ) : (
          activeQuickLesson && (
            <QuickTrapLessonView
              key={activeQuickLesson.id}
              lesson={activeQuickLesson}
            />
          )
        )}
      </div>
    </div>
  );
}
