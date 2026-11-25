// Modular topics for M2 (CĐ-05: 10q, CĐ-06: 10q, CĐ-07: 10q, CĐ-08: 10q)
export const TOPICS_M2 = [
  {
    "id": "cd-05",
    "code": "CĐ-05",
    "groupId": "code-data",
    "module": "M2",
    "title": "Lập trình Python",
    "subtopics": [
      {
        "label": "Kiểu dữ liệu & Slicing",
        "weight": 25
      },
      {
        "label": "Mutability & Aliasing",
        "weight": 20
      },
      {
        "label": "Hàm / Comprehension / Generator",
        "weight": 25
      },
      {
        "label": "Ngoại lệ & Regex",
        "weight": 15
      },
      {
        "label": "OOP & Dataclass",
        "weight": 15
      }
    ],
    "step1": {
      "essence": "Python trong bài thi Level 3 kiểm tra khả năng truy vết bộ nhớ chính xác không cần IDE gợi ý: phân biệt Mutable/Immutable, viết Comprehension/Generator tiết kiệm RAM, bắt ngoại lệ sạch và cấu trúc code bằng Dataclass/OOP.",
      "formulas": [
        "Slicing a[start:end:step]: lấy từ start đến TRƯỚC end  |  a[-1] cuối  |  a[::-1] đảo ngược",
        "Mutable: list, dict, set  |  Immutable (làm dict key được): int, float, str, tuple, frozenset",
        "Comprehension: [r[\"v\"]*2 for r in recs if r.get(\"v\") is not None]  |  Generator (yield): RAM O(1)",
        "Context Manager: with open(path) as f: (tránh resource leak)  |  re.compile() biên dịch sẵn Regex",
        "@dataclass tự sinh __init__, __repr__, __eq__  |  Dùng field(default_factory=list) cho trường mutable"
      ],
      "problemBlocks": [
        {
          "subtopicIndex": 0,
          "subtopic": "Kiểu dữ liệu & Slicing (25%)",
          "title": "Kiểu dữ liệu (list/dict/set/tuple) & Slicing a[start:end:step]",
          "formulaShort": "a[start:end] lấy TRƯỚC end  |  a[-1] cuối  |  a[::-1] đảo ngược",
          "realProblem": "Trong bài Code tay Python không có IDE nhắc lỗi, làm sao cắt trích chính xác đoạn danh sách và chọn đúng kiểu dữ liệu (list vs tuple vs set vs dict) để không dính lỗi runtime?",
          "aiRole": "Slicing và chọn đúng kiểu cấu trúc tích hợp sẵn quyết định tốc độ tra cứu (`set`/`dict` O(1) vs `list` O(n)) và độ sạch của toàn bộ pipeline tiền xử lý dữ liệu.",
          "plainSteps": "Với `a = [10, 20, 30, 40]`: `a[1:3]` bắt đầu ở chỉ số `1` và dừng TRƯỚC `3` → lấy đúng `3 − 1 = 2` phần tử là `[20, 30]`; `a[-1]` là phần tử cuối `40`; `a[::-1]` đảo ngược thành `[40, 30, 20, 10]`. Chú ý `[1, 2] * 2` trong list Python ra `[1, 2, 1, 2]` (lặp danh sách), KHÔNG nhân từng số như NumPy!"
        },
        {
          "subtopicIndex": 1,
          "subtopic": "Mutability & Aliasing (20%)",
          "title": "Mutability, Aliasing (Copy) & Bẫy Mutable Default Argument",
          "formulaShort": "b = a (chung nhớ) vs b = a.copy()  |  def f(buf=None):",
          "realProblem": "Tại sao sửa bảng `b` lại làm hỏng bảng gốc `a`, tạo ma trận `[[0]*3]*3` sửa 1 ô lại đổi cả 3 dòng, và gọi `def add(x, buf=[])` lần 2 lại dính rác của lần 1?",
          "aiRole": "Truy vết bộ nhớ chính xác ngăn ngừa lỗi rò rỉ dữ liệu chéo giữa các request API và lỗi làm biến dạng tập dữ liệu huấn luyện gốc.",
          "plainSteps": "Bước 1 (Aliasing): `list/dict/set` là Mutable — viết `b = a` chỉ gắn 2 tên vào cùng 1 giỏ (muốn tách dùng `b = a.copy()` hoặc `copy.deepcopy(a)` cho mảng lồng nhau; ma trận 3×3 viết `[[0]*3 for _ in range(3)]`). Bước 2 (Default Arg): thay `def add(x, buf=[]):` bằng `def add(x, buf=None): buf = [] if buf is None else buf`."
        },
        {
          "subtopicIndex": 2,
          "subtopic": "Hàm / Comprehension / Generator (25%)",
          "title": "Hàm, List Comprehension, Generator (yield) & Closure",
          "formulaShort": "[x*2 for x in a if x is not None]  |  yield → RAM O(1)",
          "realProblem": "Cần đọc và lọc file log inference AI nặng 15 GB trên máy chỉ có 8 GB RAM mà không bị tràn bộ nhớ (OOM), đồng thời viết code lọc gọn sạch?",
          "aiRole": "Comprehension rút gọn vòng lặp lọc dữ liệu rõ ràng; Generator (`yield`) truyền dữ liệu từng dòng tốn RAM O(1); còn Closure giúp hàm nhớ cấu hình trạng thái bên ngoài mà không dùng biến toàn cục.",
          "plainSteps": "Thay vì nạp hết file vào list `[line for line in f]` (tốn đủ 15 GB RAM = O(N)), đổi thành Generator `(line for line in f)` hoặc dùng `yield line`: tại mỗi thời điểm máy chỉ giữ đúng 1 dòng trong RAM (`O(1)`). Nhớ kiểm tra rỗng luôn viết `if x is not None` thay vì `if x` (vì `if 0` bị loại oan số `0`!)."
        },
        {
          "subtopicIndex": 3,
          "subtopic": "Ngoại lệ & Regex (15%)",
          "title": "Xử lý Ngoại lệ (try/except/with), Chuỗi & Regex",
          "formulaShort": "with open(...) as f:  |  \"\".join(parts)  |  re.compile()",
          "realProblem": "Làm sao đọc/làm sạch hàng triệu dòng văn bản chứa SĐT, email bẩn mà không rò rỉ file handle, không che giấu bug và không bị chậm O(N²) khi nối chuỗi?",
          "aiRole": "Là nền tảng của pipeline làm sạch text/ẩn danh PII trước khi nạp vào LLM hoặc lưu log hệ thống production.",
          "plainSteps": "Quy tắc 3 bước: (1) Luôn mở file bằng `with open(path, encoding=\"utf-8\") as f:` để tự đóng khi gặp lỗi; (2) Bắt đúng loại ngoại lệ cụ thể (`except ValueError:`), CẤM bọc `except Exception: pass` che lỗi; dùng `d.get(k, 0)` tránh `KeyError`; (3) Nối nhiều chuỗi dùng `\"\".join(parts)` (O(N)) thay vì `s += x` (O(N²)), và biên dịch sẵn mẫu lặp bằng `re.compile(r\"\\d{10}\")`."
        },
        {
          "subtopicIndex": 4,
          "subtopic": "OOP & Dataclass (15%)",
          "title": "OOP & @dataclass đóng gói cấu hình / bản ghi sạch",
          "formulaShort": "@dataclass  |  field(default_factory=list)",
          "realProblem": "Khi thiết kế cấu hình huấn luyện AI (`lr`, `epochs`, `tags`) hoặc kết quả trả về của Agent, làm sao tránh viết hàng chục dòng `__init__`, `__repr__` lặp đi lặp lại mà vẫn an toàn bộ nhớ?",
          "aiRole": "Giúp cấu trúc code hệ thống AI/MLOps gọn gàng, có gợi ý kiểu rõ ràng (type hints) và dễ viết unit test kiểm tra bằng `==`.",
          "plainSteps": "Đặt `@dataclass` ngay trên class: Python tự sinh `__init__`, `__repr__`, `__eq__`. Ví dụ `@dataclass class RunCfg: lr: float = 0.01; tags: list = field(default_factory=list)`. Chú ý: nếu viết thẳng `tags: list = []` Python sẽ ném `ValueError` ngay lập tức để bảo vệ bạn khỏi bẫy mutable default!"
        }
      ],
      "quickExample": {
        "problem": "Đoạn code `def add(x, buf=[]): buf.append(x); return buf` khi gọi `add(1)` rồi `add(2)` trả về gì?",
        "solution": "Lần 1 trả [1], lần 2 trả [1, 2] (dính dữ liệu cũ!). Sửa đúng: `def add(x, buf=None): buf = [] if buf is None else buf`."
      }
    },
    "step2": {
      "keywords": [
        {
          "en": "Mutable vs Immutable",
          "vi": "Khả biến vs Bất biến",
          "short": "list/dict/set sửa tại chỗ được (Mutable); chỉ kiểu bất biến (str, tuple, int) làm được key dict."
        },
        {
          "en": "Shallow vs Deep Copy",
          "vi": "Sao chép nông vs Sao chép sâu",
          "short": "Copy nông chỉ nhân bản lớp ngoài; mảng/dict lồng nhau phải dùng deepcopy để tách rời hoàn toàn."
        },
        {
          "en": "Mutable Default Argument",
          "vi": "Bẫy tham số mặc định mutable",
          "short": "Viết def f(buf=[]) làm dữ liệu lần gọi trước dính sang lần sau; luôn đổi sang buf=None."
        },
        {
          "en": "List Comprehension & Generator",
          "vi": "Biểu thức rút gọn & Bộ sinh dòng",
          "short": "List [...] nạp hết vào RAM O(N); Generator (...) hoặc yield duyệt từng dòng chỉ tốn RAM O(1)."
        },
        {
          "en": "Context Manager",
          "vi": "Quản lý ngữ cảnh (with)",
          "short": "Khối with open(...) tự động đóng file và giải phóng tài nguyên an toàn kể cả khi gặp lỗi."
        },
        {
          "en": "Python Dataclass",
          "vi": "Lớp dữ liệu @dataclass",
          "short": "Tự sinh __init__/__repr__/__eq__ cực gọn; thuộc tính list bắt buộc dùng field(default_factory=list)."
        }
      ],
      "memoryTip": "4 quy tắc Clean Python ăn trọn điểm: (1) So sánh None luôn dùng `is not None`; (2) Không dùng `[]`/`{}` làm tham số mặc định; (3) Không bọc `except Exception: pass` che bug; (4) Nối nhiều chuỗi dùng `\"\".join(parts)` thay vì `+=`.",
      "youtubeQueries": [
        "Python mutable immutable aliasing copy deepcopy explained",
        "Python generators yield vs list comprehension memory",
        "Python dataclass clean code best practices"
      ]
    },
    "step3": {
      "traps": [
        {
          "title": "Bẫy aliasing `b = a` và `[[0]*3]*3`",
          "detail": "Gán `b = a` trỏ cùng vùng nhớ; `[[0]*3]*3` tạo 3 hàng cùng trỏ 1 list (sửa 1 hàng đổi cả 3). Phải dùng `.copy()` hoặc `[[0]*3 for _ in range(3)]`."
        },
        {
          "title": "Gán `x = my_list.sort()` tưởng ra list đã sắp xếp",
          "detail": "`list.sort()` sửa tại chỗ và trả về `None`! Muốn nhận list mới phải dùng `sorted(my_list)`."
        },
        {
          "title": "Nhầm `[1, 2, 3] * 2` với phép nhân NumPy",
          "detail": "List Python cho `[1, 2, 3, 1, 2, 3]` (lặp danh sách), KHÔNG phải `[2, 4, 6]`."
        }
      ]
    },
    "step4": {
      "miniQuiz": [
        {
          "id": "cd05-q1",
          "question": "Kết quả in ra của `a = [10, 20, 30, 40]; print(a[1:3], a[-1])` là gì?",
          "options": [
            "[20, 30, 40] 40",
            "[20, 30] 40",
            "[10, 20] 30",
            "[20, 30] 10"
          ],
          "correctIndex": 1,
          "explanation": "Slicing `a[1:3]` lấy chỉ số 1 và 2 (`[20, 30]`), `a[-1]` là phần tử cuối cùng (`40`)."
        },
        {
          "id": "cd05-q2",
          "question": "Trong `@dataclass`, cách khai báo đúng một thuộc tính danh sách `tags` mặc định rỗng cho mỗi instance là gì?",
          "options": [
            "`tags: list = []`",
            "`tags: list = field(default_factory=list)`",
            "`tags = []`",
            "`tags: tuple = []`"
          ],
          "correctIndex": 1,
          "explanation": "Python dataclass cấm mutable default `[]` trực tiếp (ném ValueError); phải dùng `field(default_factory=list)` để mỗi object có list riêng."
        },
        {
          "id": "cd05-q3",
          "question": "Cần duyệt file log 15 GB trên máy 8 GB RAM mà không tràn bộ nhớ và không rò rỉ file handle. Cách viết chuẩn nhất?",
          "options": [
            "`lines = open(\"app.log\").readlines()`",
            "Dùng `with open(\"app.log\") as f:` kết hợp duyệt từng dòng / Generator (`yield`).",
            "`content = open(\"app.log\").read().split(\"\\n\")`",
            "Nạp toàn bộ vào `list` bằng List Comprehension."
          ],
          "correctIndex": 1,
          "explanation": "Context Manager `with` tự động đóng file và duyệt streaming/Generator chỉ dùng bộ nhớ O(1)."
        },
        {
          "id": "cd05-q4",
          "question": "Đoạn code `grid = [[0] * 3] * 3; grid[0][1] = 9; print(grid[2][1])` in ra kết quả nào và tại sao?",
          "options": [
            "`0`, vì chỉ sửa dòng 0.",
            "`9`, vì phép `* 3` nhân bản 3 tham chiếu cùng trỏ tới 1 list duy nhất (Aliasing).",
            "Báo lỗi `IndexError`.",
            "`None`."
          ],
          "correctIndex": 1,
          "explanation": "Đúng là B: [[0]*3]*3 tạo 3 hàng cùng trỏ một địa chỉ nhớ nên sửa hàng 0 làm hàng 1 và 2 đổi theo! Phải viết [[0]*3 for _ in range(3)]. A nhầm tưởng các hàng độc lập; C và D sai hành vi Python."
        },
        {
          "id": "cd05-q5",
          "question": "Cho đoạn code `x = [3, 1, 2]; y = x.sort(); print(x, y)`. Kết quả in ra là gì?",
          "options": [
            "`[3, 1, 2] [1, 2, 3]`",
            "`[1, 2, 3] [1, 2, 3]`",
            "`[1, 2, 3] None`",
            "Báo lỗi `TypeError`"
          ],
          "correctIndex": 2,
          "explanation": "Đúng là C: `list.sort()` sắp xếp tại chỗ (in-place) trên `x` và trả về `None` nên `y` là `None`. A là hành vi của `sorted(x)`; B sai vì `sort()` không trả list; D sai vì list số nguyên sort bình thường."
        },
        {
          "id": "cd05-q6",
          "question": "Kiểu dữ liệu nào sau đây trong Python có thể dùng làm khóa (`key`) của một `dict`?",
          "options": [
            "`[1, 2]` (list)",
            "`{\"a\": 1}` (dict)",
            "`(1, \"user\")` (tuple chứa các phần tử immutable)",
            "`{1, 2}` (set)"
          ],
          "correctIndex": 2,
          "explanation": "Đúng là C: khóa của dict bắt buộc phải hashable (immutable), và tuple chứa int/str đáp ứng điều kiện này. A (list), B (dict), D (set) đều là mutable nên ném `TypeError: unhashable type`."
        },
        {
          "id": "cd05-q7",
          "question": "Trong Python, kết quả của biểu thức `[1, 2, 3] * 2` là gì?",
          "options": [
            "`[2, 4, 6]`",
            "`[1, 2, 3, 1, 2, 3]`",
            "`[[1, 2, 3], [1, 2, 3]]`",
            "Báo lỗi không nhân được list với số nguyên"
          ],
          "correctIndex": 1,
          "explanation": "Đúng là B: trên list Python thuần, toán tử `* 2` lặp nối danh sách thành `[1, 2, 3, 1, 2, 3]`. A là bẫy nhầm sang NumPy `np.array([1,2,3]) * 2`; C và D sai hành vi Python."
        },
        {
          "id": "cd05-q8",
          "question": "Khi lọc danh sách điểm `scores = [0, None, 5, 10]` để giữ lại mọi điểm hợp lệ (kể cả điểm `0`), cách viết List Comprehension nào ĐÚNG?",
          "options": [
            "`[s for s in scores if s]`",
            "`[s for s in scores if s is not None]`",
            "`[s for s in scores if s != 0]`",
            "`[s for s in scores if s == True]`"
          ],
          "correctIndex": 1,
          "explanation": "Đúng là B: `s is not None` chỉ loại bỏ `None` và giữ nguyên điểm `0`. A sai vì `if 0` đánh giá là False làm mất điểm 0; C cố tình loại 0; D chỉ giữ mỗi giá trị 1."
        },
        {
          "id": "cd05-q9",
          "question": "Tại sao khi nối 50.000 chuỗi nhỏ trong Python nên dùng `\"\".join(parts)` thay vì dùng vòng lặp `res += s`?",
          "options": [
            "Vì `+=` không hoạt động với chuỗi.",
            "Vì chuỗi (`str`) là immutable nên mỗi lần `res += s` phải cấp phát và sao chép lại toàn bộ chuỗi cũ (O(N²)), còn `\"\".join(parts)` chạy tuyến tính O(N).",
            "Vì `join` tự động dịch chuỗi sang tiếng Anh.",
            "Không có khác biệt hiệu năng nào."
          ],
          "correctIndex": 1,
          "explanation": "Đúng là B: `str` bất biến nên cộng dồn trong vòng lặp gây tốn O(N²) thời gian/bộ nhớ; `\"\".join(parts)` tính trước tổng độ dài rồi chép đúng 1 lượt O(N). A, C, D đều sai."
        },
        {
          "id": "cd05-q10",
          "question": "Trong xử lý ngoại lệ & Regex ở code production, thực hành nào là **TỆ NHẤT** cần tránh tuyệt đối?",
          "options": [
            "Dùng `re.compile()` biên dịch sẵn mẫu regex dùng lặp lại hàng triệu lần.",
            "Dùng `d.get(key, 0)` để đọc an toàn tránh `KeyError`.",
            "Viết `try: ... except Exception: pass` để nuốt sạch mọi lỗi mà không ghi log.",
            "Dùng `with open(path) as f:` để tự động đóng file."
          ],
          "correctIndex": 2,
          "explanation": "Đúng là C: nuốt lỗi bằng `except Exception: pass` che giấu hoàn toàn bug nghiêm trọng khiến hệ thống âm thầm sai dữ liệu. A, B, D đều là các best practice chuẩn Clean Python."
        }
      ]
    }
  },
  {
    "id": "cd-06",
    "code": "CĐ-06",
    "groupId": "code-data",
    "module": "M2",
    "title": "Pandas",
    "subtopics": [
      {
        "label": "loc / iloc / query & lọc",
        "weight": 25
      },
      {
        "label": "groupby / agg / pivot / transform",
        "weight": 30
      },
      {
        "label": "merge / concat ghép bảng",
        "weight": 20
      },
      {
        "label": "Missing values & Datetime",
        "weight": 25
      }
    ],
    "step1": {
      "essence": "Pandas là xương sống của mọi pipeline làm sạch và tổng hợp dữ liệu bảng. Nắm vững bộ tứ: lọc an toàn không bị SettingWithCopy, gom nhóm (`agg` vs `transform`), ghép bảng (`merge` vs `concat`) và xử lý thiếu/thời gian không gây Data Leakage.",
      "formulas": [
        "loc[label_start:label_end] (GỒM điểm cuối)  |  iloc[0:2] (KHÔNG gồm điểm cuối)  |  df.query(\"age > 25\")",
        "Lọc kép: df[(df[\"age\"] > 25) & (df[\"region\"] == \"HN\")].sort_values(\"score\", ascending=False)",
        "groupby(\"region\", as_index=False).agg(rev=(\"revenue\", \"sum\"))  |  transform(\"mean\") giữ NGUYÊN số dòng",
        "pd.merge(a, b, on=\"id\", how=\"left\") (JOIN theo khóa)  |  pd.concat([a, b], ignore_index=True) (nối trục)",
        "df.isna().sum()  |  df.ffill() (tránh bfill trên time-series)  |  pd.to_datetime(s, errors=\"coerce\").dt.month"
      ],
      "problemBlocks": [
        {
          "subtopicIndex": 0,
          "subtopic": "loc / iloc / query & lọc (25%)",
          "title": "loc vs iloc, query() & Lọc kép tránh SettingWithCopy",
          "formulaShort": "loc (gồm cuối) · iloc (bỏ cuối) · df[(...) & (...)].copy()",
          "realProblem": "Cần lọc nhóm khách hàng ở Hà Nội trên 25 tuổi từ bảng triệu dòng rồi gắn thêm cột phân hạng mà không bị lỗi cú pháp hay cảnh báo `SettingWithCopyWarning`?",
          "aiRole": "Là bước Data Cleaning mở đầu của mọi pipeline học máy bảng — sai 1 dấu ngoặc hoặc quên `.copy()` sẽ làm sập script hoặc mất âm thầm phép gán nhãn.",
          "plainSteps": "Bước 1: Đặt từng điều kiện trong ngoặc đơn rồi nối bằng `&` / `|` (cấm `and`/`or`), ví dụ `sub = df[(df[\"age\"] > 25) & (df[\"city\"] == \"HN\")].copy()` (hoặc viết gọn `df.query(\"age > 25 and city == 'HN'\").copy()`). Bước 2: Nhớ bảng có index `0, 1, 2, 3` thì `loc[0:2]` lấy **3 dòng** (0, 1, 2), còn `iloc[0:2]` chỉ lấy **2 dòng** (0, 1)."
        },
        {
          "subtopicIndex": 1,
          "subtopic": "groupby / agg / pivot / transform (30%)",
          "title": "groupby().agg(), pivot_table & groupby().transform()",
          "formulaShort": "agg = 1 dòng/nhóm  |  transform = giữ nguyên số dòng gốc",
          "realProblem": "Muốn tính bảng tổng hợp 2 chiều theo (Vùng × Tháng) VÀ tạo cột \"chênh lệch từng đơn so với trung bình vùng\" ngay trên bảng gốc mà không làm mất dòng đơn hàng?",
          "aiRole": "Bộ ba `agg` (báo cáo), `pivot_table` (bảng chéo 2 chiều) và `transform` (tạo đặc trưng so sánh với nhóm ngay trên bảng gốc) là xương sống của Feature Engineering bằng Pandas.",
          "plainSteps": "Với bảng 1.000 đơn thuộc 3 vùng: (1) Báo cáo gọn 3 dòng dùng `df.groupby(\"region\", as_index=False).agg(tong=(\"rev\", \"sum\"))`. (2) Gắn trung bình vùng về đủ 1.000 dòng dùng `df[\"avg_vung\"] = df.groupby(\"region\")[\"rev\"].transform(\"mean\")`, rồi lấy `df[\"rev\"] − df[\"avg_vung\"]`. (3) Xoay bảng chéo dùng `df.pivot_table(index=\"region\", columns=\"month\", values=\"rev\", aggfunc=\"sum\")`."
        },
        {
          "subtopicIndex": 2,
          "subtopic": "merge / concat ghép bảng (20%)",
          "title": "pd.merge() (SQL JOIN) vs pd.concat() ghép bảng",
          "formulaShort": "merge = ghép ngang theo KEY  |  concat = nối chồng trục",
          "realProblem": "Làm sao nối bảng giao dịch `orders` với hồ sơ `customers` mà không đánh rơi đơn hàng của khách mới, và làm sao ghép nối tiếp 12 file log các tháng thành 1 bảng?",
          "aiRole": "Phân biệt đúng `merge` và `concat` giúp ghép nối dữ liệu đa nguồn chuẩn xác, tránh bẫy `inner join` âm thầm xóa mất dữ liệu hoặc trùng lặp chỉ số index.",
          "plainSteps": "Bước 1 (Ghép theo mã ID chung): dùng `pd.merge(orders, customers, on=\"user_id\", how=\"left\")` — `how=\"left\"` giữ nguyên 100% số dòng bảng đơn hàng bên trái (khách chưa có hồ sơ hiện `NaN`). Bước 2 (Xếp chồng nhiều file cùng cột): dùng `pd.concat([t1, t2], ignore_index=True)` để đánh lại số thứ tự 0, 1, 2... sạch sẽ."
        },
        {
          "subtopicIndex": 3,
          "subtopic": "Missing values & Datetime (25%)",
          "title": "Missing Values (isna/ffill) & Datetime / Rolling",
          "formulaShort": "df.isna().sum()  |  ffill() (tránh bfill)  |  to_datetime(errors=\"coerce\")",
          "realProblem": "Bảng cảm biến theo ngày có nhiều ô `NaN` và vài ô ngày tháng viết sai định dạng — làm sao đếm thiếu, điền sạch và tạo trung bình trượt 7 ngày mà không gây Data Leakage?",
          "aiRole": "Xử lý thiếu và thời gian đúng chuẩn là chốt chặn sống còn chống Data Leakage trên bài toán dự báo chuỗi thời gian.",
          "plainSteps": "Bước 1 (Đếm thiếu từng cột): chạy `df.isna().sum()`. Bước 2 (Điền thiếu thời gian): chuỗi `[10, NaN, NaN, 20]` dùng `s.ffill()` kéo quá khứ tới thành `[10, 10, 10, 20]` (CẤM `bfill()` nhìn tương lai và CẤM điền `mean()` toàn bảng trước khi chia Train/Test!). Bước 3 (Ngày tháng): `pd.to_datetime(s, errors=\"coerce\")` biến ngày lỗi thành `NaT` không sập code, rồi dùng `.rolling(7).mean()` tính trung bình trượt 7 ngày."
        }
      ],
      "quickExample": {
        "problem": "Chuỗi `[10, NaN, NaN, 20]` sau `s.ffill()` ra gì? Muốn gắn trung bình `revenue` từng `region` thành cột mới cùng số dòng thì dùng `agg` hay `transform`?",
        "solution": "`s.ffill()` ra `[10, 10, 10, 20]` (lấy giá trị hợp lệ gần nhất phía trước). Muốn giữ nguyên số dòng bảng gốc PHẢI dùng `df.groupby(\"region\")[\"revenue\"].transform(\"mean\")`."
      }
    },
    "step2": {
      "keywords": [
        {
          "en": "loc vs iloc",
          "vi": "Lọc theo nhãn vs theo chỉ số",
          "short": "loc cắt theo tên nhãn (GỒM điểm cuối); iloc cắt theo vị trí số nguyên (BỎ điểm cuối)."
        },
        {
          "en": "groupby agg vs transform",
          "vi": "Gom gọn nhóm vs Giữ nguyên dòng",
          "short": "agg rút gọn mỗi nhóm thành 1 dòng; transform điền giá trị nhóm về đúng số dòng bảng gốc."
        },
        {
          "en": "pd.merge vs pd.concat",
          "vi": "Ghép theo khóa vs Nối trục",
          "short": "merge ghép ngang theo cột ID giống SQL JOIN; concat xếp chồng nhiều bảng cùng cột."
        },
        {
          "en": "SettingWithCopyWarning",
          "vi": "Cảnh báo gán trên bảng cắt",
          "short": "Xảy ra khi sửa trực tiếp trên slice đã lọc; sửa dứt điểm bằng .copy() hoặc gán qua .loc."
        },
        {
          "en": "Forward Fill (ffill)",
          "vi": "Điền xuôi từ quá khứ",
          "short": "Lấy giá trị hợp lệ trước đó kéo tới để điền NaN chuỗi thời gian, tuyệt đối tránh bfill()."
        },
        {
          "en": "pd.to_datetime & rolling",
          "vi": "Chuẩn hóa ngày & Trung bình trượt",
          "short": "Chuyển chuỗi ngày an toàn bằng errors=\"coerce\" và tính trung bình trượt theo cửa sổ K ngày."
        }
      ],
      "memoryTip": "Mẹo phân biệt nhanh: `merge` = ghép ngang theo KEY (như SQL JOIN), `concat` = xếp chồng nhiều file cùng cột; `agg` = thu gọn mỗi nhóm 1 dòng, `transform` = giữ nguyên số dòng gốc!",
      "youtubeQueries": [
        "Pandas loc iloc query filtering tutorial",
        "Pandas groupby agg transform pivot_table explained",
        "Pandas merge vs concat vs join missing values ffill"
      ]
    },
    "step3": {
      "traps": [
        {
          "title": "Dùng `and`/`or` hoặc quên ngoặc đơn khi lọc nhiều điều kiện",
          "detail": "Phải viết `(df[\"a\"] > 1) & (df[\"b\"] < 5)`. Dùng `and` hoặc bỏ ngoặc đơn sẽ báo lỗi ngay lập tức."
        },
        {
          "title": "Dùng `bfill()` hoặc `fillna(df.mean())` trên toàn bảng trước khi chia Train/Test",
          "detail": "Cả hai đều gây Data Leakage! Trên chuỗi thời gian dùng `ffill()`, còn thống kê `mean/median` chỉ tính trên tập Train."
        },
        {
          "title": "Quên `.copy()` dẫn tới `SettingWithCopyWarning`",
          "detail": "Sau khi lọc `sub = df[df[\"age\"] >= 22].copy()` hoặc `drop_duplicates().copy()` mới gán sửa cột an toàn."
        }
      ]
    },
    "step4": {
      "miniQuiz": [
        {
          "id": "cd06-q1",
          "question": "Lệnh nào tạo cột `region_avg` chứa trung bình doanh thu của từng `region` với ĐÚNG số dòng của DataFrame `df` gốc?",
          "options": [
            "`df.groupby(\"region\")[\"revenue\"].mean()`",
            "`df.groupby(\"region\")[\"revenue\"].transform(\"mean\")`",
            "`df.groupby(\"region\").agg({\"revenue\": \"mean\"})`",
            "`pd.concat([df, df.mean()])`"
          ],
          "correctIndex": 1,
          "explanation": "`transform(\"mean\")` broadcast giá trị từng nhóm về đúng chiều dài và index của bảng gốc."
        },
        {
          "id": "cd06-q2",
          "question": "Lệnh nào đếm chính xác số giá trị bị thiếu (`NaN`) trên từng cột của `df`?",
          "options": [
            "`df.isna().count()`",
            "`df.isna().sum()`",
            "`df.count()`",
            "`df.dropna().sum()`"
          ],
          "correctIndex": 1,
          "explanation": "`df.isna()` trả về True/False (1/0) nên `.sum()` cộng đúng số ô thiếu trên từng cột."
        },
        {
          "id": "cd06-q3",
          "question": "Khác biệt cốt lõi giữa `pd.merge()` và `pd.concat()` là gì?",
          "options": [
            "Giống nhau hoàn toàn.",
            "`merge` ghép bảng theo khóa chung (SQL JOIN), còn `concat` nối các DataFrame theo trục (axis=0 hoặc axis=1).",
            "`concat` chỉ dùng cho 1 cột.",
            "`merge` không hỗ trợ `how=\"left\"`."
          ],
          "correctIndex": 1,
          "explanation": "Dùng `pd.merge` khi nối bảng `orders` với `customers` theo `customer_id`; dùng `pd.concat` khi ghép nối log tháng 1 và tháng 2."
        },
        {
          "id": "cd06-q4",
          "question": "DataFrame `df` có index mặc định `0, 1, 2, 3, 4`. Lệnh `df.loc[1:3]` và `df.iloc[1:3]` lần lượt trả về bao nhiêu dòng?",
          "options": [
            "`2` dòng và `2` dòng",
            "`3` dòng (index 1, 2, 3) và `2` dòng (vị trí 1, 2)",
            "`2` dòng và `3` dòng",
            "`3` dòng và `3` dòng"
          ],
          "correctIndex": 1,
          "explanation": "Đúng là B: `loc` cắt theo nhãn và BAO GỒM mốc cuối (1, 2, 3 = 3 dòng); `iloc` cắt theo số thứ tự nguyên và KHÔNG bao gồm mốc cuối (1, 2 = 2 dòng). A, C, D đều nhầm quy tắc biên của loc/iloc."
        },
        {
          "id": "cd06-q5",
          "question": "Câu lệnh Pandas nào lọc ĐÚNG các dòng có `age > 25` VÀ `city == \"HN\"` mà không báo lỗi cú pháp?",
          "options": [
            "`df[df[\"age\"] > 25 and df[\"city\"] == \"HN\"]`",
            "`df[df[\"age\"] > 25 & df[\"city\"] == \"HN\"]`",
            "`df[(df[\"age\"] > 25) & (df[\"city\"] == \"HN\")]`",
            "`df.where(age > 25 && city == \"HN\")`"
          ],
          "correctIndex": 2,
          "explanation": "Đúng là C: Pandas yêu cầu toán tử bitwise `&` và BẮT BUỘC bọc từng điều kiện trong ngoặc đơn `(...)`. A lỗi vì dùng `and` trên Series; B lỗi thứ tự ưu tiên toán tử `&` cao hơn `>`; D dùng cú pháp sai của JS/C."
        },
        {
          "id": "cd06-q6",
          "question": "Sau khi chạy `sub = df[df[\"score\"] >= 80]`, việc gán `sub[\"grade\"] = \"A\"` hay gây cảnh báo `SettingWithCopyWarning`. Cách viết nào sạch và an toàn nhất?",
          "options": [
            "Tắt toàn bộ cảnh báo Python bằng `warnings.filterwarnings(\"ignore\")` rồi kệ.",
            "Thêm `.copy()` khi tách (`sub = df[df[\"score\"] >= 80].copy()`) hoặc gán trực tiếp trên bảng gốc bằng `df.loc[df[\"score\"] >= 80, \"grade\"] = \"A\"`.",
            "Chuyển DataFrame sang list rồi gán.",
            "Đổi `>=` thành `==`."
          ],
          "correctIndex": 1,
          "explanation": "Đúng là B: gọi `.copy()` tách rõ vùng nhớ mới hoặc dùng `.loc[mask, col]` để gán trực tiếp một nhịp trên `df`. A chỉ che giấu bug tiềm ẩn; C và D không giải quyết đúng vấn đề."
        },
        {
          "id": "cd06-q7",
          "question": "Dữ liệu nhiệt độ cảm biến theo từng giờ là `[22.0, NaN, NaN, 28.0]`. Phương án điền thiếu nào an toàn KHÔNG gây Data Leakage chuỗi thời gian?",
          "options": [
            "`s.bfill()` cho `[22.0, 28.0, 28.0, 28.0]`",
            "`s.ffill()` cho `[22.0, 22.0, 22.0, 28.0]`",
            "`s.fillna(s.mean())` trên toàn bộ cả năm trước khi tách Test",
            "Thay mọi `NaN` bằng `9999`"
          ],
          "correctIndex": 1,
          "explanation": "Đúng là B: `ffill()` chỉ kéo giá trị quá khứ (22.0) đi tới nên không nhìn lén tương lai. A (`bfill`) nhìn trước giá trị 28.0 ở tương lai gây Leakage; C dùng thông số tương lai của cả năm cũng gây Leakage; D bơm outlier giả."
        },
        {
          "id": "cd06-q8",
          "question": "Cột `order_date` chứa lẫn vài chuỗi lỗi `\"N/A\"`. Muốn chuyển sang kiểu `datetime` mà biến các ô lỗi thành `NaT` thay vì văng lỗi làm sập script, truyền tham số nào?",
          "options": [
            "`pd.to_datetime(df[\"order_date\"], errors=\"raise\")`",
            "`pd.to_datetime(df[\"order_date\"], errors=\"coerce\")`",
            "`pd.to_datetime(df[\"order_date\"], drop=True)`",
            "`df[\"order_date\"].astype(int)`"
          ],
          "correctIndex": 1,
          "explanation": "Đúng là B: `errors=\"coerce\"` ép mọi giá trị không parse được thành `NaT` để pipeline tiếp tục xử lý an toàn. A (mặc định) sẽ ném ValueError làm crash chương trình; C và D sai tham số/kiểu."
        },
        {
          "id": "cd06-q9",
          "question": "Cần tạo bảng tổng hợp chéo 2 chiều: hàng là `region`, cột là `month`, giá trị là tổng `revenue`. Hàm Pandas nào sinh ra đúng cấu trúc này nhanh nhất?",
          "options": [
            "`df.pivot_table(index=\"region\", columns=\"month\", values=\"revenue\", aggfunc=\"sum\")`",
            "`df.sort_values([\"region\", \"month\"])`",
            "`df.drop_duplicates([\"region\", \"month\"])`",
            "`df.isna().sum()`"
          ],
          "correctIndex": 0,
          "explanation": "Đúng là A: `pivot_table` chuyên xoay bảng tổng hợp 2 chiều theo `index × columns` với hàm gộp `aggfunc`. B chỉ sắp xếp; C chỉ xóa dòng trùng; D chỉ đếm thiếu."
        },
        {
          "id": "cd06-q10",
          "question": "Khi chạy `pd.concat([df_jan, df_feb])` theo chiều dọc, lỗi tinh tế nào thường xảy ra nếu quên `ignore_index=True`?",
          "options": [
            "Mất toàn bộ dữ liệu tháng 2.",
            "Hai bảng bị trùng lặp chỉ số index (ví dụ có hai dòng cùng mang index `0`), dễ gây bug khi truy xuất bằng `.loc[0]`.",
            "Tất cả cột số bị đổi sang chuỗi.",
            "Báo lỗi không thể nối hai DataFrame cùng cột."
          ],
          "correctIndex": 1,
          "explanation": "Đúng là B: `pd.concat` mặc định giữ nguyên index cũ của từng bảng nên index `0, 1, 2...` bị lặp lại — thêm `ignore_index=True` sẽ đánh lại index liên tục sạch sẽ. A, C, D đều không đúng."
        }
      ]
    }
  },
  {
    "id": "cd-07",
    "code": "CĐ-07",
    "groupId": "code-data",
    "module": "M2",
    "title": "NumPy & Big-O",
    "subtopics": [
      {
        "label": "ndarray / shape / axis / broadcasting",
        "weight": 30
      },
      {
        "label": "Vector hóa phép toán",
        "weight": 15
      },
      {
        "label": "Big-O & đệ quy / phân tích thời gian",
        "weight": 30
      },
      {
        "label": "Hash / Heap / Deque / Two Pointers",
        "weight": 25
      }
    ],
    "step1": {
      "essence": "NumPy tính toán song song tầng C nhanh gấp hàng chục lần vòng lặp Python, còn Big-O + cấu trúc dữ liệu (Hash Set/Dict, Deque, Heap, Two Pointers) quyết định dịch vụ chịu tải hàng nghìn RPS chạy mượt hay sập.",
      "formulas": [
        "Broadcasting: khớp shape từ PHẢI sang TRÁI (= nhau hoặc = 1)  |  (4, 3) + (3,) ✔  |  (4, 3) + (4,) ✘",
        "axis=0: gộp dọc theo CỘT  |  axis=1: gộp ngang theo HÀNG  |  a * b (element-wise) ≠ a @ b (nhân ma trận)",
        "Lookup: x in set/dict = O(1), x in list = O(n), len(d) = O(1), Binary Search = O(log n), Sort = O(n log n)",
        "Moving Average RPS cao: deque(maxlen=K) + running_sum = O(1)  |  Top-K: Min-Heap = O(n log k)",
        "Two Pointers / Sliding Window giảm vòng lặp lồng O(n²) xuống O(n); Memoization (@lru_cache) tránh đệ quy O(2^n)"
      ],
      "problemBlocks": [
        {
          "subtopicIndex": 0,
          "subtopic": "ndarray / shape / axis / broadcasting (30%)",
          "title": "Quy tắc Broadcasting & Bẫy phình ma trận (3,1) − (3,)",
          "formulaShort": "Khớp shape từ PHẢI sang TRÁI (= nhau hoặc = 1)",
          "realProblem": "Làm sao trừ điểm dự đoán `prediction` với đáp án thật `y` cho cả bảng dữ liệu bằng 1 dòng NumPy mà không vô tình phình 3 con số thành bảng 9 số sai lệch?",
          "aiRole": "Broadcasting cho phép tính ma trận siêu gọn, nhưng chỉ cần lệch hình dáng (cột trừ hàng) là Gradient Descent âm thầm tính sai mà không hề báo lỗi.",
          "plainSteps": "Bước 1: Căn 2 kích thước (shape) thẳng lề PHẢI. Bước 2: So từng chiều từ phải sang trái — hợp lệ nếu bằng nhau hoặc có 1 chiều bằng 1. Ví dụ `(4, 3) + (3,)` coi như `(4, 3) + (1, 3)` → hợp lệ ✔; còn `(3, 1) − (3,)` coi như `(3, 1) − (1, 3)` → phình thành `(3, 3)`! Phải dựng thành cột bằng `y[:, None]` thành `(3, 1)`."
        },
        {
          "subtopicIndex": 0,
          "subtopic": "ndarray / shape / axis / broadcasting (30%)",
          "title": "ndarray View vs Copy, axis=0 vs axis=1 & Phép nhân * vs @",
          "formulaShort": "axis=0: tính CỘT · axis=1: tính HÀNG · slice = View (.copy() để tách)",
          "realProblem": "Với bảng dữ liệu `X` (mỗi hàng là 1 khách, mỗi cột là 1 đặc trưng), làm sao tính trung bình theo từng cột, nhân ma trận chuẩn và cắt mảng mà không sửa hỏng mảng gốc?",
          "aiRole": "Đặt đúng `axis` cho bước chuẩn hóa/Softmax và nhớ `slice` NumPy trả về View giúp tránh hai lỗi sai kết quả phổ biến nhất khi code NumPy.",
          "plainSteps": "Với mảng 2×3 `[[1, 2, 3], [4, 5, 6]]`: `sum(axis=0)` ép dọc tính từng CỘT ra `[5, 7, 9]`; `sum(axis=1)` ép ngang tính từng HÀNG ra `[6, 15]`. Slicing `sub = m[0:2, 1:]` tạo View chung bộ nhớ (sửa `sub[0,0]=99` làm `m[0,1]` thành `99` — phải viết `.copy()`!). Còn `a * b` là nhân từng ô, khác hoàn toàn `a @ b` là nhân ma trận."
        },
        {
          "subtopicIndex": 1,
          "subtopic": "Vector hóa phép toán (15%)",
          "title": "Vectorization (Vector hóa) so với Vòng lặp Python",
          "formulaShort": "a * 2 + b (C-level) nhanh gấp 50–100× vòng for Python",
          "realProblem": "Cần tính khoảng cách hoặc nhân hệ số cho 1.000.000 phần tử — tại sao viết vòng `for` trong Python tốn gần nửa giây còn đổi sang biểu thức NumPy chạy xong trong vài mili-giây?",
          "aiRole": "Vectorization đẩy toàn bộ phép tính xuống tầng C/SIMD chạy song song trên bộ nhớ liên tục, là chìa khóa giúp tiền xử lý dữ liệu lớn và huấn luyện AI đạt tốc độ thực chiến.",
          "plainSteps": "Thay vì lặp từng phần tử `[x * 2 + 1 for x in arr]` (mỗi vòng Python phải kiểm tra kiểu dữ liệu 1.000.000 lần), chuyển sang mảng NumPy rồi viết 1 dòng `arr * 2 + 1` (hay chuẩn hóa cả bảng `X_norm = (X - X.mean(axis=0)) / X.std(axis=0)`). Kết quả khớp hệt nhau nhưng tốc độ nhanh gấp hàng chục lần!"
        },
        {
          "subtopicIndex": 2,
          "subtopic": "Big-O & đệ quy / phân tích thời gian (30%)",
          "title": "Phân tích Big-O, Hash O(1) vs List O(n) & Đệ quy Memoization",
          "formulaShort": "O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2^n)",
          "realProblem": "Cần đối chiếu 1 triệu user với 50.000 tài khoản bị chặn hoặc tính hàm đệ quy Fibonacci — làm sao biết đoạn code chạy trong 0.2 giây hay sẽ treo máy hàng giờ?",
          "aiRole": "Phân tích Big-O giúp nhận diện ngay vòng lặp lồng O(N×M) và đệ quy trùng lặp O(2^n) để tối ưu xuống O(N) trước khi hệ thống production sập dưới tải cao.",
          "plainSteps": "Bước 1 (Hash O(1)): Kiểm tra `u in banned_list` trong vòng lặp 1 triệu user tốn `1.000.000 × 50.000 = 50 tỷ` phép so sánh; đổi sang `banned = set(banned_list)` trước vòng lặp chỉ còn `1.000.000 + 50.000 = 1,05 triệu` bước (`O(N + M)`). Bước 2 (Đệ quy): Fibonacci thường gọi lặp lại vô số lần tốn `O(2^n)`; gắn `@lru_cache` (Memoization) nhớ kết quả đã tính kéo tụt ngay xuống `O(n)`! (Và nhớ `len(d)` luôn là `O(1)`)."
        },
        {
          "subtopicIndex": 3,
          "subtopic": "Hash / Heap / Deque / Two Pointers (25%)",
          "title": "Deque Sliding Window O(1), Min-Heap Top-K & Two Pointers",
          "formulaShort": "deque + running_sum = O(1)  |  Min-Heap = O(n log k)  |  Two Pointers = O(n)",
          "realProblem": "Hệ thống nhận 5.000 RPS cần tính Moving Average 10.000 lượt gần nhất, lọc Top-10 sản phẩm điểm cao nhất từ 1 triệu món, hoặc tìm 2 số có tổng bằng Target trên mảng đã sắp xếp?",
          "aiRole": "Bộ 3 mẫu thuật toán thực chiến thay thế cách làm ngây thơ (`list.pop(0)` O(n), `sum(window)` O(k), 2 vòng `for` O(n²)) giúp dịch vụ AI chịu tải cao cực mượt.",
          "plainSteps": "1) Moving Average O(1): dùng `deque(maxlen=K)` + `running_sum = running_sum + mới − cũ` (chỉ 1 phép cộng + 1 phép trừ!). 2) Top-K: dùng `heapq.nlargest(k, arr)` (Min-Heap cỡ k tốn `O(n log k)` nhanh hơn sort `O(n log n)`). 3) Two Pointers: đặt con trỏ trái `L = 0` và phải `R = n−1` trên mảng đã sort; nếu `a[L] + a[R] > target` thì giảm `R`, nhỏ hơn thì tăng `L` → đúng 1 lượt duyệt `O(n)`."
        }
      ],
      "quickExample": {
        "problem": "Cho `m = np.array([[1,2,3],[4,5,6],[7,8,9]])`. Chạy `sub = m[0:2, 1:]; sub[0, 0] = 99`. Giá trị `m[0, 1]` bây giờ là bao nhiêu?",
        "solution": "Là `99`! Vì basic slicing trong NumPy trả về **View** dùng chung vùng nhớ với `m`. Muốn tách mảng độc lập phải viết `.copy()`."
      }
    },
    "step2": {
      "keywords": [
        {
          "en": "NumPy Broadcasting Rules",
          "vi": "Quy tắc nhân bản chiều NumPy",
          "short": "So kích thước từ phải sang trái (= nhau hoặc = 1); cẩn thận cột (3,1) trừ hàng (3,) phình thành (3,3)."
        },
        {
          "en": "NumPy View vs Copy",
          "vi": "Nhìn chung bộ nhớ vs Bản sao độc lập",
          "short": "Slicing NumPy tạo View (sửa bản cắt làm đổi mảng gốc); muốn tách riêng phải gọi .copy()."
        },
        {
          "en": "Axis 0 vs Axis 1",
          "vi": "Trục dọc theo cột vs ngang theo hàng",
          "short": "axis=0 ép dọc tính ra kết quả từng CỘT; axis=1 ép ngang tính ra kết quả từng HÀNG."
        },
        {
          "en": "Vectorization",
          "vi": "Vector hóa phép toán",
          "short": "Giao cả mảng số cho lõi C của NumPy tính song song thay vì dùng vòng for Python chậm chạp."
        },
        {
          "en": "Hash Table O(1) vs List O(n)",
          "vi": "Tra cứu bảng băm O(1) vs Danh sách O(n)",
          "short": "Kiểm tra x in set/dict tốn đúng 1 bước O(1), nhanh gấp hàng nghìn lần quét list O(n)."
        },
        {
          "en": "Deque Sliding Window & Heap Top-K",
          "vi": "Cửa sổ trượt Deque & Đống tìm Top-K",
          "short": "deque + running_sum tính Moving Average O(1); Min-Heap (heapq) lấy Top-K trong O(n log k)."
        }
      ],
      "memoryTip": "Nhớ 3 cặp đối lập: (1) `axis=0` tính từng CỘT, `axis=1` tính từng HÀNG; (2) `a * b` nhân từng ô, `a @ b` nhân ma trận; (3) `set/dict` tìm `O(1)`, `deque` cửa sổ trượt `O(1)`, `heapq` lấy Top-K `O(n log k)`.",
      "youtubeQueries": [
        "NumPy slicing broadcasting view vs copy tutorial",
        "Big O notation Python data structures time complexity",
        "Sliding window deque and heap Top K Python"
      ]
    },
    "step3": {
      "traps": [
        {
          "title": "Sửa slice NumPy làm hỏng luôn mảng gốc (View vs Copy)",
          "detail": "Khác với Python `list`, slice cơ bản của NumPy không copy bộ nhớ. Boolean masking `a[a > 0]` mới trả về bản copy."
        },
        {
          "title": "Gọi `sum(window)` bên trong vòng lặp Moving Average",
          "detail": "Làm độ phức tạp vọt lên O(K) mỗi request thay vì dùng biến `running_sum` để đạt O(1)."
        },
        {
          "title": "Nghĩ `len(d)` tốn O(n) hoặc dùng `list.pop(0)` làm Queue",
          "detail": "`len(d)` luôn là O(1), ngược lại `list.pop(0)` tốn O(n) — Queue luôn phải dùng `collections.deque.popleft()`."
        }
      ]
    },
    "step4": {
      "miniQuiz": [
        {
          "id": "cd07-q1",
          "question": "Cho ma trận NumPy `X` shape `(5, 3)`. Phép cộng nào sau đây HỢP LỆ theo quy tắc Broadcasting?",
          "options": [
            "`X + np.ones((5,))`",
            "`X + np.ones((3,))`",
            "`X + np.ones((3, 5))`",
            "`X + np.ones((2, 3))`"
          ],
          "correctIndex": 1,
          "explanation": "Khớp từ phải sang trái: `(5, 3)` và `(3,)` khớp ở chiều cuối `3 == 3`."
        },
        {
          "id": "cd07-q2",
          "question": "Hệ thống tính Moving Average độ trễ của 10.000 request gần nhất ở tốc độ hàng nghìn RPS. Cấu trúc dữ liệu tối ưu nhất?",
          "options": [
            "Python `list` + `sum()` — O(N)",
            "`collections.deque(maxlen=10000)` + biến `running_sum` — O(1)",
            "Min-Heap — O(log N)",
            "Dictionary lưu toàn bộ lịch sử"
          ],
          "correctIndex": 1,
          "explanation": "Cập nhật `running_sum = running_sum + new_val - old_val` cùng `deque` đạt O(1) tuyệt đối."
        },
        {
          "id": "cd07-q3",
          "question": "Cần kiểm tra 1 triệu `user_id` có thuộc danh sách đen 50.000 người không. Tối ưu từ O(N·M) xuống O(N + M) bằng cách nào?",
          "options": [
            "Đổi danh sách đen thành `tuple`.",
            "Chuyển danh sách đen thành `set` trước vòng lặp rồi dùng `u in banned_set`.",
            "Dùng vòng lặp `while` thay `for`.",
            "Sắp xếp danh sách 1 triệu user."
          ],
          "correctIndex": 1,
          "explanation": "Tra cứu trên `set` tốn trung bình O(1) nhờ Hash Table."
        },
        {
          "id": "cd07-q4",
          "question": "Cho mảng `a = np.array([[1, 2, 3], [4, 5, 6]])` (shape `(2, 3)`). Kết quả của `a.sum(axis=0)` và `a.sum(axis=1)` lần lượt là gì?",
          "options": [
            "`[6, 15]` và `[5, 7, 9]`",
            "`[5, 7, 9]` và `[6, 15]`",
            "`21` và `21`",
            "Báo lỗi lệch chiều"
          ],
          "correctIndex": 1,
          "explanation": "Đúng là B: `axis=0` gộp dọc theo từng CỘT → `[1+4, 2+5, 3+6] = [5, 7, 9]`; `axis=1` gộp ngang theo từng HÀNG → `[1+2+3, 4+5+6] = [6, 15]`. A bị đảo ngược hai trục; C là `a.sum()` không truyền axis; D sai."
        },
        {
          "id": "cd07-q5",
          "question": "Trong NumPy, khi trừ cột `pred` shape `(3, 1)` với mảng 1D `y` shape `(3,)`, hình dáng kết quả `pred - y` là gì và sửa bằng cách nào?",
          "options": [
            "Shape `(3, 1)`, không cần sửa.",
            "Bị Broadcasting phình thành `(3, 3)`; sửa bằng `pred - y[:, None]` để dựng `y` thành `(3, 1)`.",
            "Báo `ValueError` ngay lập tức.",
            "Shape `(3,)`, biến thành hàng ngang."
          ],
          "correctIndex": 1,
          "explanation": "Đúng là B: `(3, 1)` trừ `(3,)` (coi như `(1, 3)`) sẽ broadcast thành ma trận vuông `(3, 3)`! Dựng `y[:, None]` tạo shape `(3, 1)` giúp trừ cột với cột chuẩn xác. A, C, D là các bẫy kinh điển phòng thi."
        },
        {
          "id": "cd07-q6",
          "question": "Sự khác biệt giữa `A * B` và `A @ B` trên hai ma trận NumPy 2×2 là gì?",
          "options": [
            "Giống hệt nhau.",
            "`A * B` nhân từng phần tử cùng vị trí (element-wise), còn `A @ B` thực hiện phép nhân ma trận đại số tuyến tính.",
            "`A @ B` chỉ dùng cho chuỗi văn bản.",
            "`A * B` là phép nhân ma trận còn `A @ B` là cộng từng ô."
          ],
          "correctIndex": 1,
          "explanation": "Đúng là B: trong NumPy, `*` là nhân từng ô tương ứng (Hadamard product), còn `@` (tương đương `np.matmul`) là nhân ma trận. A, C, D đều nhầm lẫn ký hiệu."
        },
        {
          "id": "cd07-q7",
          "question": "Cần tìm `K = 10` sản phẩm có điểm cao nhất từ `N = 1.000.000` sản phẩm mà không muốn sắp xếp toàn bộ 1 triệu món. Cấu trúc dữ liệu & độ phức tạp tối ưu nhất?",
          "options": [
            "Vòng lặp lồng tìm max 10 lần — `O(N²)`",
            "Min-Heap cỡ `K` (`heapq.nlargest`) — `O(N log K)`",
            "Dùng `list.pop(0)` — `O(N)`",
            "Sắp xếp nổi bọt Bubble Sort — `O(N²)`"
          ],
          "correctIndex": 1,
          "explanation": "Đúng là B: duy trì Min-Heap kích thước K chỉ tốn O(log K) mỗi phần tử ⇒ tổng O(N log K), nhanh hơn nhiều so với sort toàn bộ O(N log N) hay O(N²). A, C, D sai thuật toán/độ phức tạp."
        },
        {
          "id": "cd07-q8",
          "question": "Trên một mảng số nguyên ĐÃ SẮP XẾP tăng dần, kỹ thuật **Two Pointers** (hai con trỏ đầu–cuối) giúp tìm cặp số có tổng bằng `target` với độ phức tạp bao nhiêu?",
          "options": [
            "`O(n²)`",
            "`O(n)` với bộ nhớ phụ `O(1)`",
            "`O(2^n)`",
            "`O(n log n)`"
          ],
          "correctIndex": 1,
          "explanation": "Đúng là B: con trỏ `left` chỉ đi sang phải, `right` chỉ đi sang trái nên gặp nhau sau tối đa `n` bước ⇒ O(n) thời gian và O(1) bộ nhớ phụ. A là brute-force 2 vòng for; C và D sai đánh giá độ phức tạp."
        },
        {
          "id": "cd07-q9",
          "question": "Tại sao gọi `list.pop(0)` trong vòng lặp làm hàng đợi (Queue) cho 100.000 phần tử lại rất chậm, và cấu trúc thay thế chuẩn là gì?",
          "options": [
            "Vì `pop(0)` tốn `O(n)` do phải dịch chuyển toàn bộ phần tử phía sau lên trên; thay bằng `collections.deque.popleft()` tốn `O(1)`.",
            "Vì `pop(0)` xóa phần tử cuối cùng.",
            "Vì `list` không chứa được quá 1.000 phần tử.",
            "Thay bằng `tuple.pop(0)` sẽ đạt `O(1)`."
          ],
          "correctIndex": 0,
          "explanation": "Đúng là A: mảng động Python phải dời N−1 ô nhớ sau mỗi lần xóa đầu list nên N lần thành O(N²); `deque` là danh sách liên kết hai đầu nên `popleft()` chỉ tốn O(1). B, C, D đều sai (tuple thậm chí không có `.pop()`)."
        },
        {
          "id": "cd07-q10",
          "question": "Hàm đệ quy Fibonacci `fib(n) = fib(n-1) + fib(n-2)` chạy rất chậm (`O(2^n)`). Gắn decorator nào của Python để giảm độ phức tạp xuống `O(n)`?",
          "options": [
            "`@staticmethod`",
            "`@functools.lru_cache` (Memoization — lưu kết quả bài toán con đã tính)",
            "`@property`",
            "`@dataclass`"
          ],
          "correctIndex": 1,
          "explanation": "Đúng là B: `@lru_cache` lưu bộ nhớ đệm (Memoization) các giá trị `fib(k)` đã tính nên mỗi bài toán con chỉ tính đúng 1 lần ⇒ O(n). A, C, D là các decorator hoàn toàn khác mục đích."
        }
      ]
    }
  },
  {
    "id": "cd-08",
    "code": "CĐ-08",
    "groupId": "code-data",
    "module": "M2",
    "title": "SQL",
    "subtopics": [
      {
        "label": "SELECT / WHERE / NULL",
        "weight": 15
      },
      {
        "label": "INNER / LEFT / Anti JOIN",
        "weight": 25
      },
      {
        "label": "GROUP BY / HAVING",
        "weight": 25
      },
      {
        "label": "Window Function (ROW_NUMBER / LAG / SUM OVER)",
        "weight": 20
      },
      {
        "label": "CTE & Partitioning / Index",
        "weight": 15
      }
    ],
    "step1": {
      "essence": "SQL ở Level 3 không dừng ở SELECT cơ bản mà kiểm tra thứ tự thực thi, xử lý NULL 3 giá trị, Anti-Join, hàm cửa sổ (Window Functions) và thiết kế Partitioning + B-Tree Index cho bảng trăm triệu dòng.",
      "formulas": [
        "Thứ tự thực thi: FROM/JOIN → WHERE → GROUP BY → HAVING → SELECT (Window) → ORDER BY → LIMIT",
        "NULL: dùng IS NULL / IS NOT NULL / COALESCE(col, 0)  |  COUNT(*) đếm cả NULL, COUNT(col) bỏ NULL",
        "Anti-Join (user chưa đặt đơn): LEFT JOIN orders o ON u.id = o.user_id WHERE o.id IS NULL",
        "Window: ROW_NUMBER() / RANK() / DENSE_RANK() OVER (PARTITION BY dept ORDER BY score DESC)",
        "Running Total: SUM(amt) OVER (PARTITION BY uid ORDER BY ts)  |  Partitioning + Composite Index (Leftmost Prefix)"
      ],
      "problemBlocks": [
        {
          "subtopicIndex": 0,
          "subtopic": "SELECT / WHERE / NULL (15%)",
          "title": "Thứ tự thực thi SQL, SELECT / WHERE & Bẫy NULL 3 giá trị",
          "formulaShort": "FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT",
          "realProblem": "Tại sao viết `WHERE discount = NULL` luôn trả về 0 dòng, và tại sao `COUNT(discount)` lại ra số nhỏ hơn `COUNT(*)` trên cùng một bảng?",
          "aiRole": "Hiểu logic 3 giá trị (TRUE / FALSE / UNKNOWN) của NULL và thứ tự chạy SQL giúp trích xuất tập dữ liệu huấn luyện đầy đủ, không âm thầm mất mẫu thiếu dữ liệu.",
          "plainSteps": "Bước 1 (NULL): mọi phép so sánh `= NULL` hay `!= NULL` đều ra UNKNOWN (bị loại sạch!) — bắt buộc dùng `IS NULL` / `IS NOT NULL` hoặc thay thế bằng `COALESCE(discount, 0)`. Bước 2 (COUNT): trên bảng 100 dòng có 20 ô `discount` trống, `COUNT(*)` đếm đủ `100` dòng còn `COUNT(discount)` bỏ qua 20 ô NULL chỉ trả `80`."
        },
        {
          "subtopicIndex": 1,
          "subtopic": "INNER / LEFT / Anti JOIN (25%)",
          "title": "INNER JOIN, LEFT JOIN & Anti-Join tìm bản ghi thiếu",
          "formulaShort": "INNER (khớp cả 2) · LEFT (giữ hết trái) · Anti-Join (LEFT + WHERE b.id IS NULL)",
          "realProblem": "Cần nối bảng `users` với `orders` để xem doanh số mọi khách hàng (kể cả người mua 0 đồng), và rút riêng danh sách những khách đã đăng ký nhưng chưa từng đặt đơn nào?",
          "aiRole": "Chọn đúng loại JOIN ngăn thảm họa làm mất sạch nhóm khách chưa tương tác (gây Survivorship Bias trong tập train Churn/Retention).",
          "plainSteps": "Giả sử có 100 user, 70 người có đơn và 30 người chưa đặt đơn: `INNER JOIN` chỉ giữ đúng 70 người có đơn (mất 30 người!). `LEFT JOIN` giữ đủ 100 người (30 người chưa đặt có `orders.id = NULL`). Muốn lọc riêng đúng 30 người chưa đặt (Anti-Join): viết `FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE o.id IS NULL`."
        },
        {
          "subtopicIndex": 2,
          "subtopic": "GROUP BY / HAVING (25%)",
          "title": "GROUP BY, Hàm tổng hợp & Phân biệt WHERE vs HAVING",
          "formulaShort": "WHERE (lọc dòng thô TRƯỚC) → GROUP BY → HAVING (lọc tổng SAU)",
          "realProblem": "Cần lọc các khu vực có tổng doanh thu đơn đã thanh toán vượt 100.000 — tại sao viết `WHERE SUM(revenue) > 100000` lại bị SQL báo lỗi cú pháp ngay lập tức?",
          "aiRole": "Giúp viết truy vấn tổng hợp KPI/tạo đặc trưng theo nhóm chuẩn chỉnh trong bài thi SQL mà không bao giờ sập bẫy đặt hàm tổng hợp nhầm chỗ.",
          "plainSteps": "Theo thứ tự chạy SQL: `WHERE` chạy TRƯỚC `GROUP BY` nên lúc đó chưa hề tính xong `SUM`. Cách viết chuẩn 3 nhịp: (1) `WHERE status = 'paid'` lọc từng đơn đã trả tiền trước, (2) `GROUP BY region` gom theo khu vực, (3) `HAVING SUM(revenue) > 100000` lọc những khu vực có tổng vượt 100.000."
        },
        {
          "subtopicIndex": 3,
          "subtopic": "Window Function (ROW_NUMBER / LAG / SUM OVER) (20%)",
          "title": "Window Function: ROW_NUMBER, RANK, DENSE_RANK, LAG & SUM OVER",
          "formulaShort": "FUNC() OVER (PARTITION BY nhóm ORDER BY thứ_tự)",
          "realProblem": "Làm sao lấy đúng Top-1 nhân viên doanh số cao nhất mỗi phòng ban (chỉ 1 dòng/phòng kể cả khi đồng hạng), so doanh số với tháng liền trước và tính tổng lũy kế mà không gộp mất dòng?",
          "aiRole": "Window Function giữ nguyên chi tiết từng dòng thay vì gộp lại như `GROUP BY`, là vũ khí số 1 tạo lag features và running total cho mô hình dự báo chuỗi thời gian.",
          "plainSteps": "Với 3 người điểm `[100, 100, 90]` trong cùng phòng (`PARTITION BY dept ORDER BY rev DESC`): `ROW_NUMBER()` đánh `(1, 2, 3)` (tách được đúng 1 người đầu); `RANK()` đánh `(1, 1, 3)` (nhảy số 2); `DENSE_RANK()` đánh `(1, 1, 2)`. Hàm `LAG(rev, 1, 0)` lấy doanh số dòng ngay trên (dòng đầu mỗi phòng trả mặc định `0` thay vì `NULL`), còn `SUM(rev) OVER (PARTITION BY uid ORDER BY dt)` tính tổng cộng dồn từng ngày."
        },
        {
          "subtopicIndex": 4,
          "subtopic": "CTE & Partitioning / Index (15%)",
          "title": "CTE (WITH) & Tối ưu bảng lớn bằng Partitioning + B-Tree Index",
          "formulaShort": "WITH cte AS (...) SELECT ... WHERE rn = 1  |  Partitioning + Leftmost Prefix",
          "realProblem": "Làm sao lọc `rn = 1` từ Window Function mà không lỗi cú pháp, và làm sao kéo tốc độ truy vấn bảng `inference_logs` 500 triệu dòng từ 3 giây xuống dưới 200ms?",
          "aiRole": "CTE tách truy vấn phức tạp sạch sẽ, còn Table Partitioning + Composite B-Tree Index là đáp án kiến trúc DB chuẩn cho hệ thống AI phục vụ lượng log khổng lồ.",
          "plainSteps": "Bước 1 (CTE): Bọc Window Function vào `WITH r AS (SELECT *, ROW_NUMBER() OVER (...) AS rn FROM sales) SELECT * FROM r WHERE rn = 1`. Bước 2 (Tối ưu 500 triệu dòng): Chia Partition theo `created_at` (chỉ quét đúng phân vùng tháng cần tìm — Partition Pruning) kết hợp Composite B-Tree Index `(user_id, created_at)` và nhớ quy tắc **Leftmost Prefix** (phải lọc cột trái `user_id` mới tận dụng hết index!)."
        }
      ],
      "quickExample": {
        "problem": "Bảng điểm có `[100, 100, 90]`. Cho biết giá trị của `ROW_NUMBER()`, `RANK()`, `DENSE_RANK()` tại dòng điểm `90`?",
        "solution": "`ROW_NUMBER = 3`, `RANK = 3` (nhảy số 2 vì có hai hạng 1), `DENSE_RANK = 2` (liên tục không nhảy số)."
      }
    },
    "step2": {
      "keywords": [
        {
          "en": "SQL Execution Order",
          "vi": "Thứ tự thực thi câu lệnh SQL",
          "short": "FROM/JOIN → WHERE → GROUP BY → HAVING → SELECT (Window) → ORDER BY → LIMIT."
        },
        {
          "en": "WHERE vs HAVING",
          "vi": "Lọc từng dòng vs Lọc sau gom nhóm",
          "short": "WHERE lọc dữ liệu thô trước GROUP BY; HAVING lọc kết quả hàm tổng hợp (SUM/COUNT) sau GROUP BY."
        },
        {
          "en": "LEFT JOIN Anti-Join",
          "vi": "Tìm bản ghi không khớp (Anti-Join)",
          "short": "Dùng LEFT JOIN rồi lọc WHERE b.id IS NULL để tìm khách chưa từng đặt đơn nào."
        },
        {
          "en": "Window Functions ROW_NUMBER LAG",
          "vi": "Hàm cửa sổ xếp hạng & nhìn dòng trước",
          "short": "Tính xếp hạng/lũy kế theo phân vùng mà giữ nguyên số dòng gốc; dòng đầu của LAG luôn NULL."
        },
        {
          "en": "CTE WITH Clause",
          "vi": "Bảng tạm CTE (WITH)",
          "short": "Bọc truy vấn có Window Function vào WITH ... AS (...) để lọc WHERE rn = 1 ở bên ngoài."
        },
        {
          "en": "PostgreSQL Partitioning & B-Tree Index",
          "vi": "Phân vùng bảng & Chỉ mục B-Tree",
          "short": "Chia bảng log trăm triệu dòng theo ngày (Partition Pruning) + Composite Index đạt tốc độ < 200ms."
        }
      ],
      "memoryTip": "Nhớ 3 quy tắc vàng SQL: (1) Lọc từng dòng dùng `WHERE`, lọc tổng hợp `SUM/COUNT` dùng `HAVING`; (2) Bảng log 500M dòng chậm → `Partitioning theo created_at + B-Tree Index`; (3) Lấy Top-1 mỗi nhóm → `CTE + ROW_NUMBER() OVER (PARTITION BY ...) = 1`.",
      "youtubeQueries": [
        "SQL window functions ROW_NUMBER RANK DENSE_RANK LAG tutorial",
        "SQL execution order WHERE vs HAVING vs NULL traps",
        "PostgreSQL table partitioning and B-Tree composite index explained"
      ]
    },
    "step3": {
      "traps": [
        {
          "title": "Viết `WHERE col = NULL` hoặc đặt `SUM(x)` vào `WHERE`",
          "detail": "Trong SQL, `col = NULL` luôn trả UNKNOWN (0 dòng) — phải dùng `IS NULL`. Hàm tổng hợp chỉ được đặt trong `HAVING`."
        },
        {
          "title": "Dùng `INNER JOIN` khi tìm bản ghi không khớp hoặc `COUNT(col)` tưởng đếm mọi dòng",
          "detail": "`INNER JOIN` loại bỏ ngay các bản ghi không khớp; `COUNT(col)` bỏ qua dòng có `col IS NULL`."
        },
        {
          "title": "Vi phạm quy tắc Leftmost Prefix của Composite Index `(user_id, created_at)`",
          "detail": "Chỉ lọc `WHERE created_at >= ...` mà bỏ qua cột đầu `user_id` sẽ không dùng hiệu quả Composite Index đó."
        }
      ]
    },
    "step4": {
      "miniQuiz": [
        {
          "id": "cd08-q1",
          "question": "Bảng `inference_logs` PostgreSQL đạt 500 triệu dòng khiến API mất 3 giây (yêu cầu < 200ms). Giải pháp kiến trúc DB triệt để nhất?",
          "options": [
            "Thêm Redis cache TTL 24 giờ cho mọi query.",
            "Áp dụng Table Partitioning theo `created_at`/`user_id` kết hợp B-Tree Index.",
            "Xóa toàn bộ log cũ hơn 30 ngày mỗi đêm.",
            "Chuyển toàn bộ sang MongoDB."
          ],
          "correctIndex": 1,
          "explanation": "Partitioning + B-Tree Index giúp Partition Pruning thu hẹp phạm vi quét DB bền vững mà không mất dữ liệu lịch sử."
        },
        {
          "id": "cd08-q2",
          "question": "Bảng có 100 dòng, cột `discount` có 20 ô `NULL`. Kết quả của `COUNT(*)` và `COUNT(discount)` lần lượt là?",
          "options": [
            "100 và 100",
            "100 và 80",
            "80 và 80",
            "100 và NULL"
          ],
          "correctIndex": 1,
          "explanation": "`COUNT(*)` đếm mọi dòng (100), còn `COUNT(discount)` bỏ qua 20 ô NULL (80)."
        },
        {
          "id": "cd08-q3",
          "question": "Câu SQL nào đúng để lọc các `region` có tổng doanh thu > 100.000 chỉ tính các đơn `status = 'paid'`?",
          "options": [
            "`... WHERE SUM(revenue) > 100000 AND status = 'paid' GROUP BY region`",
            "`... WHERE status = 'paid' GROUP BY region HAVING SUM(revenue) > 100000`",
            "`... HAVING status = 'paid' GROUP BY region WHERE SUM(revenue) > 100000`",
            "`... GROUP BY region WHERE status = 'paid'`"
          ],
          "correctIndex": 1,
          "explanation": "Thứ tự chuẩn: `WHERE` lọc dòng trước, `GROUP BY` gom nhóm, rồi `HAVING` lọc trên hàm tổng hợp `SUM(revenue)`."
        },
        {
          "id": "cd08-q4",
          "question": "Thứ tự thực thi thực tế của các mệnh đề trong câu truy vấn SQL nào sau đây là ĐÚNG?",
          "options": [
            "`SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY`",
            "`FROM/JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT`",
            "`WHERE → FROM → SELECT → HAVING → GROUP BY`",
            "`GROUP BY → WHERE → FROM → SELECT → LIMIT`"
          ],
          "correctIndex": 1,
          "explanation": "Đúng là B: SQL luôn nạp bảng (`FROM/JOIN`), lọc dòng (`WHERE`), gom nhóm (`GROUP BY`), lọc nhóm (`HAVING`), rồi mới tính cột/Window ở `SELECT`, sắp xếp `ORDER BY` và cắt `LIMIT`. A, C, D đều sai thứ tự chạy thực tế."
        },
        {
          "id": "cd08-q5",
          "question": "Muốn tìm tất cả khách hàng trong bảng `users` nhưng **CHƯA TỪNG** có đơn hàng nào trong bảng `orders`, câu truy vấn Anti-Join chuẩn là gì?",
          "options": [
            "`SELECT u.* FROM users u INNER JOIN orders o ON u.id = o.user_id WHERE o.id IS NULL`",
            "`SELECT u.* FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE o.id IS NULL`",
            "`SELECT u.* FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE o.id = NULL`",
            "`SELECT u.* FROM users u RIGHT JOIN orders o ON u.id = o.user_id`"
          ],
          "correctIndex": 1,
          "explanation": "Đúng là B: `LEFT JOIN` giữ toàn bộ `users` (người chưa mua sẽ có `o.id` là `NULL`), rồi `WHERE o.id IS NULL` lọc đúng nhóm chưa mua. A sai vì INNER JOIN đã loại bỏ người không khớp từ đầu; C sai vì `= NULL` luôn trả UNKNOWN (0 dòng); D giữ bảng `orders`."
        },
        {
          "id": "cd08-q6",
          "question": "Tại sao câu SQL `SELECT *, ROW_NUMBER() OVER (PARTITION BY dept ORDER BY rev DESC) AS rn FROM sales WHERE rn = 1` lại báo lỗi cú pháp?",
          "options": [
            "Vì SQL không hỗ trợ hàm `ROW_NUMBER()`.",
            "Vì `WHERE` chạy TRƯỚC `SELECT`, lúc đó bí danh `rn` và Window Function chưa tồn tại — phải bọc vào CTE `WITH` rồi lọc ở ngoài.",
            "Vì thiếu dấu chấm phẩy ở cuối.",
            "Vì `PARTITION BY` phải đặt sau `WHERE`."
          ],
          "correctIndex": 1,
          "explanation": "Đúng là B: theo thứ tự thực thi, `WHERE` chạy trước `SELECT` nên chưa thể tham chiếu cột Window Function `rn`; giải pháp chuẩn là dùng CTE `WITH ranked AS (...) SELECT * FROM ranked WHERE rn = 1`. A, C, D sai nguyên nhân."
        },
        {
          "id": "cd08-q7",
          "question": "Hàm `LAG(rev, 1) OVER (PARTITION BY store_id ORDER BY month)` trả về giá trị gì ở tháng ĐẦU TIÊN của cửa hàng thứ 2?",
          "options": [
            "Trả về doanh thu tháng cuối cùng của cửa hàng thứ 1.",
            "Trả về `NULL` (vì `PARTITION BY store_id` cô lập từng cửa hàng và dòng đầu chưa có dòng trước; muốn ra `0` phải viết `LAG(rev, 1, 0)`).",
            "Trả về `0` mặc định.",
            "Báo lỗi không có dòng trước đó."
          ],
          "correctIndex": 1,
          "explanation": "Đúng là B: `PARTITION BY` reset hoàn toàn cửa sổ cho mỗi `store_id` nên dòng đầu trả `NULL` nếu không truyền giá trị default thứ 3. A hiểu sai tác dụng PARTITION BY; C nhầm có sẵn default 0; D sai vì SQL không báo lỗi."
        },
        {
          "id": "cd08-q8",
          "question": "Khi có hai nhân viên đồng hạng cao nhất `[100, 100, 90]`, muốn lấy **đúng 1 dòng/phòng ban** thì nên dùng `ROW_NUMBER()` hay `RANK()` với `WHERE rn = 1`?",
          "options": [
            "`RANK()`, vì luôn chỉ ra đúng 1 dòng.",
            "`ROW_NUMBER()`, vì luôn đánh số duy nhất `1, 2, 3` (còn `RANK()` gán cả hai người 100 là hạng `1` nên trả về 2 dòng!).",
            "`DENSE_RANK()`, vì gán `1, 2, 3`.",
            "Cả 3 hàm đều trả về đúng 1 dòng."
          ],
          "correctIndex": 1,
          "explanation": "Đúng là B: với `[100, 100, 90]`, `ROW_NUMBER()` cho `(1, 2, 3)` nên `rn = 1` chắc chắn trả đúng 1 dòng; cả `RANK()` `(1, 1, 3)` và `DENSE_RANK()` `(1, 1, 2)` đều có hai dòng hạng 1. A, C, D đều sập bẫy đồng hạng."
        },
        {
          "id": "cd08-q9",
          "question": "Bảng `logs` đã tạo Composite B-Tree Index trên `(user_id, created_at)`. Truy vấn nào tận dụng được tối đa Index này theo quy tắc **Leftmost Prefix**?",
          "options": [
            "`WHERE created_at >= '2025-01-01'` (bỏ qua cột đầu `user_id`)",
            "`WHERE user_id = 42 AND created_at >= '2025-01-01'`",
            "`WHERE LOWER(CAST(user_id AS TEXT)) LIKE '%42%'`",
            "`WHERE status = 'ok'`"
          ],
          "correctIndex": 1,
          "explanation": "Đúng là B: lọc đúng cột ngoài cùng bên trái `user_id` rồi tới `created_at` khớp chuẩn Leftmost Prefix của B-Tree. A bỏ qua cột trái `user_id`; C bọc hàm + wildcard `%` đầu làm vô hiệu hóa B-Tree index; D lọc cột không nằm trong index."
        },
        {
          "id": "cd08-q10",
          "question": "Câu lệnh nào tính **tổng doanh thu lũy kế theo ngày (Running Total)** cho từng khách hàng `uid` mà VẪN giữ nguyên từng dòng giao dịch?",
          "options": [
            "`SELECT uid, SUM(amt) FROM orders GROUP BY uid`",
            "`SELECT uid, dt, amt, SUM(amt) OVER (PARTITION BY uid ORDER BY dt) AS running_total FROM orders`",
            "`SELECT uid, COUNT(*) OVER () FROM orders`",
            "`SELECT uid, MAX(amt) FROM orders HAVING SUM(amt) > 0`"
          ],
          "correctIndex": 1,
          "explanation": "Đúng là B: `SUM(amt) OVER (PARTITION BY uid ORDER BY dt)` cộng dồn theo thứ tự ngày riêng cho từng khách mà không gộp mất dòng. A gộp mỗi khách còn 1 dòng; C chỉ đếm tổng toàn bảng; D sai cú pháp/ý nghĩa."
        }
      ]
    }
  }
];
