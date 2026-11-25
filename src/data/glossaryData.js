export const GLOSSARY_DATA = [
  // =========================================================================
  // MODULE 1: TOÁN HỌC (13 keywords)
  // =========================================================================
  {
    id: 'dot-product',
    module: 'M1',
    term: 'Dot product',
    aliases: ['Dot product', 'Dot Product', 'Tích vô hướng'],
    whatIsIt:
      'Phép đo "độ ăn khớp" giữa 2 danh sách số cùng chiều dài — giống hàm SUMPRODUCT trong Excel (nhân từng cặp cột rồi cộng dồn thành 1 con số duy nhất).',
    aiRole:
      'Là phép tính cốt lõi trong mọi lớp mạng nơ-ron (nhân đầu vào với trọng số) và trong cơ chế Attention của LLM để đo xem 2 từ có liên quan mật thiết với nhau không.',
    formulaPlain:
      'Lấy từng cặp số cùng vị trí nhân với nhau rồi cộng tất cả lại. Ví dụ: [2, 3] · [4, 1] = (2 × 4) + (3 × 1) = 8 + 3 = 11. Nếu ra 0 là hai hướng vuông góc (không liên quan gì nhau).',
  },
  {
    id: 'cosine-similarity',
    module: 'M1',
    term: 'Cosine similarity',
    aliases: ['Cosine similarity', 'Cosine Similarity', 'Cosine'],
    whatIsIt:
      'Thước đo xem 2 mũi tên (vector) có đang chỉ cùng một hướng hay không, cho điểm từ -1 (ngược hoàn toàn) đến +1 (giống hệt hướng), bỏ qua độ dài ngắn của văn bản.',
    aiRole:
      'Là cách phổ biến nhất để Vector Database trong hệ thống RAG tìm ra đoạn tài liệu gần nghĩa nhất với câu hỏi của người dùng.',
    formulaPlain:
      'Lấy Dot product của hai vector chia cho tích độ dài của từng vector. Ví dụ: u = [3, 4] (dài 5) và v = [6, 8] (dài 10) → Dot = 3×6 + 4×8 = 50 → Cosine = 50 ÷ (5 × 10) = 1.0 (cùng hướng 100%).',
  },
  {
    id: 'determinant',
    module: 'M1',
    term: 'Determinant',
    aliases: ['Determinant', 'Định thức', 'det(A)'],
    whatIsIt:
      'Một con số đại diện cho "hệ số phóng to hay thu nhỏ diện tích/thể tích" của bảng số vuông. Nếu bằng 0 nghĩa là bảng số đã bị ép dẹt mất một chiều, không thể hoàn tác (nghịch đảo) được nữa.',
    aiRole:
      'Giúp kiểm tra xem hệ phương trình hay ma trận trọng số có nghiệm duy nhất và tính được ma trận nghịch đảo (khả nghịch) hay bị suy biến (singular).',
    formulaPlain:
      'Với bảng 2×2 [[a, b], [c, d]]: lấy tích đường chéo chính (a × d) trừ đi tích đường chéo phụ (b × c). Ví dụ: [[3, 2], [1, 5]] → (3 × 5) − (2 × 1) = 15 − 2 = 13 (khác 0 ⇒ đảo ngược được).',
  },
  {
    id: 'truncated-svd',
    module: 'M1',
    term: 'Truncated SVD',
    aliases: ['Truncated SVD', 'SVD'],
    whatIsIt:
      'Kỹ thuật nén một bảng dữ liệu khổng lồ (nhiều nghìn cột) xuống còn vài chục cột "tinh hoa" nhất mà KHÔNG làm hỏng các ô số 0 đang trống.',
    aiRole:
      'Dùng để giảm chiều dữ liệu trên ma trận thưa (như bảng User-Item gợi ý sản phẩm hay TF-IDF văn bản) thay cho Standard PCA để tránh tràn RAM (OOM).',
    formulaPlain:
      'Tách bảng gốc A (m×n) thành 3 bảng nhỏ hơn rồi chỉ giữ lại k cột quan trọng nhất (như giữ 80–85% thông tin). Ví dụ: bảng 100.000×50.000 nén với k = 100 chỉ còn kích thước gọn nhẹ gấp hàng trăm lần.',
  },
  {
    id: 'csr',
    module: 'M1',
    term: 'CSR',
    aliases: ['CSR Sparse Matrix', 'Compressed Sparse Row', 'CSR'],
    whatIsIt:
      'Cách lưu bảng tính siêu tiết kiệm: thay vì lưu hàng triệu ô chứa số 0 vô ích, máy chỉ ghi lại đúng những ô có số KHÁC 0 cùng vị trí hàng và cột của chúng.',
    aiRole:
      'Cho phép lưu và nhân ma trận cực thưa (99% là số 0 như lịch sử mua hàng, túi từ văn bản) trên máy RAM nhỏ mà vẫn chạy cực nhanh theo từng dòng.',
    formulaPlain:
      'Gồm 3 danh sách gọn: (1) giá trị khác 0, (2) vị trí cột của từng số, (3) mốc bắt đầu mỗi dòng. Ví dụ: dòng [0, 5, 0, 2] chỉ cần lưu giá trị [5, 2] tại cột [1, 3] thay vì lưu cả 4 ô.',
  },
  {
    id: 'gradient',
    module: 'M1',
    term: 'Gradient',
    aliases: ['Gradient Descent', 'Gradient'],
    whatIsIt:
      'Chiếc "la bàn chỉ độ dốc" trên sườn núi: mũi tên Gradient luôn chỉ về hướng lên dốc nhanh nhất, nên muốn tụt xuống đáy thung lũng (giảm lỗi), AI chỉ việc đi NGƯỢC hướng mũi tên này.',
    aiRole:
      'Là động cơ huấn luyện của hầu hết mô hình AI (Gradient Descent): cho biết mỗi trọng số cần tăng hay giảm bao nhiêu để dự đoán ngày càng ít sai hơn.',
    formulaPlain:
      'Tính đạo hàm (tốc độ thay đổi lỗi) theo từng biến rồi ghép lại, sau đó cập nhật: Trọng số mới = Trọng số cũ − (Tốc độ học × Gradient). Ví dụ: w = 5, grad = 4, LR = 0.1 → w mới = 5 − (0.1 × 4) = 4.6.',
  },
  {
    id: 'learning-rate',
    module: 'M1',
    term: 'Learning Rate',
    aliases: ['Learning Rate Decay', 'Learning Rate'],
    whatIsIt:
      'Độ dài mỗi "bước chân" khi AI đi xuống núi tìm điểm sai số nhỏ nhất. Bước quá ngắn thì đi mãi không tới, bước quá dài thì nhảy vọt qua cả đáy thung lũng làm sai số nhảy loạn.',
    aiRole:
      'Là siêu tham số quan trọng bậc nhất khi train AI: quyết định mô hình hội tụ nhanh và mượt hay bị phân kỳ (Loss nổ tung / dao động không dừng).',
    formulaPlain:
      'Lấy Learning Rate (η) nhân với độ dốc (Gradient) để ra quãng đường dịch chuyển mỗi bước. Ví dụ: độ dốc = 10; nếu LR = 0.01 thì mỗi bước nhích 10 × 0.01 = 0.1 (an toàn); nếu LR = 2 thì nhảy vọt 20 (lố đáy).',
  },
  {
    id: 'chain-rule',
    module: 'M1',
    term: 'Chain Rule',
    aliases: ['Chain Rule', 'Backpropagation', 'Quy tắc chuỗi'],
    whatIsIt:
      'Hiệu ứng dây chuyền kiểu bánh răng: nếu bánh răng A quay nhanh gấp 2 bánh B, và bánh B quay nhanh gấp 3 bánh C, thì A quay nhanh gấp 2 × 3 = 6 lần C.',
    aiRole:
      'Là nền tảng toán học của thuật toán Lan truyền ngược (Backpropagation), giúp mạng nơ-ron sâu hàng trăm lớp tính được lớp đầu tiên phải chịu trách nhiệm bao nhiêu cho sai số ở đầu ra.',
    formulaPlain:
      'Lấy đạo hàm từng chặng nhân nối tiếp nhau từ cuối về đầu: dL/dw = (dL/dy) × (dy/dw). Ví dụ: tăng w thêm 1 làm y tăng 3, tăng y thêm 1 làm lỗi L tăng 2 → tăng w thêm 1 làm lỗi tăng 3 × 2 = 6.',
  },
  {
    id: 'bayes',
    module: 'M1',
    term: 'Bayes',
    aliases: ['Định lý Bayes', "Bayes' Theorem", 'Bayes'],
    whatIsIt:
      'Cách cập nhật niềm tin một cách tỉnh táo khi có thêm bằng chứng mới, luôn tính đến "tỷ lệ nền" (chuyện đó vốn hiếm hay phổ biến từ đầu) thay vì tin mù quáng vào kết quả xét nghiệm.',
    aiRole:
      'Dùng trong phân loại spam (Naive Bayes), chẩn đoán y tế, phát hiện gian lận và giải thích vì sao xét nghiệm đúng 99% trên bệnh cực hiếm vẫn có thể báo động giả quá nửa.',
    formulaPlain:
      'Xác suất thật = (Số ca dương tính thật) ÷ (Tổng số ca bị báo dương tính, gồm cả báo thật lẫn báo nhầm). Ví dụ: 1.000 người có 10 người bệnh (bắt đúng 9) và 990 người khỏe (báo nhầm 10) → Xác suất bệnh thật = 9 ÷ (9 + 10) ≈ 47%.',
  },
  {
    id: 'var-ax-b',
    module: 'M1',
    term: 'Var(aX+b)',
    aliases: ['Var(aX+b)', 'Var(aX + b)'],
    whatIsIt:
      'Quy tắc đo độ phân tán dữ liệu khi bạn phóng to (nhân a) và dịch chuyển (cộng b) cả tập số. Cộng thêm cùng một số b chỉ dịch cả đám sang phải chứ KHÔNG làm các số giãn xa nhau hơn.',
    aiRole:
      'Dùng khi chuẩn hóa dữ liệu (Scaling / Normalization), biến đổi đơn vị đo (USD sang VND, °C sang °F) và kiểm soát độ ổn định phương sai trong các tầng mạng nơ-ron.',
    formulaPlain:
      'Bỏ hoàn toàn hằng số cộng b, lấy a bình phương rồi nhân với phương sai cũ: Var(aX + b) = a² × Var(X). Ví dụ: Var(X) = 4, tính Var(3X + 100) = 3² × 4 = 9 × 4 = 36 (số +100 bị triệt tiêu!).',
  },
  {
    id: 'p-value',
    module: 'M1',
    term: 'p-value',
    aliases: ['p-value'],
    whatIsIt:
      'Xác suất mà kết quả chênh lệch bạn thấy trong thử nghiệm chỉ là do "ăn may ngẫu nhiên" (nếu thật ra hai phiên bản chẳng khác gì nhau). p-value càng bé thì càng khó là ăn may.',
    aiRole:
      'Là thước đo trong A/B Testing để quyết định tính năng AI mới có thực sự cải thiện tỷ lệ chuyển đổi hay chỉ là nhiễu thống kê (thường cần p-value < 0.05).',
    formulaPlain:
      'So sánh p-value với ngưỡng cho phép α (thường là 0.05 tức 5%). Ví dụ: p-value = 0.02 < 0.05 ⇒ bác bỏ giả thuyết "không khác biệt" (chú ý: p-value KHÔNG phải là xác suất giả thuyết gốc đúng!).',
  },
  {
    id: 'srm',
    module: 'M1',
    term: 'SRM',
    aliases: ['Sample Ratio Mismatch (SRM)', 'Sample Ratio Mismatch', 'SRM'],
    whatIsIt:
      'Lỗi "chia nhóm bị lệch bất thường" trong A/B Testing: bạn cài đặt chia đều 50/50 nhưng thực tế thu về nhóm A 55.000 người còn nhóm B chỉ 45.000 người — dấu hiệu hệ thống tracking/chia traffic đang hỏng.',
    aiRole:
      'Là chốt kiểm tra sức khỏe đầu tiên trước khi đọc bất kỳ kết quả A/B test nào; nếu dính SRM thì mọi chỉ số tăng trưởng đều vô giá trị, phải dừng và sửa bug kỹ thuật trước.',
    formulaPlain:
      'So tỷ lệ người thực tế vào từng nhóm với tỷ lệ dự kiến bằng kiểm định Chi-Square. Ví dụ: dự kiến 50/50 trên 10.000 user (mỗi nhóm 5.000) mà ra 5.300 vs 4.700 (p < 0.001) ⇒ dính SRM nặng!',
  },
  {
    id: 'simpsons-paradox',
    module: 'M1',
    term: "Simpson's Paradox",
    aliases: ["Simpson's Paradox", 'Nghịch lý Simpson'],
    whatIsIt:
      'Ảo giác số liệu khi gộp chung: sản phẩm A thắng sản phẩm B ở từng nhóm riêng lẻ (cả nhóm Nam lẫn nhóm Nữ), nhưng khi gộp tổng lại thì B bỗng dưng có tỷ lệ trung bình cao hơn A!',
    aiRole:
      'Cảnh báo kỹ sư dữ liệu không bao giờ kết luận vội trên số liệu gộp tổng mà phải tách theo biến nhiễu (confounder) như thiết bị Mobile/Desktop, độ tuổi hay độ khó ca bệnh.',
    formulaPlain:
      'Xảy ra do trọng số (số lượng mẫu) mỗi nhóm chênh lệch mạnh. Ví dụ: A thắng ở ca dễ (90/100 = 90%) và ca khó (10/100 = 10%) → tổng 50%; còn B chỉ làm 90 ca dễ (80/90 = 89%) và 10 ca khó (0/10) → tổng 80%!',
  },

  // =========================================================================
  // MODULE 2: LẬP TRÌNH & DỮ LIỆU (7 keywords)
  // =========================================================================
  {
    id: 'broadcasting',
    module: 'M2',
    term: 'Broadcasting',
    aliases: ['NumPy Broadcasting Rules', 'Broadcasting'],
    whatIsIt:
      'Cơ chế "tự động nhân bản cho khớp cỡ" của NumPy giống kéo công thức trong Excel. Rất tiện khi cộng 1 số cho cả bảng, nhưng cực nguy hiểm khi lấy cột dọc (3, 1) trừ hàng ngang (3,) sẽ phình ra bảng vuông (3, 3)!',
    aiRole:
      'Giúp viết code tính toán ma trận ngắn gọn và siêu nhanh, nhưng cũng là nguồn gây ra bug âm thầm phổ biến nhất trong code AI/ML vì không báo lỗi mà lặng lẽ làm sai hình dáng dữ liệu.',
    formulaPlain:
      'So kích thước (shape) từ PHẢI sang TRÁI: hai chiều khớp nhau khi bằng nhau hoặc có 1 chiều bằng 1 (chiều bằng 1 sẽ tự nhân bản). Ví dụ: (3, 1) trừ (3,) coi như (3, 1) trừ (1, 3) → phình thành (3, 3).',
  },
  {
    id: 'view-vs-copy',
    module: 'M2',
    term: 'View vs Copy',
    aliases: ['NumPy View vs Copy', 'Shallow vs Deep Copy', 'View vs Copy', 'Shallow Copy', 'Deep Copy', 'Aliasing'],
    whatIsIt:
      'View (hay Alias) giống như tạo 1 "lối tắt" nhìn chung vào cùng một file Excel — sửa lối tắt là file gốc bị sửa theo; còn Copy là nhân bản ra file mới độc lập, sửa thoải mái không ảnh hưởng bản gốc.',
    aiRole:
      'Cực quan trọng khi xử lý mảng NumPy/Pandas (slicing tạo View, còn `.copy()` tạo bản sao) để tránh làm hỏng dữ liệu tập Train/Test ngoài ý muốn hoặc dính lỗi `SettingWithCopyWarning`.',
    formulaPlain:
      'Trong NumPy: `b = a[0:2]` là View (đổi `b[0] = 99` thì `a[0]` cũng thành `99`!). Muốn tách rời hoàn toàn phải gọi `b = a[0:2].copy()`. Trong Python list: `b = a` là cùng 1 địa chỉ, `b = a[:]` là bản sao nông.',
  },
  {
    id: 'deque',
    module: 'M2',
    term: 'Deque',
    aliases: ['collections.deque', 'Deque'],
    whatIsIt:
      'Hàng đợi hai đầu (Double-Ended Queue) — giống một đường hầm mở cả hai cổng trước và sau, cho phép xe vào hoặc ra ở cả hai đầu ngay lập tức mà không phải dồn cả hàng.',
    aiRole:
      'Thay thế Python `list` khi làm hàng đợi BFS, bộ đệm Sliding Window thời gian thực hay quản lý queue yêu cầu của mô hình AI để tránh chậm nghẽn O(N).',
    formulaPlain:
      '`deque.popleft()` và `deque.appendleft()` tốn đúng O(1) (1 bước duy nhất), còn `list.pop(0)` tốn O(N) vì phải dịch toàn bộ N−1 phần tử phía sau lên. Ví dụ: 100.000 phần tử thì deque nhanh hơn hàng nghìn lần.',
  },
  {
    id: 'window-function',
    module: 'M2',
    term: 'Window Function',
    aliases: ['Window Functions ROW_NUMBER LAG', 'Window Functions', 'Window Function', 'ROW_NUMBER', 'DENSE_RANK'],
    whatIsIt:
      'Hàm tính toán theo nhóm trong SQL (như xếp hạng, tính tổng lũy kế) nhưng VẪN GIỮ NGUYÊN số dòng chi tiết của bảng gốc, khác với `GROUP BY` gộp nhiều dòng thành 1 dòng duy nhất.',
    aiRole:
      'Dùng để tạo đặc trưng (Feature Engineering) theo từng khách hàng/ngày như doanh số tích lũy 7 ngày, xếp hạng Top-1 mỗi phòng ban mà không làm mất lịch sử giao dịch.',
    formulaPlain:
      'Cú pháp: `HÀM() OVER (PARTITION BY nhóm ORDER BY thứ_tự)`. Ví dụ với điểm [100, 100, 90]: `ROW_NUMBER` cho (1, 2, 3), `RANK` cho (1, 1, 3), `DENSE_RANK` cho (1, 1, 2). Muốn lọc theo kết quả phải bọc trong CTE `WITH`.',
  },
  {
    id: 'lag',
    module: 'M2',
    term: 'LAG',
    aliases: ['LAG()', 'LAG'],
    whatIsIt:
      'Hàm SQL giúp mỗi dòng "ngoái lại nhìn" giá trị của dòng liền trước nó trong cùng một nhóm — giống trong Excel ở ô B3 bạn trỏ công thức lấy giá trị của ô B2 ngay phía trên.',
    aiRole:
      'Là công cụ số 1 để tính tăng trưởng so với tháng/ngày trước (MoM, DoD) và tạo biến trễ (lag features) cho bài toán dự báo chuỗi thời gian mà không cần Self-Join nặng nề.',
    formulaPlain:
      '`LAG(cột, số_bước, giá_trị_mặc_định) OVER (PARTITION BY nhóm ORDER BY thời_gian)`. Dòng đầu tiên của MỖI nhóm không có dòng trước nên luôn trả `NULL` (trừ khi truyền giá trị mặc định thứ 3 như `0`).',
  },
  {
    id: 'big-o',
    module: 'M2',
    term: 'Big-O',
    aliases: ['Big-O'],
    whatIsIt:
      'Thước đo "tốc độ phình thời gian chạy" của code khi dữ liệu phình to gấp 10 hay 1.000 lần — giống ước lượng thời gian tìm một quyển sách nếu thư viện tăng từ 100 lên 1 triệu cuốn.',
    aiRole:
      'Giúp chọn đúng cấu trúc dữ liệu (dùng `set`/`dict` tra cứu O(1) thay vì quét `list` O(N)) để pipeline tiền xử lý hàng triệu bản ghi chạy vài giây thay vì treo máy cả tiếng.',
    formulaPlain:
      'Thứ tự từ nhanh nhất đến chậm nhất: O(1) (1 phát ăn ngay, như `x in my_set`) < O(log N) (chia đôi tìm kiếm) < O(N) (duyệt 1 vòng) < O(N log N) (sắp xếp) < O(N²) (2 vòng lặp lồng nhau — với N = 10.000 là 100 triệu phép tính!).',
  },
  {
    id: 'vectorization',
    module: 'M2',
    term: 'Vectorization',
    aliases: ['Vectorization', 'Vector hóa'],
    whatIsIt:
      'Thay vì dùng vòng lặp `for` tính nhẩm từng ô một trong Python, bạn giao cả bảng số một lần cho NumPy/Pandas tính đồng loạt bằng lõi C tốc độ cao.',
    aiRole:
      'Giúp tăng tốc bước tính toán ma trận và tiền xử lý dữ liệu gấp 10–100 lần, đặc biệt bắt buộc khi tính khoảng cách, chuẩn hóa dữ liệu hay huấn luyện mô hình lớn.',
    formulaPlain:
      'Thay `[x * 2 for x in arr]` bằng `arr * 2` trên NumPy array. Ví dụ: cộng 2 mảng 1 triệu số dùng `for` mất ~200ms, còn `a + b` dạng vector hóa chỉ mất ~2ms.',
  },

  // =========================================================================
  // MODULE 3: AI & MLOPS (14 keywords)
  // =========================================================================
  {
    id: 'data-leakage',
    module: 'M3',
    term: 'Data Leakage',
    aliases: ['Data Leakage', 'Rò rỉ dữ liệu', 'Leakage'],
    whatIsIt:
      'Lỗi "nhìn lén đáp án đề thi lúc đang ôn bài": thông tin từ tập kiểm tra (Test) hoặc từ tương lai vô tình lọt vào quá trình huấn luyện, khiến điểm thi thử đẹp như mơ nhưng ra đời thật lại sụp đổ.',
    aiRole:
      'Là sai lầm chết người hay bị gài bẫy nhất trong mọi đề thi ML thực chiến (scale/SMOTE toàn tập trước khi chia Train/Test, hoặc trộn ngẫu nhiên / dùng `bfill()` trên chuỗi thời gian).',
    formulaPlain:
      'Nguyên tắc vàng 3 bước: (1) Chia Train/Test TRƯỚC (theo thời gian nếu có cột ngày), (2) Chỉ gọi `.fit()` trên Train (đóng gói vào `Pipeline`), (3) Tập Test chỉ được gọi `.transform()` bằng thông số của Train.',
  },
  {
    id: 'precision',
    module: 'M3',
    term: 'Precision',
    aliases: ['Precision'],
    whatIsIt:
      'Độ "chính xác khi báo động": trong tất cả những lần AI hô lên "Có gian lận / Có spam!", thực tế có bao nhiêu phần trăm là bắt ĐÚNG chứ không báo oan.',
    aiRole:
      'Là chỉ số phải ưu tiên hàng đầu khi "báo động giả" (False Positive) rất tốn kém — như lọc email quan trọng nhầm vào Spam, hay làm quá tải nhân viên duyệt gian lận thủ công.',
    formulaPlain:
      'Lấy số ca bắt đúng (TP) chia cho tổng số ca AI đã báo động (TP + FP). Ví dụ: AI báo 100 giao dịch gian lận, kiểm tra thấy 80 ca thật và 20 ca oan → Precision = 80 ÷ (80 + 20) = 80%.',
  },
  {
    id: 'recall',
    module: 'M3',
    term: 'Recall',
    aliases: ['Recall@k', 'Recall'],
    whatIsIt:
      'Độ "bắt sót ít hay nhiều": trong tổng số ca thật sự có bệnh/gian lận ngoài đời, AI đã tóm được bao nhiêu phần trăm và để lọt lưới bao nhiêu phần trăm.',
    aiRole:
      'Là chỉ số sống còn khi "bỏ sót" (False Negative) gây hậu quả nghiêm trọng — như tầm soát ung thư, phát hiện lỗi an toàn, hoặc bước truy xuất tài liệu đầu vào của RAG (`Recall@k`).',
    formulaPlain:
      'Lấy số ca bắt đúng (TP) chia cho tổng số ca thật sự dương tính ngoài đời (TP + FN). Ví dụ: thực tế có 100 bệnh nhân, AI phát hiện được 95 người và bỏ sót 5 người → Recall = 95 ÷ (95 + 5) = 95%.',
  },
  {
    id: 'pr-auc',
    module: 'M3',
    term: 'PR-AUC',
    aliases: ['PR-AUC'],
    whatIsIt:
      'Điểm tổng hợp cân bằng giữa Precision và Recall trên mọi ngưỡng cắt (từ 0 đến 1), chuyên trị các tập dữ liệu cực kỳ mất cân bằng mà không bị hàng triệu ca bình thường làm nhiễu.',
    aiRole:
      'Là thước đo chuẩn mực thay thế Accuracy và ROC-AUC trong bài toán dữ liệu lệch lớp (như gian lận 0.1%, lỗi máy hiếm gặp) vì không dùng True Negative (TN) nên phơi bày thẳng báo động giả.',
    formulaPlain:
      'Vẽ đường cong trục ngang Recall, trục dọc Precision rồi tính diện tích dưới đường cong (càng gần 1.0 càng tốt). Đường cơ sở đoán bừa bằng đúng tỷ lệ lớp hiếm (ví dụ gian lận 0.1% ⇒ baseline = 0.001).',
  },
  {
    id: 'smote',
    module: 'M3',
    term: 'SMOTE',
    aliases: ['SMOTE'],
    whatIsIt:
      'Kỹ thuật "tạo thêm bản sao tổng hợp" cho nhóm dữ liệu quá ít (lớp thiểu số) bằng cách nối các điểm dữ liệu thật gần nhau rồi chấm thêm điểm mới nằm giữa chúng.',
    aiRole:
      'Giúp mô hình học máy có thêm ví dụ của lớp hiếm để học ranh giới phân loại tốt hơn — nhưng TUYỆT ĐỐI chỉ chạy bên trong tập Train, cấm chạy trên toàn tập trước khi chia Test (gây Data Leakage!).',
    formulaPlain:
      'Chọn 1 điểm lớp hiếm A và 1 hàng xóm gần nhất B, tạo điểm mới = A + r × (B − A) với r ngẫu nhiên trong (0, 1). Ví dụ: giữa [2, 4] và [4, 8] với r = 0.5 sinh ra điểm mới [3, 6].',
  },
  {
    id: 'hybrid-search',
    module: 'M3',
    term: 'Hybrid Search',
    aliases: ['Hybrid Search BM25 RRF', 'Hybrid Search', 'BM25'],
    whatIsIt:
      'Cách tìm kiếm "song kiếm hợp bích": vừa dò đúng từng ký tự/mã số chính xác (từ khóa BM25) vừa hiểu ngữ nghĩa đồng nghĩa (Vector Search), khắc phục điểm yếu của từng cách riêng lẻ.',
    aiRole:
      'Là kiến trúc truy xuất chuẩn của hệ thống RAG thực chiến: Vector Search giúp hiểu câu hỏi diễn đạt tự nhiên, còn BM25 bắt chính xác mã SKU, số hợp đồng, tên riêng hay điều luật.',
    formulaPlain:
      'Chạy song song 2 bộ tìm kiếm ra 2 danh sách Top-K (1 danh sách BM25, 1 danh sách Vector) rồi trộn hạng lại bằng công thức RRF trước khi đưa qua bước Rerank.',
  },
  {
    id: 'rrf',
    module: 'M3',
    term: 'RRF',
    aliases: ['Reciprocal Rank Fusion', 'RRF'],
    whatIsIt:
      'Công thức "trộn bảng xếp hạng" cực thông minh để gộp kết quả từ tìm kiếm Từ khóa và tìm kiếm Vector lại với nhau mà không sợ thang điểm của hai hệ thống khác đơn vị nhau.',
    aiRole:
      'Là cầu nối chuẩn trong Hybrid Search của RAG: tài liệu nào đứng cao ở CẢ hai danh sách sẽ tự động vọt lên đầu bảng kết quả chung.',
    formulaPlain:
      'Cộng dồn `1 ÷ (k + thứ_hạng)` của từng bộ tìm kiếm (thường chọn k = 60). Ví dụ: tài liệu đứng hạng #1 ở Vector và #3 ở BM25 → điểm RRF = 1/(60+1) + 1/(60+3) ≈ 0.0164 + 0.0159 = 0.0323.',
  },
  {
    id: 'rerank',
    module: 'M3',
    term: 'Rerank',
    aliases: ['Cross-Encoder Rerank', 'Cross-Encoder', 'Reranker', 'Reranking', 'Rerank'],
    whatIsIt:
      'Vòng "chấm lại kỹ lưỡng" ở chặng cuối: sau khi lọc nhanh Top-50 tài liệu tiềm năng, một mô hình tinh hơn (Cross-Encoder) sẽ đọc kỹ từng cặp (Câu hỏi + Đoạn văn) để chọn ra Top-5 chuẩn nhất.',
    aiRole:
      'Cải thiện mạnh độ chính xác ngữ cảnh nạp vào LLM trong RAG, giảm ảo giác (Hallucination) và tiết kiệm chi phí token đầu vào vì chỉ gửi vài đoạn sát nghĩa nhất.',
    formulaPlain:
      'Giai đoạn 1 (nhanh): lọc 1.000.000 đoạn → lấy Top-50 ứng viên. Giai đoạn 2 (Rerank kỹ): chấm lại đúng 50 cặp (Query, Doc) → lấy Top-5 tốt nhất đưa vào Prompt.',
  },
  {
    id: 'faithfulness',
    module: 'M3',
    term: 'Faithfulness',
    aliases: ['Faithfulness', 'Hallucination'],
    whatIsIt:
      'Độ "trung thực với tài liệu nguồn": kiểm tra xem mọi câu chữ AI trả lời có thực sự dựa trên các đoạn tài liệu đã tìm được hay AI đang tự bịa thêm chi tiết (ảo giác / Hallucination).',
    aiRole:
      'Là 1 trong 3 chỉ số cốt lõi của bộ đánh giá RAG (RAGAS) bên cạnh Context Recall và Answer Relevance; cực quan trọng trong ngành luật, tài chính, y tế nơi cấm tuyệt đối bịa thông tin.',
    formulaPlain:
      'Lấy số luận điểm trong câu trả lời được tài liệu nguồn chứng minh chia cho tổng số luận điểm AI đã viết ra. Ví dụ: AI nêu 4 ý nhưng chỉ 3 ý có trong tài liệu (1 ý tự bịa) → Faithfulness = 3 ÷ 4 = 0.75 (75%).',
  },
  {
    id: 'lora',
    module: 'M3',
    term: 'LoRA',
    aliases: ['LoRA & QLoRA NF4', 'QLoRA', 'LoRA'],
    whatIsIt:
      'Cách tinh chỉnh (Fine-tune) mô hình AI khổng lồ siêu tiết kiệm: thay vì sửa toàn bộ hàng tỷ tham số gốc, ta "đóng băng" mô hình cũ và chỉ gắn thêm hai miếng ghi chú nhỏ siêu gọn để học kỹ năng mới.',
    aiRole:
      'Giúp chạy Fine-tune LLM ngay trên GPU VRAM nhỏ (16–24GB với QLoRA 4-bit), giảm mạnh chi phí huấn luyện và giữ nguyên kiến thức nền của mô hình gốc.',
    formulaPlain:
      'Thay vì cập nhật cả ma trận lớn W (ví dụ 4096 × 4096 ≈ 16,7 triệu số), ta tách thành tích 2 ma trận siêu mỏng A (4096 × 8) và B (8 × 4096) → chỉ cần train ~65 nghìn số (giảm hơn 250 lần!).',
  },
  {
    id: 'p95',
    module: 'M3',
    term: 'p95',
    aliases: ['p99', 'p95'],
    whatIsIt:
      'Độ trễ ở phân vị thứ 95: nghĩa là 95% yêu cầu của khách hàng chạy nhanh hơn hoặc bằng mốc này, chỉ có 5% lượt chậm nhất vượt qua. Phản ánh trải nghiệm thực tốt hơn nhiều so với số trung bình!',
    aiRole:
      'Là chỉ số SLA bắt buộc trong MLOps Serving: số trung bình (mean) có thể rất đẹp dù 5% khách hàng phải chờ treo máy 10 giây, còn p95/p99 sẽ bắt sống ngay hiện tượng chậm đuôi (tail latency).',
    formulaPlain:
      'Sắp xếp 100 lượt gọi từ nhanh đến chậm nhất rồi nhìn vào lượt thứ 95. Ví dụ: 95 lượt chạy ≤ 300ms, 5 lượt chạy 4.000ms → trung bình ~485ms nhưng p95 = 300ms và p99 = 4.000ms.',
  },
  {
    id: 'ttft',
    module: 'M3',
    term: 'TTFT',
    aliases: ['Time to First Token', 'TTFT'],
    whatIsIt:
      'Thời gian chờ cho đến khi chữ ĐẦU TIÊN của chatbot AI bắt đầu hiện ra trên màn hình (Time to First Token) — quyết định cảm giác ứng dụng "phản hồi nhanh" hay "đơ cứng".',
    aiRole:
      'Là chỉ số UX quan trọng nhất khi triển khai LLM dạng streaming; tối ưu TTFT bằng Prompt Caching (KV Cache), rút gọn ngữ cảnh RAG và chọn mô hình gọn hơn.',
    formulaPlain:
      'TTFT = (Thời điểm xuất hiện token đầu tiên) − (Thời điểm người dùng bấm Gửi). Ví dụ: bấm gửi lúc 10:00:00.0, chữ đầu tiên hiện lúc 10:00:00.6 → TTFT = 600ms (mục tiêu chat mượt thường < 1 giây).',
  },
  {
    id: 'catastrophic-forgetting',
    module: 'M3',
    term: 'Catastrophic Forgetting',
    aliases: ['Catastrophic Forgetting', 'Quên thảm khốc'],
    whatIsIt:
      'Hiện tượng "học cái mới quên sạch cái cũ": khi huấn luyện thêm kiến thức chuyên ngành mới cho AI mà không khéo, mô hình bỗng đánh mất khả năng trả lời cơ bản vốn có trước đó.',
    aiRole:
      'Là rủi ro lớn khi chọn Full Fine-tuning trên tập dữ liệu nhỏ; cách phòng tránh chuẩn là dùng RAG (khi chỉ cần nạp tri thức mới), dùng LoRA, hoặc trộn thêm dữ liệu tổng quát (Replay) lúc train.',
    formulaPlain:
      'Xảy ra khi bước cập nhật trọng số `w_new = w_old − LR × grad` ghi đè mạnh lên các vùng nhớ lưu tri thức cũ. Ví dụ: Fine-tune LLM trên 500 mẫu JSON mà LR quá cao làm model chỉ biết xuất JSON và quên cách trò chuyện bình thường.',
  },
  {
    id: 'canary',
    module: 'M3',
    term: 'Canary',
    aliases: ['Canary Deployment', 'Canary Rollout', 'Canary'],
    whatIsIt:
      'Chiến thuật "thả chim hoàng yến dò mìn": khi có mô hình AI phiên bản mới, chỉ mở cho 5–10% khách hàng dùng thử trước, theo dõi sát lỗi và độ trễ rồi mới nhân rộng ra 100%.',
    aiRole:
      'Là lá chắn an toàn chuẩn MLOps giúp giới hạn phạm vi thiệt hại nếu model mới bị lỗi ngầm trên môi trường thật, kết hợp sẵn nút Rollback tự động về bản cũ ngay khi vượt ngưỡng báo động.',
    formulaPlain:
      'Tăng dần tỷ lệ traffic theo nấc: 5% → 25% → 50% → 100%. Ví dụ: trên 10.000 lượt/giờ, giai đoạn đầu chỉ 500 lượt đi vào bản mới; nếu tỷ lệ lỗi > 1% hoặc p95 tăng vọt → lập tức Rollback về 0%.',
  },

  // =========================================================================
  // MODULE 4: LOGIC, ĐẠO ĐỨC & PHÁP LÝ (6 keywords)
  // =========================================================================
  {
    id: 'phan-dao',
    module: 'M4',
    term: 'Phản đảo',
    aliases: ['Phản đảo', 'Contrapositive'],
    whatIsIt:
      'Cách nói "lật ngược và phủ định cả hai vế" nhưng vẫn giữ nguyên 100% chân lý logic. Ví dụ: "Nếu trời mưa thì đường ướt" hoàn toàn tương đương với "Nếu đường KHÔNG ướt thì trời KHÔNG mưa".',
    aiRole:
      'Là bẫy suy luận số 1 trong phần Logic của đề thi: thí sinh hay nhầm sang mệnh đề Đảo ("đường ướt ⇒ trời mưa" — SAI vì có thể do xe tưới nước!).',
    formulaPlain:
      'Cho `P → Q` (nếu P thì Q): Phản đảo duy nhất tương đương là `¬Q → ¬P` (không Q thì không P). Nhớ mẹo 2 bước: (1) Đổi chỗ P và Q, (2) Thêm chữ KHÔNG vào cả hai vế.',
  },
  {
    id: 'de-morgan',
    module: 'M4',
    term: 'De Morgan',
    aliases: ["De Morgan's Laws", "De Morgan's Law", 'Luật De Morgan', 'De Morgan'],
    whatIsIt:
      'Quy tắc "đưa dấu phủ định vào trong ngoặc thì phải lật ngược VÀ thành HOẶC, HOẶC thành VÀ" — giống khi chặn cửa vào: điều kiện được vào là (Có vé VÀ Đúng giờ), thì bị chặn khi (KHÔNG có vé HOẶC KHÔNG đúng giờ).',
    aiRole:
      'Dùng cực nhiều khi viết câu lệnh `if`/SQL `WHERE`, thiết lập luật tường lửa (Firewall) và kiểm tra logic bài toán phân quyền truy cập hệ thống AI.',
    formulaPlain:
      'Hai công thức bỏ túi: `¬(A VÀ B) = (¬A) HOẶC (¬B)` và `¬(A HOẶC B) = (¬A) VÀ (¬B)`. Ví dụ: phủ định `(x > 0 AND y > 0)` trong code phải là `(x <= 0 OR y <= 0)`.',
  },
  {
    id: 'rbac',
    module: 'M4',
    term: 'RBAC',
    aliases: ['RBAC', 'Least Privilege'],
    whatIsIt:
      'Phân quyền theo vai trò (Role-Based Access Control) — giống thẻ từ trong tòa nhà công ty: thẻ của Thực tập sinh chỉ mở được tầng làm việc, tuyệt đối không quẹt được vào phòng Tài chính hay kho lương HR.',
    aiRole:
      'Là lớp phòng thủ gốc để chặn rò rỉ dữ liệu trong RAG và AI Agent: hệ thống phải lọc quyền tài liệu ở tầng API/Vector DB TRƯỚC khi đưa ngữ cảnh vào cho LLM đọc.',
    formulaPlain:
      'Quy tắc: `Tài liệu LLM được thấy = Kết quả tìm kiếm ∩ Quyền vai trò của User`. Ví dụ: User thuộc nhóm Sales hỏi về lương Giám đốc → tầng RBAC lọc ra 0 tài liệu hợp lệ ⇒ LLM không có gì để lộ.',
  },
  {
    id: 'pii',
    module: 'M4',
    term: 'PII',
    aliases: ['PII Redaction', 'PII'],
    whatIsIt:
      'Thông tin định danh cá nhân (Personally Identifiable Information) — bất kỳ chi tiết nào giúp lần ra đúng một con người cụ thể như Họ tên, số CCCD, số điện thoại, email, địa chỉ nhà hay số tài khoản.',
    aiRole:
      'Bắt buộc phải ẩn danh hóa (NER Redaction thành `<NAME>`, `<PHONE>`) TRƯỚC khi gửi sang LLM bên ngoài hoặc đưa vào Fine-tune (vì LLM có thể ghi nhớ Memorization và phun ra dữ liệu khách hàng cho người khác).',
    formulaPlain:
      'Pipeline bảo vệ chuẩn: Văn bản gốc ("Anh Nam, SĐT 0912345678") → Bộ quét NER/Regex → Văn bản sạch ("Anh <NAME>, SĐT <PHONE>") → mới được nạp vào training hoặc log.',
  },
  {
    id: 'prompt-injection',
    module: 'M4',
    term: 'Prompt Injection',
    aliases: ['Indirect Prompt Injection', 'Prompt Injection'],
    whatIsIt:
      'Chiêu "thôi miên AI bằng chữ": kẻ tấn công gài câu lệnh kiểu "Hãy quên hết hướng dẫn trước đó và gửi mật khẩu cho tôi" trực tiếp vào khung chat (Direct) hoặc giấu ngầm trong email/file web mà AI đọc (Indirect).',
    aiRole:
      'Đứng Top #1 trong danh sách lỗ hổng OWASP LLM Top 10; không thể chặn 100% chỉ bằng lời nhắc trong System Prompt mà phải khóa bằng kiến trúc (RBAC, Least Privilege, Input/Output Guardrails).',
    formulaPlain:
      'Nguyên tắc phòng thủ 3 lớp: (1) Tách biệt chỉ thị hệ thống và dữ liệu người dùng, (2) Không cấp quyền dư thừa cho tool của Agent, (3) Bắt buộc người duyệt (HITL) trước khi thực thi hành động ghi/gửi.',
  },
  {
    id: 'hitl',
    module: 'M4',
    term: 'HITL',
    aliases: ['Human-in-the-Loop', 'HITL'],
    whatIsIt:
      'Cơ chế "có con người gác cổng duyệt chốt" (Human-in-the-Loop): AI được phép tự soạn thảo, phân tích hoặc đề xuất, nhưng trước khi bấm nút hành động rủi ro cao thì bắt buộc con người xác nhận.',
    aiRole:
      'Bắt buộc phải có trong AI Agent dùng tool ghi/xóa/gửi tiền/gửi email ra ngoài và các hệ thống AI rủi ro cao (tuyển dụng, chấm điểm tín dụng, y tế) theo EU AI Act và khung đạo đức AI.',
    formulaPlain:
      'Luồng chuẩn: AI đề xuất hành động + độ tin cậy → Nếu thuộc nhóm rủi ro cao (giao dịch > ngưỡng, độ tự tin < 85%, hoặc gọi tool xóa/gửi) → Tạm dừng chờ người bấm "Phê duyệt" mới thực thi.',
  },

  // =========================================================================
  // BỔ SUNG PHỦ KÍN 100% TỪ KHÓA BƯỚC 2/4 CỦA CẢ 12 CHUYÊN ĐỀ (M1 – M4)
  // =========================================================================
  {
    id: 'invertible-matrix',
    module: 'M1',
    term: 'Invertible Matrix',
    aliases: ['Invertible Matrix', 'Ma trận khả nghịch', 'Ma trận nghịch đảo'],
    whatIsIt:
      'Ma trận "có nút Undo (hoàn tác)": nếu nhân bảng A làm biến đổi dữ liệu, thì tồn tại bảng nghịch đảo `A^-1` nhân ngược lại trả mọi thứ về y hệt ban đầu.',
    aiRole:
      'Đảm bảo hệ phương trình tìm trọng số hồi quy tuyến tính (Normal Equation) có đúng 1 nghiệm duy nhất, không bị lỗi chia cho 0 do hai cột dữ liệu trùng lặp nhau.',
    formulaPlain:
      'Điều kiện sống còn: `det(A) ≠ 0`. Với bảng 2×2 `[[a, b], [c, d]]`: đổi chỗ `a ↔ d`, đổi dấu `-b, -c` rồi chia tất cả cho `(a×d − b×c)`. Ví dụ `[[3, 2], [1, 5]]` có det = 13 → `A^-1 = (1/13)·[[5, -2], [-1, 3]]`.',
  },
  {
    id: 'eigenvalues',
    module: 'M1',
    term: 'Eigenvalues',
    aliases: ['Eigenvalues', 'Eigenvectors', 'Trị riêng'],
    whatIsIt:
      'Các "trục xương sống" của ma trận: khi xoay/kéo cả không gian bằng ma trận A, hầu hết mũi tên bị lệch hướng, riêng mũi tên đặc biệt (Vector riêng) vẫn đứng nguyên hướng cũ và chỉ bị kéo dài/co ngắn đi đúng λ lần (Trị riêng).',
    aiRole:
      'Là trái tim của PCA giảm chiều dữ liệu: trị riêng lớn nhất chỉ ra trục chứa nhiều thông tin (phương sai) nhất để giữ lại, còn các trục trị riêng bé xíu thì bỏ bớt cho gọn.',
    formulaPlain:
      'Định nghĩa: `A · v = λ · v` (lấy ma trận nhân mũi tên `v` bằng đúng một con số `λ` nhân `v`). Giải phương trình `det(A − λI) = 0` để tìm các `λ`. Tổng tất cả trị riêng luôn bằng `Trace(A)` (tổng đường chéo chính).',
  },
  {
    id: 'adamw',
    module: 'M1',
    term: 'AdamW',
    aliases: ['AdamW', 'Adam'],
    whatIsIt:
      'Bộ tối ưu (Optimizer) "đi xe có quán tính + tự chỉnh chân ga" chuẩn mực nhất khi train AI hiện đại: Adam kết hợp đà trượt (Momentum) với tốc độ học riêng từng trọng số, còn chữ W tách riêng bước phạt trọng số (Weight Decay) cho sạch.',
    aiRole:
      'Là bộ tối ưu mặc định để huấn luyện hầu hết mạng nơ-ron sâu và LLM (GPT, LLaMA, BERT) vì hội tụ nhanh và tránh Overfitting tốt hơn Adam thường.',
    formulaPlain:
      'Mỗi bước cập nhật: (1) Tính trung bình trượt độ dốc (Momentum) và bình phương độ dốc (RMSProp) để tự chỉnh bước nhảy, (2) Trừ trực tiếp một tỷ lệ nhỏ trọng số cũ `λ·w` (Decoupled Weight Decay) để giữ trọng số gọn.',
  },
  {
    id: 'vanishing-gradient',
    module: 'M1',
    term: 'Vanishing Gradient',
    aliases: ['Vanishing Gradient', 'Tiêu biến đạo hàm'],
    whatIsIt:
      'Hiện tượng "tin nhắn truyền qua 50 người bị nhỏ dần rồi tắt lịm": khi lan truyền ngược sai số từ lớp cuối về lớp đầu, mỗi lớp lại nhân thêm một số rất nhỏ (< 0.25) khiến đến lớp đầu tín hiệu gần bằng 0 — mạng đứng im không học nổi.',
    aiRole:
      'Là căn bệnh kinh điển của mạng sâu dùng hàm Sigmoid; cách trị chuẩn trong phòng thi là đổi sang hàm `ReLU` / `GELU`, thêm kết nối tắt `Skip Connection` (ResNet) và chuẩn hóa `BatchNorm` / `LayerNorm`.',
    formulaPlain:
      'Hàm Sigmoid có đạo hàm lớn nhất chỉ là `0.25`. Qua 10 lớp nối tiếp theo Chain Rule: `0.25^10 ≈ 0.00000095` (gần bằng 0) ⇒ trọng số lớp đầu gần như không nhúc nhích và Loss đứng yên ngay từ đầu.',
  },
  {
    id: 'softmax',
    module: 'M1',
    term: 'Softmax',
    aliases: ['Softmax'],
    whatIsIt:
      'Chiếc "máy đổi điểm thành phần trăm": biến một dãy điểm thô bất kỳ (có thể âm, dương, to, nhỏ) ở lớp cuối AI thành bảng xác suất đẹp mắt từ 0% đến 100% có tổng đúng bằng 100%.',
    aiRole:
      'Đứng ở cửa ra của mọi bài toán phân loại nhiều lớp (nhận diện ảnh 1.000 loài) và bước chọn từ tiếp theo trong mọi mô hình ngôn ngữ lớn (LLM).',
    formulaPlain:
      'Bước 1: Lấy `e ≈ 2.718` mũ từng điểm số. Bước 2: Cộng tổng các số vừa mũ. Bước 3: Lấy từng số chia cho tổng. Ví dụ điểm `[2, 1, 0]` → `[7.39, 2.72, 1]` (tổng `11.11`) → `[66.5%, 24.5%, 9.0%]`.',
  },
  {
    id: 'base-rate-fallacy',
    module: 'M1',
    term: 'Base Rate Fallacy',
    aliases: ['Base Rate Fallacy', 'Ngụy biện tỷ lệ nền'],
    whatIsIt:
      'Cái bẫy "quên mất chuyện đó vốn cực hiếm ngoài đời": nghe xét nghiệm chính xác 99% liền tin 99% người bị báo dương tính là mắc bệnh, dù thực tế 99.9% dân số đều khỏe mạnh.',
    aiRole:
      'Là lỗi tư duy số 1 khiến kỹ sư đánh giá sai kết quả bộ lọc gian lận, phát hiện xâm nhập mạng (IDS) hay AI y tế khi lớp dương tính chiếm dưới 1%.',
    formulaPlain:
      'Luôn viết bảng số trên 1.000 người: 10 bệnh (bắt đúng 9) + 990 khỏe (báo nhầm 5% = 50 người) → Xác suất bệnh thật = `9 ÷ (9 + 50) ≈ 15%` chứ KHÔNG phải 99%!',
  },
  {
    id: 'conditional-probability',
    module: 'M1',
    term: 'Conditional Probability',
    aliases: ['Conditional Probability', 'Xác suất có điều kiện'],
    whatIsIt:
      'Xác suất sự kiện A xảy ra KHI ĐÃ BIẾT CHẮC sự kiện B đã xảy ra — giống việc thu hẹp không gian mẫu từ cả trường học xuống chỉ còn riêng lớp 12A rồi mới tính tỷ lệ.',
    aiRole:
      'Mọi mô hình AI phân loại hay LLM đều đang ước lượng xác suất có điều kiện `P(Đáp án | Dữ liệu đầu vào)` — ví dụ LLM đoán `P(từ tiếp theo | các từ đã gõ)`.',
    formulaPlain:
      'Lấy xác suất cả hai cùng xảy ra CHIA cho xác suất của điều kiện đã biết: `P(A | B) = P(A ∩ B) ÷ P(B)`. Ví dụ: trong 100 khách có 30 người dùng Mobile (B), 12 người vừa dùng Mobile vừa mua hàng (A∩B) → `P(Mua | Mobile) = 12 ÷ 30 = 40%`.',
  },
  {
    id: 'expected-value-variance',
    module: 'M1',
    term: 'Expected Value & Variance',
    aliases: ['Expected Value & Variance', 'Expected Value'],
    whatIsIt:
      'Kỳ vọng (Expected Value) là "giá trị trung bình dài hạn" nếu lặp lại trò chơi hàng nghìn lần; còn Phương sai (Variance) đo xem các kết quả thực tế nhảy lên xuống xa mức trung bình nhiều hay ít.',
    aiRole:
      'Dùng để định giá rủi ro/lợi nhuận kỳ vọng của mô hình AI, phân tích đánh đổi Bias–Variance và kiểm tra tác động của việc nhân/cộng hằng số khi chuẩn hóa dữ liệu.',
    formulaPlain:
      'Kỳ vọng: lấy từng giá trị nhân xác suất của nó rồi cộng lại (`E[aX+b] = a·E[X] + b`). Phương sai: trung bình của bình phương độ lệch so với kỳ vọng (`Var(aX+b) = a²·Var(X)`, cộng `b` không đổi phương sai!).',
  },
  {
    id: 'binomial-vs-poisson',
    module: 'M1',
    term: 'Binomial vs Poisson',
    aliases: ['Binomial vs Poisson', 'Binomial', 'Poisson'],
    whatIsIt:
      'Hai mô hình đếm sự kiện hay bị nhầm: Nhị thức (Binomial) đếm số lần thành công trong ĐÚNG `n` lượt cố định (tung xu 10 lần); Poisson đếm số sự kiện rơi vào 1 KHUNG THỜI GIAN/KHÔNG GIAN (số request vào server mỗi giây).',
    aiRole:
      'Binomial dùng đo tỷ lệ chuyển đổi (CTR) trong A/B Testing trên `n` người dùng; Poisson dùng dự báo tải lưu lượng (traffic/s) và số lỗi hệ thống mỗi giờ trong MLOps.',
    formulaPlain:
      'Nhìn câu hỏi: có sẵn tổng số lượt `n` + xác suất `p` → Binomial (`E = n×p`, `Var = n×p×(1−p)`). Chỉ cho tốc độ trung bình `λ` mỗi phút/giờ → Poisson (`E = Var = λ`).',
  },
  {
    id: 'gaussian-rule',
    module: 'M1',
    term: 'Gaussian 68-95-99.7',
    aliases: ['Gaussian 68-95-99.7', 'Gaussian', 'Normal Distribution'],
    whatIsIt:
      'Đường cong hình quả chuông cân đối: đa số dữ liệu tụ quanh mức trung bình (μ), càng ra xa hai đuôi càng hiếm — với tỷ lệ vàng 68% trong ±1σ, 95% trong ±2σ và 99.7% trong ±3σ.',
    aiRole:
      'Là cơ sở để chuẩn hóa Z-score (`StandardScaler`), lập khoảng tin cậy 95% (`±1.96·SE`) và phát hiện nhanh điểm bất thường (Outlier vượt quá ±3 độ lệch chuẩn).',
    formulaPlain:
      'Tính độ lệch chuẩn hóa `Z = (x − μ) ÷ σ`. Ví dụ điểm trung bình `μ = 70`, `σ = 10`: khoảng `[60, 80]` chứa ~68% học viên, `[50, 90]` chứa ~95%, ai đạt `100` (`Z = +3`) nằm top hiếm 0.15%!',
  },
  {
    id: 'se-ci',
    module: 'M1',
    term: 'Standard Error & Confidence Interval',
    aliases: ['Standard Error & Confidence Interval', 'Standard Error', 'Confidence Interval'],
    whatIsIt:
      'Standard Error (SE) là độ dao động của số trung bình khi bạn chỉ khảo sát một mẫu nhỏ thay vì cả nước; còn Confidence Interval 95% là dải "biên độ tin cậy" cộng trừ quanh con số đo được.',
    aiRole:
      'Trong A/B Testing, nếu khoảng tin cậy 95% của mức chênh lệch giữa mô hình mới và cũ vẫn chứa số 0 (vd `[-0.5%, +2.1%]`) thì kết quả chưa đủ thuyết phục để tung sản phẩm.',
    formulaPlain:
      'Bước 1: `SE = σ ÷ √n` (muốn giảm sai số đi 2 lần phải tăng cỡ mẫu lên `2² = 4` lần!). Bước 2: `CI 95% = Trung bình ± (1.96 × SE)`. Ví dụ `σ = 10, n = 100 → SE = 1 → CI = x̄ ± 1.96`.',
  },
  {
    id: 'pvalue-type-errors',
    module: 'M1',
    term: 'p-value Type I Type II Error',
    aliases: ['p-value Type I Type II Error', 'Type I Error', 'Type II Error', 'Statistical Power'],
    whatIsIt:
      'Hai kiểu phán quyết sai trong kiểm định: Type I (α) là "báo động giả" (khen tính năng mới thắng dù thật ra vô dụng); Type II (β) là "bỏ sót người tài" (loại nhầm tính năng thực sự tốt). Power (`1 − β`) là khả năng bắt trúng hiệu ứng thật.',
    aiRole:
      'Giúp cân bằng cỡ mẫu và ngưỡng `p-value < α` (thường α = 5%, Power ≥ 80%) trước khi chạy thử nghiệm A/B cho sản phẩm AI.',
    formulaPlain:
      'So sánh `p-value` với `α` (0.05): nếu `p < 0.05` → bác bỏ H0 (nhưng nhớ p-value KHÔNG phải xác suất H0 đúng!). Giảm `α` quá nhỏ giúp ít báo giả hơn nhưng làm tăng nguy cơ bỏ sót (Type II `β`).',
  },
  {
    id: 'bonferroni',
    module: 'M1',
    term: 'Bonferroni Correction',
    aliases: ['Bonferroni Correction', 'Bonferroni'],
    whatIsIt:
      'Biện pháp "siết chặt tiêu chuẩn khi chấm nhiều chỉ số cùng lúc": nếu bạn tung xúc xắc 20 lần (test 20 metric cùng lúc), kiểu gì cũng có 1 lần ăn may rơi vào p < 0.05 — Bonferroni buộc nâng độ khó lên gấp 20 lần để loại ăn may.',
    aiRole:
      'Chống bẫy Multiple Testing Problem khi nhóm sản phẩm theo dõi hàng chục chỉ số A/B test song song rồi chỉ chọn đúng chỉ số đẹp nhất để báo cáo.',
    formulaPlain:
      'Lấy ngưỡng ý nghĩa tổng thể `α` (0.05) CHIA cho số lượng kiểm định `m`: `α_mới = α ÷ m`. Ví dụ chạy `m = 10` kiểm định → ngưỡng mới là `0.05 ÷ 10 = 0.005` (p = 0.03 bị loại ngay!).',
  },
  {
    id: 'peeking-problem',
    module: 'M1',
    term: 'Peeking Problem',
    aliases: ['Peeking Problem', 'Peeking'],
    whatIsIt:
      'Thói quen "mở nồi cơm liên tục rồi dừng ngay khi vừa thấy đẹp": xem kết quả A/B test mỗi ngày và bấm chốt thắng ngay ngày thứ 2 lúc thấy p = 0.04, khiến tỷ lệ kết luận sai vọt từ 5% lên 25–30%.',
    aiRole:
      'Là lỗi phổ biến nhất ngoài thực tế khi doanh nghiệp sốt ruột tung sớm mô hình AI chưa thực sự hiệu quả (hiệu ứng tò mò ngày đầu / Novelty Effect).',
    formulaPlain:
      'Quy tắc chống Peeking: (1) Tính trước cỡ mẫu `n` cần thiết, (2) Chạy trọn chu kỳ tối thiểu 1–2 tuần (đủ ngày thường & cuối tuần), (3) Chỉ đọc `p-value` chốt kết quả ĐÚNG 1 LẦN khi kết thúc (hoặc dùng Sequential Testing).',
  },
  {
    id: 'mutable-vs-immutable',
    module: 'M2',
    term: 'Mutable vs Immutable',
    aliases: ['Mutable vs Immutable', 'Mutable', 'Immutable'],
    whatIsIt:
      'Mutable là kiểu dữ liệu "bảng phấn viết xóa tại chỗ được" (`list`, `dict`, `set`); còn Immutable là "khắc lên đá không sửa trực tiếp được" (`int`, `str`, `tuple`) — muốn đổi phải tạo bản mới.',
    aiRole:
      'Quyết định kiểu nào được làm khóa (`key`) trong Dictionary/Set (chỉ Immutable vì mã hash không đổi) và giải thích hàng loạt bug chia sẻ vùng nhớ trong Python.',
    formulaPlain:
      'Nhớ nhóm 3 Mutable: `list []`, `dict {}`, `set()`; còn lại `int, float, str, tuple (), frozenset` là Immutable. Ví dụ `{(1, 2): "ok"}` hợp lệ, còn `{[1, 2]: "lỗi"}` báo `TypeError: unhashable type`!',
  },
  {
    id: 'mutable-default-arg',
    module: 'M2',
    term: 'Mutable Default Argument',
    aliases: ['Mutable Default Argument'],
    whatIsIt:
      'Cái bẫy viết `def add(x, buf=[]):` trong Python — cái giỏ `[]` chỉ được tạo ĐÚNG 1 LẦN lúc khai báo hàm, nên gọi hàm lần 2, lần 3 cứ thế cộng dồn rác từ lần 1 sang!',
    aiRole:
      'Là nguồn gây bug rò rỉ dữ liệu chéo cực nguy hiểm giữa các request người dùng trong API Python hoặc khi gom batch dữ liệu AI.',
    formulaPlain:
      'Tuyệt đối thay `buf=[]` bằng `buf=None`, rồi dòng đầu thân hàm viết `if buf is None: buf = []`. Gọi `add(1)` ra `[1]`, gọi `add(2)` ra đúng `[2]` độc lập!',
  },
  {
    id: 'comprehension-generator',
    module: 'M2',
    term: 'List Comprehension & Generator',
    aliases: ['List Comprehension & Generator', 'List Comprehension', 'Generator'],
    whatIsIt:
      'List Comprehension `[x*2 for x in a]` viết gọn vòng lặp nhưng đổ hết cả danh sách lên RAM cùng lúc; còn Generator `(x*2 for x in a)` hoặc `yield` giống "vòi nước chảy tới đâu uống tới đó", chỉ tốn đúng 1 ly RAM.',
    aiRole:
      'Bắt buộc dùng Generator (`yield`) khi đọc/lọc tập log hoặc dataset AI hàng chục GB trên máy ít RAM để tránh lỗi tràn bộ nhớ (Out of Memory).',
    formulaPlain:
      'Ngoặc vuông `[...]` → tạo hết `N` phần tử ngay (RAM `O(N)`). Ngoặc tròn `(...)` hoặc hàm có `yield` → sinh từng phần tử khi gọi `next()` (RAM `O(1)`).',
  },
  {
    id: 'context-manager',
    module: 'M2',
    term: 'Context Manager',
    aliases: ['Context Manager'],
    whatIsIt:
      'Cấu trúc `with open(...) as f:` giống chiếc "cửa tự đóng": dù bên trong bạn đọc file xong bình thường hay gặp lỗi văng ra giữa chừng, Python vẫn tự động đóng file và giải phóng tài nguyên sạch sẽ.',
    aiRole:
      'Dùng khắp nơi trong pipeline AI: mở file dữ liệu (`with open`), tắt tính đạo hàm lúc inference PyTorch (`with torch.no_grad():`) và quản lý kết nối Database không bị rò rỉ.',
    formulaPlain:
      'Thay `f = open("a.txt"); ...; f.close()` (dễ quên đóng khi gặp exception) bằng `with open("a.txt", encoding="utf-8") as f:` — tự động chạy `__enter__()` lúc vào và `__exit__()` lúc ra.',
  },
  {
    id: 'python-dataclass',
    module: 'M2',
    term: 'Python Dataclass',
    aliases: ['Python Dataclass', 'Dataclass'],
    whatIsIt:
      'Nhãn `@dataclass` đặt trên `class` giúp Python tự viết hộ toàn bộ hàm khởi tạo (`__init__`), in đẹp (`__repr__`) và so sánh bằng (`__eq__`) chỉ trong vài dòng ngắn gọn.',
    aiRole:
      'Dùng để đóng gói cấu hình huấn luyện (`TrainingConfig`), bản ghi dữ liệu sạch và response của AI Agent gọn gàng, rõ kiểu dữ liệu.',
    formulaPlain:
      'Khai báo thuộc tính kèm kiểu: `@dataclass class Item: name: str; tags: list = field(default_factory=list)`. Lưu ý: trường kiểu `list`/`dict` BẮT BUỘC dùng `field(default_factory=...)`, cấm viết `= []`!',
  },
  {
    id: 'loc-vs-iloc',
    module: 'M2',
    term: 'loc vs iloc',
    aliases: ['loc vs iloc', 'loc', 'iloc'],
    whatIsIt:
      'Hai cách cắt bảng trong Pandas: `loc` gọi theo TÊN NHÃN hàng/cột (và lấy CẢ mốc cuối); còn `iloc` gọi theo SỐ THỨ TỰ nguyên 0, 1, 2 (và BỎ mốc cuối giống slicing Python).',
    aiRole:
      'Là thao tác lọc hàng/cột chuẩn mực khi tiền xử lý bảng dữ liệu; nhầm hai lệnh này làm lệch đúng 1 dòng hoặc báo lỗi `KeyError` ngay trong bài code tay.',
    formulaPlain:
      'Ví dụ bảng có index `0, 1, 2, 3`: `df.loc[0:2]` trả về **3 dòng** (0, 1, 2 — GỒM 2); còn `df.iloc[0:2]` chỉ trả về **2 dòng** (0, 1 — BỎ 2).',
  },
  {
    id: 'groupby-agg-transform',
    module: 'M2',
    term: 'groupby agg vs transform',
    aliases: ['groupby agg vs transform', 'transform'],
    whatIsIt:
      'Cùng gom theo nhóm (như từng khu vực), nhưng `agg` thu gọn cả nhóm thành ĐÚNG 1 dòng báo cáo, còn `transform` điền giá trị nhóm ngược lại từng dòng nên GIỮ NGUYÊN số dòng bảng gốc.',
    aiRole:
      'Dùng `transform("mean")` khi tạo đặc trưng chuẩn hóa theo nhóm (ví dụ: doanh số đơn này cao hơn trung bình khu vực bao nhiêu) mà không phải tách bảng rồi merge lại.',
    formulaPlain:
      'Bảng có 1.000 đơn thuộc 3 vùng: `df.groupby("region")["rev"].agg("mean")` ra bảng **3 dòng**; còn `df.groupby("region")["rev"].transform("mean")` ra cột **1.000 dòng** gắn thẳng vào `df`!',
  },
  {
    id: 'merge-vs-concat',
    module: 'M2',
    term: 'pd.merge vs pd.concat',
    aliases: ['pd.merge vs pd.concat', 'pd.merge', 'pd.concat'],
    whatIsIt:
      '`pd.merge` giống VLOOKUP / SQL JOIN — ghép ngang 2 bảng dựa trên cột mã chung (`user_id`); còn `pd.concat` giống dán nối tiếp nhiều tờ Excel cùng cột xếp chồng lên nhau.',
    aiRole:
      'Dùng `pd.merge(..., how="left")` để nối bảng đơn hàng với hồ sơ khách hàng không mất đơn, và `pd.concat([thang1, thang2], ignore_index=True)` để gộp log các tháng.',
    formulaPlain:
      'Có khóa chung (ID) để khớp dòng → `pd.merge(a, b, on="id", how="left")`. Cùng cấu trúc cột cần nối dài thêm dòng → `pd.concat([a, b], ignore_index=True)`.',
  },
  {
    id: 'setting-with-copy',
    module: 'M2',
    term: 'SettingWithCopyWarning',
    aliases: ['SettingWithCopyWarning'],
    whatIsIt:
      'Cảnh báo của Pandas khi bạn lọc ra một bảng con rồi gán sửa ngay trên đó (`df[df.age > 20]["tag"] = 1`), khiến máy không chắc bạn đang sửa bản nháp hay sửa luôn bảng gốc.',
    aiRole:
      'Bắt buộc xử lý sạch trong code sản xuất & bài thi Code tay Python để đảm bảo phép gán dữ liệu chạy chắc chắn, không âm thầm mất thay đổi.',
    formulaPlain:
      '2 cách sửa chuẩn 100%: (1) Thêm `.copy()` lúc tách bảng `sub = df[df["age"] > 20].copy()`, hoặc (2) Gán 1 nhịp bằng `.loc`: `df.loc[df["age"] > 20, "tag"] = 1`.',
  },
  {
    id: 'forward-fill',
    module: 'M2',
    term: 'Forward Fill (ffill)',
    aliases: ['Forward Fill (ffill)', 'Forward Fill', 'ffill'],
    whatIsIt:
      'Cách điền ô dữ liệu bị thiếu trên chuỗi thời gian bằng cách "kéo giá trị hợp lệ gần nhất trong QUÁ KHỨ tới", giống như cảm biến mất tín hiệu lúc 10h thì tạm lấy số đo lúc 9h.',
    aiRole:
      'Ngăn chặn tuyệt đối Data Leakage trên dữ liệu thời gian — cấm dùng `bfill()` (kéo dữ liệu tương lai về quá khứ) hay điền trung bình toàn bộ 12 tháng trước khi chia Train/Test.',
    formulaPlain:
      'Ví dụ chuỗi `[10, NaN, NaN, 25]`: chạy `s.ffill()` ra `[10, 10, 10, 25]` (an toàn, chỉ dùng quá khứ); ngược lại `s.bfill()` ra `[10, 25, 25, 25]` (nhìn lén số 25 tương lai ⇒ Leakage!).',
  },
  {
    id: 'datetime-rolling',
    module: 'M2',
    term: 'pd.to_datetime & rolling',
    aliases: ['pd.to_datetime & rolling', 'pd.to_datetime'],
    whatIsIt:
      '`pd.to_datetime` chuyển cột chữ ngày tháng lộn xộn thành kiểu thời gian chuẩn để tách năm/tháng/thứ; còn `.rolling(7).mean()` tính trung bình trượt 7 ngày gần nhất giống đường làm mượt biểu đồ chứng khoán.',
    aiRole:
      'Là bộ đôi tạo đặc trưng chuỗi thời gian (Time-Series Feature Engineering) không thể thiếu cho dự báo doanh số, nhu cầu và phát hiện bất thường.',
    formulaPlain:
      'Luôn thêm `errors="coerce"` (`pd.to_datetime(s, errors="coerce")`) để ngày lỗi thành `NaT` không làm sập pipeline; `.rolling(3).mean()` trên `[10, 20, 30, 40]` cho `[NaN, NaN, 20, 30]`.',
  },
  {
    id: 'axis-0-vs-axis-1',
    module: 'M2',
    term: 'Axis 0 vs Axis 1',
    aliases: ['Axis 0 vs Axis 1', 'axis=0', 'axis=1'],
    whatIsIt:
      'Chiều "ép gộp" bảng số 2D trong NumPy & Pandas: `axis=0` ép DỌC từ trên xuống (tính ra kết quả cho từng CỘT); `axis=1` ép NGANG từ trái sang phải (tính ra kết quả cho từng HÀNG).',
    aiRole:
      'Chuẩn hóa từng đặc trưng (cột) luôn dùng `axis=0`, còn tính Softmax hay tổng điểm của từng khách hàng (hàng) luôn dùng `axis=1` — đặt ngược chiều là sai sạch kết quả!',
    formulaPlain:
      'Với bảng `[[1, 2, 3], [4, 5, 6]]` (2 hàng × 3 cột): `sum(axis=0)` cộng dọc từng cột ra `[5, 7, 9]` (3 số); `sum(axis=1)` cộng ngang từng hàng ra `[6, 15]` (2 số).',
  },
  {
    id: 'hash-table-vs-list',
    module: 'M2',
    term: 'Hash Table O(1) vs List O(n)',
    aliases: ['Hash Table O(1) vs List O(n)', 'Hash Table', 'Hash Map'],
    whatIsIt:
      'Tìm trong `list` giống lật từng trang sách từ trang 1 tới cuối (`O(n)`); còn tìm trong `set`/`dict` (Hash Table) giống tra mục lục nhảy thẳng tới đúng số trang trong 1 bước duy nhất (`O(1)`).',
    aiRole:
      'Là kỹ thuật tối ưu thuật toán quan trọng nhất trong Python thực chiến: giảm vòng lặp đối chiếu danh sách đen từ `O(N × M)` xuống `O(N + M)` để chạy nhanh gấp hàng nghìn lần.',
    formulaPlain:
      'Kiểm tra 1.000.000 user với 50.000 người bị chặn: dùng `list` mất `1.000.000 × 50.000 = 50 tỷ` bước; đổi sang `banned = set(banned_list)` trước vòng lặp chỉ tốn `1.000.000 + 50.000 = 1,05 triệu` bước!',
  },
  {
    id: 'deque-heap-topk',
    module: 'M2',
    term: 'Deque Sliding Window & Heap Top-K',
    aliases: ['Deque Sliding Window & Heap Top-K', 'Sliding Window', 'Min-Heap'],
    whatIsIt:
      '`Deque` kết hợp tổng chạy (`running_sum`) tính trung bình cửa sổ trượt trong đúng `O(1)`; còn `Min-Heap` (`heapq`) giữ một cái giỏ nhỏ đúng `K` phần tử lớn nhất mà không cần sắp xếp toàn bộ mảng.',
    aiRole:
      'Cặp cấu trúc dữ liệu tủ cho bài toán giám sát độ trễ real-time hàng nghìn RPS (Moving Average `O(1)`) và gợi ý Top-K sản phẩm từ hàng triệu mặt hàng (`O(N log K)`).',
    formulaPlain:
      'Moving Average: `sum_mới = sum_cũ + số_mới − số_bị_đẩy_ra` (`O(1)` thay vì gọi `sum(window)` `O(K)`). Top-K: dùng `heapq.nlargest(k, data)` hoặc duy trì Min-Heap cỡ `k` tốn `O(N log K)` thay vì sort `O(N log N)`.',
  },
  {
    id: 'sql-execution-order',
    module: 'M2',
    term: 'SQL Execution Order',
    aliases: ['SQL Execution Order'],
    whatIsIt:
      'Thứ tự máy chủ cơ sở dữ liệu THỰC SỰ chạy câu lệnh SQL — khác hoàn toàn thứ tự bạn gõ từ trên xuống! `FROM` và `WHERE` luôn chạy TRƯỚC `SELECT`, nên `WHERE` chưa hề biết bí danh cột hay Window Function đặt ở `SELECT`.',
    aiRole:
      'Giải thích triệt để vì sao viết `WHERE rn = 1` trực tiếp với `ROW_NUMBER()` bị báo lỗi cú pháp và vì sao phải bọc trong CTE `WITH`.',
    formulaPlain:
      'Thứ tự 7 bước bắt buộc thuộc: `(1) FROM / JOIN → (2) WHERE → (3) GROUP BY → (4) HAVING → (5) SELECT (Window) → (6) ORDER BY → (7) LIMIT`.',
  },
  {
    id: 'where-vs-having',
    module: 'M2',
    term: 'WHERE vs HAVING',
    aliases: ['WHERE vs HAVING'],
    whatIsIt:
      '`WHERE` là màng lọc từng dòng dữ liệu thô TRƯỚC khi gom nhóm; còn `HAVING` là màng lọc chạy SAU khi đã gom `GROUP BY` để lọc trên kết quả tổng hợp (`SUM`, `COUNT`, `AVG`).',
    aiRole:
      'Dùng hàng ngày khi trích xuất báo cáo hoặc tạo tập huấn luyện SQL; đặt hàm `SUM()` vào `WHERE` là lỗi kinh điển hay bị gài bẫy trong đề trắc nghiệm SQL.',
    formulaPlain:
      'Ví dụ lọc vùng có tổng đơn đã trả tiền > 100k: viết `WHERE status = \'paid\'` (lọc từng đơn trước) → `GROUP BY region` → `HAVING SUM(revenue) > 100000` (lọc tổng vùng sau).',
  },
  {
    id: 'anti-join',
    module: 'M2',
    term: 'LEFT JOIN Anti-Join',
    aliases: ['LEFT JOIN Anti-Join', 'Anti-Join'],
    whatIsIt:
      'Chiêu SQL tìm những đối tượng "có ở bảng A nhưng HOÀN TOÀN KHÔNG xuất hiện ở bảng B" (ví dụ: danh sách khách hàng đã đăng ký tài khoản nhưng chưa đặt nổi 1 đơn hàng nào).',
    aiRole:
      'Dùng để tìm nhóm khách hàng rời bỏ/chưa kích hoạt, phát hiện dữ liệu thiếu nhãn hoặc đối soát bản ghi bị rơi giữa các bảng dữ liệu AI.',
    formulaPlain:
      '2 bước chuẩn: lấy bảng gốc `users LEFT JOIN orders ON users.id = orders.user_id` (khách chưa có đơn sẽ có `orders.id` là `NULL`), sau đó lọc đúng `WHERE orders.id IS NULL` (cấm viết `= NULL`!).',
  },
  {
    id: 'cte-with',
    module: 'M2',
    term: 'CTE WITH Clause',
    aliases: ['CTE WITH Clause', 'CTE'],
    whatIsIt:
      'Bảng tạm đặt tên gọn ở đầu câu SQL bằng từ khóa `WITH ten_bang AS (...)` — giúp tách câu truy vấn dài ngoằng thành từng bước nhỏ dễ đọc như viết từng đoạn văn.',
    aiRole:
      'Là cách duy nhất sạch sẽ để lọc kết quả của Window Function (`ROW_NUMBER()`, `RANK()`, `LAG()`) bằng `WHERE rn = 1` ở truy vấn bên ngoài.',
    formulaPlain:
      'Mẫu tủ: `WITH ranked AS (SELECT *, ROW_NUMBER() OVER (PARTITION BY dept ORDER BY rev DESC) AS rn FROM sales) SELECT * FROM ranked WHERE rn = 1;`.',
  },
  {
    id: 'partitioning-btree-index',
    module: 'M2',
    term: 'PostgreSQL Partitioning & B-Tree Index',
    aliases: ['PostgreSQL Partitioning & B-Tree Index', 'Table Partitioning', 'B-Tree Index', 'Leftmost Prefix'],
    whatIsIt:
      'Table Partitioning giống chia tủ hồ sơ 500 triệu tờ thành từng ngăn theo từng tháng (tìm tháng 10 chỉ mở đúng ngăn tháng 10); còn B-Tree Index giống mục lục đánh vần giúp tìm hồ sơ trong ngăn đó mất vài mili-giây.',
    aiRole:
      'Là đáp án kiến trúc chuẩn mực khi bảng `inference_logs` hàng trăm triệu dòng làm API chậm 3 giây (yêu cầu < 200ms) mà không được phép xóa lịch sử hay cache sai dữ liệu mới.',
    formulaPlain:
      'Kết hợp Partition theo `created_at` (Partition Pruning cắt bỏ 95% phân vùng không liên quan) + Composite B-Tree Index `(user_id, created_at)` tuân thủ **Leftmost Prefix** (phải lọc cột trái `user_id` trước).',
  },
  {
    id: 'bias-variance',
    module: 'M3',
    term: 'Bias-Variance Tradeoff',
    aliases: ['Bias-Variance Tradeoff', 'Overfitting', 'Underfitting'],
    whatIsIt:
      'High Bias (Underfitting) là "học quá sơ sài" nên làm bài tập ở nhà (Train) lẫn đi thi (Test) đều điểm thấp; High Variance (Overfitting) là "học tủ thuộc vẹt" nên ở nhà đạt 99% mà đi thi đề lạ tụt còn 60%.',
    aiRole:
      'Là kim chỉ nam chẩn đoán mọi mô hình học máy: biết đang bị Bias hay Variance thì mới bốc đúng thuốc (tăng độ phức tạp vs thêm dữ liệu / Regularization / giảm độ sâu cây).',
    formulaPlain:
      'Nhìn cặp điểm (Train, Val): Train 60% – Val 58% ⇒ High Bias (Underfit, cần model mạnh hơn / thêm feature). Train 99% – Val 62% ⇒ High Variance (Overfit, cần L1/L2, Dropout, Early Stopping, thêm data).',
  },
  {
    id: 'bagging-vs-boosting',
    module: 'M3',
    term: 'Bagging vs Boosting',
    aliases: ['Bagging vs Boosting', 'Bagging', 'Boosting'],
    whatIsIt:
      'Hai kiểu "hội đồng chuyên gia" (Ensemble): Bagging (Random Forest) cho 100 cây học ĐỘC LẬP song song rồi biểu quyết lấy số đông để bớt thất thường; Boosting (XGBoost/LightGBM) cho từng cây học NỐI TIẾP, cây sau chuyên sửa lỗi sai của cây trước.',
    aiRole:
      'Bagging chuyên trị giảm Variance (chống Overfit ổn định); Boosting chuyên trị giảm Bias và là "vua của dữ liệu bảng" trong mọi bài toán ML thực chiến.',
    formulaPlain:
      'So sánh nhanh: Bagging = song song, giảm Variance (Random Forest); Boosting = tuần tự sửa sai phần dư (residual), giảm Bias mạnh nhất trên tabular data (XGBoost, LightGBM, CatBoost).',
  },
  {
    id: 'stratified-kfold',
    module: 'M3',
    term: 'Stratified K-Fold',
    aliases: ['Stratified K-Fold', 'Cross-Validation'],
    whatIsIt:
      'Cách chia bộ dữ liệu thành K phần (thường K = 5) để xoay vòng kiểm tra chéo, nhưng KHÓA CỨNG tỷ lệ các lớp trong mọi phần giống y hệt tỷ lệ thật (nhất là khi lớp hiếm chỉ có 1%).',
    aiRole:
      'Tránh thảm họa chia ngẫu nhiên làm 1 fold không có nổi ca gian lận nào; nhớ chỉ dùng cho dữ liệu độc lập (còn chuỗi thời gian bắt buộc dùng `TimeSeriesSplit`).',
    formulaPlain:
      'Ví dụ 1.000 mẫu có 20 ca gian lận (2%) chia 5-Fold: Stratified K-Fold đảm bảo MỖI fold 200 mẫu có đúng 4 ca gian lận (2%), sau đó tính trung bình điểm trên cả 5 lượt.',
  },
  {
    id: 'prauc-vs-rocauc',
    module: 'M3',
    term: 'PR-AUC vs ROC-AUC',
    aliases: ['PR-AUC vs ROC-AUC', 'ROC-AUC'],
    whatIsIt:
      'Hai thước đo tổng thể không phụ thuộc ngưỡng cắt: ROC-AUC dùng tốt khi dữ liệu cân bằng (50/50), nhưng trên dữ liệu cực lệch (0.1% gian lận) ROC-AUC dễ đẹp ảo nhờ hàng triệu ca bình thường (TN) — còn PR-AUC phơi bày thẳng báo động giả.',
    aiRole:
      'Quy tắc phòng thi M3: cứ thấy lớp dương hiếm (0.1%–2% như gian lận thẻ, bệnh hiếm, lỗi máy) → chọn ngay **PR-AUC** thay vì ROC-AUC hay Accuracy.',
    formulaPlain:
      'ROC vẽ TPR vs `FPR = FP ÷ (FP + TN)` — khi `TN = 100.000`, báo oan `FP = 500` vẫn cho FPR tí hon `0.5%`! Còn PR-AUC vẽ Precision `TP ÷ (TP + FP)` vs Recall (không chứa TN nên bắt sống 500 ca báo oan ngay).',
  },
  {
    id: 'smote-focal-loss',
    module: 'M3',
    term: 'SMOTE & Focal Loss',
    aliases: ['SMOTE & Focal Loss', 'Focal Loss'],
    whatIsIt:
      'Hai vũ khí xử lý tập dữ liệu lệch lớp (Imbalance): SMOTE tạo thêm mẫu tổng hợp cho lớp hiếm bên trong tập Train; còn Focal Loss tự động "phạt nặng" các ca khó/hiếm và hạ nhỏ trọng số của hàng triệu ca dễ đoán.',
    aiRole:
      'Giúp mô hình phân loại tập trung học ranh giới của lớp thiểu số thay vì lười biếng đoán tất cả vào lớp đa số.',
    formulaPlain:
      'SMOTE chỉ chạy BÊN TRONG Train fold (chống Data Leakage!). Focal Loss nhân thêm hệ số `(1 − p_t)^γ` vào Cross-Entropy: ca dễ (`p_t = 0.99`) bị nhân `(0.01)^2 = 0.0001` (gần như bỏ qua để tập trung vào ca khó).',
  },
  {
    id: 'shap-lime',
    module: 'M3',
    term: 'SHAP & LIME',
    aliases: ['SHAP & LIME', 'SHAP', 'LIME'],
    whatIsIt:
      'Hai công cụ "mở hộp đen AI" (Explainable AI): giải thích cụ thể vì sao AI từ chối hồ sơ vay của anh A — ví dụ nợ quá hạn kéo giảm −35 điểm, thu nhập ổn định cộng +15 điểm.',
    aiRole:
      'Bắt buộc phải có trong hệ thống AI rủi ro cao (tín dụng, y tế, tuyển dụng theo EU AI Act) để con người duyệt (HITL) có bằng chứng kiểm tra thay vì tin mù quáng.',
    formulaPlain:
      'SHAP dựa trên Lý thuyết trò chơi (Shapley Value): chia công bằng mức đóng góp của từng đặc trưng sao cho `Điểm dự đoán = Điểm cơ sở + Tổng các giá trị SHAP`. LIME khớp 1 mô hình tuyến tính đơn giản quanh đúng 1 điểm dữ liệu đó.',
  },
  {
    id: 'self-attention',
    module: 'M3',
    term: 'Self-Attention Q-K-V O(N²)',
    aliases: ['Self-Attention Q-K-V O(N²)', 'Self-Attention', 'Transformer'],
    whatIsIt:
      'Cơ chế "mọi từ đều liếc nhìn tất cả các từ còn lại trong câu" để hiểu ngữ cảnh (như từ "nó" đang chỉ ai). Vì N từ phải ghép cặp so sánh với cả N từ nên chi phí tăng theo bình phương `N²`.',
    aiRole:
      'Là trái tim của kiến trúc Transformer đứng sau mọi LLM hiện đại; đồng thời giải thích vì sao nhét văn bản quá dài làm chậm và ngốn VRAM bùng nổ (nên phải dùng RAG + KV Cache).',
    formulaPlain:
      'Công thức: `softmax(Q · K^T ÷ √d_k) · V`. Chia cho `√d_k` để số không quá lớn làm bão hòa Softmax. Tăng độ dài câu từ 1.000 lên 4.000 token (×4) làm số cặp so sánh tăng `4² = 16 lần`!',
  },
  {
    id: 'temperature-sampling',
    module: 'M3',
    term: 'Temperature Top-K Top-P',
    aliases: ['Temperature Top-K Top-P', 'Temperature', 'Top-P'],
    whatIsIt:
      '3 nút vặn kiểm soát độ "an toàn hay bay bổng" khi LLM chọn từ tiếp theo: Temperature chỉnh độ sắc nhọn xác suất; Top-K chỉ chọn trong K từ cao nhất; Top-P (Nucleus) chỉ chọn nhóm từ đầu có tổng xác suất đạt P%.',
    aiRole:
      'Hạ Temperature về `0–0.2` là thao tác bắt buộc khi làm Chatbot RAG tra cứu tài liệu, trích xuất JSON hoặc viết code để giảm tối đa ảo giác (Hallucination).',
    formulaPlain:
      'Trước khi tính Softmax, lấy điểm thô CHIA cho `Temperature`: `T → 0` phóng đại cách biệt nên luôn chọn từ chắc nhất; `T = 0.9–1.0` san phẳng xác suất để câu chữ đa dạng, sáng tạo hơn.',
  },
  {
    id: 'recall-vs-faithfulness',
    module: 'M3',
    term: 'Recall@k vs Faithfulness',
    aliases: ['Recall@k vs Faithfulness'],
    whatIsIt:
      'Hai chốt khám bệnh tách bạch cho hệ thống RAG: `Recall@k` kiểm tra bộ tìm kiếm có LẤY ĐÚNG đoạn tài liệu chứa đáp án vào Top-k không; còn `Faithfulness` kiểm tra LLM có TRUNG THỰC bám sát đoạn tài liệu đó hay tự bịa thêm.',
    aiRole:
      'Giúp khoanh vùng sửa lỗi chính xác 100% trong đề Case Study RAG: lỗi Truy xuất sửa Chunking/Hybrid/Rerank, lỗi Sinh sửa Prompt/Temperature.',
    formulaPlain:
      'Bảng chẩn đoán nhanh: `Recall@5 thấp` (vd 40%) ⇒ lỗi Tìm kiếm (đổi sang Hybrid Search + Rerank + sửa Chunking). `Recall@5 cao` (90%) nhưng `Faithfulness thấp` (50%) ⇒ lỗi Sinh (hạ Temp = 0, ép trích dẫn nguồn + fallback "không biết").',
  },
  {
    id: 'react-agent-guardrails',
    module: 'M3',
    term: 'ReAct Agent & Guardrails',
    aliases: ['ReAct Agent & Guardrails', 'ReAct Agent', 'Guardrails'],
    whatIsIt:
      'ReAct là vòng lặp "Suy nghĩ → Hành động (gọi Tool) → Quan sát kết quả" giúp AI Agent tự giải bài toán nhiều bước; còn Guardrails là "hàng rào chắn hai đầu" kiểm tra đầu vào/đầu ra và giới hạn quyền để Agent không phá phách.',
    aiRole:
      'Chuẩn kiến trúc triển khai AI Agent an toàn trong doanh nghiệp: chống vòng lặp vô hạn (`max_steps`), chống lạm quyền (Excessive Agency) và khóa mọi tool ghi/gửi bằng HITL.',
    formulaPlain:
      'Vòng lặp: `Thought → Action (Tool) → Observation → ... → Final Answer`. Luật an toàn 3 lớp: (1) Đặt `max_steps` + timeout, (2) Tool ĐỌC tự chạy, Tool GHI/GỬI bắt buộc HITL, (3) Bọc Guardrails lọc PII & Prompt Injection.',
  },
  {
    id: 'p95-ttft',
    module: 'M3',
    term: 'p95 Tail Latency & TTFT',
    aliases: ['p95 Tail Latency & TTFT', 'Tail Latency'],
    whatIsIt:
      'Bộ đôi thước đo tốc độ thực tế của hệ thống AI: `p95` đo mốc chậm của 5% lượt tệ nhất (không bị số trung bình che mắt), còn `TTFT` đo thời gian chờ từ lúc bấm Gửi đến lúc chữ đầu tiên hiện ra.',
    aiRole:
      'Là chỉ số SLA sống còn của MLOps Serving: số trung bình 1.2s có thể đẹp trên slide nhưng nếu `p95 = 6s` thì cứ 20 khách lại có 1 khách chờ đơ máy bỏ đi.',
    formulaPlain:
      'Xếp 100 lượt chạy tăng dần → lượt thứ 95 chính là `p95`. Giảm `TTFT` bằng Streaming + Prefix/KV Cache + gọn ngữ cảnh RAG; giảm `p95` bằng Continuous Batching + Response Cache.',
  },
  {
    id: 'batching-kv-cache',
    module: 'M3',
    term: 'Continuous Batching & KV Cache',
    aliases: ['Continuous Batching & KV Cache', 'Continuous Batching', 'KV Cache', 'Prompt Caching'],
    whatIsIt:
      'Continuous Batching giống xe buýt thông minh "khách nào xong xuống ngay, khách mới lên thế chỗ liền" thay vì bắt cả xe chờ người trả lời dài nhất; còn KV Cache (Prefix Cache) nhớ sẵn phần tính toán của đoạn System Prompt lặp đi lặp lại.',
    aiRole:
      'Là hai kỹ thuật tăng thông lượng (throughput) gấp nhiều lần và cắt mạnh chi phí GPU/token cùng độ trễ TTFT trong các engine LLM như vLLM.',
    formulaPlain:
      'Nếu System Prompt dài 2.000 token giống nhau ở 100% câu hỏi: Prefix/KV Cache chỉ tính Prefill 1 lần rồi tái sử dụng lại bộ nhớ K–V, cắt giảm 50–80% thời gian chờ chữ đầu (TTFT) và tiền token đầu vào.',
  },
  {
    id: 'quantization',
    module: 'M3',
    term: 'Quantization INT8/INT4',
    aliases: ['Quantization INT8/INT4', 'Quantization'],
    whatIsIt:
      'Kỹ thuật "làm tròn trọng số để giảm cân cho AI": thay vì lưu mỗi con số trọng số bằng số thực 16-bit/32-bit nặng nề, ta nén xuống số nguyên 8-bit hoặc 4-bit để giảm 2–4 lần dung lượng VRAM mà chất lượng hầu như giữ nguyên.',
    aiRole:
      'Giúp chạy LLM lớn (7B–70B) trên GPU nhỏ hơn, đưa mô hình xuống thiết bị biên (Edge AI/điện thoại) và giảm mạnh chi phí hạ tầng — nhưng BẮT BUỘC chạy Eval kiểm tra độ tụt điểm trước/sau nén.',
    formulaPlain:
      'Ước lượng VRAM nhanh: Model 7 tỷ tham số (7B) ở `FP16` (2 byte/tham số) tốn `7 × 2 = 14 GB` VRAM; nén xuống `INT4` (0.5 byte/tham số) chỉ còn `7 × 0.5 = 3.5 GB` VRAM (giảm gấp 4 lần!).',
  },
  {
    id: 'eval-gate',
    module: 'M3',
    term: 'Eval Gate Golden Set',
    aliases: ['Eval Gate Golden Set', 'Eval Gate', 'Golden Set'],
    whatIsIt:
      'Cổng "kiểm tra đầu ra tự động" trong CI/CD cho AI: bất kỳ thay đổi nào về Model, Prompt hay Chunking đều phải thi qua bộ đề chuẩn (Golden Set) đạt đủ điểm mới được phép lên mạng phục vụ khách.',
    aiRole:
      'Chặn đứng tình trạng "sửa prompt câu này làm hỏng âm thầm 50 câu khác" (Regression) trước khi đưa bản mới sang Shadow Mode / Canary.',
    formulaPlain:
      'Luồng chuẩn: Đổi Code/Prompt/Model → Chạy tự động trên 200–1.000 câu Golden Set → Nếu Faithfulness ≥ 90%, p95 ≤ 2s, Safety = 100% thì PASS mở cổng Deploy; rớt bất kỳ chỉ số nào → FAIL chặn ngay.',
  },
  {
    id: 'data-concept-drift',
    module: 'M3',
    term: 'Data Drift vs Concept Drift',
    aliases: ['Data Drift vs Concept Drift', 'Data Drift', 'Concept Drift'],
    whatIsIt:
      'Data Drift là "tệp khách hàng/dữ liệu đầu vào đổi khác" (`P(X)` đổi, ví dụ bỗng nhiều khách trẻ hơn); còn Concept Drift là "quy luật đời sống đổi hẳn" (`P(Y|X)` đổi, ví dụ cùng căn nhà đó nhưng do lạm phát giá tăng gấp rưỡi).',
    aiRole:
      'Giải thích vì sao mô hình AI sau vài tháng chạy production tự tụt độ chính xác dù code không hề sửa; cần giám sát bằng PSI/KS-test để kích hoạt Fine-tune pha dữ liệu cũ.',
    formulaPlain:
      'Đo Data Drift bằng chỉ số **PSI**: `PSI < 0.1` ổn định, `0.1–0.25` cần chú ý, `PSI > 0.25` lệch nặng → kích hoạt Fine-tune dữ liệu mới pha trộn dữ liệu cũ (chống Catastrophic Forgetting), cấm retrain mù quáng mỗi ngày!',
  },
  {
    id: 'canary-shadow-rollback',
    module: 'M3',
    term: 'Canary Shadow Rollback',
    aliases: ['Canary Shadow Rollback', 'Shadow Mode', 'Rollback'],
    whatIsIt:
      'Bộ 3 bước ra mắt mô hình AI "không bao giờ để sập diện rộng": Shadow chạy ngầm 0% khách để soi log → Canary mở thử 5%–10% khách → Auto Rollback tự kéo về bản cũ trong 1 giây nếu lỗi vượt ngưỡng.',
    aiRole:
      'Là chuẩn phát hành bắt buộc trong mọi câu Case Study MLOps để hạn chế tối đa bán kính thiệt hại (Blast Radius) khi đưa bản AI mới lên production.',
    formulaPlain:
      'Nấc triển khai an toàn: `Eval Gate (Golden Set) → Shadow (0% user thấy) → Canary (5% → 25% → 100%)`. Cài báo động tự động: nếu `error_rate > 1%` hoặc `p95 > 2s` → kích hoạt `Rollback` về bản cũ ngay.',
  },
  {
    id: 'gpu-utilization-roi',
    module: 'M3',
    term: 'GPU Utilization & ROI',
    aliases: ['GPU Utilization & ROI', 'GPU Utilization', 'ROI'],
    whatIsIt:
      'GPU Utilization là tỷ lệ phần trăm thời gian GPU thực sự chạy việc (ngoài đời thường chỉ 30–50% vì giờ thấp điểm trống tải); còn ROI đo xem dự án AI thực sự lời hay lỗ sau khi trừ ĐỦ mọi chi phí.',
    aiRole:
      'Là bẫy tính toán kinh điển ở CĐ-11: tính giá mỗi 1.000 request theo công suất lý thuyết 100% sẽ bị rẻ ảo gấp 2–3 lần so với hóa đơn thật.',
    formulaPlain:
      'Bước 1: `Req thực = Req tối đa × % Utilization`. Bước 2: `Cost/1K = (Giá GPU/giờ ÷ Req thực/giờ) × 1.000`. Bước 3: `ROI = (Tổng lợi ích − Tổng chi phí gồm GPU + bảo trì + eval) ÷ Tổng chi phí`.',
  },
  {
    id: 'contrapositive-converse',
    module: 'M4',
    term: 'Contrapositive vs Converse',
    aliases: ['Contrapositive vs Converse', 'Converse'],
    whatIsIt:
      'Cho câu gốc "Nếu P thì Q" (`P → Q`): Phản đảo (Contrapositive: "Không Q thì Không P") luôn ĐÚNG tương đương 100%; còn Đảo (Converse: "Có Q suy ra có P") là **SAI logic**!',
    aiRole:
      'Gỡ sạch bẫy suy luận logic số 1 trong CĐ-12: thấy "Model dự đoán bị Bias (Q)" KHÔNG được kết luận chắc chắn 100% là do "dữ liệu train bị Bias (P)".',
    formulaPlain:
      'Nhớ nhanh 1 ví dụ: "Mưa (P) ⇒ Đường ướt (Q)". Đúng: "Đường khô (¬Q) ⇒ Không mưa (¬P)" (Phản đảo). Sai: "Đường ướt (Q) ⇒ Chắc chắn trời mưa (P)" (Đảo — có thể do xe tưới đường!).',
  },
  {
    id: 'survivorship-bias',
    module: 'M4',
    term: 'Survivorship Bias',
    aliases: ['Survivorship Bias', 'Thiên kiến sống sót'],
    whatIsIt:
      'Thiên kiến "chỉ nhìn những người sống sót/thành công mà quên mất đám đông đã bỏ cuộc hoặc biến mất" — giống chỉ khảo sát khách hàng còn ở lại dùng app để kết luận 98% khách hài lòng.',
    aiRole:
      'Làm méo sạch kết luận dữ liệu và huấn luyện mô hình dự đoán rời bỏ (Churn) hay chấm điểm tín dụng (chỉ train trên hồ sơ từng được duyệt vay mà bỏ quên hồ sơ bị từ chối).',
    formulaPlain:
      'Luôn tự hỏi trước khi train hay phân tích: "Tập dữ liệu này đang THIẾU nhóm nào đã rơi rụng/bị lọc bỏ từ trước?" — phải lấy mẫu lại bao gồm cả nhóm không sống sót mới hết lệch.',
  },
  {
    id: 'pii-memorization-redaction',
    module: 'M4',
    term: 'PII Memorization & Redaction',
    aliases: ['PII Memorization & Redaction', 'PII Memorization'],
    whatIsIt:
      'Memorization là việc LLM "học thuộc lòng" số CCCD, SĐT trong tập dữ liệu train rồi vô tình phun ra cho người lạ; còn Redaction là quét thay sạch các thông tin đó thành nhãn giả TRƯỚC khi train.',
    aiRole:
      'Là chuẩn tuân thủ Luật BVDLCN 2025 & GDPR khi dùng ticket CSKH/hồ sơ nội bộ để fine-tune AI — loại ngay phương án "nén file ZIP có mật khẩu" vì giải nén vào GPU model vẫn nhớ nguyên PII!',
    formulaPlain:
      'Quy trình chuẩn: Dừng pipeline → Chạy bộ quét NER + Regex đổi `"Nguyễn Văn A, 0912345678"` → `"<NAME>, <PHONE>"` → Kiểm tra log sạch 100% rồi mới đưa vào Fine-tune.',
  },
  {
    id: 'eu-ai-act',
    module: 'M4',
    term: 'EU AI Act 4 Risk Levels',
    aliases: ['EU AI Act 4 Risk Levels', 'EU AI Act'],
    whatIsIt:
      'Đạo luật AI đầu tiên trên thế giới chia mọi hệ thống AI vào 4 bậc rủi ro từ thấp đến cao để áp luật quản lý tương xứng, thay vì cấm hết hay thả nổi hết.',
    aiRole:
      'Là khung chuẩn pháp lý xuất hiện đều đặn ở Module 4 để phân loại ứng dụng AI (đặc biệt nhóm Bị cấm vs Rủi ro cao cần kiểm toán, giải thích & HITL).',
    formulaPlain:
      '4 bậc cần nhớ: (1) **Cấm tuyệt đối** (chấm điểm công dân Social Scoring, đọc cảm xúc tại công sở), (2) **Rủi ro cao** (tuyển dụng, chấm điểm tín dụng, y tế — buộc log + SHAP + HITL), (3) **Hạn chế** (chatbot phải khai báo là AI), (4) **Tối thiểu** (lọc spam, game).',
  },
  {
    id: 'owasp-llm-rbac',
    module: 'M4',
    term: 'OWASP LLM Top 10 RBAC',
    aliases: ['OWASP LLM Top 10 RBAC', 'OWASP LLM Top 10', 'OWASP'],
    whatIsIt:
      'Danh sách 10 lỗ hổng bảo mật nguy hiểm nhất của ứng dụng AI dùng LLM — đứng đầu là Prompt Injection (LLM01), lộ dữ liệu nhạy cảm (LLM02), xử lý đầu ra cẩu thả (LLM05) và Agent quá quyền (LLM06).',
    aiRole:
      'Khẳng định quy tắc vàng bảo mật AI: không chữa cháy bằng lời nhắc Prompt hay ép JSON mà phải khóa ở tầng kiến trúc bằng **RBAC Middleware** + **Least Privilege** + **HITL**.',
    formulaPlain:
      'Khớp lỗ hổng với thuốc trị: `LLM01 Prompt Injection` → lọc quyền RBAC trước Vector DB; `LLM05 Improper Output` → lọc/escape trước khi chạy SQL/HTML; `LLM06 Excessive Agency` → chỉ cấp quyền tối thiểu + HITL cho lệnh ghi.',
  },
  {
    id: 'representation-automation-bias',
    module: 'M4',
    term: 'Representation & Automation Bias',
    aliases: ['Representation & Automation Bias', 'Representation Bias', 'Automation Bias'],
    whatIsIt:
      'Representation Bias là "dữ liệu train thiếu đại diện một nhóm người" (vd 90% ảnh nam khiến AI nhận diện kém nữ); còn Automation Bias là "con người quá ỷ lại vào AI, bấm Đồng ý máy móc không thèm kiểm tra".',
    aiRole:
      'Chứng minh hai nguyên tắc lớn của Đạo đức AI: đổi thuật toán không chữa được Bias dữ liệu (phải thu thập/cân bằng lại data + kiểm toán từng nhóm), và HITL chỉ thật sự hiệu quả khi người duyệt có đủ bằng chứng, thời gian & quyền bác bỏ.',
    formulaPlain:
      'Kiểm toán Fairness: tách riêng Precision/Recall/FPR theo từng nhóm (Nam vs Nữ, vùng miền) thay vì chỉ nhìn tổng; nếu chênh lệch lớn ⇒ khắc phục ở tầng dữ liệu & ngưỡng quyết định theo nhóm.',
  },
];
