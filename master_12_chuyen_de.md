# TÀI LIỆU TỔNG HỢP 12 CHUYÊN ĐỀ ÔN THI AI THỰC CHIẾN VINUNI (CĐ-01 → CĐ-12)

> File này tổng hợp cô đọng toàn bộ kiến thức, công thức, keyword YouTube và bẫy kinh điển của cả 12 chuyên đề (kết hợp `a.pdf`, `Tài liệu ôn tập AI CĐ-09 đến CĐ-12.docx`, `De-Thi-Danh-Gia-Nang-Luc-AI-VinUni.md`, `de-cuong-on-tap`, và bổ sung đầy đủ **CĐ-04 Thống kê & A/B testing** + **CĐ-08 SQL**). Dùng để Antigravity đọc và sinh nội dung cho Tab `12 Chuyên đề` và `Mẹo 15s`.

---

## NHÓM 1: TOÁN HỌC (MODULE 1)

### CĐ-01 · Đại số tuyến tính
- **Tỷ trọng mục:** Vector, tích vô hướng, chuẩn, cosine (20%) · Ma trận: nhân, chuyển vị, hạng, định thức, nghịch đảo (30%) · Hệ PT, độc lập tuyến tính (15%) · Trị riêng, vector riêng, chéo hóa (20%) · SVD, PCA, xấp xỉ hạng thấp (15%).
- **Bản chất & Công thức:**
  - Nhân ma trận: `(m × n) · (n × p) = (m × p)`; `(AB)^T = B^T A^T`.
  - Tích vô hướng: `u · v = ∑ u_i v_i`; trực giao khi `u · v = 0`. Cosine similarity: `(u · v) / (||u|| ||v||)`.
  - Chuẩn (Norm): L1 = `∑|x_i|` (Manhattan, tạo độ thưa), L2 = `√(∑x_i²)` (Euclidean).
  - Định thức cấp 2: `det(A) = ad - bc`; cấp 3 theo Sarrus: `aei + bfg + cdh - ceg - bdi - afh`.
  - Ma trận nghịch đảo cấp 2: tồn tại khi và chỉ khi `det(A) ≠ 0`, `A^-1 = (1/(ad-bc)) * [[d, -b], [-c, a]]`.
  - Trị riêng & Vector riêng: `Av = λv` (nền tảng của PCA tìm trục phương sai lớn nhất).
  - SVD & PCA: Ma trận thưa (sparse) dùng **Truncated SVD + CSR**, không dùng Standard PCA.
- **Keyword YouTube:** `3Blue1Brown Essence of Linear Algebra`, `Truncated SVD vs PCA sparse matrix`, `Eigenvalues Eigenvectors PCA intuition`.
- **Bẫy kinh điển:** Dùng Standard PCA trên ma trận thưa làm bước centering biến số 0 thành khác 0 gây tràn RAM (OOM); nhầm `AB = BA`; quên đổi thứ tự khi chuyển vị `(AB)^T`.

### CĐ-02 · Giải tích và tối ưu
- **Tỷ trọng mục:** Đạo hàm, quy tắc chuỗi (25%) · Đạo hàm riêng, gradient, Jacobian, Hessian (25%) · Gradient descent, LR, momentum, Adam (25%) · Hàm mất mát, sigmoid, softmax, backprop (25%).
- **Bản chất & Công thức:**
  - Đạo hàm cơ bản: `(x^n)' = nx^(n-1)`, `(e^x)' = e^x`, `(ln x)' = 1/x`, `(sin x)' = cos x`, `(cos x)' = -sin x`.
  - Chain Rule: `dL/dw = (dL/dy) * (dy/dw)` (cơ sở của Backpropagation).
  - Gradient: `∇f = [∂f/∂x, ∂f/∂y]` (chỉ hướng tăng nhanh nhất); Jacobian (ma trận đạo hàm bậc 1), Hessian (ma trận đạo hàm bậc 2 kiểm tra lồi/cực trị).
  - Cực trị 1 biến: `f'(x) = 0`; `f''(x) > 0` → Local Min, `f''(x) < 0` → Local Max.
  - Gradient Descent: `θ_new = θ_old - η∇L`. Momentum (thêm quán tính vượt điểm yên ngựa), Adam (kết hợp Momentum + thích nghi learning rate từng tham số).
  - Activation & Loss: `ReLU(x) = max(0, x)`, `Sigmoid ∈ (0, 1)`, `Softmax` chuẩn hóa thành xác suất tổng = 1. MSE cho Regression, Cross-Entropy cho Classification.
