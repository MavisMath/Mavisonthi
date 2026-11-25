import { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Code2,
  Eye,
  EyeOff,
  Grid3X3,
  Lightbulb,
  RotateCcw,
  Sparkles,
  Target,
  XCircle,
  Zap,
} from 'lucide-react';

const CODE_STEPS = [
  {
    id: 0,
    lines: '1',
    code: 'import numpy as np',
    category: 'Khởi động',
    theme: 'blue',
    title: 'Mở bộ công cụ tính toán bảng số (NumPy)',
    everyday:
      'Giống như việc bạn mở phần mềm Excel trước khi tính toán. NumPy là thư viện giúp Python xử lý các bảng số (ma trận) cực nhanh, và ta đặt tên tắt là "np" cho gọn.',
    tip: 'Dòng này chỉ để khai báo thư viện, không in ra gì cả.',
    visual: {
      type: 'info',
      label: 'Thư viện đã sẵn sàng',
      text: 'np = Bộ máy tính bảng số (giống Excel trong Python)',
    },
  },
  {
    id: 1,
    lines: '3',
    code: 'X = np.array([[1., 0.], [1., 1.], [1., 2.]])',
    category: 'Dữ liệu đầu vào',
    theme: 'blue',
    title: 'Tạo bảng dữ liệu đầu vào X (3 dòng, 2 cột)',
    everyday:
      'Đây là đề bài gồm 3 mẫu dữ liệu (3 dòng). Cột đầu tiên toàn số 1 (đóng vai trò hệ số tự do / độ dịch chuyển), cột thứ hai là các giá trị 0, 1, 2.',
    tip: 'Nhớ len(X) = 3 vì bảng X có 3 dòng!',
    visual: {
      type: 'matrix',
      name: 'X',
      shape: '(3, 2)',
      color: 'blue',
      data: [
        ['1.', '0.'],
        ['1.', '1.'],
        ['1.', '2.'],
      ],
    },
  },
  {
    id: 2,
    lines: '4',
    code: 'y = np.array([1., 2., 2.])',
    category: 'Mầm mống bẫy',
    theme: 'amber',
    title: 'Đáp án thật y — Dạng 1 HÀNG NGANG (mầm mống của bẫy!)',
    everyday:
      'Đây là kết quả đúng mà máy học cần đoán cho 3 mẫu dữ liệu. Chú ý cực kỳ quan trọng: y chỉ có 1 cặp ngoặc vuông [...], nên nó nằm ngang kiểu mảng 1 chiều có shape (3,).',
    tip: 'Vì y nằm ngang (3,) còn prediction lát nữa đứng dọc (3, 1), nên hai thứ này trừ nhau sẽ kích hoạt bẫy Broadcasting!',
    visual: {
      type: 'matrix',
      name: 'y (1 chiều - nằm ngang)',
      shape: '(3,)',
      color: 'amber',
      data: [['1.', '2.', '2.']],
    },
  },
  {
    id: 3,
    lines: '5',
    code: 'w = np.array([[0.], [1.]])',
    category: 'Trọng số',
    theme: 'blue',
    title: 'Trọng số ban đầu w — Dạng 1 CỘT DỌC (2 dòng, 1 cột)',
    everyday:
      'Đây là "công thức nêm nếm" ban đầu mà AI đoán bừa: hệ số thứ nhất là 0, hệ số thứ hai là 1. Vì có 2 cặp ngoặc vuông lồng nhau [[0.], [1.]], nên nó là cột dọc (2, 1).',
    tip: 'Nhờ w là cột (2, 1), nên lát nữa X @ w sẽ cho ra kết quả cũng là cột dọc (3, 1).',
    visual: {
      type: 'matrix',
      name: 'w (cột dọc)',
      shape: '(2, 1)',
      color: 'blue',
      data: [['0.'], ['1.']],
    },
  },
  {
    id: 4,
    lines: '6',
    code: 'history = []',
    category: 'Lưu trữ',
    theme: 'blue',
    title: 'Tạo cuốn sổ trống để ghi chép lịch sử',
    everyday:
      'Tạo một danh sách rỗng tên là history. Sau mỗi bước học (step 0 và step 1), chương trình sẽ ghi lại kết quả vào đây để cuối bài in ra.',
    tip: 'Cuối bài history[0] là nhật ký bước 0, history[1] là nhật ký bước 1.',
    visual: {
      type: 'info',
      label: 'history hiện tại',
      text: '[ ] (Danh sách rỗng, sẵn sàng ghi 2 bước học)',
    },
  },
  {
    id: 5,
    lines: '8',
    code: 'for step in range(2):',
    category: 'Vòng lặp',
    theme: 'blue',
    title: 'Lặp lại quá trình học 2 lần (step = 0 và step = 1)',
    everyday:
      'Bảo máy tính thực hiện chu trình "Đoán → So lỗi → Tính hướng sửa → Cập nhật" đúng 2 vòng. Vòng 1 gọi là step0, vòng 2 gọi là step1.',
    tip: 'Quan trọng: Sau khi xong step0, biến w đã thay đổi giá trị mới! Do đó step1 sẽ dùng w mới chứ không dùng lại w cũ (giúp loại ngay đáp án D).',
    visual: {
      type: 'info',
      label: 'Số lần lặp',
      text: 'Vòng 1: step = 0  →  Vòng 2: step = 1',
    },
  },
  {
    id: 6,
    lines: '9',
    code: '    prediction = X @ w',
    category: 'Dự đoán',
    theme: 'blue',
    title: 'Tính dự đoán ban đầu bằng phép nhân ma trận (@)',
    everyday:
      'Ở bước 0, ta lấy từng dòng của X nhân với cột w: dòng 1 là 1×0 + 0×1 = 0; dòng 2 là 1×0 + 1×1 = 1; dòng 3 là 1×0 + 2×1 = 2. Kết quả là 1 cột dọc (3, 1).',
    tip: 'Quy tắc nhân ma trận: (3, 2) @ (2, 1) → ra hình dáng (3, 1).',
    visual: {
      type: 'matrix',
      name: 'prediction (ở step 0)',
      shape: '(3, 1)',
      color: 'blue',
      data: [['0.'], ['1.'], ['2.']],
    },
  },
  {
    id: 7,
    lines: '10',
    code: '    residual = prediction - y',
    category: 'BẪY BROADCASTING',
    theme: 'rose',
    title: 'CÁI BẪY LỚN NHẤT: Cột (3, 1) trừ Hàng (3,) phình thành Bảng (3, 3)!',
    everyday:
      'Thay vì trừ 3 cặp số tương ứng, NumPy thấy 1 cột dọc (3, 1) trừ 1 hàng ngang (3,) nên tự nhân bản cột thành 3 cột và nhân bản hàng thành 3 hàng! Kết quả phình to thành bảng vuông 3×3.',
    tip: 'Chỉ cần nhìn thấy dòng này tạo ra shape [3, 3], bạn lập tức loại được đáp án B (vì B ghi [3, 1])!',
    visual: {
      type: 'matrix',
      name: 'residual (BỊ PHÌNH TO ở step 0)',
      shape: '(3, 3)',
      color: 'rose',
      data: [
        ['-1.', '-2.', '-2.'],
        ['0.', '-1.', '-1.'],
        ['1.', '0.', '0.'],
      ],
    },
  },
  {
    id: 8,
    lines: '11',
    code: '    grad = X.T @ residual / len(X)',
    category: 'Tính Gradient',
    theme: 'rose',
    title: 'Tính độ lệch trung bình (Gradient) — Cũng bị phình thành (2, 3)!',
    everyday:
      'X.T là bảng X xoay ngang (2 dòng, 3 cột). Nhân với residual (3, 3) rồi chia đều cho len(X) = 3 mẫu. Vì residual đã bị phình thành 3 cột, nên grad cũng bị phình thành 2 dòng × 3 cột.',
    tip: 'Nhớ phép chia cho len(X) = 3! Nếu quên chia 3 thì số sẽ là -3.0 và 2.0 (đây là bẫy của đáp án C). Chia 3 xong ta được -1.0 và 0.667.',
    visual: {
      type: 'matrix',
      name: 'grad (ở step 0, đã làm tròn)',
      shape: '(2, 3)',
      color: 'rose',
      data: [
        ['0.0', '-1.0', '-1.0'],
        ['0.667', '-0.333', '-0.333'],
      ],
    },
  },
  {
    id: 9,
    lines: '12',
    code: '    w = w - 0.1 * grad',
    category: 'Cập nhật w',
    theme: 'rose',
    title: 'Cập nhật trọng số w với bước nhảy 0.1 — w cũng phình thành (2, 3)!',
    everyday:
      'Ta nhích trọng số w ngược chiều sai số một đoạn nhỏ 0.1 * grad. Vì w cũ là (2, 1) trừ cho grad (2, 3), NumPy lại broadcast kéo dãn w thành bảng (2, 3) luôn!',
    tip: 'Ví dụ ô đầu dòng 2: 1.0 - 0.1 * 0.667 = 0.933. Sang step1, máy dùng bảng w (2, 3) mới này để tính tiếp.',
    visual: {
      type: 'matrix',
      name: 'w mới (sau step 0)',
      shape: '(2, 3)',
      color: 'rose',
      data: [
        ['0.0', '0.1', '0.1'],
        ['0.933', '1.033', '1.033'],
      ],
    },
  },
  {
    id: 10,
    lines: '13-17',
    code: '    history.append([\n        list(residual.shape),\n        np.round(grad, 3).tolist(),\n        np.round(w, 3).tolist()\n    ])',
    category: 'Ghi nhật ký',
    theme: 'blue',
    title: 'Ghi lại 3 thông tin của bước học vào sổ history',
    everyday:
      'Mỗi vòng lặp sẽ lưu 1 gói gồm 3 thứ: (1) kích thước của residual là [3, 3], (2) bảng grad làm tròn 3 số thập phân, và (3) bảng w mới làm tròn 3 số thập phân.',
    tip: 'Đó là lý do mỗi dòng step0 và step1 trong đáp án đều có đúng 3 cụm ngoặc vuông lồng nhau.',
    visual: {
      type: 'info',
      label: 'Cấu trúc 1 bản ghi trong history',
      text: '[ shape của residual,  bảng grad (làm tròn 3 số),  bảng w (làm tròn 3 số) ]',
    },
  },
  {
    id: 11,
    lines: '19',
    code: 'fixed = X @ np.array([[0.], [1.]]) - y[:, None]',
    category: 'SỬA LỖI ĐÚNG',
    theme: 'emerald',
    title: 'Cách sửa bẫy chuẩn: Dùng y[:, None] để dựng y thành cột dọc!',
    everyday:
      'Tác giả tính lại sai số ban đầu nhưng lần này thêm [:, None] vào sau y. Phép này biến hàng ngang [1, 2, 2] thành cột dọc [[1], [2], [2]] (shape 3, 1). Cột trừ cột cho ra đúng 1 cột gọn gàng!',
    tip: 'Hãy nhớ cụm từ khóa "y[:, None]" — trong NumPy, thêm None có nghĩa là chèn thêm 1 trục chiều mới để biến hàng thành cột.',
    visual: {
      type: 'matrix',
      name: 'fixed (Gọn gàng, không bị bẫy!)',
      shape: '(3, 1)',
      color: 'emerald',
      data: [['-1.'], ['-1.'], ['0.']],
    },
  },
  {
    id: 12,
    lines: '20-23',
    code: 'print("step0:", history[0])\nprint("step1:", history[1])\nprint("pred:", np.round(X @ w, 3).tolist())\nprint("fixed_grad:", np.round(X.T @ fixed / 3, 3).tolist())',
    category: 'In kết quả',
    theme: 'emerald',
    title: 'In ra 4 dòng đáp án cuối cùng',
    everyday:
      'In ra nhật ký bước 0, bước 1, bảng dự đoán cuối cùng (vẫn bị lỗi 3×3 do w đã bị phình), và cuối cùng là gradient đúng (fixed_grad) dạng cột (2, 1): [[-0.667], [-0.333]].',
    tip: 'Cả 4 đáp án A, B, C, D đều có dòng fixed_grad giống nhau [[-0.667], [-0.333]], nên khi đi thi đừng mất công so dòng cuối này — hãy so 2 dòng step0 và step1!',
    visual: {
      type: 'matrix',
      name: 'fixed_grad (Gradient đúng)',
      shape: '(2, 1)',
      color: 'emerald',
      data: [['-0.667'], ['-0.333']],
    },
  },
];

