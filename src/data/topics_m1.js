// Modular topics for M1 (CĐ-01: 10q, CĐ-02: 10q, CĐ-03: 10q, CĐ-04: 10q)
export const TOPICS_M1 = [
  {
    "id": "cd-01",
    "code": "CĐ-01",
    "groupId": "math",
    "module": "M1",
    "title": "Đại số tuyến tính",
    "subtopics": [
      {
        "label": "Vector / dot / norm / cosine",
        "weight": 20
      },
      {
        "label": "Ma trận / det / nghịch đảo",
        "weight": 30
      },
      {
        "label": "Hệ phương trình tuyến tính",
        "weight": 15
      },
      {
        "label": "Trị riêng & Vector riêng",
        "weight": 20
      },
      {
        "label": "SVD / PCA & ma trận thưa",
        "weight": 15
      }
    ],
    "step1": {
      "essence": "Dữ liệu AI (ảnh, embedding văn bản, trọng số mạng nơ-ron) đều biểu diễn bằng vector và ma trận. Nhân ma trận là phép biến đổi không gian, còn SVD/PCA nén chiều dữ liệu nhưng vẫn giữ lại nhiều phương sai nhất.",
      "formulas": [
        "Nhân ma trận: (m × n) · (n × p) = (m × p)  |  (AB)^T = B^T · A^T",
        "Dot product: u · v = Σ u_i·v_i (trực giao khi = 0)  |  Cosine = (u·v) / (||u||·||v||)",
        "det 2×2 = ad − bc  |  Khả nghịch ⇔ det(A) ≠ 0  |  A^-1 = [1/(ad−bc)]·[[d, −b], [−c, a]]",
        "Sarrus 3×3: det = aei + bfg + cdh − ceg − bdi − afh  |  Trace(A) = tổng đường chéo chính",
        "Trị riêng: A·v = λ·v  |  SVD: A = U·Σ·V^T (dùng CSR + Truncated SVD cho ma trận thưa)",
        "Chuẩn Vector (Norm): L1 (Manhattan) = Σ|x_i| (tạo độ thưa)  |  L2 (Euclidean) = √(Σ x_i²)",
        "Hệ PT tuyến tính Ax = b: có nghiệm duy nhất ⇔ det(A) ≠ 0 (các cột Độc lập tuyến tính, full rank)"
      ],
      "problemBlocks": [
        {
          "subtopicIndex": 0,
          "subtopic": "Vector / dot / norm / cosine (20%)",
          "title": "Dot product & Cosine similarity",
          "formulaShort": "Cosine = (u · v) ÷ (||u|| × ||v||)",
          "realProblem": "Làm sao Chatbot RAG so sánh câu hỏi ngắn của khách với 10.000 đoạn tài liệu dài ngắn khác nhau để tìm ra đoạn khớp ý nhất?",
          "aiRole": "Vector Database biến mỗi câu thành một danh sách số (vector), rồi dùng Cosine similarity đo góc lệch giữa chúng để bỏ qua sự chênh lệch độ dài văn bản.",
          "plainSteps": "Bước 1: Lấy từng cặp số cùng vị trí của 2 vector nhân nhau rồi cộng dồn (Dot product) làm Tử số. Bước 2: Bình phương từng số trong mỗi vector, cộng lại rồi lấy căn bậc hai để ra độ dài thật, sau đó nhân 2 độ dài làm Mẫu số. Bước 3: Lấy Tử số ÷ Mẫu số → điểm từ −1 đến +1. Ví dụ u = [3, 4] và v = [6, 8]: Tử = 3×6 + 4×8 = 50; Độ dài u = √(9+16) = 5, độ dài v = √(36+64) = 10 → Mẫu = 5×10 = 50 → Cosine = 50 ÷ 50 = 1.0 (khớp hướng 100%)."
        },
        {
          "subtopicIndex": 0,
          "subtopic": "Vector / dot / norm / cosine (20%)",
          "title": "Chuẩn Vector L1 (Manhattan) & L2 (Euclidean)",
          "formulaShort": "L1 = Σ|x_i|  |  L2 = √(Σ x_i²)",
          "realProblem": "Làm sao đo \"độ lớn\" của vector sai số hoặc độ lớn bộ trọng số mô hình để phạt bớt trọng số phình to (Regularization L1/L2) và đo khoảng cách giữa 2 điểm dữ liệu?",
          "aiRole": "Chuẩn L1 (Lasso) giúp ép các trọng số vô dụng về đúng 0 để tự lọc bỏ cột thừa (tạo độ thưa), còn chuẩn L2 (Ridge & Euclidean) đo khoảng cách đường chim bay và làm mượt trọng số trong KNN, K-Means, Neural Network.",
          "plainSteps": "Với vector v = [3, −4]: Bước 1 (Chuẩn L1 — đi theo ô bàn cờ): bỏ dấu âm rồi cộng thẳng `|3| + |−4| = 3 + 4 = 7`. Bước 2 (Chuẩn L2 — đường chim bay Pytago): bình phương từng số rồi cộng lại xong lấy căn `√(3² + (−4)²) = √(9 + 16) = √25 = 5`."
        },
        {
          "subtopicIndex": 1,
          "subtopic": "Ma trận / det / nghịch đảo (30%)",
          "title": "Nhân ma trận, Chuyển vị & Đường chéo chính Trace(AB)",
          "formulaShort": "(m × n) · (n × p) = (m × p)  |  (AB)^T = B^T · A^T",
          "realProblem": "Làm sao một tầng mạng nơ-ron tính điểm dự đoán cho cả 100 khách hàng cùng lúc thay vì tính nhẩm thủ công từng người?",
          "aiRole": "Nhân ma trận gộp toàn bộ phép tính \"lấy từng đặc trưng nhân trọng số rồi cộng lại\" cho hàng loạt mẫu vào một lệnh GPU duy nhất (nhớ số cột bảng trái phải bằng số dòng bảng phải, và nhân ma trận KHÔNG giao hoán AB ≠ BA).",
          "plainSteps": "Để tính ô ở Dòng i, Cột j của bảng kết quả: lấy lần lượt từng số trên Dòng i bảng trái nhân với từng số trên Cột j bảng phải rồi cộng lại. Mẹo tính Trace(AB): chỉ cần nhân đúng các ô đường chéo chính (Dòng 1 × Cột 1, Dòng 2 × Cột 2) rồi cộng lại. Ví dụ A = [[1, 2], [3, 4]] và B = [[2, 0], [1, 3]]: (AB)[0,0] = 1×2 + 2×1 = 4; (AB)[1,1] = 3×0 + 4×3 = 12 → Trace(AB) = 4 + 12 = 16."
        },
        {
          "subtopicIndex": 1,
          "subtopic": "Ma trận / det / nghịch đảo (30%)",
          "title": "Determinant (Định thức 2×2, Sarrus 3×3) & Ma trận nghịch đảo",
          "formulaShort": "det 2×2 = (a × d) − (b × c)  |  Khả nghịch ⇔ det ≠ 0",
          "realProblem": "Khi giải bài toán tìm trọng số hồi quy tuyến tính, làm sao kiểm tra nhanh bảng dữ liệu có bị suy biến (không đảo ngược được) và tính ma trận hoàn tác A^-1?",
          "aiRole": "Determinant đo hệ số phóng to/thu nhỏ diện tích của ma trận: chỉ khi det(A) ≠ 0 thì ma trận mới là Invertible Matrix (khả nghịch), có nút \"Undo\" giải ngược ra nghiệm duy nhất.",
          "plainSteps": "Với bảng 2×2 [[a, b], [c, d]]: Bước 1 lấy tích đường chéo chính (a × d). Bước 2 trừ tích đường chéo phụ (b × c). Ví dụ [[3, 2], [1, 5]] → (3×5) − (2×1) = 15 − 2 = 13 ≠ 0 ⇒ khả nghịch. Bước 3 (Tìm nghịch đảo A^-1): đổi chỗ a↔d, đổi dấu b, c rồi chia tất cả cho 13 → `(1/13) × [[5, −2], [−1, 3]]`. Với bảng 3×3 áp dụng Sarrus: cộng 3 chéo xuôi trừ 3 chéo ngược."
        },
        {
          "subtopicIndex": 2,
          "subtopic": "Hệ phương trình tuyến tính (15%)",
          "title": "Hệ phương trình tuyến tính & Độc lập tuyến tính",
          "formulaShort": "A · x = b  |  Độc lập tuyến tính ⇔ không cột nào lặp lại cột khác",
          "realProblem": "Bảng dữ liệu bán hàng vô tình có cả 2 cột \"Doanh thu (VND)\" và \"Doanh thu (USD = VND ÷ 25.000)\" — tại sao mô hình Hồi quy tuyến tính bị lỗi không giải nổi trọng số ổn định?",
          "aiRole": "Khi một cột là tổ hợp tuyến tính của cột khác (Phụ thuộc tuyến tính / Đa cộng tuyến), ma trận bị tụt hạng (Rank giảm, det = 0), làm hệ phương trình `Ax = b` vô số nghiệm và trọng số AI nhảy loạn.",
          "plainSteps": "Kiểm tra độc lập tuyến tính 2 vector u = [1, 2] và v = [2, 4]: ta thấy v = 2 × u (tỉ lệ hoàn toàn nhau) ⇒ Phụ thuộc tuyến tính (dư thừa 1 cột, det = 1×4 − 2×2 = 0). Ngược lại với hệ `2x + y = 5` và `x + y = 3`: trừ vế theo vế ra `x = 2`, thay vào ra `y = 1` — có đúng 1 nghiệm duy nhất vì 2 cột `[2, 1]` và `[1, 1]` độc lập tuyến tính (det = 2×1 − 1×1 = 1 ≠ 0)."
        },
        {
          "subtopicIndex": 3,
          "subtopic": "Trị riêng & Vector riêng (20%)",
          "title": "Trị riêng (Eigenvalues), Vector riêng & Chéo hóa",
          "formulaShort": "A · v = λ · v  |  Giải det(A − λI) = 0",
          "realProblem": "Dữ liệu khách hàng có 50 cột đan xen nhau — làm sao xoay hệ trục tọa độ để tìm ra các \"trục xương sống\" chứa nhiều biến động (thông tin) nhất nhằm nén dữ liệu mà ít mất nét nhất?",
          "aiRole": "Eigenvalues (λ) và Eigenvectors (v) là trái tim của PCA và phân tích đồ thị (PageRank): Vector riêng chỉ ra trục chính mới, còn Trị riêng λ đo đúng lượng thông tin (phương sai) nằm trên trục đó.",
          "plainSteps": "Bước 1: Lấy ma trận A trừ λ dọc theo đường chéo chính để lập `A − λI`. Bước 2: Giải `det(A − λI) = 0` để tìm các Trị riêng λ. Ví dụ A = [[3, 0], [0, 5]] (ma trận đường chéo): `(3 − λ)(5 − λ) = 0` ⇒ hai trị riêng là `λ1 = 5` (trục quan trọng hơn) và `λ2 = 3`. Kiểm tra nhanh: tổng các trị riêng `5 + 3 = 8` luôn bằng `Trace(A) = 3 + 5 = 8`, và tích `5 × 3 = 15` luôn bằng `det(A)`!"
        },
        {
          "subtopicIndex": 4,
          "subtopic": "SVD / PCA & ma trận thưa (15%)",
          "title": "SVD, PCA & Nén ma trận thưa bằng CSR + Truncated SVD",
          "formulaShort": "CSR + Truncated SVD (giữ 80–85% phương sai, KHÔNG center)",
          "realProblem": "Bảng lịch sử mua hàng 100.000 khách × 50.000 sản phẩm (99% là số 0 vì mỗi người chỉ mua vài món) bị tràn RAM (OOM) khi cố giảm số cột bằng Standard PCA?",
          "aiRole": "Standard PCA phải trừ trung bình từng cột (centering) nên biến toàn bộ hàng tỷ ô số 0 thành số khác 0 gây nổ RAM. Định dạng CSR chỉ lưu các ô khác 0 kết hợp Truncated SVD nén chiều trực tiếp mà giữ nguyên độ thưa.",
          "plainSteps": "Bước 1: Chuyển bảng sang định dạng CSR (chỉ ghi giá trị khác 0 + chỉ số cột; vd dòng `[0, 5, 0, 2]` chỉ lưu `[5, 2]` tại cột `[1, 3]`). Bước 2: Chạy Truncated SVD tách `A ≈ U · Σ · V^T` và giữ k trục có giá trị kỳ dị lớn nhất ứng với ~80–85% phương sai (vd nén 50.000 cột xuống k = 100 cột giúp giảm RAM hàng trăm lần)."
        }
      ],
      "quickExample": {
        "problem": "Cho A = [[1, 2], [3, 4]] và B = [[2, 0], [1, 3]]. Tính Trace(AB) và kiểm tra A có khả nghịch không?",
        "solution": "Chỉ cần nhân 2 ô đường chéo: (AB)[0,0] = 1·2 + 2·1 = 4; (AB)[1,1] = 3·0 + 4·3 = 12 ⇒ Trace(AB) = 16. Kiểm tra det(A) = 1·4 − 2·3 = −2 ≠ 0 ⇒ A khả nghịch."
      }
    },
    "step2": {
      "keywords": [
        {
          "en": "Dot Product",
          "vi": "Tích vô hướng",
          "short": "Nhân từng cặp số cùng vị trí rồi cộng dồn để đo độ cùng hướng (= 0 là vuông góc)."
        },
        {
          "en": "Cosine Similarity",
          "vi": "Độ tương đồng Cosine",
          "short": "Đo góc giống nhau giữa 2 vector từ −1 đến +1, không phụ thuộc độ dài văn bản."
        },
        {
          "en": "Determinant",
          "vi": "Định thức ma trận",
          "short": "Con số kiểm tra ma trận có bị suy biến không; chỉ khi det ≠ 0 mới đảo ngược được."
        },
        {
          "en": "Invertible Matrix",
          "vi": "Ma trận khả nghịch",
          "short": "Ma trận có \"nút hoàn tác\" (A^-1) giúp giải ngược hệ phương trình ra đúng 1 nghiệm duy nhất."
        },
        {
          "en": "Eigenvalues",
          "vi": "Trị riêng",
          "short": "Hệ số co giãn trên các trục chính — nền tảng của PCA để chọn trục giữ nhiều thông tin nhất."
        },
        {
          "en": "Truncated SVD",
          "vi": "Phân rã SVD rút gọn",
          "short": "Nén chiều ma trận thưa mà không trừ trung bình, tránh tràn RAM (OOM) như Standard PCA."
        },
        {
          "en": "CSR Sparse Matrix",
          "vi": "Ma trận thưa dạng CSR",
          "short": "Định dạng chỉ lưu các ô khác 0 cùng vị trí cột, tiết kiệm RAM gấp hàng trăm lần."
        }
      ],
      "memoryTip": "Nhớ 3 phản xạ: Tính Trace(AB) chỉ nhân đúng đường chéo chính; Khả nghịch ⇔ det ≠ 0; Ma trận User-Item thưa lớn ⇒ luôn chọn CSR + Truncated SVD (cấm Standard PCA).",
      "youtubeQueries": [
        "3Blue1Brown Essence of Linear Algebra",
        "Matrix multiplication and determinant 2x2 3x3 Sarrus",
        "Truncated SVD vs PCA sparse matrix CSR"
      ]
    },
    "step3": {
      "traps": [
        {
          "title": "Nhầm phép nhân ma trận giao hoán (AB = BA)",
          "detail": "Nhân ma trận KHÔNG giao hoán và khi chuyển vị phải đảo thứ tự: (AB)^T = B^T·A^T."
        },
        {
          "title": "Dùng Standard PCA cho ma trận thưa gây tràn RAM (OOM)",
          "detail": "Standard PCA trừ trung bình (centering) làm toàn bộ số 0 biến thành khác 0, phá vỡ tính thưa."
        },
        {
          "title": "Quên dấu trừ ở đường chéo phụ khi tính det",
          "detail": "det([[2, 3], [1, 4]]) = 2·4 − 3·1 = 5 (hay nhầm thành + thành 11)."
        }
      ]
    },
    "step4": {
      "miniQuiz": [
        {
          "id": "cd01-q1",
          "question": "Ma trận User-Item rất thưa đang tràn RAM khi chạy Truncated SVD giữ 95% phương sai. Phương án kỹ thuật tối ưu nhất?",
          "options": [
            "Đổi sang Standard PCA để tự động chuẩn hóa.",
            "Chuyển ma trận sang định dạng CSR và giảm số components k xuống mức 80–85% phương sai.",
            "Đổi sang NMF giữ nguyên số chiều k.",
            "Nhân toàn bộ ma trận với hằng số 0.01."
          ],
          "correctIndex": 1,
          "explanation": "CSR + Truncated SVD giữ nguyên tính thưa (không center dữ liệu) và giảm k là trade-off chuẩn giữa thông tin và RAM."
        },
        {
          "id": "cd01-q2",
          "question": "Cho A = [[3, 2], [1, 5]]. Định thức det(A) bằng bao nhiêu và A có nghịch đảo không?",
          "options": [
            "17, khả nghịch",
            "13, khả nghịch vì det(A) ≠ 0",
            "13, không khả nghịch",
            "-13, khả nghịch"
          ],
          "correctIndex": 1,
          "explanation": "det(A) = 3·5 − 2·1 = 13 ≠ 0 ⇒ ma trận khả nghịch."
        },
        {
          "id": "cd01-q3",
          "question": "Tích vô hướng (Dot Product) của u = [2, -1, 3] và v = [4, 2, -1] bằng bao nhiêu?",
          "options": [
            "3",
            "7",
            "9",
            "0"
          ],
          "correctIndex": 0,
          "explanation": "u · v = 2(4) + (-1)(2) + 3(-1) = 8 − 2 − 3 = 3."
        },
        {
          "id": "cd01-q4",
          "question": "Cho vector `v = [3, -4]`. Giá trị chuẩn L1 (Manhattan) và chuẩn L2 (Euclidean) của `v` lần lượt là bao nhiêu?",
          "options": [
            "`1` và `5`",
            "`7` và `5`",
            "`7` và `25`",
            "`5` và `7`"
          ],
          "correctIndex": 1,
          "explanation": "Đúng là B: L1 = |3| + |-4| = 7; L2 = √(3² + (-4)²) = √25 = 5. A sai vì cộng trực tiếp 3 + (-4) quên trị tuyệt đối; C sai vì quên lấy căn bậc hai cho L2; D đảo ngược thứ tự L1 và L2."
        },
        {
          "id": "cd01-q5",
          "question": "Tính Cosine Similarity giữa hai vector `u = [1, 0]` và `v = [0, 5]`. Kết quả cho biết điều gì?",
          "options": [
            "`1.0` — hai vector hoàn toàn cùng hướng",
            "`-1.0` — hai vector ngược hướng nhau",
            "`0.0` — hai vector trực giao (vuông góc, không cùng hướng)",
            "`5.0` — vector v dài gấp 5 lần vector u"
          ],
          "correctIndex": 2,
          "explanation": "Đúng là C: u·v = 1×0 + 0×5 = 0 ⇒ Cosine = 0/(1×5) = 0 (trực giao). A và B sai vì Cosine = ±1 khi cùng/ngược hướng; D sai vì Cosine Similarity luôn nằm trong [-1, 1] và không phụ thuộc độ dài."
        },
        {
          "id": "cd01-q6",
          "question": "Cho ma trận `A` cỡ `(4 × 3)` và `B` cỡ `(3 × 2)`. Phát biểu nào ĐÚNG về kích thước tích ma trận và phép chuyển vị?",
          "options": [
            "`AB` có cỡ `(4 × 2)` và `(AB)^T = B^T · A^T`",
            "`AB` có cỡ `(4 × 2)` và `(AB)^T = A^T · B^T`",
            "`BA` nhân được bình thường và bằng `AB`",
            "`AB` có cỡ `(3 × 3)`"
          ],
          "correctIndex": 0,
          "explanation": "Đúng là A: (4×3)·(3×2) = (4×2) và chuyển vị tích phải đảo thứ tự (AB)^T = B^T·A^T. B sai vì quên đảo thứ tự (A^T cỡ 3×4 không nhân được với B^T cỡ 2×3); C sai vì B(3×2) không nhân được với A(4×3); D sai quy tắc kích thước ngoài."
        },
        {
          "id": "cd01-q7",
          "question": "Bảng dữ liệu hồi quy có 2 cột đặc trưng `x1 = [1, 2, 3]` và `x2 = [2, 4, 6]`. Nhận xét nào chính xác về tính độc lập tuyến tính?",
          "options": [
            "Hai cột độc lập tuyến tính vì các phần tử đều dương.",
            "Hai cột phụ thuộc tuyến tính (`x2 = 2·x1`), làm ma trận bị tụt hạng (đa cộng tuyến) và không có nghịch đảo chuẩn.",
            "Định thức ma trận tương ứng luôn bằng 2.",
            "Thêm 1 cột nữa giống hệt `x1` sẽ giúp ma trận khả nghịch."
          ],
          "correctIndex": 1,
          "explanation": "Đúng là B: x2 tỉ lệ tuyệt đối với x1 (x2 = 2·x1) ⇒ phụ thuộc tuyến tính, rank giảm, det = 0 gây đa cộng tuyến. A sai vì dấu không quyết định độc lập; C sai vì det = 0; D sai vì thêm cột trùng càng làm thừa thông tin."
        },
        {
          "id": "cd01-q8",
          "question": "Cho ma trận đường chéo `A = [[6, 0], [0, 2]]`. Hai trị riêng (Eigenvalues) của `A` và `Trace(A)` lần lượt là gì?",
          "options": [
            "Trị riêng `6, 2` và `Trace = 8`",
            "Trị riêng `6, 2` và `Trace = 12`",
            "Trị riêng `8, 4` và `Trace = 8`",
            "Ma trận này không có trị riêng"
          ],
          "correctIndex": 0,
          "explanation": "Đúng là A: ma trận đường chéo có trị riêng là chính các số trên đường chéo (6 và 2), tổng trị riêng luôn bằng Trace(A) = 6 + 2 = 8. B nhầm Trace với tích (det = 12); C và D sai định nghĩa trị riêng."
        },
        {
          "id": "cd01-q9",
          "question": "Khi chạy giải hệ phương trình `Ax = b` với `A = [[2, 4], [1, 2]]`, điều gì xảy ra?",
          "options": [
            "Có duy nhất 1 nghiệm vì `det(A) = 8`.",
            "`det(A) = 2×2 − 4×1 = 0` nên `A` suy biến (không khả nghịch), không có nghiệm duy nhất.",
            "Ma trận nghịch đảo là `[[2, -4], [-1, 2]]`.",
            "Chỉ cần đổi dấu hàng 2 sẽ ra nghiệm duy nhất."
          ],
          "correctIndex": 1,
          "explanation": "Đúng là B: det(A) = 2·2 − 4·1 = 0 ⇒ hàng 1 gấp đôi hàng 2 (phụ thuộc tuyến tính), A không có nghịch đảo. A sai vì nhầm dấu trừ thành dấu cộng (4+4=8); C sai vì chia cho det=0 là vô nghĩa; D không làm 2 hàng độc lập."
        },
        {
          "id": "cd01-q10",
          "question": "Tại sao dùng Standard PCA trên ma trận văn bản TF-IDF rất thưa (99% là số 0) thường gây tràn RAM (Out of Memory)?",
          "options": [
            "Vì Standard PCA tự động nhân kích thước ma trận lên gấp 100 lần bằng cách sao chép dòng.",
            "Vì bước trừ trung bình (mean-centering) biến toàn bộ các ô số 0 thành số khác 0, phá vỡ cấu trúc thưa CSR thành ma trận đặc khổng lồ.",
            "Vì Python không đọc được số 0 trong ma trận.",
            "Vì Standard PCA chỉ chạy trên GPU."
          ],
          "correctIndex": 1,
          "explanation": "Đúng là B: centering (x − μ) khiến mọi phần tử 0 biến thành −μ ≠ 0, biến ma trận thưa vài MB thành ma trận đặc hàng chục GB. A, C, D đều mô tả sai cơ chế — giải pháp chuẩn là CSR + Truncated SVD."
        }
      ]
    }
  },
  {
    "id": "cd-02",
    "code": "CĐ-02",
    "groupId": "math",
    "module": "M1",
    "title": "Giải tích & tối ưu",
    "subtopics": [
      {
        "label": "Đạo hàm / Chain Rule",
        "weight": 25
      },
      {
        "label": "Gradient / Jacobian / Hessian",
        "weight": 25
      },
      {
        "label": "GD / Learning Rate / Adam",
        "weight": 25
      },
      {
        "label": "Loss / Sigmoid / Softmax / Backprop",
        "weight": 25
      }
    ],
    "step1": {
      "essence": "Huấn luyện AI là bài toán tối thiểu hóa hàm mất mát (Loss). Gradient ∇L chỉ hướng tăng nhanh nhất, nên thuật toán đi ngược hướng (−∇L) kết hợp Chain Rule (Backpropagation) để cập nhật mọi trọng số.",
      "formulas": [
        "(x^n)' = n·x^(n−1)  |  (e^x)' = e^x  |  (ln x)' = 1/x  |  Chain Rule: [f(g(x))]' = f'(g(x))·g'(x)",
        "∇f(x, y) = [∂f/∂x, ∂f/∂y]  |  Jacobian (đạo hàm bậc 1 vector)  |  Hessian (đạo hàm bậc 2 độ cong)",
        "Cực trị: f'(x) = 0;  f''(x) > 0 ⇒ Local Min;  f''(x) < 0 ⇒ Local Max",
        "Update: θ_new = θ_old − η·∇L  |  Adam = Momentum + RMSProp  |  AdamW tách riêng Weight Decay",
        "ReLU(x) = max(0, x)  |  Sigmoid σ(x) ∈ (0, 1), σ' = σ(1−σ)  |  Softmax: exp(z_i)/Σexp(z_j)"
      ],
      "problemBlocks": [
        {
          "subtopicIndex": 0,
          "subtopic": "Đạo hàm / Chain Rule (25%)",
          "title": "Đạo hàm cơ bản & Quy tắc chuỗi (Chain Rule)",
          "formulaShort": "(x^n)' = n·x^(n−1)  |  dL/dw = (dL/dy) × (dy/dw)",
          "realProblem": "Một mạng nơ-ron sâu hàng chục lớp dự đoán sai ở đầu ra cuối cùng — làm sao tính được khi nhích trọng số w ở lớp đầu thêm 1 chút thì sai số cuối cùng L thay đổi bao nhiêu?",
          "aiRole": "Chain Rule là nền tảng toán học của Backpropagation: tách chuỗi hàm lồng nhau phức tạp thành từng chặng đơn giản rồi nhân tốc độ thay đổi từ cuối về đầu.",
          "plainSteps": "Bước 1 (Đạo hàm cơ bản): hạ số mũ xuống nhân rồi giảm mũ đi 1 (vd `(x³)' = 3x²`, `(x²)' = 2x`, hằng số đạo hàm = 0). Bước 2 (Chain Rule): đo xem y tăng 1 làm L tăng mấy lần, rồi đo w tăng 1 làm y tăng mấy lần, sau đó NHÂN hai số đó lại. Ví dụ: `y = 3w` (`dy/dw = 3`) và `L = 2y` (`dL/dy = 2`) → `dL/dw = 2 × 3 = 6`."
        },
        {
          "subtopicIndex": 1,
          "subtopic": "Gradient / Jacobian / Hessian (25%)",
          "title": "Đạo hàm riêng, Gradient ∇f, Jacobian & Hessian (Cực trị)",
          "formulaShort": "∇f = [∂f/∂x, ∂f/∂y]  |  f'(x) = 0, f''(x) > 0 ⇒ Đáy",
          "realProblem": "Hàm mất mát phụ thuộc cùng lúc hàng triệu trọng số — làm sao biết chiều tăng nhanh nhất của sai số và phân biệt điểm dừng là đáy thung lũng (cực tiểu), đỉnh đồi (cực đại) hay điểm yên ngựa?",
          "aiRole": "Gradient ∇f gộp đạo hàm riêng từng biến thành mũi tên chỉ hướng lên dốc nhanh nhất; Jacobian mở rộng cho đầu ra vector; còn Hessian (đạo hàm bậc 2) đo độ cong để kiểm tra cực trị.",
          "plainSteps": "Bước 1 (Đạo hàm riêng): muốn đạo hàm theo `x` thì coi `y` như hằng số bình thường. Ví dụ `L(x, y) = x² + 2y² − 4x + 4y` → `∂L/∂x = 2x − 4`, `∂L/∂y = 4y + 4`. Tại `(1, −1)` ta có `∇L = [2(1)−4, 4(−1)+4] = [−2, 0]`. Bước 2 (Kiểm tra đáy): giải `f'(x) = 0` rồi xem đạo hàm bậc 2 `f''(x)` — nếu `> 0` là hình chữ U (đáy cực tiểu), `< 0` là đỉnh cực đại."
        },
        {
          "subtopicIndex": 2,
          "subtopic": "GD / Learning Rate / Adam (25%)",
          "title": "Gradient Descent, Learning Rate, Momentum & AdamW",
          "formulaShort": "θ_mới = θ_cũ − (LR × ∇L)  |  AdamW = Momentum + RMSProp + Weight Decay",
          "realProblem": "Khi AI dự đoán giá nhà đang sai lệch lớn, làm sao cập nhật trọng số từng nhịp để tụt xuống đáy sai số nhanh, mượt mà không bị nhảy loạn hay kẹt giữa đường?",
          "aiRole": "Gradient Descent đi ngược chiều độ dốc (−∇L) theo bước chân Learning Rate; Momentum tạo đà trượt vượt điểm yên ngựa; AdamW tự chỉnh bước nhảy từng biến và tách riêng phạt trọng số.",
          "plainSteps": "Bước 1: Lấy Learning Rate (η) nhân với độ dốc (∇L). Bước 2: Lấy Trọng số cũ TRỪ đi tích vừa tính (nhớ dấu TRỪ, viết dấu cộng là đi lên đỉnh!). Ví dụ: `w_cũ = 5.0`, `∇L = +4.0`, `LR = 0.1` → `w_mới = 5.0 − (0.1 × 4.0) = 4.6`. Nếu Loss giảm đầu rồi nhảy loạn không hội tụ → LR đang quá lớn, phải bật Learning Rate Decay!"
        },
        {
          "subtopicIndex": 3,
          "subtopic": "Loss / Sigmoid / Softmax / Backprop (25%)",
          "title": "Hàm mất mát (MSE vs Cross-Entropy) & Backpropagation",
          "formulaShort": "Regression → MSE  |  Classification → Cross-Entropy",
          "realProblem": "Làm sao máy chấm điểm độ \"sai ít hay sai nhiều\" của dự đoán giá nhà (số liên tục) so với phân loại email Spam/Thường (xác suất) để gửi tín hiệu ngược về sửa trọng số?",
          "aiRole": "Hàm mất mát (Loss) là \"thước đo đau đớn\" định hướng toàn bộ quá trình học: Backpropagation xuất phát từ đạo hàm của Loss để cập nhật mọi lớp mạng phía trước.",
          "plainSteps": "Với Hồi quy (MSE): lấy `(Dự đoán − Thật)²` rồi chia trung bình. Ví dụ thật `[10, 20]`, đoán `[12, 16]` → sai số bình phương `[(12−10)², (16−20)²] = [4, 16]` → `MSE = (4 + 16) ÷ 2 = 10`. Với Phân loại (Cross-Entropy): phạt cực nặng khi AI đoán tự tin sai (`−ln(p_đúng)`): đoán đúng `p = 0.9` bị phạt nhẹ `0.105`, đoán sai tự tin `p = 0.01` bị phạt vọt lên `4.6`!"
        },
        {
          "subtopicIndex": 3,
          "subtopic": "Loss / Sigmoid / Softmax / Backprop (25%)",
          "title": "Hàm kích hoạt ReLU, Sigmoid (Vanishing Gradient) & Softmax",
          "formulaShort": "ReLU = max(0, x)  |  Softmax = e^(z_i) ÷ Σ e^(z_j)",
          "realProblem": "Làm sao tránh mạng sâu bị đứng im không học được (Vanishing Gradient) và biến dãy điểm thô bất kỳ ở lớp cuối thành bảng % xác suất tổng đúng bằng 100%?",
          "aiRole": "ReLU giữ nguyên độ dốc = 1 ở phần dương giúp mạng sâu học mượt (thay thế Sigmoid có đạo hàm tối đa chỉ 0.25 gây tiêu biến), còn Softmax chuẩn hóa đầu ra thành xác suất chọn lớp.",
          "plainSteps": "Với ReLU: số âm biến thành `0` (`ReLU(−5) = 0`), số dương giữ nguyên (`ReLU(3) = 3`). Với Softmax: Bước 1 lấy `e ≈ 2.718` mũ từng điểm số. Bước 2 cộng tổng tất cả lại. Bước 3 lấy từng số chia tổng. Ví dụ `[2, 1, 0]` → `[7.39, 2.72, 1]` (tổng `11.11`) → `[66.5%, 24.5%, 9.0%]` (cộng đúng 100%)."
        }
      ],
      "quickExample": {
        "problem": "Cho L(x, y) = x² + 2y² − 4x + 4y. Tìm ∇L(1, −1) và hướng cập nhật giảm Loss?",
        "solution": "∂L/∂x = 2x − 4, ∂L/∂y = 4y + 4 ⇒ ∇L(1, −1) = [−2, 0]. Để giảm Loss đi theo ngược hướng −∇L = [+2, 0] (tăng x, giữ y)."
      }
    },
    "step2": {
      "keywords": [
        {
          "en": "Chain Rule",
          "vi": "Quy tắc chuỗi đạo hàm",
          "short": "Nhân nối tiếp đạo hàm từng chặng từ cuối về đầu để tính tác động của lớp đầu tiên lên lỗi."
        },
        {
          "en": "Backpropagation",
          "vi": "Lan truyền ngược",
          "short": "Thuật toán dùng Chain Rule truyền sai số ngược qua mạng nơ-ron để cập nhật mọi trọng số."
        },
        {
          "en": "Gradient Descent",
          "vi": "Hạ gradient (xuống dốc)",
          "short": "Đi ngược chiều độ dốc (−∇L) từng bước nhỏ để trượt dần về đáy sai số nhỏ nhất."
        },
        {
          "en": "Learning Rate Decay",
          "vi": "Giảm dần tốc độ học",
          "short": "Thu nhỏ bước nhảy dần về cuối quá trình train để tránh nhảy lố qua đáy làm Loss dao động."
        },
        {
          "en": "AdamW",
          "vi": "Bộ tối ưu AdamW",
          "short": "Kết hợp quán tính Momentum + tự chỉnh bước nhảy từng biến + tách riêng phạt trọng số."
        },
        {
          "en": "Vanishing Gradient",
          "vi": "Tiêu biến đạo hàm",
          "short": "Gradient nhỏ dần về 0 ở mạng sâu dùng Sigmoid làm Loss đứng yên; trị bằng ReLU + Skip Connection."
        },
        {
          "en": "Softmax",
          "vi": "Hàm chuẩn hóa xác suất Softmax",
          "short": "Biến điểm thô bất kỳ thành phân phối xác suất từ 0% đến 100% có tổng đúng bằng 1."
        }
      ],
      "memoryTip": "Loss giảm chậm đều ⇒ LR quá nhỏ. Loss giảm đầu rồi nhảy loạn không hội tụ ⇒ LR quá lớn (dùng Cosine/Step Decay). Loss đứng im từ đầu trên mạng sâu dùng Sigmoid ⇒ Vanishing Gradient (đổi sang ReLU/GELU + Skip Connection).",
      "youtubeQueries": [
        "StatQuest Gradient Descent step by step",
        "3Blue1Brown Backpropagation calculus chain rule",
        "Adam vs AdamW optimizer learning rate decay intuition"
      ]
    },
    "step3": {
      "traps": [
        {
          "title": "Nhầm dấu cộng/trừ khi cập nhật Gradient Descent",
          "detail": "Phải đi NGƯỢC hướng Gradient (θ − η∇L). Đi cùng hướng (+η∇L) là Gradient Ascent làm Loss tăng vọt."
        },
        {
          "title": "Nhầm Loss dao động mạnh với Vanishing Gradient",
          "detail": "Dao động mạnh sau vài epoch đầu là do Learning Rate quá cao; Vanishing Gradient làm Loss gần như đứng yên ngay từ đầu."
        },
        {
          "title": "Quên giá trị và đạo hàm của ReLU ở phần âm",
          "detail": "ReLU(-5) = 0 và đạo hàm tại x < 0 bằng 0 (nếu toàn âm gây Dying ReLU)."
        }
      ]
    },
    "step4": {
      "miniQuiz": [
        {
          "id": "cd02-q1",
          "question": "Đồ thị Loss giảm nhanh trong 3 epoch đầu rồi dao động mạnh liên tục không hội tụ. Hướng xử lý đúng nhất?",
          "options": [
            "Đổi ReLU sang Sigmoid để chữa Vanishing Gradient.",
            "Áp dụng Learning Rate Decay (Step Decay / Cosine Annealing) vì LR đang quá lớn.",
            "Giảm Batch Size xuống 1 (SGD thuần).",
            "Nhân tất cả trọng số ban đầu lên 10 lần."
          ],
          "correctIndex": 1,
          "explanation": "Dao động mạnh ở giai đoạn sau là dấu hiệu kinh điển của Learning Rate quá lớn khiến bước nhảy vượt qua đáy cực tiểu."
        },
        {
          "id": "cd02-q2",
          "question": "Tìm điểm cực tiểu của hàm f(x) = x² − 6x + 10?",
          "options": [
            "x = -3",
            "x = 1",
            "x = 3",
            "x = 6"
          ],
          "correctIndex": 2,
          "explanation": "Giải f'(x) = 2x − 6 = 0 ⇒ x = 3. Kiểm tra f''(x) = 2 > 0 ⇒ cực tiểu tại x = 3."
        },
        {
          "id": "cd02-q3",
          "question": "Tại sao dùng Sigmoid ở nhiều lớp ẩn sâu dễ gây Vanishing Gradient?",
          "options": [
            "Vì Sigmoid trả về số âm.",
            "Vì giá trị cực đại đạo hàm σ'(x) chỉ là 0.25; nhân chuỗi nhiều lớp theo Chain Rule làm gradient triệt tiêu về 0.",
            "Vì Sigmoid không khả vi tại 0.",
            "Vì Sigmoid tổng đầu ra bằng 1."
          ],
          "correctIndex": 1,
          "explanation": "max σ'(x) = 0.25 tại x = 0 và tiến gần 0 ở hai đuôi bão hòa nên tích chuỗi đạo hàm giảm theo hàm mũ."
        },
        {
          "id": "cd02-q4",
          "question": "Cho hàm hợp `y = 3w + 1` và hàm lỗi `L = y²`. Theo Chain Rule, đạo hàm `dL/dw` tại `w = 1` bằng bao nhiêu?",
          "options": [
            "`8`",
            "`12`",
            "`24`",
            "`6`"
          ],
          "correctIndex": 2,
          "explanation": "Đúng là C: tại w = 1 có y = 4; dL/dy = 2y = 8 và dy/dw = 3 ⇒ dL/dw = 8 × 3 = 24. A sai vì quên nhân dy/dw = 3; B nhầm 4×3; D lấy 2×3 quên thay y = 4."
        },
        {
          "id": "cd02-q5",
          "question": "Tại thời điểm hiện tại trọng số `w = 5.0`, độ dốc `∇L = +4.0` và `Learning Rate = 0.1`. Giá trị `w` sau 1 bước Gradient Descent chuẩn là?",
          "options": [
            "`5.4`",
            "`4.6`",
            "`1.0`",
            "`4.9`"
          ],
          "correctIndex": 1,
          "explanation": "Đúng là B: w_new = w_old − η·∇L = 5.0 − 0.1×4.0 = 4.6. A sai vì dùng dấu cộng (Gradient Ascent làm tăng Loss); C sai vì quên nhân LR 0.1; D trừ nhầm 0.1 thay vì 0.1×4."
        },
        {
          "id": "cd02-q6",
          "question": "Trong giải tích nhiều biến cho tối ưu hóa mạng nơ-ron, ma trận **Hessian** chứa thông tin gì và dùng để làm gì?",
          "options": [
            "Chứa đạo hàm bậc 1 để cập nhật trọng số SGD.",
            "Chứa các đạo hàm riêng bậc 2, biểu thị độ cong của bề mặt Loss để phân biệt cực tiểu, cực đại và điểm yên ngựa.",
            "Chứa xác suất đầu ra sau Softmax.",
            "Chứa số lượng lớp ẩn trong mạng."
          ],
          "correctIndex": 1,
          "explanation": "Đúng là B: Gradient/Jacobian là đạo hàm bậc 1, còn Hessian là ma trận vuông đạo hàm bậc 2 đo độ cong. A là mô tả của Gradient/Jacobian; C và D không liên quan đến Hessian."
        },
        {
          "id": "cd02-q7",
          "question": "Tính giá trị `ReLU(-5)` và cho biết điểm mạnh cốt lõi của ReLU so với Sigmoid ở các lớp ẩn sâu?",
          "options": [
            "`ReLU(-5) = -5`, giúp giữ toàn bộ tín hiệu âm.",
            "`ReLU(-5) = 0`, đạo hàm bằng `1` với mọi `x > 0` nên tránh triệt tiêu đạo hàm (Vanishing Gradient).",
            "`ReLU(-5) = 0.5`, luôn nằm giữa 0 và 1.",
            "`ReLU(-5) = 5`, biến mọi số thành trị tuyệt đối."
          ],
          "correctIndex": 1,
          "explanation": "Đúng là B: ReLU(x) = max(0, x) nên ReLU(-5) = 0 và đạo hàm ở phần dương bằng 1 không bị co nhỏ như Sigmoid (max 0.25). A, C, D đều sai định nghĩa hàm ReLU."
        },
        {
          "id": "cd02-q8",
          "question": "Điểm khác biệt quan trọng giữa bộ tối ưu **AdamW** và **Adam** truyền thống là gì?",
          "options": [
            "AdamW không dùng Learning Rate.",
            "AdamW tách riêng bước phạt trọng số (Decoupled Weight Decay) khỏi phần cập nhật đạo hàm thích nghi, giúp tổng quát hóa tốt hơn.",
            "AdamW chỉ dùng cho hồi quy tuyến tính 1 biến.",
            "AdamW luôn bỏ qua Momentum."
          ],
          "correctIndex": 1,
          "explanation": "Đúng là B: AdamW tách riêng Weight Decay khỏi bước chia theo phương sai gradient nên phạt trọng số đều và chống Overfitting tốt hơn Adam. A, C, D đều sai sự thật về AdamW."
        },
        {
          "id": "cd02-q9",
          "question": "Đầu ra thô của lớp cuối cho 3 lớp là `[0, 0, 0]`. Sau khi qua hàm **Softmax**, vector xác suất trả về là gì?",
          "options": [
            "`[0, 0, 0]`",
            "`[1, 1, 1]`",
            "`[1/3, 1/3, 1/3]` (tổng đúng bằng 1)",
            "Báo lỗi chia cho 0"
          ],
          "correctIndex": 2,
          "explanation": "Đúng là C: e^0 = 1 cho cả 3 lớp, tổng = 3 ⇒ mỗi lớp nhận 1/3 ≈ 33.3%. A sai vì e^0 = 1 chứ không phải 0; B quên chia tổng; D sai vì mẫu số bằng 3 > 0."
        },
        {
          "id": "cd02-q10",
          "question": "Với bài toán phân loại ảnh 10 lớp (chó, mèo, xe...), cặp Hàm kích hoạt lớp cuối + Hàm mất mát chuẩn mực nhất là gì?",
          "options": [
            "ReLU + MSE",
            "Softmax + Cross-Entropy Loss",
            "Linear + L1 Norm",
            "Sigmoid + RMSE"
          ],
          "correctIndex": 1,
          "explanation": "Đúng là B: Softmax biến 10 điểm thô thành xác suất tổng = 1, còn Cross-Entropy phạt mạnh các ca đoán xác suất thấp cho nhãn đúng. A, C, D đều dùng hàm mất mát hồi quy (MSE/RMSE/L1) hoặc kích hoạt không khớp phân loại đa lớp."
        }
      ]
    }
  },
  {
    "id": "cd-03",
    "code": "CĐ-03",
    "groupId": "math",
    "module": "M1",
    "title": "Xác suất",
    "subtopics": [
      {
        "label": "Tổ hợp & đếm cơ bản",
        "weight": 15
      },
      {
        "label": "Bayes & tỉ lệ nền (Base Rate)",
        "weight": 30
      },
      {
        "label": "Kỳ vọng & Phương sai",
        "weight": 25
      },
      {
        "label": "Bernoulli / Nhị thức / Poisson / Chuẩn",
        "weight": 30
      }
    ],
    "step1": {
      "essence": "Mọi dự đoán AI đều là bài toán cập nhật xác suất có điều kiện khi có thêm bằng chứng. Nắm chắc Định lý Bayes giúp bạn tránh sập bẫy tỷ lệ nền (Base Rate Fallacy) ở các bài toán y tế và gian lận.",
      "formulas": [
        "Tổ hợp: C(n, k) = n! / [k!(n−k)!] (không thứ tự)  |  Chỉnh hợp: P(n, k) = n! / (n−k)! (có thứ tự)",
        "Định lý Bayes: P(A|B) = [P(B|A) · P(A)] / P(B)  |  Độc lập: P(A ∩ B) = P(A)·P(B)",
        "Kỳ vọng & Phương sai: E[aX + b] = a·E[X] + b  |  Var(aX + b) = a²·Var(X)",
        "Chuẩn (Gaussian): 68% (±1σ) · 95% (±2σ) · 99.7% (±3σ)  |  Z = (x − μ) / σ",
        "Bernoulli (1 lần 0/1) · Binomial (k lần trong n phép thử) · Poisson (số sự kiện trong khoảng thời gian)"
      ],
      "problemBlocks": [
        {
          "subtopicIndex": 0,
          "subtopic": "Tổ hợp & đếm cơ bản (15%)",
          "title": "Tổ hợp C(n, k), Chỉnh hợp P(n, k) & Biến cố Độc lập",
          "formulaShort": "C(n,k) = n! ÷ [k!(n−k)!]  |  Độc lập: P(A∩B) = P(A) × P(B)",
          "realProblem": "Có 5 mô hình AI ứng viên, cần chọn ra 2 mô hình ghép chung (không phân biệt thứ tự) vs xếp hạng Nhất–Nhì (có thứ tự) — có bao nhiêu cách, và tính xác suất 2 server cùng sập độc lập ra sao?",
          "aiRole": "Là nền tảng đếm số tổ hợp đặc trưng, cấu hình thí nghiệm và tính xác suất xảy ra đồng thời của các sự cố hệ thống độc lập.",
          "plainSteps": "Bước 1 (Có thứ tự → Chỉnh hợp P): vị trí 1 có 5 cách, vị trí 2 còn 4 cách → `P(5, 2) = 5 × 4 = 20` cách. Bước 2 (KHÔNG thứ tự → Tổ hợp C): chia bớt cho số cách hoán đổi `2! = 2` → `C(5, 2) = 20 ÷ 2 = 10` cặp. Bước 3 (Độc lập): xác suất 2 sự kiện độc lập cùng xảy ra bằng tích 2 xác suất (vd mỗi máy lỗi 10% → cả 2 cùng lỗi = `0.1 × 0.1 = 0.01` tức 1%)."
        },
        {
          "subtopicIndex": 1,
          "subtopic": "Bayes & tỉ lệ nền (Base Rate) (30%)",
          "title": "Xác suất có điều kiện, Định lý Bayes & Tỷ lệ nền (Base Rate)",
          "formulaShort": "P(Thật | +) = Dương thật ÷ Tổng bị báo (+)",
          "realProblem": "Hệ thống AI chẩn đoán bệnh hiếm (1% dân số mắc) có độ nhạy 99% và báo nhầm 5%. Khi máy báo Dương tính (+), khả năng thật sự bị bệnh có phải 99% không?",
          "aiRole": "Định lý Bayes buộc ta tính cả \"tỷ lệ nền\" (số người khỏe áp đảo) để không sập bẫy Base Rate Fallacy trong y tế, lọc spam và phát hiện gian lận ngân hàng.",
          "plainSteps": "Giả sử có 1.000 người: Bước 1 tính số ca Dương thật = `10 người bệnh × 99% = 9.9` ca. Bước 2 tính số ca Báo nhầm = `990 người khỏe × 5% = 49.5` ca. Bước 3 lấy Dương thật ÷ (Dương thật + Báo nhầm) = `9.9 ÷ (9.9 + 49.5) ≈ 16.7%` — khác xa con số ảo 99%!"
        },
        {
          "subtopicIndex": 2,
          "subtopic": "Kỳ vọng & Phương sai (25%)",
          "title": "Kỳ vọng E[aX+b] & Phương sai Var(aX+b)",
          "formulaShort": "E[aX+b] = a·E[X]+b  |  Var(aX+b) = a²·Var(X)",
          "realProblem": "Khi quy đổi cột doanh thu từ USD sang VND (nhân hệ số a) hoặc cộng thêm phí cố định +b cho mọi đơn hàng, mức trung bình và độ biến động dữ liệu thay đổi thế nào?",
          "aiRole": "Giúp dự đoán ngay tác động của phép biến đổi đơn vị và chuẩn hóa dữ liệu (Scaling / Normalization) lên trung bình và phương sai đặc trưng.",
          "plainSteps": "Với Trung bình (Kỳ vọng): cứ nhân `a` rồi cộng `b` bình thường. Với Phương sai: cộng thêm `b` chỉ dịch cả đám số sang phải chứ không làm chúng tản rộng thêm nên vứt bỏ `+b`, còn hệ số nhân `a` phải BÌNH PHƯƠNG lên rồi nhân phương sai cũ. Ví dụ `Var(X) = 4` → `Var(3X + 5) = (3 × 3) × 4 = 36` (tuyệt đối KHÔNG cộng 5!)."
        },
        {
          "subtopicIndex": 3,
          "subtopic": "Bernoulli / Nhị thức / Poisson / Chuẩn (30%)",
          "title": "Phân phối Bernoulli, Nhị thức (Binomial) & Poisson",
          "formulaShort": "1 lần → Bernoulli · n lần → Binomial · theo thời gian → Poisson",
          "realProblem": "Làm sao chọn đúng công thức mô hình hóa tỷ lệ click quảng cáo trên 100 lượt hiển thị so với số API request đổ vào máy chủ AI mỗi giây?",
          "aiRole": "Chọn đúng phân phối xác suất giúp dự báo tải server (Auto-scaling), ước lượng số lỗi mỗi giờ và tính cỡ mẫu kiểm định A/B chuẩn xác.",
          "plainSteps": "Nhìn đơn vị bài toán: (1) 1 phép thử Có/Không (1 người click hay không) → Bernoulli (`E = p`). (2) Đếm số lần thành công trong đúng `n` lượt cố định → Nhị thức Binomial (`E = n × p`; vd 100 lượt, tỷ lệ 10% → kỳ vọng `100 × 0.1 = 10` click). (3) Đếm số sự kiện rơi vào 1 khung thời gian (số request/giây) → Poisson (`E = Var = λ`)."
        },
        {
          "subtopicIndex": 3,
          "subtopic": "Bernoulli / Nhị thức / Poisson / Chuẩn (30%)",
          "title": "Phân phối Chuẩn (Gaussian 68–95–99.7) & Z-score",
          "formulaShort": "Z = (x − μ) ÷ σ  |  ±1σ: 68% · ±2σ: 95% · ±3σ: 99.7%",
          "realProblem": "Làm sao đưa các cột dữ liệu khác đơn vị (Tuổi 20–60 vs Thu nhập 10–200 triệu) về cùng thước đo và bắt ngay giao dịch bất thường (Outlier)?",
          "aiRole": "StandardScaler dùng công thức Z-score đưa mọi cột về trung bình 0, độ lệch chuẩn 1, còn quy tắc 68–95–99.7 giúp khoanh vùng điểm ngoại lai nhanh trong 3 giây.",
          "plainSteps": "Bước 1: Lấy Giá trị quan sát `x` TRỪ Trung bình `μ`. Bước 2: CHIA cho Độ lệch chuẩn `σ` để ra số bước lệch `Z`. Ví dụ thời gian xử lý trung bình `μ = 100ms`, `σ = 20ms`: 95% lượt nằm trong `[100 − 40, 100 + 40] = [60ms, 140ms]`; ca chạy `160ms` có `Z = (160 − 100) ÷ 20 = +3` (rìa 99.7% ⇒ dấu hiệu bất thường!)."
        }
      ],
      "quickExample": {
        "problem": "Bệnh hiếm có P(Bệnh) = 1%. Test nhạy P(+|Bệnh) = 99%, báo giả P(+|Khỏe) = 5%. Có kết quả (+), xác suất thật sự mắc bệnh?",
        "solution": "P(Bệnh|+) = (0.99×0.01) / (0.99×0.01 + 0.05×0.99) = 0.0099 / 0.0594 = 1/6 ≈ 16.7% (không phải 99%!)."
      }
    },
    "step2": {
      "keywords": [
        {
          "en": "Bayes' Theorem",
          "vi": "Định lý Bayes",
          "short": "Cập nhật xác suất thật khi có bằng chứng mới bằng cách tính cả tỷ lệ nền ban đầu."
        },
        {
          "en": "Base Rate Fallacy",
          "vi": "Ngụy biện tỷ lệ nền",
          "short": "Sai lầm tin mù quáng độ nhạy 99% mà quên bệnh/gian lận vốn rất hiếm ngoài đời."
        },
        {
          "en": "Conditional Probability",
          "vi": "Xác suất có điều kiện",
          "short": "Xác suất A xảy ra khi đã biết chắc B xảy ra: P(A|B) = P(A∩B) ÷ P(B)."
        },
        {
          "en": "Expected Value & Variance",
          "vi": "Kỳ vọng & Phương sai",
          "short": "Đo trung bình dài hạn và độ phân tán; nhớ Var(aX+b) = a²·Var(X) (bỏ hằng số +b)."
        },
        {
          "en": "Binomial vs Poisson",
          "vi": "Phân phối Nhị thức vs Poisson",
          "short": "Binomial đếm số lần trúng trong n lượt cố định; Poisson đếm sự kiện mỗi giây/giờ."
        },
        {
          "en": "Gaussian 68-95-99.7",
          "vi": "Quy tắc chuẩn 68–95–99.7",
          "short": "Tỷ lệ dữ liệu nằm trong ±1σ (68%), ±2σ (95%) và ±3σ (99.7%) quanh trung bình."
        }
      ],
      "memoryTip": "Bí kíp Var(aX + b) = a²·Var(X): cộng hằng số (+b) chỉ tịnh tiến đồ thị nên KHÔNG đổi phương sai, còn nhân hệ số a phải BÌNH PHƯƠNG lên! Đếm sự kiện trên mỗi phút/giờ (request/s) → nghĩ ngay Poisson.",
      "youtubeQueries": [
        "3Blue1Brown Bayes theorem intuition",
        "StatQuest Probability distributions Binomial Poisson Normal",
        "Base rate fallacy Bayes theorem medical test example"
      ]
    },
    "step3": {
      "traps": [
        {
          "title": "Base Rate Fallacy — Quên tỷ lệ nền P(A) khi đọc kết quả test",
          "detail": "Khi bệnh/gian lận chỉ chiếm 0.1%–1%, dù test nhạy 99% thì đa số ca báo dương vẫn là False Positive từ nhóm âm tính khổng lồ."
        },
        {
          "title": "Cộng hằng số b vào Phương sai hoặc quên bình phương a",
          "detail": "Với Var(X) = 4, Var(3X + 5) = 9 × 4 = 36 (KHÔNG phải 3×4 = 12 hay 36+5 = 41)."
        },
        {
          "title": "Nhầm biến cố Độc lập (Independent) với Xung khắc (Mutually Exclusive)",
          "detail": "Hai biến cố xung khắc (P(A∩B)=0, P(A),P(B)>0) thực chất PHỤ THUỘC hoàn toàn vì A xảy ra thì B chắc chắn không xảy ra!"
        }
      ]
    },
    "step4": {
      "miniQuiz": [
        {
          "id": "cd03-q1",
          "question": "Biến ngẫu nhiên X có Var(X) = 4. Giá trị của Var(3X + 5) bằng bao nhiêu?",
          "options": [
            "12",
            "17",
            "36",
            "41"
          ],
          "correctIndex": 2,
          "explanation": "Var(3X + 5) = 3² · Var(X) = 9 × 4 = 36 (hằng số +5 không đổi phương sai)."
        },
        {
          "id": "cd03-q2",
          "question": "Phân phối xác suất nào phù hợp nhất để mô hình hóa \"số lượng API request gửi tới server trong mỗi giây\"?",
          "options": [
            "Phân phối Bernoulli",
            "Phân phối Poisson",
            "Phân phối Uniform rời rạc",
            "Phân phối t-Student"
          ],
          "correctIndex": 1,
          "explanation": "Poisson mô tả số lần xảy ra của sự kiện độc lập trong một đơn vị thời gian hoặc không gian cố định."
        },
        {
          "id": "cd03-q3",
          "question": "Theo quy tắc kinh nghiệm phân phối chuẩn (Gaussian), khoảng μ ± 2σ chứa xấp xỉ bao nhiêu % dữ liệu?",
          "options": [
            "68%",
            "95%",
            "99.7%",
            "50%"
          ],
          "correctIndex": 1,
          "explanation": "Quy tắc 68–95–99.7%: ±1σ ≈ 68%, ±2σ ≈ 95%, ±3σ ≈ 99.7%."
        },
        {
          "id": "cd03-q4",
          "question": "Có 5 mô hình AI ứng viên, cần chọn ra một cặp 2 mô hình để ghép Ensemble (KHÔNG phân biệt thứ tự). Có bao nhiêu cặp khác nhau?",
          "options": [
            "`20`",
            "`10`",
            "`25`",
            "`5`"
          ],
          "correctIndex": 1,
          "explanation": "Đúng là B: không tính thứ tự nên dùng Tổ hợp C(5, 2) = 5! / (2!·3!) = (5×4)/2 = 10 cặp. A là Chỉnh hợp P(5, 2) = 20 (tính cả thứ tự); C là chọn có lặp 5²; D sai công thức đếm."
        },
        {
          "id": "cd03-q5",
          "question": "Bệnh hiếm có tỷ lệ nền `P(Bệnh) = 1%`. Xét nghiệm có độ nhạy `99%` và báo nhầm người khỏe `5%`. Một người có kết quả dương tính (+), xác suất thật sự mắc bệnh xấp xỉ bao nhiêu?",
          "options": [
            "`99%`",
            "`94%`",
            "`16.7%`",
            "`1%`"
          ],
          "correctIndex": 2,
          "explanation": "Đúng là C: trên 1.000 người có 10 bệnh (bắt đúng 9.9) và 990 khỏe (báo nhầm 49.5) ⇒ P(Bệnh|+) = 9.9 / (9.9 + 49.5) ≈ 16.7%. A và B là bẫy Base Rate Fallacy bỏ qua nhóm 990 người khỏe; D là tỷ lệ nền trước khi xét nghiệm."
        },
        {
          "id": "cd03-q6",
          "question": "Cho biến ngẫu nhiên `X` có kỳ vọng `E[X] = 10` và phương sai `Var(X) = 4`. Giá trị của `E[2X - 3]` là bao nhiêu?",
          "options": [
            "`20`",
            "`17`",
            "`37`",
            "`14`"
          ],
          "correctIndex": 1,
          "explanation": "Đúng là B: E[aX + b] = a·E[X] + b = 2×10 − 3 = 17. A quên trừ 3; C bình phương nhầm hệ số 2 (nhầm với công thức Var); D tính sai số học."
        },
        {
          "id": "cd03-q7",
          "question": "Hai biến cố `A` và `B` có `P(A) = 0.4`, `P(B) = 0.5` và **xung khắc** (không thể cùng xảy ra, `P(A ∩ B) = 0`). Phát biểu nào ĐÚNG?",
          "options": [
            "A và B độc lập hoàn toàn với nhau.",
            "A và B KHÔNG độc lập (thực chất phụ thuộc chặt vì A xảy ra thì chắc chắn B không xảy ra).",
            "`P(A ∩ B) = 0.2`.",
            "`P(A ∪ B) = 0.2`."
          ],
          "correctIndex": 1,
          "explanation": "Đúng là B: để độc lập phải có P(A∩B) = P(A)·P(B) = 0.2, nhưng vì xung khắc nên P(A∩B) = 0 ≠ 0.2 ⇒ phụ thuộc! A là bẫy kinh điển nhầm xung khắc với độc lập; C sai vì P(A∩B)=0; D sai vì P(A∪B) = 0.4 + 0.5 = 0.9."
        },
        {
          "id": "cd03-q8",
          "question": "Tung 10 lần một quảng cáo có xác suất mỗi người bấm là `p = 0.2` (độc lập). Phân phối nào mô tả \"số lượt bấm trong 10 lần\" và kỳ vọng bằng bao nhiêu?",
          "options": [
            "Bernoulli, kỳ vọng `0.2`",
            "Nhị thức (Binomial), kỳ vọng `n·p = 10 × 0.2 = 2`",
            "Poisson, kỳ vọng `10`",
            "Phân phối đều, kỳ vọng `5`"
          ],
          "correctIndex": 1,
          "explanation": "Đúng là B: đếm số thành công trong n = 10 phép thử độc lập cố định là Nhị thức Binomial với E = n·p = 2. A chỉ dùng cho đúng 1 phép thử; C dùng cho khung thời gian không cố định n; D sai loại phân phối."
        },
        {
          "id": "cd03-q9",
          "question": "Thời gian phản hồi API tuân theo phân phối chuẩn với trung bình `μ = 200ms` và độ lệch chuẩn `σ = 25ms`. Một yêu cầu mất `275ms` có điểm chuẩn hóa `Z-score` bằng bao nhiêu?",
          "options": [
            "`+2.0`",
            "`+3.0` (rìa 99.7%, dấu hiệu bất thường)",
            "`+75`",
            "`-3.0`"
          ],
          "correctIndex": 1,
          "explanation": "Đúng là B: Z = (x − μ) / σ = (275 − 200) / 25 = +3.0, nằm ngoài ±2σ và chạm rìa 99.7% ⇒ dấu hiệu Outlier. A tính nhầm thương; C quên chia σ; D sai dấu vì 275 > 200."
        },
        {
          "id": "cd03-q10",
          "question": "Trong 100 khách truy cập có 40 người dùng iOS, trong đó có 10 người mua hàng. Xác suất có điều kiện `P(Mua hàng | iOS)` bằng bao nhiêu?",
          "options": [
            "`10%`",
            "`25%`",
            "`40%`",
            "`50%`"
          ],
          "correctIndex": 1,
          "explanation": "Đúng là B: P(Mua | iOS) = P(Mua ∩ iOS) / P(iOS) = 10 / 40 = 0.25 (25%). A nhầm lấy 10/100 (là xác suất đồng thời P(Mua ∩ iOS)); C là P(iOS); D sai phép chia."
        }
      ]
    }
  },
  {
    "id": "cd-04",
    "code": "CĐ-04",
    "groupId": "math",
    "module": "M1",
    "title": "Thống kê & A/B testing",
    "subtopics": [
      {
        "label": "Thống kê mô tả (Mean/Median/IQR)",
        "weight": 15
      },
      {
        "label": "Standard Error (SE) & Confidence Interval",
        "weight": 20
      },
      {
        "label": "p-value / Type I–II / Power",
        "weight": 25
      },
      {
        "label": "A/B Testing / SRM / Peeking",
        "weight": 30
      },
      {
        "label": "Nhân quả & Simpson’s Paradox",
        "weight": 10
      }
    ],
    "step1": {
      "essence": "A/B Testing là tiêu chuẩn vàng đo tác động nhân quả trước khi tung tính năng AI. Kỹ sư cần kiểm soát sai lầm thống kê (p-value, Multiple Testing, Peeking, SRM) để không tung nhầm mô hình vô dụng.",
      "formulas": [
        "SE = σ / √n  (cỡ mẫu tăng 4 lần ⇒ sai số chuẩn giảm 2 lần)  |  CI 95% ≈ x̄ ± 1.96 · SE",
        "p-value < α (0.05) ⇒ Bác bỏ H0  |  Type I (α): Báo hiệu ứng giả  |  Type II (β): Bỏ sót hiệu ứng thật",
        "Statistical Power = 1 − β (thường đặt ≥ 80%)  |  Bonferroni cho m kiểm định: α_new = α / m",
        "IQR = Q3 − Q1 (Outlier nằm ngoài [Q1 − 1.5·IQR, Q3 + 1.5·IQR])",
        "SRM (Sample Ratio Mismatch): tỉ lệ chia traffic thực tế lệch thiết kế (vd 50/50 thành 53/47) ⇒ kết quả A/B vô hiệu!"
      ],
      "problemBlocks": [
        {
          "subtopicIndex": 0,
          "subtopic": "Thống kê mô tả (Mean/Median/IQR) (15%)",
          "title": "Thống kê mô tả: Mean vs Median, Phân vị & IQR lọc Outlier",
          "formulaShort": "IQR = Q3 − Q1  |  Outlier ngoài [Q1 − 1.5·IQR, Q3 + 1.5·IQR]",
          "realProblem": "Cột thu nhập khách hàng có 9 người lương 15 triệu và 1 tỷ phú lương 1 tỷ — dùng Mean hay Median để đại diện đúng, và công thức nào lọc các giá trị ngoại lai (Outlier)?",
          "aiRole": "Giúp phân tích dữ liệu khám phá (EDA) chính xác mà không bị vài ngoại lai làm méo con số báo cáo, đồng thời hiểu bản chất các mốc phân vị p50 (Median) và p95 trong MLOps.",
          "plainSteps": "Bước 1 (Mean vs Median): 9 người 15tr + 1 người 1.000tr cho Mean = 113,5tr (méo hoàn toàn!), còn Median (số đứng giữa p50) = 15tr (phản ánh đúng thực tế!). Bước 2 (Lọc Outlier bằng IQR): tính `IQR = mốc 75% (Q3) − mốc 25% (Q1)`. Ví dụ `Q1 = 10`, `Q3 = 20` → `IQR = 10` → ngưỡng trên là `20 + (1.5 × 10) = 35` (số nào `> 35` là Outlier)."
        },
        {
          "subtopicIndex": 1,
          "subtopic": "Standard Error (SE) & Confidence Interval (20%)",
          "title": "Standard Error (SE) & Khoảng tin cậy 95% (Confidence Interval)",
          "formulaShort": "SE = σ ÷ √n  |  CI 95% = x̄ ± 1.96 × SE",
          "realProblem": "Chỉ chạy thử tính năng gợi ý AI trên mẫu nhỏ 100 khách — làm sao ước lượng biên độ sai số khi mở cho 1 triệu khách và cần tăng cỡ mẫu bao nhiêu để biên độ giảm một nửa?",
          "aiRole": "SE và CI 95% đo độ bấp bênh của ước lượng mẫu; nếu khoảng tin cậy mức tăng trưởng vẫn cắt qua 0 (vd `[-1%, +3%]`) thì chưa đủ bằng chứng tung mô hình mới.",
          "plainSteps": "Bước 1: Lấy độ lệch chuẩn `σ` CHIA cho căn bậc hai cỡ mẫu `√n` để ra `SE` — vì có căn bậc hai nên muốn giảm sai số đi 2 lần phải TĂNG cỡ mẫu lên `2² = 4` lần! Bước 2: Lấy `Trung bình ± (1.96 × SE)`. Ví dụ `σ = 10`, `n = 100` → `SE = 10 ÷ √100 = 1` → CI 95% quanh mức `50` là `[50 − 1.96, 50 + 1.96] = [48.04, 51.96]`."
        },
        {
          "subtopicIndex": 2,
          "subtopic": "p-value / Type I–II / Power (25%)",
          "title": "p-value, Sai lầm Loại I–II, Power & Hiệu chỉnh Bonferroni",
          "formulaShort": "Power = 1 − β ≥ 80%  |  Bonferroni: α_new = α ÷ m",
          "realProblem": "Nhóm chạy A/B test và soi cùng lúc 20 chỉ số ở mức α = 0.05, thấy 1 chỉ số có p = 0.03 liền chốt thắng — tại sao kết luận này dễ sai và phân biệt lỗi Loại I vs Loại II thế nào?",
          "aiRole": "Kiểm soát rủi ro tung nhầm mô hình vô dụng (Type I `α`) hoặc bỏ sót mô hình tốt (Type II `β`) khi ra quyết định sản phẩm AI.",
          "plainSteps": "Bước 1: `p-value` đo xác suất thấy chênh lệch lớn vậy do ăn may GIẢ SỬ 2 bản như nhau (KHÔNG phải xác suất H0 đúng!). Bước 2: Soi `m` chỉ số song song phải dùng Bonferroni: lấy `α ÷ m`. Ví dụ `m = 20` → `α_new = 0.05 ÷ 20 = 0.0025` ⇒ `p = 0.03 > 0.0025` nên CHƯA đạt ý nghĩa thống kê! Luôn đặt Statistical Power `1 − β ≥ 80%`."
        },
        {
          "subtopicIndex": 3,
          "subtopic": "A/B Testing / SRM / Peeking (30%)",
          "title": "Thiết kế A/B Testing sạch: Cỡ mẫu, SRM & Chống Peeking",
          "formulaShort": "Check SRM trước · Chạy đủ cỡ mẫu & chu kỳ (No Peeking)",
          "realProblem": "A/B test cài chia 50/50 nhưng thực tế nhóm A nhận 54.000 người còn nhóm B 46.000 người; hoặc mới ngày 1 thấy p < 0.05 đã muốn dừng sớm — hai lỗi này phá hỏng thí nghiệm thế nào?",
          "aiRole": "Là chốt chặn kỹ thuật số 1 của A/B Testing: dính SRM nghĩa là pipeline chia nhóm/tracking đang bug, còn nhìn trộm dừng sớm (Peeking) đẩy tỷ lệ báo thắng giả từ 5% vọt lên 25–30%.",
          "plainSteps": "Bước 1 (Soi SRM): Trên 100.000 user chia 50/50 phải xấp xỉ 50.000 vs 50.000; lệch thành 54.000 vs 46.000 (Chi-Square `p < 0.001`) ⇒ DỪNG đọc kết quả kinh doanh, sửa lỗi chia traffic trước! Bước 2 (Chống Peeking): Ấn định cỡ mẫu `n` và thời gian tối thiểu 1–2 tuần từ đầu, chạy đủ ngày mới đọc `p-value` ĐÚNG 1 LẦN."
        },
        {
          "subtopicIndex": 4,
          "subtopic": "Nhân quả & Simpson’s Paradox (10%)",
          "title": "Tương quan ≠ Nhân quả & Nghịch lý Simpson's Paradox",
          "formulaShort": "Luôn tách theo biến nhiễu (Confounder) · Chỉ A/B chứng minh Nhân quả",
          "realProblem": "Tại sao dữ liệu cho thấy \"người mua kem nhiều thì số ca đuối nước tăng\", và tại sao mô hình AI thắng ở CẢ Mobile lẫn Desktop nhưng khi gộp tổng báo cáo lại thành thua?",
          "aiRole": "Ngăn lãnh đạo ra quyết định sai từ số liệu quan sát bị biến ẩn chi phối (như mùa hè gây tăng cả kem lẫn đi bơi) hoặc số liệu gộp tổng bị đảo chiều xu hướng.",
          "plainSteps": "Ví dụ Simpson's Paradox: Mô hình A thắng ở ca dễ (`90/100 = 90%`) lẫn ca khó (`10/100 = 10%`) → tổng `(90+10) ÷ 200 = 50%`. Mô hình B thua ở cả hai nhóm (dễ `80/90 = 88.9%`, khó `0/10 = 0%`) nhưng vì được chia toàn ca dễ nên tổng lại là `(80+0) ÷ 100 = 80%`! Quy tắc: luôn tách phân khúc theo thiết bị/nhóm khách trước khi kết luận."
        }
      ],
      "quickExample": {
        "problem": "Nhóm chạy 20 chỉ số A/B cùng lúc ở mức α = 0.05 và thấy 1 chỉ số có p = 0.03 nên kết luận mô hình mới thắng. Đúng hay sai?",
        "solution": "Sai — mắc Multiple Testing Problem (xác suất có ≥1 báo giả lên tới 64%). Áp dụng Bonferroni: ngưỡng mới α_new = 0.05/20 = 0.0025 ⇒ p = 0.03 chưa đủ ý nghĩa thống kê."
      }
    },
    "step2": {
      "keywords": [
        {
          "en": "Standard Error & Confidence Interval",
          "vi": "Sai số chuẩn & Khoảng tin cậy",
          "short": "SE = σ/√n đo độ lệch ước lượng mẫu (giảm 2 lần cần tăng mẫu 4 lần); CI 95% = x̄ ± 1.96·SE."
        },
        {
          "en": "p-value Type I Type II Error",
          "vi": "p-value & Sai lầm Loại I–II",
          "short": "Type I (α) là báo thắng giả, Type II (β) là bỏ sót hiệu ứng thật; Power = 1 − β ≥ 80%."
        },
        {
          "en": "Bonferroni Correction",
          "vi": "Hiệu chỉnh Bonferroni",
          "short": "Chia nhỏ ngưỡng α cho số phép thử m (α/m) để không ăn may thắng giả khi test nhiều chỉ số."
        },
        {
          "en": "Sample Ratio Mismatch (SRM)",
          "vi": "Lệch tỷ lệ phân nhóm SRM",
          "short": "Tỷ lệ traffic thực lệch thiết kế (50/50 thành 54/46) ⇒ lỗi kỹ thuật, kết quả A/B vô hiệu."
        },
        {
          "en": "Peeking Problem",
          "vi": "Lỗi nhìn trộm dừng sớm",
          "short": "Chốt A/B test sớm ngay khi vừa thấy p < 0.05 làm tỷ lệ báo thắng giả vọt lên 25–30%."
        },
        {
          "en": "Simpson's Paradox",
          "vi": "Nghịch lý Simpson",
          "short": "Thắng ở từng phân khúc riêng nhưng gộp tổng lại thua do phân bổ mẫu giữa các nhóm lệch."
        }
      ],
      "memoryTip": "Checklist A/B test sạch: (1) Không nhìn sớm dừng sớm (No Peeking); (2) Kiểm tra SRM trước khi đọc kết quả; (3) Nhiều metric phải dùng Bonferroni; (4) Luôn soi theo phân khúc tránh Simpson’s Paradox.",
      "youtubeQueries": [
        "StatQuest p-values Type I Type II errors Statistical Power",
        "A/B testing SRM sample ratio mismatch peeking problem",
        "Simpson's paradox explained with examples"
      ]
    },
    "step3": {
      "traps": [
        {
          "title": "Dừng A/B test ngay ngày đầu khi vừa thấy p < 0.05 (Peeking)",
          "detail": "Xem kết quả liên tục và dừng ngay khi đạt p < 0.05 làm tỷ lệ False Positive thực tế vọt lên 25–30% thay vì 5%."
        },
        {
          "title": "Bỏ qua SRM (Sample Ratio Mismatch)",
          "detail": "Nếu chia 50/50 nhưng log thu được 47/53 (p < 0.001), pipeline chia nhóm đang lỗi kỹ thuật — mọi kết luận A/B đều vô nghĩa."
        },
        {
          "title": "Hiểu sai định nghĩa Confidence Interval 95% hoặc p-value",
          "detail": "p-value KHÔNG phải \"xác suất H0 đúng\"; nó là xác suất gặp dữ liệu cực đoan như vậy GIẢ SỬ H0 đúng."
        }
      ]
    },
    "step4": {
      "miniQuiz": [
        {
          "id": "cd04-q1",
          "question": "Chạy 10 kiểm định giả thuyết độc lập cùng lúc với mức ý nghĩa mong muốn tổng thể α = 0.05. Theo Bonferroni Correction, ngưỡng p-value cho từng kiểm định là bao nhiêu?",
          "options": [
            "0.05",
            "0.005",
            "0.5",
            "0.0005"
          ],
          "correctIndex": 1,
          "explanation": "Bonferroni chia ngưỡng α cho số lượng kiểm định m: α_new = 0.05 / 10 = 0.005."
        },
        {
          "id": "cd04-q2",
          "question": "Thử nghiệm A/B thiết kế chia 50/50 nhưng sau 1 tuần nhóm A nhận 54.000 user còn nhóm B chỉ nhận 46.000 user. Điều cần làm ĐẦU TIÊN là gì?",
          "options": [
            "Lập tức kết luận nhóm A thắng vì có nhiều user hơn.",
            "Dừng đọc kết quả kinh doanh và điều tra lỗi Sample Ratio Mismatch (SRM) ở tầng chia traffic/logging.",
            "Lấy ngẫu nhiên 46.000 user từ nhóm A cho bằng nhau rồi báo cáo.",
            "Tăng cỡ mẫu thêm 1 ngày."
          ],
          "correctIndex": 1,
          "explanation": "SRM cho thấy có lỗi thiên lệch trong cơ chế phân nhóm/thu thập log; mọi so sánh chỉ số trên tập lệch đều mất giá trị nhân quả."
        },
        {
          "id": "cd04-q3",
          "question": "Hiện tượng một mô hình thắng ở từng phân khúc (Mobile lẫn Desktop) nhưng khi gộp chung toàn bộ lại thua do tỷ lệ traffic giữa hai phân khúc khác nhau gọi là gì?",
          "options": [
            "Overfitting",
            "Simpson's Paradox",
            "Base Rate Fallacy",
            "Data Leakage"
          ],
          "correctIndex": 1,
          "explanation": "Simpson's Paradox xảy ra khi xu hướng đảo chiều lúc gộp nhóm do biến nhiễu (phân bổ thiết bị không đều giữa 2 nhánh)."
        },
        {
          "id": "cd04-q4",
          "question": "Một nhóm 5 khách hàng chi tiêu `[10, 12, 15, 18, 500]` (triệu đồng). Thước đo vị trí trung tâm nào phản ánh thực tế nhóm khách này tốt hơn và vì sao?",
          "options": [
            "Mean = `111`, vì Mean luôn tốt nhất cho mọi dữ liệu.",
            "Median = `15`, vì Median bền vững trước giá trị ngoại lai (Outlier `500`) còn Mean bị kéo lệch mạnh.",
            "IQR = `500`, vì lấy số lớn nhất.",
            "Độ lệch chuẩn, vì luôn bằng `15`."
          ],
          "correctIndex": 1,
          "explanation": "Đúng là B: Outlier 500 kéo Mean vọt lên 111 dù 4/5 người chỉ chi 10–18 triệu, còn Median (giá trị giữa p50 = 15) không bị ảnh hưởng. A sai vì Mean rất nhạy outlier; C và D sai định nghĩa IQR/std."
        },
        {
          "id": "cd04-q5",
          "question": "Theo công thức Sai số chuẩn `SE = σ / √n`, muốn giảm độ rộng Khoảng tin cậy 95% đi một nửa (giảm 2 lần) thì cần tăng cỡ mẫu `n` lên bao nhiêu lần?",
          "options": [
            "Tăng `2` lần",
            "Tăng `4` lần",
            "Tăng `8` lần",
            "Giảm `2` lần"
          ],
          "correctIndex": 1,
          "explanation": "Đúng là B: vì n nằm dưới dấu căn bậc hai (√n), muốn SE giảm 2 lần thì √n phải tăng 2 lần ⇒ n phải tăng 2² = 4 lần. A là bẫy tuyến tính hay gặp nhất; C và D tính sai quan hệ căn bậc hai."
        },
        {
          "id": "cd04-q6",
          "question": "Một kết quả A/B test báo cáo `p-value = 0.03`. Cách diễn giải nào sau đây ĐÚNG về mặt thống kê?",
          "options": [
            "Có đúng 3% khả năng giả thuyết gốc `H0` (hai bản như nhau) là đúng.",
            "Có 97% khả năng doanh thu chắc chắn tăng khi tung ra thị trường.",
            "Nếu giả sử `H0` đúng (hai bản thực sự không khác biệt), chỉ có 3% xác suất quan sát được chênh lệch cực đoan như vậy do ngẫu nhiên.",
            "Chắc chắn mô hình mới tăng trưởng thêm 3%."
          ],
          "correctIndex": 2,
          "explanation": "Đúng là C: định nghĩa chuẩn của p-value là P(Dữ liệu cực đoan | H0 đúng). A và B là hai ngộ nhận phổ biến nhất về p-value; D nhầm lẫn p-value với độ lớn hiệu ứng (Effect Size)."
        },
        {
          "id": "cd04-q7",
          "question": "Trong kiểm định giả thuyết A/B, **Sai lầm Loại I (Type I Error, α)** và **Sai lầm Loại II (Type II Error, β)** tương ứng với tình huống nào?",
          "options": [
            "Type I: kết luận tính năng mới thắng dù thật ra vô dụng (False Positive); Type II: bỏ sót một tính năng thực sự hiệu quả (False Negative).",
            "Type I: bỏ sót tính năng tốt; Type II: kết luận thắng giả.",
            "Cả hai đều có nghĩa là hệ thống bị SRM.",
            "Type I luôn nhỏ hơn 0 và Type II luôn bằng 1."
          ],
          "correctIndex": 0,
          "explanation": "Đúng là A: α (Type I) = bác bỏ nhầm H0 (báo thắng giả); β (Type II) = không bác bỏ được H0 dù H1 đúng (bỏ sót hiệu quả thật), và Statistical Power = 1 − β. B bị đảo ngược; C và D sai định nghĩa."
        },
        {
          "id": "cd04-q8",
          "question": "Nhóm sản phẩm mở xem kết quả A/B test mỗi sáng và dừng thí nghiệm ngay ngày thứ 2 khi vừa thấy `p = 0.04`. Lỗi này tên là gì và hậu quả ra sao?",
          "options": [
            "SRM — làm giảm lượng người dùng truy cập.",
            "Peeking Problem — làm tỷ lệ False Positive (báo thắng giả) thực tế tăng vọt từ 5% lên 25–30%.",
            "Overfitting — làm mô hình mất hết trọng số.",
            "Data Drift — làm thay đổi đơn vị tiền tệ."
          ],
          "correctIndex": 1,
          "explanation": "Đúng là B: nhìn trộm dừng sớm (Peeking) khiến bạn bắt đúng dao động ngẫu nhiên tạm thời, làm phình mạnh tỷ lệ sai lầm Loại I. A là lệch tỷ lệ chia nhóm; C và D thuộc bài toán ML/MLOps."
        },
        {
          "id": "cd04-q9",
          "question": "Một tập số liệu có tứ phân vị `Q1 = 20` và `Q3 = 40`. Theo quy tắc `1.5 × IQR`, giá trị nào sau đây bị coi là **Outlier** ở phía trên?",
          "options": [
            "`55`",
            "`65`",
            "`75` (vì lớn hơn ngưỡng trên `40 + 1.5 × 20 = 70`)",
            "`45`"
          ],
          "correctIndex": 2,
          "explanation": "Đúng là C: IQR = Q3 − Q1 = 40 − 20 = 20 ⇒ ngưỡng trên = Q3 + 1.5×IQR = 40 + 30 = 70. Chỉ số 75 > 70 là Outlier; các số 45, 55, 65 đều nằm trong vùng hợp lệ ≤ 70."
        },
        {
          "id": "cd04-q10",
          "question": "Khoảng tin cậy 95% (CI 95%) cho mức thay đổi tỷ lệ chuyển đổi (Conversion Lift) của mô hình AI mới là `[-0.4%, +2.2%]`. Quyết định đúng là gì?",
          "options": [
            "Tung ngay cho 100% khách vì cận trên đạt tận +2.2%.",
            "Chưa có ý nghĩa thống kê ở mức 95% vì khoảng tin cậy vẫn chứa giá trị `0%` (có khả năng hiệu ứng thật = 0 hoặc âm).",
            "Chắc chắn mô hình mới làm giảm doanh thu 0.4%.",
            "Chia đôi khoảng tin cậy để loại số âm."
          ],
          "correctIndex": 1,
          "explanation": "Đúng là B: khi CI 95% cắt qua 0 (từ âm sang dương), ta chưa thể bác bỏ H0 ở mức α = 0.05 — cần tiếp tục chạy đủ cỡ mẫu hoặc cải tiến mô hình. A, C, D đều suy diễn sai nguyên tắc thống kê."
        }
      ]
    }
  }
];
