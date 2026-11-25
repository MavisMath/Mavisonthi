import { TOPICS_M1 } from './topics_m1.js';
import { TOPICS_M2 } from './topics_m2.js';
import { TOPICS_M3 } from './topics_m3.js';
import { TOPICS_M4 } from './topics_m4.js';

export const TOPIC_GROUPS = [
  {
    "id": "math",
    "module": "M1",
    "title": "Nhóm Toán (M1)",
    "subtitle": "Đại số tuyến tính, Giải tích & Tối ưu, Xác suất, Thống kê & A/B Testing",
    "accentBorder": "border-sky-200",
    "accentBg": "bg-sky-50",
    "accentText": "text-sky-700",
    "barColor": "bg-sky-500"
  },
  {
    "id": "code-data",
    "module": "M2",
    "title": "Nhóm Lập trình & Dữ liệu (M2)",
    "subtitle": "Python Core, Pandas, NumPy & Big-O, SQL Window Functions & Index",
    "accentBorder": "border-emerald-200",
    "accentBg": "bg-emerald-50",
    "accentText": "text-emerald-700",
    "barColor": "bg-emerald-500"
  },
  {
    "id": "ai-ops",
    "module": "M3",
    "title": "Nhóm AI & Vận hành (M3)",
    "subtitle": "Machine Learning, LLM/RAG/Agent, MLOps Serving, Drift & Chi phí",
    "accentBorder": "border-indigo-200",
    "accentBg": "bg-indigo-50",
    "accentText": "text-indigo-700",
    "barColor": "bg-indigo-500"
  },
  {
    "id": "logic-ethics",
    "module": "M4",
    "title": "Nhóm Logic & Đạo đức (M4)",
    "subtitle": "Logic mệnh đề, Ngụy biện, Luật BVDLCN 2025/GDPR, EU AI Act & OWASP LLM",
    "accentBorder": "border-amber-200",
    "accentBg": "bg-amber-50",
    "accentText": "text-amber-800",
    "barColor": "bg-amber-500"
  }
];

export const TOPICS = [
  ...TOPICS_M1,
  ...TOPICS_M2,
  ...TOPICS_M3,
  ...TOPICS_M4,
];

export { TOPICS_M1, TOPICS_M2, TOPICS_M3, TOPICS_M4 };
export default TOPICS;