const PRED_COL = [0, 1, 2];
const Y_ROW = [1, 2, 2];

const MINI_QUIZ = [
  {
    id: 'bc-q1',
    question:
      'Câu 1: Khi lấy mảng prediction có kích thước (3, 1) trừ đi mảng y có kích thước (3,) trong NumPy, kết quả residual có kích thước (shape) là gì?',
    options: [
      'A. Báo lỗi vì không cùng kích thước',
      'B. (3, 1) — giữ nguyên dạng cột dọc',
      'C. (3, 3) — bị Broadcasting phình thành bảng vuông 3×3',
      'D. (3,) — biến thành hàng ngang',
    ],
    correct: 2,
    explanation:
      'NumPy tự động kích hoạt Broadcasting: nhân bản cột (3, 1) sang phải thành 3 cột và nhân bản hàng (3,) xuống dưới thành 3 hàng, tạo ra ma trận (3, 3).',
  },
  {
    id: 'bc-q2',
    question: 'Câu 2: Trong dòng code cuối bài, lệnh y[:, None] có tác dụng gì?',
    options: [
      'A. Xóa bớt các phần tử bị lỗi trong y',
      'B. Dựng hàng ngang y có shape (3,) thành cột dọc có shape (3, 1) để tránh bẫy Broadcasting',
      'C. Nhân đôi toàn bộ giá trị trong mảng y',
      'D. Làm tròn các số trong y đến 3 chữ số thập phân',
    ],
    correct: 1,
    explanation:
      'y[:, None] biến mảng 1 chiều [1., 2., 2.] thành cột dọc [[1.], [2.], [2.]] có shape (3, 1), giúp phép trừ cột với cột diễn ra chính xác.',
  },
  {
    id: 'bc-q3',
    question:
      'Câu 3: Khi làm trắc nghiệm Câu 02, nhìn vào điểm nào để loại ngay đáp án D trong 5 giây?',
    options: [
      'A. Vì đáp án D ghi shape là [3, 1]',
      'B. Vì đáp án D quên chia cho len(X) = 3 nên có số -3.0 và 2.0',
      'C. Vì đáp án D có dòng fixed_grad bị sai',
      'D. Vì ở đáp án D, giá trị grad của step1 giống hệt step0 (vô lý vì w đã được cập nhật)',
    ],
    correct: 3,
    explanation:
      'Ở cuối step0, trọng số w đã thay đổi, nên sang step1 thì prediction, residual và grad bắt buộc phải thay đổi theo. Đáp án D giữ nguyên grad giống hệt step0 nên sai chắc chắn!',
  },
];