- **Keyword YouTube:** `StatQuest Gradient Descent Adam optimizer`, `Backpropagation calculus 3Blue1Brown`, `Jacobian and Hessian intuition`.
- **Bẫy kinh điển:** Loss giảm nhanh đầu rồi dao động mạnh → Learning Rate quá lớn (sửa bằng LR Decay, không phải giảm batch size xuống 1); nhầm dấu `+` thành `-` trong công thức update; ReLU(-5) = 0.

### CĐ-03 · Xác suất
- **Tỷ trọng mục:** Tổ hợp, xác suất cơ bản (15%) · Xác suất có điều kiện, Bayes, tỉ lệ nền (30%) · Biến ngẫu nhiên, kỳ vọng, phương sai (25%) · Phân phối Bernoulli, nhị thức, Poisson, chuẩn (30%).
- **Bản chất & Công thức:**
  - Tổ hợp `C(n, k) = n! / (k!(n-k)!)` (không tính thứ tự) vs Chỉnh hợp `A(n, k)` (có thứ tự).
  - Độc lập: `P(A ∩ B) = P(A)P(B)`.
  - Định lý Bayes: `P(A|B) = P(B|A)P(A) / P(B)` — chú ý **tỉ lệ nền (base rate)** khi bệnh/sự kiện rất hiếm.
  - Kỳ vọng & Phương sai: `E(aX + b) = aE(X) + b`; `Var(aX + b) = a² Var(X)` (cộng hằng số `b` không đổi phương sai!).
  - Phân phối: Bernoulli (1 lần thử 0/1), Nhị thức Binomial (`n` lần thử độc lập), Poisson (đếm số sự kiện xảy ra trong khoảng thời gian cố định), Chuẩn Gaussian (68% - 95% - 99.7% trong ±1σ, ±2σ, ±3σ).
- **Keyword YouTube:** `3Blue1Brown Bayes theorem base rate fallacy`, `StatQuest Probability Distributions Binomial Poisson Normal`.
- **Bẫy kinh điển:** Bỏ qua tỉ lệ nền (Base Rate Fallacy): test chính xác 99% nhưng bệnh chỉ chiếm 0.1% dân số thì xác suất mắc thật khi dương tính vẫn thấp; quên bình phương `a` trong `Var(aX + b)`.

