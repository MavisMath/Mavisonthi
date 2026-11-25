export const MODULES = [
  {
    code: 'M1',
    shortTitle: 'Toán & Thống kê',
    title: 'Toán nền tảng, Tối ưu hóa & Metrics',
    topics: 'Gradient Descent, Activation, Precision/Recall/F1, SVD',
    defaultWeight: 1,
    badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
    barClass: 'bg-sky-500',
  },
  {
    code: 'M2',
    shortTitle: 'Python & Thuật toán',
    title: 'Lập trình Python, Cấu trúc dữ liệu & Hệ thống',
    topics: 'Big-O, Clean Code, Deque/Hash, PostgreSQL Partitioning',
    defaultWeight: 2,
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    barClass: 'bg-emerald-500',
  },
  {
    code: 'M3',
    shortTitle: 'AI, ML & MLOps',
    title: 'Machine Learning, Deep Learning, LLM/RAG & MLOps',
    topics: 'Loss, Overfitting, Transformer, RAG, LoRA, Data Drift, XAI',
    defaultWeight: 2,
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    barClass: 'bg-indigo-500',
  },
  {
    code: 'M4',
    shortTitle: 'Đạo đức & Bảo mật',
    title: 'Logic, AI Safety, Privacy & Quản trị',
    topics: 'Prompt Injection, RBAC, PII, Representation Bias, HITL',
    defaultWeight: 1,
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    barClass: 'bg-amber-500',
  },
];

export const NAV_TABS = [
  {
    id: 'topics',
    label: '12 Chuyên đề',
    shortLabel: '12 Chuyên đề',
    plannedStep: 'Hoạt động',
    description:
      'Lộ trình 12 chuyên đề chuẩn khung AI20K VinUni với chế độ Học nhanh 4 bước và Mini-Quiz qua ải.',
  },
  {
    id: 'flashcards',
    label: 'Flashcard Phản xạ',
    shortLabel: 'Flashcard',
    plannedStep: 'Bước 2',
    description:
      'Luyện phản xạ nhanh các khái niệm, công thức và bẫy lý thuyết cốt lõi theo từng Module.',
  },
  {
    id: 'quizzes',
    label: 'Trắc nghiệm & Thi thử 90p',
    shortLabel: 'Trắc nghiệm 90p',
    plannedStep: 'Bước 3',
    description:
      'Câu hỏi tình huống chuẩn SFIA với cấu trúc lệch trọng số (ưu tiên M2 & M3) và giải thích bẫy.',
  },
  {
    id: 'python',
    label: 'Code tay Python',
    shortLabel: 'Code Python',
    plannedStep: 'Bước 4',
    description:
      'Luyện viết hàm Python & Pandas không gợi ý tự động, tự đối soát theo checklist edge-case.',
  },
  {
    id: 'case-study',
    label: 'Case Study (R-A-T-S-M)',
    shortLabel: 'Case Study',
    plannedStep: 'Bước 4',
    description:
      'Phân tích tình huống AI thực chiến theo 5 trụ cột Root Cause, Architecture, Trade-offs, Safety & Ethics, Metrics & Rollout.',
  },
  {
    id: 'traps',
    label: 'Mẹo 15s & Gỡ Bẫy',
    shortLabel: 'Mẹo 15s',
    plannedStep: 'Hoạt động',
    description:
      'Phân tích bẫy tương tác (Broadcasting 3×3, SQL Window, Data Leakage, Logic De Morgan, Prompt Injection) kèm mẹo loại trừ 15 giây.',
  },
];

export const RATSM_PILLARS = [
  { key: 'rootCause', code: 'R', label: 'Root Cause' },
  { key: 'architecture', code: 'A', label: 'Architecture' },
  { key: 'tradeoffs', code: 'T', label: 'Trade-offs' },
  { key: 'safetyEthics', code: 'S', label: 'Safety & Ethics' },
  { key: 'metricsRollout', code: 'M', label: 'Metrics & Rollout' },
];