const SUB_TABS = [
  { id: 1, label: '1. Hiểu bản chất (Non-tech)', icon: Lightbulb },
  { id: 2, label: '2. Giải thích từng dòng', icon: Code2 },
  { id: 3, label: '3. Trực quan bẫy (3×3 vs 3×1)', icon: Grid3X3 },
  { id: 4, label: '4. Mẹo 15s & Mini-Quiz', icon: Zap },
];

const MATRIX_COLORS = {
  blue: {
    wrap: 'bg-blue-50/70 border-blue-200',
    badge: 'bg-blue-100 text-blue-800',
    cell: 'bg-white border-blue-200 text-blue-900',
  },
  amber: {
    wrap: 'bg-amber-50/70 border-amber-200',
    badge: 'bg-amber-100 text-amber-800',
    cell: 'bg-white border-amber-300 text-amber-900',
  },
  rose: {
    wrap: 'bg-rose-50/70 border-rose-200',
    badge: 'bg-rose-100 text-rose-800',
    cell: 'bg-white border-rose-300 text-rose-900',
  },
  emerald: {
    wrap: 'bg-emerald-50/70 border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-800',
    cell: 'bg-white border-emerald-300 text-emerald-900',
  },
};

export default function BroadcastingTrapLesson() {
  const [subTab, setSubTab] = useState(1);
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [broadcastMode, setBroadcastMode] = useState('trap'); // 'trap' | 'fixed'
  const [selectedTrapCell, setSelectedTrapCell] = useState({ r: 0, c: 1 });
  const [selectedFixedRow, setSelectedFixedRow] = useState(0);
  const [hintsVisible, setHintsVisible] = useState(true);
  const [quizAnswers, setQuizAnswers] = useState({});

  const activeStep = CODE_STEPS[activeStepIdx];
  const quizScore = MINI_QUIZ.reduce(
    (sum, q) => sum + (quizAnswers[q.id] === q.correct ? 1 : 0),
    0
  );

  return (
    <div className="space-y-5">
      {/* Lesson Banner Header + 4 Sub-tabs */}
      <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 font-mono text-base font-bold text-white shadow-2xs">
              02
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                  Gradient Descent &amp; Bẫy Broadcasting (3×3 vs 3×1)
                </h2>
                <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                  Bản cho Non-tech
                </span>
              </div>
              <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                Hiểu bản chất, soi từng dòng code, trực quan hóa ma trận phình to và khoanh đáp án chuẩn trong 15 giây.
              </p>
            </div>
          </div>

          <div className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800">
            <Target className="h-3.5 w-3.5 text-emerald-600" />
            <span>
              Đáp án chuẩn đề thi: <strong className="font-bold">Câu A</strong>
            </span>
          </div>
        </div>

        {/* 4 Interactive Sub-tabs */}
        <div className="mt-5 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4 lg:grid-cols-4">
          {SUB_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = subTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSubTab(tab.id)}
                className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-semibold transition-all sm:text-sm ${
                  isActive
                    ? 'border-blue-600 bg-blue-600 text-white shadow-2xs'
                    : 'border-slate-200 bg-slate-50/70 text-slate-600 hover:border-slate-300 hover:bg-white hover:text-slate-900'
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 ${
                    isActive ? 'text-blue-100' : 'text-slate-400'
                  }`}
                />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ========================================================= */}
      {/* SUB-TAB 1: HIỂU BẢN CHẤT (NON-TECH)                       */}
      {/* ========================================================= */}
      {subTab === 1 && (
        <div className="space-y-5">
          {/* Summary Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white shadow-xs sm:p-7">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Tóm tắt ý nghĩa toàn bộ bài code trong 1 câu</span>
            </div>
            <h3 className="text-lg font-bold leading-snug sm:text-2xl">
              Bài này cố tình gài một &ldquo;cái bẫy Excel&rdquo; (Broadcasting) để kiểm tra xem bạn có phát hiện ra bảng số bị phình to thành 3×3 hay không!
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-blue-100">
              Đoạn code mô phỏng một máy học AI đang tập đoán số (Gradient Descent). Nhưng ở dòng{' '}
              <code className="rounded bg-white/20 px-1.5 py-0.5 font-mono text-xs text-white">
                residual = prediction - y
              </code>
              , tác giả cố tình lấy <strong className="text-white">1 cột dọc</strong> trừ đi{' '}
              <strong className="text-white">1 hàng ngang</strong> khiến kết quả bị phình to thành bảng{' '}
              <strong className="text-white">3×3</strong>. Cuối bài, tác giả mới đưa ra cách sửa đúng bằng{' '}
              <code className="rounded bg-white/20 px-1.5 py-0.5 font-mono text-xs text-white">
                y[:, None]
              </code>
              .
            </p>
          </div>

          {/* 2 Core Concepts Grid */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Concept 1: Gradient Descent */}
            <article className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs">
              <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                Khái niệm 1 · Dữ liệu &amp; Học máy
              </span>
              <h3 className="mt-3 text-lg font-bold text-slate-900">
                Gradient Descent là gì?
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                Hãy tưởng tượng bạn đang <strong className="text-slate-900">nêm nếm một nồi canh</strong> (hoặc dò đường xuống núi trong sương mù). Bạn không biết chính xác cần bao nhiêu muối, nên lặp đi lặp lại 4 bước nhỏ:
              </p>

              <div className="mt-4 space-y-2.5">
                {[
                  {
                    n: 1,
                    title: 'Đoán thử',
                    code: 'prediction',
                    desc: 'Bỏ một ít gia vị theo công thức hiện tại (w) rồi nếm thử.',
                  },
                  {
                    n: 2,
                    title: 'Xem bị lệch bao nhiêu',
                    code: 'residual',
                    desc: 'So sánh vị vừa nếm với vị chuẩn (y): mặn quá hay nhạt quá?',
                  },
                  {
                    n: 3,
                    title: 'Tính hướng cần sửa',
                    code: 'grad',
                    desc: 'Quyết định xem nên tăng hay giảm gia vị (đạo hàm trung bình).',
                  },
                  {
                    n: 4,
                    title: 'Nhích nhẹ từng chút một',
                    code: 'w - 0.1 * grad',
                    desc: 'Chỉ điều chỉnh 10% (0.1) để không bị lố tay, rồi lặp lại bước 1!',
                  },
                ].map((item) => (
                  <div
                    key={item.n}
                    className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/60 p-3"
                  >
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-blue-600 font-mono text-xs font-bold text-white">
                      {item.n}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {item.title} (
                        <code className="font-mono text-xs text-blue-700">
                          {item.code}
                        </code>
                        )
                      </p>
                      <p className="mt-0.5 text-xs text-slate-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            {/* Concept 2: Broadcasting Trap */}
            <article className="flex flex-col justify-between rounded-2xl border-2 border-rose-200 bg-white p-6 shadow-2xs">
              <div>
                <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>Khái niệm 2 · Cái bẫy của bài thi</span>
                </span>
                <h3 className="mt-3 text-lg font-bold text-slate-900">
                  Broadcasting là gì? (Bẫy Excel)
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                  Nếu lấy <strong className="text-slate-900">1 cột dọc (3×1)</strong> trừ đi{' '}
                  <strong className="text-slate-900">1 hàng ngang (3,)</strong>, lẽ ra máy nên báo lỗi lệch hình dáng. Nhưng NumPy lại <strong className="text-slate-900">&ldquo;nhiệt tình thái quá&rdquo;</strong>: tự nhân bản cột thành 3 cột và hàng thành 3 hàng, rồi trừ từng ô để đẻ ra <strong className="text-rose-700">bảng vuông 3×3</strong>!
                </p>

                {/* Mini Visual Illustration */}
                <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50/60 p-4">
                  <p className="mb-3 text-center text-[11px] font-bold uppercase tracking-wider text-rose-800">
                    Minh họa nhanh phép trừ bị bẫy
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-xs">
                    <div className="flex flex-col items-center">
                      <span className="mb-1 font-sans text-[11px] font-semibold text-blue-700">
                        Cột (3, 1)
                      </span>
                      <div className="grid grid-cols-1 gap-1 rounded-lg border border-blue-300 bg-white p-1.5">
                        {PRED_COL.map((v, i) => (
                          <div
                            key={i}
                            className="flex h-7 w-8 items-center justify-center rounded bg-blue-100 font-bold text-blue-900"
                          >
                            {v}
                          </div>
                        ))}
                      </div>
                    </div>

                    <span className="text-xl font-extrabold text-rose-600">−</span>

                    <div className="flex flex-col items-center">
                      <span className="mb-1 font-sans text-[11px] font-semibold text-amber-700">
                        Hàng (3,)
                      </span>
                      <div className="grid grid-cols-3 gap-1 rounded-lg border border-amber-300 bg-white p-1.5">
                        {Y_ROW.map((v, i) => (
                          <div
                            key={i}
                            className="flex h-7 w-8 items-center justify-center rounded bg-amber-100 font-bold text-amber-900"
                          >
                            {v}
                          </div>
                        ))}
                      </div>
                    </div>

                    <span className="text-xl font-extrabold text-rose-600">=</span>

                    <div className="flex flex-col items-center">
                      <span className="mb-1 font-sans text-[11px] font-bold text-rose-700">
                        Bảng (3, 3)
                      </span>
                      <div className="grid grid-cols-3 gap-1 rounded-lg border-2 border-rose-400 bg-white p-1.5">
                        {[-1, -2, -2, 0, -1, -1, 1, 0, 0].map((v, i) => (
                          <div
                            key={i}
                            className="flex h-7 w-8 items-center justify-center rounded bg-rose-100 font-bold text-rose-900"
                          >
                            {v}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <p className="text-xs text-slate-600">
                  <strong className="text-emerald-700">Cách sửa:</strong> Dùng{' '}
                  <code className="rounded bg-emerald-50 px-1.5 py-0.5 font-mono text-emerald-800">
                    y[:, None]
                  </code>{' '}
                  để dựng hàng thành cột dọc.
                </p>
                <button
                  type="button"
                  onClick={() => setSubTab(3)}
                  className="inline-flex items-center gap-1 rounded-xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-rose-700"
                >
                  <span>Xem mô phỏng</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </article>
          </div>

          {/* CTA to Sub-Tab 2 */}
          <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-5 sm:flex-row">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  Đã nắm được bức tranh lớn?
                </p>
                <p className="text-xs text-slate-500">
                  Chuyển sang Tab 2 để click vào từng dòng code và xem bảng số thay đổi.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSubTab(2)}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700 sm:w-auto"
            >
              <span>Đi tới Tab 2: Giải thích từng dòng</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 2: GIẢI THÍCH TỪNG DÒNG CODE (CLICK HIGHLIGHT)    */}
      {/* ========================================================= */}
      {subTab === 2 && (
        <div className="space-y-4">
          <div className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs sm:flex-row sm:items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900 sm:text-base">
                Nhấp vào từng dòng code để xem giải thích &amp; hình dáng ma trận
              </h3>
              <p className="text-xs text-slate-500">
                Hoặc dùng nút &ldquo;Dòng trước / Dòng tiếp theo&rdquo; để duyệt lần lượt 13 bước.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                <span className="h-2 w-2 rounded-full bg-blue-600" /> Dữ liệu thường
              </span>
              <span className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700">
                <span className="h-2 w-2 rounded-full bg-rose-600" /> Bẫy Broadcasting
              </span>
              <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-600" /> Cách sửa đúng
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
            {/* Left: Interactive Code Block */}
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-sm lg:col-span-6">
              <div className="flex items-center justify-between border-b border-slate-800 bg-slate-800/80 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <span className="ml-2 font-mono text-xs text-slate-300">
                    cau_02_gradient_descent.py
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">Click từng dòng</span>
              </div>

              <div className="space-y-1 overflow-x-auto p-3 font-mono text-xs">
                {CODE_STEPS.map((step, idx) => {
                  const isActive = idx === activeStepIdx;
                  const activeRing = isActive
                    ? step.theme === 'rose'
                      ? 'bg-rose-500/25 border-l-4 border-rose-400 text-white'
                      : step.theme === 'emerald'
                        ? 'bg-emerald-500/25 border-l-4 border-emerald-400 text-white'
                        : step.theme === 'amber'
                          ? 'bg-amber-500/25 border-l-4 border-amber-400 text-white'
                          : 'bg-blue-500/25 border-l-4 border-blue-400 text-white'
                    : 'border-l-4 border-transparent text-slate-300 hover:bg-slate-800';

                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => setActiveStepIdx(idx)}
                      className={`flex w-full items-start justify-between gap-2 rounded-lg px-2.5 py-2 text-left transition ${activeRing}`}
                    >
                      <div className="flex min-w-0 items-start gap-3">
                        <span className="w-9 shrink-0 pt-0.5 text-right text-[11px] text-slate-500 select-none">
                          {step.lines}
                        </span>
                        <pre className="whitespace-pre font-mono text-xs leading-relaxed">
                          {step.code}
                        </pre>
                      </div>
                      {step.id === 7 && (
                        <span className="shrink-0 rounded border border-rose-500/40 bg-rose-500/20 px-1.5 py-0.5 font-sans text-[10px] font-bold text-rose-300">
                          BẪY
                        </span>
                      )}
                      {step.id === 11 && (
                        <span className="shrink-0 rounded border border-emerald-500/40 bg-emerald-500/20 px-1.5 py-0.5 font-sans text-[10px] font-bold text-emerald-300">
                          SỬA
                        </span>
                      )}
                      {step.theme === 'amber' && (
                        <span className="shrink-0 rounded border border-amber-500/40 bg-amber-500/20 px-1.5 py-0.5 font-sans text-[10px] font-bold text-amber-300">
                          CHÚ Ý
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Sticky Explanation & Matrix Card */}
            <div className="lg:sticky lg:top-24 lg:col-span-6">
              <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-200/80 bg-slate-50 px-5 py-3.5">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500">
                    Phần {activeStepIdx + 1} / {CODE_STEPS.length} (Dòng{' '}
                    {activeStep.lines})
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={activeStepIdx === 0}
                      onClick={() =>
                        setActiveStepIdx((prev) => Math.max(0, prev - 1))
                      }
                      className="inline-flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                      <span>Trước</span>
                    </button>
                    <button
                      type="button"
                      disabled={activeStepIdx === CODE_STEPS.length - 1}
                      onClick={() =>
                        setActiveStepIdx((prev) =>
                          Math.min(CODE_STEPS.length - 1, prev + 1)
                        )
                      }
                      className="inline-flex items-center gap-1 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <span>Tiếp</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4 p-5 sm:p-6">
                  <div>
                    <span
                      className={`mb-2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${
                        activeStep.theme === 'rose'
                          ? 'border-rose-200 bg-rose-50 text-rose-700'
                          : activeStep.theme === 'emerald'
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            : activeStep.theme === 'amber'
                              ? 'border-amber-200 bg-amber-50 text-amber-800'
                              : 'border-blue-200 bg-blue-50 text-blue-700'
                      }`}
                    >
                      {activeStep.category}
                    </span>
                    <h4 className="text-base font-bold leading-snug text-slate-900 sm:text-lg">
                      {activeStep.title}
                    </h4>
                  </div>

                  <pre className="overflow-x-auto rounded-xl bg-slate-900 p-3 font-mono text-xs text-slate-100">
                    {activeStep.code}
                  </pre>

                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Giải thích kiểu đời thường
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-700">
                      {activeStep.everyday}
                    </p>
                  </div>

                  {/* Visual Box */}
                  {activeStep.visual?.type === 'info' && (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        {activeStep.visual.label}
                      </p>
                      <p className="mt-1 font-mono text-xs font-semibold text-slate-800 sm:text-sm">
                        {activeStep.visual.text}
                      </p>
                    </div>
                  )}

                  {activeStep.visual?.type === 'matrix' && (() => {
                    const vis = activeStep.visual;
                    const c = MATRIX_COLORS[vis.color] || MATRIX_COLORS.blue;
                    const cols = vis.data[0].length;
                    const gridClass =
                      cols === 1
                        ? 'grid-cols-1'
                        : cols === 2
                          ? 'grid-cols-2'
                          : 'grid-cols-3';

                    return (
                      <div className={`rounded-xl border p-4 ${c.wrap}`}>
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                          <span className="text-xs font-bold text-slate-800">
                            Bảng số:{' '}
                            <code className="font-mono">{vis.name}</code>
                          </span>
                          <span
                            className={`rounded-full px-2.5 py-0.5 font-mono text-xs font-bold ${c.badge}`}
                          >
                            shape = {vis.shape}
                          </span>
                        </div>
                        <div className="flex justify-center">
                          <div className={`inline-grid gap-2 ${gridClass}`}>
                            {vis.data.flat().map((val, cellIdx) => (
                              <div
                                key={cellIdx}
                                className={`min-w-[3.5rem] rounded-lg border px-2.5 py-2 text-center font-mono text-xs font-bold shadow-2xs sm:text-sm ${c.cell}`}
                              >
                                {val}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="flex items-start gap-2.5 rounded-xl border border-indigo-200 bg-indigo-50/70 p-3.5 text-xs leading-relaxed text-indigo-950">
                    <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
                    <p>
                      <strong className="font-semibold">Mẹo nhớ đi thi: </strong>
                      {activeStep.tip}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 3: TRỰC QUAN HÓA BẪY 3×3 VS ĐÃ SỬA 3×1            */}
      {/* ========================================================= */}
      {subTab === 3 && (
        <div className="space-y-5">
          {/* Toggle Bar */}
          <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs md:flex-row md:items-center">
            <div>
              <h3 className="text-base font-bold text-slate-900 sm:text-lg">
                So sánh trực quan: Bị Bẫy (3×3) vs Đã Sửa (3×1)
              </h3>
              <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                Chuyển giữa 2 chế độ và <strong className="text-slate-800">click từng ô kết quả</strong> để xem phép trừ tạo ra ô đó.
              </p>
            </div>

            <div className="inline-flex self-start rounded-xl border border-slate-200 bg-slate-100 p-1 md:self-auto">
              <button
                type="button"
                onClick={() => setBroadcastMode('trap')}
                className={`rounded-lg px-3.5 py-2 text-xs font-bold transition-all ${
                  broadcastMode === 'trap'
                    ? 'bg-rose-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Chế độ Bị Bẫy (3×3)
              </button>
              <button
                type="button"
                onClick={() => setBroadcastMode('fixed')}
                className={`rounded-lg px-3.5 py-2 text-xs font-bold transition-all ${
                  broadcastMode === 'fixed'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Chế độ Đã Sửa (3×1)
              </button>
            </div>
          </div>

          {broadcastMode === 'trap' ? (
            <div className="space-y-5">
              <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
                <div>
                  <p className="font-bold">
                    Chuyện gì xảy ra ở dòng{' '}
                    <code className="rounded border border-rose-200 bg-white px-1.5 py-0.5 font-mono text-xs text-rose-700">
                      residual = prediction - y
                    </code>
                    ?
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-rose-800 sm:text-sm">
                    <code className="font-mono font-semibold">prediction</code> là cột dọc{' '}
                    <strong>(3, 1)</strong>, còn <code className="font-mono font-semibold">y</code> là hàng ngang{' '}
                    <strong>(3,)</strong>. NumPy tự động nhân bản (ô nét đứt) cả hai thành{' '}
                    <strong>3×3</strong> rồi mới trừ từng ô!
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs sm:p-6">
                <div className="grid grid-cols-1 items-center gap-6 xl:grid-cols-11">
                  {/* Stretched Prediction */}
                  <div className="flex flex-col items-center xl:col-span-3">
                    <span className="mb-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800">
                      1. prediction nhân bản ngang
                    </span>
                    <p className="mb-3 text-xs text-slate-500">
                      Từ cột (3, 1) → bảng (3, 3)
                    </p>
                    <div className="grid grid-cols-3 gap-1.5 rounded-xl border border-blue-200 bg-blue-50/60 p-3 font-mono text-sm">
                      {PRED_COL.map((pVal, r) =>
                        [0, 1, 2].map((c) => {
                          const isSelected =
                            selectedTrapCell.r === r && selectedTrapCell.c === c;
                          return (
                            <div
                              key={`${r}-${c}`}
                              className={`flex h-11 w-12 items-center justify-center rounded-lg border-2 transition ${
                                c === 0
                                  ? 'border-blue-400 bg-blue-200 font-bold text-blue-950'
                                  : 'border-dashed border-blue-300 bg-white text-blue-700'
                              } ${
                                isSelected
                                  ? 'z-10 scale-105 shadow-md ring-2 ring-blue-600'
                                  : ''
                              }`}
                            >
                              {pVal}
                            </div>
                          );
                        })
                      )}
                    </div>
                    <p className="mt-2 text-center text-[11px] text-slate-500">
                      Ô liền: gốc • Ô nét đứt: tự nhân bản
                    </p>
                  </div>

                  <div className="flex justify-center xl:col-span-1">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-rose-200 bg-rose-100 text-2xl font-extrabold text-rose-700">
                      −
                    </span>
                  </div>

                  {/* Stretched y */}
                  <div className="flex flex-col items-center xl:col-span-3">
                    <span className="mb-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                      2. y nhân bản dọc
                    </span>
                    <p className="mb-3 text-xs text-slate-500">
                      Từ hàng (3,) → bảng (3, 3)
                    </p>
                    <div className="grid grid-cols-3 gap-1.5 rounded-xl border border-amber-200 bg-amber-50/60 p-3 font-mono text-sm">
                      {[0, 1, 2].map((r) =>
                        Y_ROW.map((yVal, c) => {
                          const isSelected =
                            selectedTrapCell.r === r && selectedTrapCell.c === c;
                          return (
                            <div
                              key={`${r}-${c}`}
                              className={`flex h-11 w-12 items-center justify-center rounded-lg border-2 transition ${
                                r === 0
                                  ? 'border-amber-400 bg-amber-200 font-bold text-amber-950'
                                  : 'border-dashed border-amber-300 bg-white text-amber-700'
                              } ${
                                isSelected
                                  ? 'z-10 scale-105 shadow-md ring-2 ring-amber-500'
                                  : ''
                              }`}
                            >
                              {yVal}
                            </div>
                          );
                        })
                      )}
                    </div>
                    <p className="mt-2 text-center text-[11px] text-slate-500">
                      Hàng 0: gốc • Hàng 1, 2: tự nhân bản
                    </p>
                  </div>

                  <div className="flex justify-center xl:col-span-1">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-2xl font-extrabold text-slate-700">
                      =
                    </span>
                  </div>

                  {/* Interactive Result (3x3) */}
                  <div className="flex flex-col items-center xl:col-span-3">
                    <span className="mb-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-800">
                      3. Kết quả residual (3, 3)
                    </span>
                    <p className="mb-3 text-xs font-semibold text-rose-600">
                      Click từng ô để xem phép tính!
                    </p>
                    <div className="grid grid-cols-3 gap-1.5 rounded-xl border-2 border-rose-300 bg-rose-50 p-3 font-mono text-sm">
                      {PRED_COL.map((pVal, r) =>
                        Y_ROW.map((yVal, c) => {
                          const diff = pVal - yVal;
                          const isSelected =
                            selectedTrapCell.r === r && selectedTrapCell.c === c;
                          return (
                            <button
                              key={`${r}-${c}`}
                              type="button"
                              onClick={() => setSelectedTrapCell({ r, c })}
                              className={`flex h-11 w-12 items-center justify-center rounded-lg border-2 font-bold transition ${
                                isSelected
                                  ? 'scale-105 border-rose-700 bg-rose-600 text-white shadow-md ring-2 ring-rose-300'
                                  : 'border-rose-200 bg-white text-rose-900 hover:bg-rose-100'
                              }`}
                            >
                              {diff}
                            </button>
                          );
                        })
                      )}
                    </div>
                    <p className="mt-2 text-center text-[11px] text-slate-500">
                      shape = <strong className="font-mono text-rose-700">[3, 3]</strong>
                    </p>
                  </div>
                </div>

                {/* Live Formula Inspector */}
                {(() => {
                  const { r, c } = selectedTrapCell;
                  const pVal = PRED_COL[r];
                  const yVal = Y_ROW[c];
                  const diff = pVal - yVal;
                  return (
                    <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-xl bg-slate-900 p-4 text-white sm:flex-row sm:p-5">
                      <div>
                        <p className="mb-1 text-xs font-medium text-slate-400">
                          Đang kiểm tra ô [Dòng {r}, Cột {c}] của bảng residual:
                        </p>
                        <p className="text-sm font-bold sm:text-base">
                          Lấy <span className="text-blue-300">{pVal}</span> (từ prediction
                          {c > 0 ? ' tự nhân bản' : ' gốc'}) −{' '}
                          <span className="text-amber-300">{yVal}</span> (từ y
                          {r > 0 ? ' tự nhân bản' : ' gốc'}) ={' '}
                          <span className="text-lg text-rose-400">{diff}</span>
                        </p>
                      </div>
                      <div className="shrink-0 rounded-xl border border-white/20 bg-white/10 px-4 py-2 font-mono text-sm font-bold sm:text-base">
                        {pVal} − {yVal} ={' '}
                        <span className="text-rose-300">{diff}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Domino Chain */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
                <h4 className="mb-3 text-sm font-bold text-slate-900">
                  Hiệu ứng Domino: Hậu quả dây chuyền sau cái bẫy
                </h4>
                <div className="grid grid-cols-1 gap-3 text-xs md:grid-cols-3">
                  <div className="rounded-xl border border-rose-200 bg-rose-50 p-3.5">
                    <p className="mb-1 font-bold text-rose-800">
                      1. residual phình → (3, 3)
                    </p>
                    <p className="text-slate-600">
                      Đáng lẽ chỉ có 1 cột 3 số, nay phình thành 3 cột (9 số).
                    </p>
                  </div>
                  <div className="rounded-xl border border-orange-200 bg-orange-50 p-3.5">
                    <p className="mb-1 font-bold text-orange-800">
                      2. grad phình → (2, 3)
                    </p>
                    <p className="text-slate-600">
                      Lấy <code className="font-mono">X.T (2,3) @ residual (3,3) / 3</code> ra 2 dòng × 3 cột.
                    </p>
                  </div>
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5">
                    <p className="mb-1 font-bold text-amber-800">
                      3. trọng số w phình → (2, 3)
                    </p>
                    <p className="text-slate-600">
                      Trọng số ban đầu <code className="font-mono">(2, 1)</code> cũng bị kéo dãn thành <code className="font-mono">(2, 3)</code>!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <div>
                  <p className="font-bold">
                    Cách sửa chuẩn:{' '}
                    <code className="rounded border border-emerald-200 bg-white px-1.5 py-0.5 font-mono text-xs text-emerald-700">
                      fixed = X @ np.array([[0.], [1.]]) - y[:, None]
                    </code>
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-emerald-800 sm:text-sm">
                    Phép <code className="font-mono font-semibold">y[:, None]</code> biến hàng ngang{' '}
                    <code className="font-mono">[1, 2, 2]</code> thành cột dọc <strong>(3, 1)</strong>. Hai cột cùng kích thước trừ cho nhau hoàn toàn không có nhân bản rác!
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs">
                <div className="flex flex-col items-center justify-center gap-6 md:flex-row sm:gap-10">
                  <div className="flex flex-col items-center">
                    <span className="mb-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800">
                      prediction (3, 1)
                    </span>
                    <p className="mb-3 text-xs text-slate-500">Cột dọc 3 số</p>
                    <div className="grid grid-cols-1 gap-2 rounded-xl border border-blue-200 bg-blue-50/70 p-3 font-mono text-sm">
                      {PRED_COL.map((pVal, r) => (
                        <div
                          key={r}
                          className={`flex h-11 w-16 items-center justify-center rounded-lg border-2 border-blue-400 bg-blue-100 font-bold text-blue-950 transition ${
                            selectedFixedRow === r
                              ? 'scale-105 shadow-md ring-2 ring-blue-600'
                              : ''
                          }`}
                        >
                          {pVal}
                        </div>
                      ))}
                    </div>
                  </div>

                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-200 bg-emerald-100 text-2xl font-extrabold text-emerald-700">
                    −
                  </span>

                  <div className="flex flex-col items-center">
                    <span className="mb-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                      y[:, None] (3, 1)
                    </span>
                    <p className="mb-3 text-xs text-slate-500">Đã dựng cột dọc!</p>
                    <div className="grid grid-cols-1 gap-2 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 font-mono text-sm">
                      {Y_ROW.map((yVal, r) => (
                        <div
                          key={r}
                          className={`flex h-11 w-16 items-center justify-center rounded-lg border-2 border-emerald-400 bg-emerald-100 font-bold text-emerald-950 transition ${
                            selectedFixedRow === r
                              ? 'scale-105 shadow-md ring-2 ring-emerald-600'
                              : ''
                          }`}
                        >
                          {yVal}
                        </div>
                      ))}
                    </div>
                  </div>

                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-2xl font-extrabold text-slate-700">
                    =
                  </span>

                  <div className="flex flex-col items-center">
                    <span className="mb-1 rounded-full bg-emerald-600 px-2.5 py-0.5 text-xs font-bold text-white">
                      fixed (3, 1)
                    </span>
                    <p className="mb-3 text-xs font-semibold text-emerald-700">
                      Click từng ô xem phép trừ
                    </p>
                    <div className="grid grid-cols-1 gap-2 rounded-xl border-2 border-emerald-400 bg-emerald-50 p-3 font-mono text-sm">
                      {PRED_COL.map((pVal, r) => {
                        const diff = pVal - Y_ROW[r];
                        const isSelected = selectedFixedRow === r;
                        return (
                          <button
                            key={r}
                            type="button"
                            onClick={() => setSelectedFixedRow(r)}
                            className={`flex h-11 w-16 items-center justify-center rounded-lg border-2 font-bold transition ${
                              isSelected
                                ? 'scale-105 border-emerald-700 bg-emerald-600 text-white shadow-md ring-2 ring-emerald-300'
                                : 'border-emerald-300 bg-white text-emerald-900 hover:bg-emerald-100'
                            }`}
                          >
                            {diff}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Fixed Inspector */}
                {(() => {
                  const r = selectedFixedRow;
                  const pVal = PRED_COL[r];
                  const yVal = Y_ROW[r];
                  const diff = pVal - yVal;
                  return (
                    <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-xl bg-emerald-950 p-4 text-emerald-50 sm:flex-row sm:p-5">
                      <div>
                        <p className="mb-1 text-xs font-medium text-emerald-300">
                          Đang kiểm tra mẫu thứ {r + 1} (Dòng {r}):
                        </p>
                        <p className="text-sm font-bold sm:text-base">
                          Dự đoán <span className="text-blue-300">{pVal}</span> − Đáp án thật{' '}
                          <span className="text-emerald-300">{yVal}</span> = Sai số{' '}
                          <span className="underline">{diff}</span> (Không có nhân bản rác!)
                        </p>
                      </div>
                      <div className="shrink-0 rounded-xl border border-white/20 bg-white/10 px-4 py-2 font-mono text-sm font-bold sm:text-base">
                        {pVal} − {yVal} ={' '}
                        <span className="text-emerald-300">{diff}</span>
                      </div>
                    </div>
                  );
                })()}

                <div className="mt-5 flex flex-col items-start justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center">
                  <div className="text-xs text-slate-700 sm:text-sm">
                    <strong>
                      Kết quả cuối <code className="font-mono text-emerald-700">fixed_grad</code>:
                    </strong>{' '}
                    <code className="font-mono">X.T @ fixed / 3</code> ={' '}
                    <code className="font-mono">[[-2], [-1]] / 3</code>
                  </div>
                  <span className="shrink-0 rounded-lg border border-emerald-300 bg-emerald-100 px-3 py-1.5 font-mono text-sm font-bold text-emerald-900">
                    [[-0.667], [-0.333]]
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 4: MẸO 15 GIÂY LOẠI TRỪ A/B/C/D & MINI-QUIZ 3 CÂU */}
      {/* ========================================================= */}
      {subTab === 4 && (
        <div className="space-y-6">
          {/* 15s Strategy Card */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs sm:p-6">
            <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <span className="mb-1 inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700 ring-1 ring-inset ring-indigo-200">
                  <Zap className="h-3.5 w-3.5" />
                  <span>Chiến thuật phòng thi 15 giây</span>
                </span>
                <h3 className="text-base font-bold text-slate-900 sm:text-lg">
                  Loại trừ 4 đáp án A, B, C, D không cần bấm máy tính
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setHintsVisible((v) => !v)}
                className="inline-flex w-fit items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
              >
                {hintsVisible ? (
                  <>
                    <EyeOff className="h-3.5 w-3.5" />
                    <span>Ẩn phân tích loại trừ</span>
                  </>
                ) : (
                  <>
                    <Eye className="h-3.5 w-3.5" />
                    <span>Hiện phân tích loại trừ</span>
                  </>
                )}
              </button>
            </div>

            {/* 3-Step 15s Checklist */}
            <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-3.5">
                <p className="text-xs font-bold text-blue-800">
                  Bước 1 (3 giây): Soi shape đầu tiên
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-700">
                  Thấy <code className="font-mono">prediction - y</code> (cột trừ hàng) → chắc chắn ra{' '}
                  <strong className="font-mono text-blue-900">[3, 3]</strong> →{' '}
                  <strong>Loại ngay B!</strong>
                </p>
              </div>
              <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5">
                <p className="text-xs font-bold text-amber-800">
                  Bước 2 (5 giây): Soi chia cho len(X)
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-700">
                  Có <code className="font-mono">/ len(X)</code> tức chia 3 → số phải nhỏ (như{' '}
                  <code className="font-mono">-1.0, 0.667</code>), không thể là{' '}
                  <code className="font-mono">-3.0, 2.0</code> → <strong>Loại ngay C!</strong>
                </p>
              </div>
              <div className="rounded-xl border border-indigo-200 bg-indigo-50/70 p-3.5">
                <p className="text-xs font-bold text-indigo-800">
                  Bước 3 (7 giây): Soi step0 vs step1
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-700">
                  Sau bước 0, <code className="font-mono">w</code> đã thay đổi →{' '}
                  <code className="font-mono">grad</code> ở <code className="font-mono">step1</code> PHẢI khác{' '}
                  <code className="font-mono">step0</code> → <strong>Loại D! Chọn A!</strong>
                </p>
              </div>
            </div>

            {/* 4 Options Comparison */}
            <div className="space-y-3.5">
              {/* Option A */}
              <div
                className={`rounded-2xl border p-4 transition ${
                  hintsVisible
                    ? 'border-2 border-emerald-400 bg-emerald-50/35'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-lg font-mono text-xs font-bold ${
                        hintsVisible
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      A
                    </span>
                    <span className="text-sm font-bold text-slate-900">Phương án A</span>
                  </div>
                  {hintsVisible && (
                    <span className="rounded-full bg-emerald-600 px-3 py-0.5 text-xs font-bold text-white">
                      ĐÁP ÁN ĐÚNG
                    </span>
                  )}
                </div>
                <pre className="overflow-x-auto rounded-xl border border-slate-200 bg-white p-3 font-mono text-[11px] leading-relaxed text-slate-800 sm:text-xs">
                  step0: [
                  <span className={hintsVisible ? 'rounded bg-emerald-100 px-1 font-bold text-emerald-900' : ''}>
                    [3, 3]
                  </span>
                  , [[0.0,{' '}
                  <span className={hintsVisible ? 'rounded bg-emerald-100 px-1 font-bold text-emerald-900' : ''}>
                    -1.0
                  </span>
                  , -1.0], [
                  <span className={hintsVisible ? 'rounded bg-emerald-100 px-1 font-bold text-emerald-900' : ''}>
                    0.667
                  </span>
                  , -0.333, -0.333]], [[0.0, 0.1, 0.1], [0.933, 1.033, 1.033]]]
                  {'\n'}step1: [[3, 3], [
                  <span className={hintsVisible ? 'rounded bg-emerald-100 px-1 font-bold text-emerald-900' : ''}>
                    [-0.067, -0.867, -0.867]
                  </span>
                  , [0.556, -0.178, -0.178]], [[0.007, 0.187, 0.187], [0.878, 1.051, 1.051]]]
                  {'\n'}pred: [[0.007, 0.187, 0.187], [0.884, 1.238, 1.238], [1.762, 2.289, 2.289]]
                  {'\n'}fixed_grad: [[-0.667], [-0.333]]
                </pre>
                {hintsVisible && (
                  <p className="mt-2.5 text-xs font-medium text-emerald-800">
                    <strong>Chuẩn cả 3 tiêu chí:</strong> Có bẫy shape{' '}
                    <code className="font-mono">[3, 3]</code>, đã chia 3 (
                    <code className="font-mono">-1.0, 0.667</code>) và{' '}
                    <code className="font-mono">grad</code> ở step1 đã cập nhật khác step0.
                  </p>
                )}
              </div>

              {/* Option B */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-200 font-mono text-xs font-bold text-slate-700">
                      B
                    </span>
                    <span className="text-sm font-bold text-slate-800">Phương án B</span>
                  </div>
                  {hintsVisible && (
                    <span className="rounded-full border border-rose-200 bg-rose-50 px-3 py-0.5 text-xs font-bold text-rose-700">
                      LOẠI NGAY · Quên bẫy Broadcasting
                    </span>
                  )}
                </div>
                <pre className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-[11px] leading-relaxed text-slate-700 sm:text-xs">
                  step0: [
                  <span className={hintsVisible ? 'rounded bg-rose-200 px-1 font-bold text-rose-900' : ''}>
                    [3, 1]
                  </span>
                  , [[-0.667], [-0.333]], [[0.067], [1.033]]]
                  {'\n'}step1: [
                  <span className={hintsVisible ? 'rounded bg-rose-200 px-1 font-bold text-rose-900' : ''}>
                    [3, 1]
                  </span>
                  , [[-0.567], [-0.211]], [[0.123], [1.054]]]
                  {'\n'}pred: [[0.123], [1.178], [2.232]]
                  {'\n'}fixed_grad: [[-0.667], [-0.333]]
                </pre>
                {hintsVisible && (
                  <p className="mt-2.5 text-xs font-medium text-rose-700">
                    <strong>Lý do loại:</strong> Ghi kích thước <code className="font-mono">[3, 1]</code> — bẫy người quên NumPy sẽ broadcast thành <code className="font-mono">[3, 3]</code>.
                  </p>
                )}
              </div>

              {/* Option C */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-200 font-mono text-xs font-bold text-slate-700">
                      C
                    </span>
                    <span className="text-sm font-bold text-slate-800">Phương án C</span>
                  </div>
                  {hintsVisible && (
                    <span className="rounded-full border border-rose-200 bg-rose-50 px-3 py-0.5 text-xs font-bold text-rose-700">
                      LOẠI NGAY · Quên chia len(X) = 3
                    </span>
                  )}
                </div>
                <pre className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-[11px] leading-relaxed text-slate-700 sm:text-xs">
                  step0: [[3, 3], [[0.0,{' '}
                  <span className={hintsVisible ? 'rounded bg-rose-200 px-1 font-bold text-rose-900' : ''}>
                    -3.0, -3.0
                  </span>
                  ], [
                  <span className={hintsVisible ? 'rounded bg-rose-200 px-1 font-bold text-rose-900' : ''}>
                    2.0
                  </span>
                  , -1.0, -1.0]], [[0.0, 0.3, 0.3], [0.8, 1.1, 1.1]]]
                  {'\n'}step1: [[3, 3], [[-0.6, -1.8, -1.8], [1.0, 0.4, 0.4]], [[0.06, 0.48, 0.48], [0.7, 1.06, 1.06]]]
                  {'\n'}pred: [[0.06, 0.48, 0.48], [0.76, 1.54, 1.54], [1.46, 2.6, 2.6]]
                  {'\n'}fixed_grad: [[-0.667], [-0.333]]
                </pre>
                {hintsVisible && (
                  <p className="mt-2.5 text-xs font-medium text-rose-700">
                    <strong>Lý do loại:</strong> Con số <code className="font-mono">-3.0</code> và <code className="font-mono">2.0</code> lớn gấp 3 lần thực tế vì quên chia cho <code className="font-mono">len(X) = 3</code>.
                  </p>
                )}
              </div>

              {/* Option D */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-200 font-mono text-xs font-bold text-slate-700">
                      D
                    </span>
                    <span className="text-sm font-bold text-slate-800">Phương án D</span>
                  </div>
                  {hintsVisible && (
                    <span className="rounded-full border border-rose-200 bg-rose-50 px-3 py-0.5 text-xs font-bold text-rose-700">
                      LOẠI NGAY · Quên cập nhật w sang step1
                    </span>
                  )}
                </div>
                <pre className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-[11px] leading-relaxed text-slate-700 sm:text-xs">
                  step0: [[3, 3], [
                  <span className={hintsVisible ? 'rounded bg-amber-200 px-1 font-bold text-amber-900' : ''}>
                    [0.0, -1.0, -1.0], [0.667, -0.333, -0.333]
                  </span>
                  ], [[0.0, 0.1, 0.1], [0.933, 1.033, 1.033]]]
                  {'\n'}step1: [[3, 3], [
                  <span className={hintsVisible ? 'rounded bg-rose-200 px-1 font-bold text-rose-900' : ''}>
                    [0.0, -1.0, -1.0], [0.667, -0.333, -0.333]
                  </span>
                  ], [[0.0, 0.2, 0.2], [0.867, 1.067, 1.067]]]
                  {'\n'}pred: [[0.0, 0.2, 0.2], [0.867, 1.267, 1.267], [1.733, 2.333, 2.333]]
                  {'\n'}fixed_grad: [[-0.667], [-0.333]]
                </pre>
                {hintsVisible && (
                  <p className="mt-2.5 text-xs font-medium text-rose-700">
                    <strong>Lý do loại:</strong> <code className="font-mono">grad</code> của{' '}
                    <code className="font-mono">step1</code> giống hệt <code className="font-mono">step0</code> — vô lý vì cuối step0 trọng số <code className="font-mono">w</code> đã đổi!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Mini-Quiz 3 Questions */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs sm:p-6">
            <div className="mb-5 flex flex-col justify-between gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center">
              <div>
                <span className="mb-1 inline-flex items-center rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-bold text-teal-800 ring-1 ring-inset ring-teal-200">
                  Kiểm tra nhanh kiến thức
                </span>
                <h3 className="text-base font-bold text-slate-900 sm:text-lg">
                  Mini-Quiz 3 câu trước khi vào phòng thi
                </h3>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 font-mono text-xs font-bold text-blue-800 tabular-nums">
                  Điểm: {quizScore} / 3
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
              {MINI_QUIZ.map((q) => {
                const chosen = quizAnswers[q.id];
                const hasAnswered = chosen !== undefined;
                const isCorrect = chosen === q.correct;

                return (
                  <div
                    key={q.id}
                    className="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-4 sm:p-5"
                  >
                    <p className="mb-3 text-sm font-bold text-slate-900">
                      {q.question}
                    </p>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {q.options.map((opt, idx) => {
                        let btnClass =
                          'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-slate-50';
                        if (hasAnswered) {
                          if (idx === q.correct) {
                            btnClass =
                              'border-teal-500 bg-teal-50 font-bold text-teal-900';
                          } else if (idx === chosen && idx !== q.correct) {
                            btnClass =
                              'border-rose-500 bg-rose-50 font-bold text-rose-900';
                          } else {
                            btnClass =
                              'border-slate-200 bg-slate-50 text-slate-400';
                          }
                        }
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() =>
                              setQuizAnswers((prev) => ({
                                ...prev,
                                [q.id]: idx,
                              }))
                            }
                            className={`rounded-xl border-2 px-3.5 py-2.5 text-left text-xs transition sm:text-sm ${btnClass}`}
                          >
                            {opt}
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
                          {q.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