### CĐ-04 · Thống kê và kiểm định A/B
- **Tỷ trọng mục:** Thống kê mô tả: trung vị, phân vị, độ lệch (15%) · Sai số chuẩn, khoảng tin cậy (20%) · Kiểm định, p-value, sai lầm loại I/II, power (25%) · Thiết kế A/B: cỡ mẫu, SRM, nhìn trộm, đa so sánh (30%) · Tương quan, nhân quả, nghịch lý Simpson (10%).
- **Bản chất & Công thức:**
  - Mean (nhạy ngoại lai) vs Median (trung vị, bền vững với outlier); Phân vị (Percentile: p50 là median, p95 là 95% giá trị nhỏ hơn mức này).
  - Sai số chuẩn: `SE = σ / √n` (mẫu càng lớn `n`, sai số chuẩn càng nhỏ). Khoảng tin cậy 95% (CI): `mean ± 1.96 * SE`.
  - Kiểm định giả thuyết: `H0` (không khác biệt), `p-value < α` (thường 0.05) → bác bỏ `H0`.
  - Sai lầm loại I (False Positive, xác suất = α: kết luận có hiệu quả dù thực tế không có) vs Sai lầm loại II (False Negative, xác suất = β: bỏ sót hiệu quả thật). **Power = 1 - β** (thường chọn ≥ 80%).
  - Bẫy A/B testing: **SRM (Sample Ratio Mismatch)** (tỉ lệ chia nhóm lệch bất thường so với 50/50 → lỗi tracking/chia traffic, phải dừng test); **Peeking (nhìn trộm)** (dừng test sớm ngay khi thấy p < 0.05 làm tăng mạnh False Positive); **Đa so sánh (Multiple Testing)** (test 20 chỉ số cùng lúc thì kiểu gì cũng có 1 chỉ số tình cờ p < 0.05 → cần hiệu chỉnh Bonferroni).
  - **Nghịch lý Simpson (Simpson's Paradox):** Xu hướng đúng ở từng nhóm nhỏ lại đảo ngược khi gộp chung toàn bộ dữ liệu do biến nhiễu (confounding variable) và cỡ mẫu lệch.
- **Keyword YouTube:** `StatQuest p-values Type I Type II error Power`, `AB Testing SRM peeking problem`, `Simpson's Paradox explained`.
- **Bẫy kinh điển:** Nghĩ `p-value = 0.03` là "xác suất H0 đúng là 3%" (sai: đó là xác suất thấy dữ liệu cực đoan như vậy *nếu giả sử* H0 đúng); đánh đồng tương quan với nhân quả; bỏ qua SRM.

---

## NHÓM 2: LẬP TRÌNH VÀ DỮ LIỆU (MODULE 2 — TRỌNG SỐ CAO)

### CĐ-05 · Lập trình Python
- **Tỷ trọng mục:** Kiểu dữ liệu, list/dict/set/tuple, slicing (25%) · Mutability, aliasing, tham số mặc định (20%) · Hàm, comprehension, generator, closure (25%) · Ngoại lệ, chuỗi, regex (15%) · OOP, dataclass (15%).
- **Bản chất & Cú pháp:**
  - Slicing `a[start:end:step]`: lấy từ `start`, dừng *trước* `end`; `a[-1]` phần tử cuối; `a[::-1]` đảo ngược.
  - Mutability & Aliasing: `list/dict/set` là mutable; `int/str/tuple` là immutable. `b = a` chỉ gán tham chiếu (aliasing); `def f(x=[])` là bẫy tham số mặc định mutable (bị dùng chung giữa các lần gọi → phải dùng `x=None`).
  - Comprehension & Generator: `[x*2 for x in arr if x is not None]`; Generator dùng `yield` (tiết kiệm RAM khi đọc file lớn, chỉ sinh từng phần tử khi lặp). Closure là hàm lồng nhớ biến của scope ngoài.
  - Exception & Regex: So sánh `None` dùng `is None` / `is not None`; không bọc `try...except Exception` che bug; dùng `dict.get(k, default)` tránh `KeyError`.
  - OOP & `dataclass`: `@dataclass` tự sinh `__init__`, `__repr__`, `__eq__` cho class chứa dữ liệu.
- **Keyword YouTube:** `Python mutable vs immutable aliasing`, `Python generators yield closure`, `Python dataclass tutorial`.
- **Bẫy kinh điển:** `def add(item, target=[]):` giữ lại phần tử của lần gọi trước; `len(list)` tưởng là O(n) nhưng thực chất là O(1).

### CĐ-06 · Xử lý dữ liệu với pandas
- **Tỷ trọng mục:** Đọc, lọc dữ liệu loc/iloc/query (25%) · groupby, agg, pivot, transform (30%) · merge, concat (20%) · Dữ liệu thiếu, kiểu dữ liệu, thời gian (25%).
- **Bản chất & Cú pháp:**
  - `loc` (truy cập theo **tên nhãn**, lấy cả đầu cuối) vs `iloc` (truy cập theo **chỉ số nguyên**, dừng trước end). Lọc: `df[(df["age"] > 25) & (df["city"] == "HN")]` hoặc `df.query("age > 25")`.
  - `groupby().agg()` (thu gọn số dòng theo nhóm) vs `groupby().transform()` (giữ nguyên số dòng ban đầu để gán lại vào bảng gốc, ví dụ tính % đóng góp của từng nhân viên trong phòng ban). `pivot_table` xoay bảng tổng hợp 2 chiều.
  - `pd.merge(df1, df2, on="id", how="left")` (ghép theo khóa như SQL JOIN) vs `pd.concat([df1, df2])` (nối theo hàng `axis=0` hoặc cột `axis=1`).
  - Missing & Datetime: `df.isna().sum()`, `fillna(method="ffill")` (lấy giá trị hợp lệ gần nhất phía trước), `pd.to_datetime()`.
- **Keyword YouTube:** `Pandas loc vs iloc`, `Pandas groupby agg vs transform`, `Pandas merge vs concat`.
- **Bẫy kinh điển:** `SettingWithCopyWarning` khi sửa trực tiếp trên slice (phải `.copy()`); `fillna(mean)` trước khi chia train/test (Data Leakage).

### CĐ-07 · NumPy và độ phức tạp thuật toán
- **Tỷ trọng mục:** ndarray, shape, axis, broadcasting (30%) · Vector hóa so với vòng lặp (15%) · Big-O: vòng lặp, đệ quy, cấu trúc dữ liệu (30%) · Tìm kiếm, sắp xếp, hash, heap, hai con trỏ (25%).
- **Bản chất & Cú pháp:**
  - NumPy: `np.array([1,2,3]) * 2` = `[2,4,6]`; slice 2D `m[0:2, 1:]` trả về **view** (sửa view làm đổi mảng gốc). `axis=0` tính dọc theo cột, `axis=1` tính ngang theo hàng.
  - Broadcasting: so khớp shape từ phải sang trái (bằng nhau hoặc bằng 1). Ví dụ `(3, 1) - (3,)` phình thành `(3, 3)`! Sửa bằng `y[:, None]`.
  - Big-O & DSA: `set/dict` lookup O(1), `list` lookup O(n), `list.pop(0)` O(n), `deque` append/popleft O(1) (dùng cho Sliding Window / Moving Average), `heapq` (Top-K) O(n log k), Binary Search O(log n), Two Pointers (hai con trỏ) O(n) trên mảng đã sort.
- **Keyword YouTube:** `NumPy broadcasting rules view vs copy`, `Big O notation data structures Python`, `Two pointers sliding window deque Python`.
- **Bẫy kinh điển:** Quên bẫy Broadcasting `(3, 1) - (3,) → (3, 3)`; dùng `sum(window)` trong vòng lặp khiến Moving Average thành O(n*k) thay vì O(1) với `running_sum`.

### CĐ-08 · SQL cho phân tích dữ liệu
- **Tỷ trọng mục:** SELECT, WHERE, ORDER BY, NULL (15%) · Các loại JOIN (25%) · GROUP BY, HAVING, hàm gộp (25%) · Window function ROW_NUMBER, LAG, SUM OVER (20%) · CTE, truy vấn con, index (15%).
- **Bản chất & Cú pháp:**
  - Thứ tự thực thi SQL: `FROM/JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT`.
  - `NULL`: Không bao giờ dùng `= NULL` hay `!= NULL`, phải dùng `IS NULL` / `IS NOT NULL`; `COUNT(*)` đếm cả dòng NULL, `COUNT(col)` bỏ qua NULL.
  - `JOIN`: `INNER JOIN` (chỉ lấy khớp cả 2 bảng), `LEFT JOIN` (giữ toàn bộ bảng trái, bên phải thiếu thành NULL).
  - `WHERE` (lọc **trước** khi gom nhóm) vs `HAVING` (lọc **sau** khi gom nhóm trên hàm gộp `SUM/COUNT`).
  - **Window Function:** `FUNC() OVER (PARTITION BY nhóm ORDER BY thứ_tự)` — giữ nguyên số dòng thay vì gộp như `GROUP BY`:
    - `ROW_NUMBER()` (1, 2, 3, 4 — không trùng), `RANK()` (1, 2, 2, 4 — nhảy số), `DENSE_RANK()` (1, 2, 2, 3 — không nhảy số).
    - `LAG(col, 1)` lấy giá trị dòng trước, `LEAD(col, 1)` lấy dòng sau; `SUM(rev) OVER (ORDER BY date)` tính tổng lũy kế (running total).
  - CTE (`WITH cte AS (...)`) giúp tách truy vấn phức tạp dễ đọc; **Partitioning + B-Tree Index** tối ưu bảng log hàng trăm triệu dòng xuống `< 200ms`.
- **Keyword YouTube:** `SQL order of execution WHERE vs HAVING`, `SQL Window Functions ROW_NUMBER RANK LAG`, `SQL Partitioning and B-Tree Index`.
- **Bẫy kinh điển:** Dùng `WHERE COUNT(*) > 5` (sai cú pháp, phải dùng `HAVING`); viết `col != NULL` (luôn trả về UNKNOWN/rỗng); nhầm `RANK()` với `DENSE_RANK()`.

---

## NHÓM 3: AI VÀ VẬN HÀNH (MODULE 3 — TRỌNG SỐ CAO)

### CĐ-09 · Học máy và đánh giá mô hình
- **Tỷ trọng mục:** Chia dữ liệu, rò rỉ dữ liệu (20%) · Hồi quy, logistic, cây, ensemble, kNN, k-means (25%) · Overfitting, bias-variance, regularization, cross-validation (20%) · Precision/recall/F1, ROC/PR-AUC, RMSE, ngưỡng (25%) · Mất cân bằng lớp, đặc trưng (10%).
- **Bản chất:** Train/Val/Test (70/15/15); 4 kiểu Data Leakage (scale trước khi chia, feature chứa đáp án, trùng mẫu, trộn chuỗi thời gian). Bagging (Random Forest giảm variance) vs Boosting (XGBoost/LightGBM giảm bias); Naive Bayes giả định độc lập có điều kiện. L2 (Ridge) vs L1 (Lasso ép về 0). Dữ liệu lệch dùng `Precision/Recall/PR-AUC` và chỉ `SMOTE` trên tập train; XAI dùng `SHAP/LIME` khi luật yêu cầu giải thích mô hình hộp đen.

### CĐ-10 · LLM, RAG và Agent
- **Tỷ trọng mục:** Transformer, attention, token, sampling (20%) · Embedding, tìm kiếm vector, hybrid, rerank (20%) · RAG: chunking, đánh giá recall@k, nDCG, faithfulness (25%) · Agent: gọi tool, ReAct, giới hạn bước, HITL (20%) · Prompt injection, guardrails (15%).
- **Bản chất:** Self-Attention `O(N²)` với `Q, K, V`. Temperature thấp (0–0.3) cho code/JSON/tra cứu; Top-K & Top-P. Edge AI nén bằng Quantization (INT8/INT4) & Distillation. Hybrid Search (`Vector + BM25 → RRF → Cross-Encoder Rerank`). Chunk 300–800 token (overlap 10–15%). Chẩn đoán RAG: `Recall@k` thấp → lỗi truy xuất; `Recall@k` tốt mà `Faithfulness` thấp → lỗi prompt/sinh. RAG (không đổi weight, data thay đổi liên tục) vs LoRA/Fine-tuning (đổi style/format). Agent dùng vòng `ReAct`, giới hạn bước/token, tool ghi bắt buộc **HITL**.

### CĐ-11 · MLOps và vận hành mô hình
- **Tỷ trọng mục:** Serving: batching, cache, lượng tử hóa, p95, TTFT (25%) · CI/CD, cổng eval, quản lý phiên bản dữ liệu và model (20%) · Giám sát: drift, canary, rollback (25%) · Chi phí/1K request, GPU, ROI (20%) · Docker, tái lập kết quả (10%).
- **Bản chất:** Đo độ trễ bằng **p95** và **TTFT**, tối ưu bằng Continuous Batching, Prefix-KV Cache, Quantization. CI/CD có **Eval Gate** (Golden Set) + quản lý đủ Git, DVC, Model Registry, Prompt. Giám sát **Data/Concept Drift** bằng PSI/KS-test, fine-tune pha dữ liệu cũ tránh **Catastrophic Forgetting**. Triển khai **Canary (5%→25%→100%) / Shadow Mode + Rollback**. `Cost/1K req = (Giá GPU/h ÷ Req/h) × 1000` (lưu ý mức sử dụng GPU thật!). `ROI = (Lợi ích - Chi phí) / Chi phí`.

---

## NHÓM 4: LOGIC VÀ ĐẠO ĐỨC (MODULE 4)

### CĐ-12 · Logic, đạo đức và pháp lý AI
- **Tỷ trọng mục:** Logic mệnh đề, phản đảo, lượng từ, De Morgan (30%) · Ngụy biện, tương quan và nhân quả (15%) · Dữ liệu cá nhân Luật BVDLCN 2025, GDPR (20%) · Công bằng, minh bạch, giám sát con người (20%) · EU AI Act theo mức rủi ro, OWASP LLM Top 10 (15%).
- **Bản chất:** `P → Q` tương đương phản đảo `¬Q → ¬P` (cấm suy ngược `Q → P`). De Morgan: `¬(A ∧ B) = ¬A ∨ ¬B`; `¬(∀x P(x)) = ∃x ¬P(x)`. 5 ngụy biện (khẳng định hệ quả, công kích cá nhân, người sống sót, cherry-picking, lưỡng phân sai); tương quan ≠ nhân quả (cần A/B test). PII (CCCD, sinh trắc, SĐT) phải Mask/Anonymize trước train (nén ZIP mật khẩu là vô dụng). Fairness kiểm tra recall giữa các nhóm, tránh **Representation Bias** & **Automation Bias**. EU AI Act 4 mức (Cấm tuyệt đối / Rủi ro cao / Hạn chế / Tối thiểu). OWASP LLM: chống Prompt Injection bằng **RBAC ở tầng Middleware** trước khi nạp RAG. Deploy khi chưa đạt Safety Test (70%): trình bày Risk bằng Evidence → giảm Scope / HITL → ghi nhận trách nhiệm.
