export const STUDY_DAYS = [
  {
    day: 1,
    shortLabel: 'Ngày 1',
    title: 'Toán Đại số tuyến tính, Giải tích & Tối ưu',
    modules: ['M1'],
    summary:
      'Ma trận, Det cấp 2–3, Nghịch đảo, Dot/Cosine, SVD/PCA thưa, Đạo hàm, Gradient Descent, AdamW, Activation & Big-O Scaling.',
    dailyAction: 'Thuộc 50 thẻ Ngày 1 + luyện M1 (câu Toán & Tối ưu)',
  },
  {
    day: 2,
    shortLabel: 'Ngày 2',
    title: 'Xác suất, Thống kê, Metrics & Logic Mệnh đề',
    modules: ['M1', 'M4'],
    summary:
      'Định lý Bayes, Var(aX+b), Kiểm định giả thuyết, Bonferroni, PR-AUC/F1/Huber Loss, Logic Phản đảo, De Morgan & 5 Ngụy biện.',
    dailyAction: 'Thuộc 50 thẻ Ngày 2 + luyện M1 (Xác suất) & M4 (Logic)',
  },
  {
    day: 3,
    shortLabel: 'Ngày 3',
    title: 'Python Core, DSA, Clean Code & Engineering',
    modules: ['M2'],
    summary:
      'Mutable/Copy, Hash Set/Dict O(1), Deque Sliding Window, Heap Top-K, Two Pointers, Generator, Pure Function, Pytest & Mocking.',
    dailyAction: 'Thuộc 50 thẻ Ngày 3 + code tay py-01, py-02, py-04, py-06',
  },
  {
    day: 4,
    shortLabel: 'Ngày 4',
    title: 'NumPy, Pandas, SQL & Tối ưu Cơ sở dữ liệu',
    modules: ['M2'],
    summary:
      'NumPy Slicing/View vs Copy, Broadcasting, axis 0/1, Pandas ffill/groupby/merge, SQL Window Functions, Partitioning & B-Tree Index.',
    dailyAction: 'Thuộc 50 thẻ Ngày 4 + code tay py-03, py-05, py-07, py-08',
  },
  {
    day: 5,
    shortLabel: 'Ngày 5',
    title: 'Machine Learning, Deep Learning, CV & XAI',
    modules: ['M3'],
    summary:
      '4 kiểu Data Leakage, Bagging vs Boosting, L1/L2, SMOTE, Focal Loss, CNN/YOLO (IoU/NMS), Residual, SHAP/LIME/Grad-CAM.',
    dailyAction: 'Thuộc 50 thẻ Ngày 5 + luyện trắc nghiệm M3 (ML/DL/XAI)',
  },
  {
    day: 6,
    shortLabel: 'Ngày 6',
    title: 'Transformer, LLM, Hybrid RAG & AI Agent',
    modules: ['M3'],
    summary:
      'Self-Attention Q-K-V O(N²), KV Cache, Sampling, Chunking, BM25+Vector+RRF+Rerank, Recall@k vs Faithfulness, QLoRA, ReAct & MCP.',
    dailyAction: 'Thuộc 50 thẻ Ngày 6 + code tay py-09 (RRF) + Case cs-01, cs-04',
  },
  {
    day: 7,
    shortLabel: 'Ngày 7',
    title: 'MLOps Production, OWASP LLM, Pháp lý & Đạo đức',
    modules: ['M3', 'M4'],
    summary:
      'p95/TTFT, Continuous Batching, Eval Gate, Drift/Canary, Cost/1K, OWASP Top 10, PII Redaction, EU AI Act, Fairness & HITL.',
    dailyAction: 'Thuộc 50 thẻ Ngày 7 + code py-10 + Case cs-02, cs-03, cs-05',
  },
  {
    day: 8,
    shortLabel: 'Ngày 8',
    title: 'Tổng ôn 50 bẫy, Tính nhanh & Thực chiến IT/AI',
    modules: ['M1', 'M2', 'M3', 'M4'],
    summary:
      '50 bài phản xạ tính tay (Det 3×3, Sarrus, Hệ 2 ẩn, RMSE/ROI), cú pháp NumPy/Pandas chuẩn a.pdf, kiến trúc 7 tầng & phòng thủ OWASP CĐ-12.',
    dailyAction: 'Thuộc 50 thẻ Ngày 8 + Thi thử 90 phút (40 câu) + Case cs-06',
  },
];

export const STUDY_DAY_MAP = Object.fromEntries(
  STUDY_DAYS.map((item) => [item.day, item])
);
