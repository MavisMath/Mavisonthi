# Bộ Prompt & Hướng Dẫn Dựng Web Ôn Thi AI Thực Chiến VinUni (Antigravity IDE)

> **Lưu ý khi dùng Antigravity trên Windows:**
> - Chạy lần lượt từng bước, kiểm tra `npm run dev` chạy mượt rồi mới dán Prompt tiếp theo.
> - Không để Windows rơi vào chế độ Sleep khi Antigravity đang chạy.
> - Ở **Bước 1**, chưa cần đưa các file PDF/DOCX vào. Chỉ nạp dữ liệu ở **Bước 5** (có thể dùng luôn file `ready_data/examData.json` đi kèm trong gói ZIP này).

---

## Bước 1: Dựng khung dự án & Dữ liệu mẫu (Dễ)

```text
Hãy khởi tạo một web app ôn thi kỳ thi AI Thực chiến VinUni bằng React + Vite + Tailwind CSS (giao diện sáng, tối giản, dễ đọc, font Be Vietnam Pro cho chữ thường và JetBrains Mono cho code/công thức).

Yêu cầu cho Bước 1:
1. Tạo cấu trúc 4 tab điều hướng ở thanh trên cùng:
   - Tab 1: Flashcard Phản xạ
   - Tab 2: Trắc nghiệm & Thi thử 90p
   - Tab 3: Code tay Python
   - Tab 4: Case Study (R-A-T-S-M)
2. Tạo file `src/data/examData.json` với cấu trúc mẫu (mỗi loại 3-5 item chuẩn bị sẵn để test):
   - `flashcards`: id, module (M1, M2, M3, M4), question, answer, tag.
   - `quizzes`: id, module, weight (M2 và M3 đặt weight: 2, M1 và M4 đặt weight: 1), question, options (A, B, C, D), correctIndex, explanation, trapNote.
   - `pythonTasks`: id, title, prompt, starterCode, solutionCode, checklist (mảng các tiêu chí kiểm tra edge case).
   - `caseStudies`: id, title, scenario, sampleAnswer (object gồm 5 key: rootCause, architecture, tradeoffs, safetyEthics, metricsRollout).
3. Hiển thị trang chủ tổng quan đếm số lượng câu hiện có ở mỗi Module và chạy thử `npm run dev` không lỗi. Chưa cần làm logic chấm điểm hay bộ đếm giờ ở bước này.
```

---

## Bước 2: Màn hình Flashcard Phản xạ & Lưu tiến độ (Trung bình)

```text
Tiếp tục từ dự án hiện tại, hãy hoàn thiện Tab 1: "Flashcard Phản xạ" dựa trên dữ liệu `flashcards` trong `src/data/examData.json`.

Yêu cầu cho Bước 2:
1. Bộ lọc ở phía trên: Lọc theo Module (Tất cả / M1 Toán / M2 Python / M3 AI & MLOps / M4 Đạo đức) và lọc "Chỉ xem thẻ chưa thuộc".
2. Giao diện thẻ lật (Click vào thẻ hoặc bấm phím Space để lật giữa Mặt trước là Câu hỏi và Mặt sau là Đáp án).
3. Bên dưới thẻ có 3 nút đánh giá:
   - "Chưa thuộc" (màu đỏ nhạt)
   - "Còn lơ mơ" (màu vàng nhạt)
   - "Đã chắc" (màu xanh ngọc)
4. Lưu trạng thái từng thẻ theo `id` vào `localStorage` để khi tải lại trang không bị mất tiến độ, kèm thanh tiến độ hiển thị số thẻ Đã chắc / Tổng số thẻ.
```

---

## Bước 3: Trắc nghiệm Lệch trọng số & Thi thử 90 phút (Trung bình khá)

```text
Tiếp tục hoàn thiện Tab 2: "Trắc nghiệm & Thi thử 90p" sử dụng dữ liệu `quizzes` trong `src/data/examData.json`.

Yêu cầu cho Bước 3:
1. Cho phép chọn 2 chế độ:
   - "Luyện theo Module": Chọn M1, M2, M3 hoặc M4 để làm không giới hạn thời gian; chọn đáp án xong hiện ngay đúng/sai kèm phần `explanation` và `trapNote` (Bẫy kinh điển cần tránh).
   - "Thi thử 90 phút (Lệch trọng số)": Có đồng hồ đếm ngược 90:00, tự động xáo trộn và ưu tiên bốc nhiều câu có `weight: 2` (Module 2 và 3) hơn `weight: 1`. Làm xong bấm "Nộp bài" mới hiện tổng điểm, phân tích % đúng theo từng Module và danh sách các câu làm sai.
2. Lưu ID các câu từng làm sai vào `localStorage` và thêm nút "Ôn lại câu đã sai" để luyện tập trung vào lỗ hổng.
```

---

## Bước 4: Sân tập Code tay Python & Phòng luyện Case Study R-A-T-S-M (Khó)

```text
Tiếp tục hoàn thiện Tab 3 ("Code tay Python") và Tab 4 ("Case Study R-A-T-S-M") từ dữ liệu trong `src/data/examData.json`.

Yêu cầu cho Bước 4:
1. Ở Tab 3 (Code tay Python):
   - Chia 2 cột: Cột trái hiện đề bài (`prompt`), cột phải là ô `<textarea>` dùng font `JetBrains Mono` để gõ code tay.
   - Tắt hoàn toàn gợi ý của trình duyệt trên ô code (`spellCheck={false}`, `autoComplete="off"`, `autoCorrect="off"`) và hỗ trợ bấm phím Tab để thụt lề 4 dấu cách.
   - Nút "Xem đáp án & Tự chấm": Hiện `solutionCode` bên dưới kèm danh sách checkbox từ `checklist` để người dùng tự tích điểm và lưu lịch sử hoàn thành vào `localStorage`.
2. Ở Tab 4 (Case Study R-A-T-S-M):
   - Hiện đề tình huống (`scenario`) kèm đồng hồ bấm giờ 15 phút cho mỗi case.
   - Chia sẵn 5 ô nhập tách biệt: 1. Root Cause (R), 2. Architecture (A), 3. Trade-offs (T), 4. Safety & Ethics (S), 5. Metrics & Rollout (M).
   - Bấm "Đối chiếu bài mẫu": Hiện song song nội dung người dùng vừa viết với từng phần trong `sampleAnswer` để tự đối soát ý còn thiếu.
```

---

## Bước 5: Nạp dữ liệu đầy đủ & Deploy Vercel
1. Copy file `ready_data/examData.json` trong gói ZIP này đè vào `src/data/examData.json` (đã có sẵn 50 Flashcard, 12 câu tình huống SFIA, 3 bài Code tay Python và 2 Case Study R-A-T-S-M). Nếu muốn bổ sung thêm câu từ `raw_docs/a.pdf` hoặc `Tai_lieu_on_tap_AI_CD09_CD12.docx`, hãy nhờ Antigravity append thêm vào mảng `quizzes`.
2. Push toàn bộ dự án lên GitHub nhánh `main` và kết nối vào Vercel để học trên cả laptop và điện thoại.
