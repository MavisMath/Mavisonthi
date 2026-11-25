import examData from '../data/index.js';
import { GLOSSARY_DATA } from '../data/glossaryData.js';

// Canonical mapping for ambiguous AI / Math / Data acronyms and common Vietnamese AI phrases
const CANONICAL_WIKI_MAP = {
  // Math & Linear Algebra (M1)
  pca: { en: 'Principal component analysis', vi: 'Phép phân tích thành phần chính', module: 'M1' },
  'phân tích thành phần chính': { en: 'Principal component analysis', vi: 'Phép phân tích thành phần chính', module: 'M1' },
  svd: { en: 'Singular value decomposition', vi: 'Phân tích giá trị suy biến', module: 'M1' },
  nmf: { en: 'Non-negative matrix factorization', module: 'M1' },
  eigenvalue: { en: 'Eigenvalues and eigenvectors', vi: 'Trị riêng và vectơ riêng', module: 'M1' },
  eigenvalues: { en: 'Eigenvalues and eigenvectors', vi: 'Trị riêng và vectơ riêng', module: 'M1' },
  eigenvector: { en: 'Eigenvalues and eigenvectors', vi: 'Trị riêng và vectơ riêng', module: 'M1' },
  eigenvectors: { en: 'Eigenvalues and eigenvectors', vi: 'Trị riêng và vectơ riêng', module: 'M1' },
  'trị riêng': { en: 'Eigenvalues and eigenvectors', vi: 'Trị riêng và vectơ riêng', module: 'M1' },
  'vector riêng': { en: 'Eigenvalues and eigenvectors', vi: 'Trị riêng và vectơ riêng', module: 'M1' },
  'nhân ma trận': { en: 'Matrix multiplication', vi: 'Phép nhân ma trận', module: 'M1' },
  'ma trận nghịch đảo': { en: 'Invertible matrix', vi: 'Ma trận khả nghịch', module: 'M1' },
  'chuyển vị': { en: 'Transpose', vi: 'Ma trận chuyển vị', module: 'M1' },
  'đường chéo chính': { en: 'Main diagonal', module: 'M1' },
  hessian: { en: 'Hessian matrix', vi: 'Ma trận Hesse', module: 'M1' },
  jacobian: { en: 'Jacobian matrix and determinant', module: 'M1' },
  'đạo hàm riêng': { en: 'Partial derivative', vi: 'Đạo hàm riêng', module: 'M1' },
  softmax: { en: 'Softmax function', module: 'M1' },
  sigmoid: { en: 'Sigmoid function', module: 'M1' },
  relu: { en: 'Rectifier (neural networks)', module: 'M1' },
  adam: { en: 'Stochastic gradient descent', module: 'M1' },
  sgd: { en: 'Stochastic gradient descent', module: 'M1' },
  'hàm mất mát': { en: 'Loss function', module: 'M1' },
  'hàm kích hoạt': { en: 'Activation function', module: 'M1' },
  'lan truyền ngược': { en: 'Backpropagation', vi: 'Lan truyền ngược', module: 'M1' },
  'phương sai': { en: 'Variance', vi: 'Phương sai', module: 'M1' },
  'độ lệch chuẩn': { en: 'Standard deviation', vi: 'Độ lệch chuẩn', module: 'M1' },
  'kỳ vọng': { en: 'Expected value', vi: 'Giá trị kỳ vọng', module: 'M1' },
  iqr: { en: 'Interquartile range', module: 'M1' },
  ci: { en: 'Confidence interval', vi: 'Khoảng tin cậy', module: 'M1' },
  se: { en: 'Standard error', module: 'M1' },
  poisson: { en: 'Poisson distribution', vi: 'Phân phối Poisson', module: 'M1' },
  bernoulli: { en: 'Bernoulli distribution', vi: 'Phân phối Bernoulli', module: 'M1' },
  binomial: { en: 'Binomial distribution', vi: 'Phân phối nhị thức', module: 'M1' },
  gaussian: { en: 'Normal distribution', vi: 'Phân phối chuẩn', module: 'M1' },
  'phân phối chuẩn': { en: 'Normal distribution', vi: 'Phân phối chuẩn', module: 'M1' },
  bonferroni: { en: 'Bonferroni correction', module: 'M1' },

  // Code & Data (M2)
  'b-tree': { en: 'B-tree', module: 'M2' },
  cte: { en: 'Hierarchical and recursive queries in SQL', module: 'M2' },
  pandas: { en: 'Pandas (software)', module: 'M2' },
  numpy: { en: 'NumPy', module: 'M2' },
  ndarray: { en: 'NumPy', module: 'M2' },
  regex: { en: 'Regular expression', vi: 'Biểu thức chính quy', module: 'M2' },
  heap: { en: 'Heap (data structure)', module: 'M2' },
  'min-heap': { en: 'Heap (data structure)', module: 'M2' },
  'hash table': { en: 'Hash table', vi: 'Bảng băm', module: 'M2' },
  'cửa sổ trượt': { en: 'Sliding window protocol', module: 'M2' },
  memoization: { en: 'Memoization', module: 'M2' },

  // AI, Neural Networks, ML, LLM, MLOps (M3)
  'tầng mạng nơ-ron': { en: 'Layer (deep learning)', module: 'M3' },
  'lớp mạng nơ-ron': { en: 'Layer (deep learning)', module: 'M3' },
  'mạng nơ-ron': { en: 'Neural network (machine learning)', vi: 'Mạng nơ-ron nhân tạo', module: 'M3' },
  'mạng nơ-ron sâu': { en: 'Deep learning', vi: 'Học sâu', module: 'M3' },
  'trọng số mạng nơ-ron': { en: 'Neural network (machine learning)', vi: 'Mạng nơ-ron nhân tạo', module: 'M3' },
  'trọng số': { en: 'Neural network (machine learning)', vi: 'Mạng nơ-ron nhân tạo', module: 'M3' },
  'học sâu': { en: 'Deep learning', vi: 'Học sâu', module: 'M3' },
  'học máy': { en: 'Machine learning', vi: 'Học máy', module: 'M3' },
  embedding: { en: 'Word embedding', vi: 'Vectơ từ', module: 'M3' },
  embeddings: { en: 'Word embedding', vi: 'Vectơ từ', module: 'M3' },
  'embedding văn bản': { en: 'Word embedding', vi: 'Vectơ từ', module: 'M3' },
  mse: { en: 'Mean squared error', module: 'M3' },
  rmse: { en: 'Root mean square deviation', module: 'M3' },
  mae: { en: 'Mean absolute error', module: 'M3' },
  knn: { en: 'K-nearest neighbors algorithm', module: 'M3' },
  svm: { en: 'Support vector machine', vi: 'Máy vectơ hỗ trợ', module: 'M3' },
  'k-means': { en: 'K-means clustering', module: 'M3' },
  xgboost: { en: 'XGBoost', module: 'M3' },
  lightgbm: { en: 'LightGBM', module: 'M3' },
  'random forest': { en: 'Random forest', module: 'M3' },
  'naive bayes': { en: 'Naive Bayes classifier', module: 'M3' },
  bagging: { en: 'Bootstrap aggregating', module: 'M3' },
  boosting: { en: 'Boosting (machine learning)', module: 'M3' },
  overfitting: { en: 'Overfitting', module: 'M3' },
  underfitting: { en: 'Overfitting', module: 'M3' },
  regularization: { en: 'Regularization (mathematics)', module: 'M3' },
  lasso: { en: 'Lasso (statistics)', module: 'M3' },
  ridge: { en: 'Ridge regression', module: 'M3' },
  dropout: { en: 'Dilution (neural networks)', module: 'M3' },
  shap: { en: 'Shapley value', module: 'M3' },
  'roc-auc': { en: 'Receiver operating characteristic', module: 'M3' },
  roc: { en: 'Receiver operating characteristic', module: 'M3' },
  f1: { en: 'F-score', module: 'M3' },
  'f1-score': { en: 'F-score', module: 'M3' },
  transformer: { en: 'Transformer (deep learning architecture)', module: 'M3' },
  'self-attention': { en: 'Attention (machine learning)', module: 'M3' },
  attention: { en: 'Attention (machine learning)', module: 'M3' },
  rag: { en: 'Retrieval-augmented generation', module: 'M3' },
  llm: { en: 'Large language model', vi: 'Mô hình ngôn ngữ lớn', module: 'M3' },
  hnsw: { en: 'Hierarchical navigable small world', module: 'M3' },
  bm25: { en: 'Okapi BM25', module: 'M3' },
  rlhf: { en: 'Reinforcement learning from human feedback', module: 'M3' },
  'fine-tuning': { en: 'Fine-tuning (deep learning)', module: 'M3' },
  quantization: { en: 'Quantization (signal processing)', module: 'M3' },
  distillation: { en: 'Knowledge distillation', module: 'M3' },
  'knowledge distillation': { en: 'Knowledge distillation', module: 'M3' },
  hallucination: { en: 'Hallucination (artificial intelligence)', module: 'M3' },
  'ảo giác': { en: 'Hallucination (artificial intelligence)', module: 'M3' },
  ner: { en: 'Named-entity recognition', module: 'M3' },
  docker: { en: 'Docker (software)', module: 'M3' },
  mlops: { en: 'MLOps', module: 'M3' },
  'ks-test': { en: 'Kolmogorov–Smirnov test', module: 'M3' },
  'giảm chiều dữ liệu': { en: 'Dimensionality reduction', module: 'M3' },

  // Logic, Ethics & Law (M4)
  gdpr: { en: 'General Data Protection Regulation', module: 'M4' },
  'eu ai act': { en: 'Artificial Intelligence Act', module: 'M4' },
  owasp: { en: 'OWASP', module: 'M4' },
  'survivorship bias': { en: 'Survivorship bias', module: 'M4' },
  'automation bias': { en: 'Automation bias', module: 'M4' },
  'ngụy biện': { en: 'Fallacy', vi: 'Ngụy biện', module: 'M4' },
};

// Domain relevance validator: summary MUST relate to tech, AI, math, data, code, logic, or law/ethics
const DOMAIN_RELEVANCE_REGEX =
  /(machine learning|artificial intelligence|deep learning|neural network|language model|transformer|algorithm|data structure|computer science|computing|software|programming|database|sql|python|mathematics|mathematical|linear algebra|calculus|statistics|statistical|probability|matrix|vector|tensor|optimization|regression|classification|clustering|gradient|derivative|eigenvalue|variance|distribution|hypothesis|inference|latency|cache|encryption|security|privacy|regulation|law|logic|fallacy|boolean|set theory|information retrieval|natural language|trí tuệ nhân tạo|học máy|học sâu|mạng nơ-ron|nơ-ron|thuật toán|cấu trúc dữ liệu|khoa học máy tính|phần mềm|lập trình|cơ sở dữ liệu|dữ liệu|toán học|đại số|giải tích|thống kê|xác suất|ma trận|vectơ|vector|tối ưu|hồi quy|phân loại|phân cụm|đạo hàm|phương sai|phân phối|giả thuyết|kiểm định|độ trễ|bộ nhớ đệm|mã hóa|bảo mật|quyền riêng tư|pháp lý|luật|mệnh đề|ngụy biện|biểu thức chính quy|ngôn ngữ tự nhiên|mô hình ngôn ngữ|truy xuất thông tin)/i;

// Hard blocklist for obviously off-topic Wikipedia summaries (geography, biography, sports, history, biology)
const OFF_TOPIC_WIKI_REGEX =
  /(thành phố trực thuộc|tỉnh của việt nam|huyện thuộc tỉnh|xã thuộc huyện|phường thuộc|thủ đô của|quốc gia tại|sông tại|dãy núi|di sản thế giới|triều đại|hoàng đế|vị vua|cầu thủ bóng đá|ca sĩ người|diễn viên người|bộ phim điện ảnh|album phòng thu|loài thực vật|loài chim|loài cá|city in vietnam|capital of|province of|municipality in|commune in|district of|footballer|association football|singer-songwriter|studio album|television series|species of|genus of|dynasty)/i;

const MODULE_DETECT_RULES = [
  { module: 'M1', re: /(matrix|vector|algebra|eigen|svd|pca|calculus|gradient|derivative|probability|bayes|variance|statistic|distribution|p-value|confidence|test|ma trận|vectơ|xác suất|thống kê|đạo hàm|tích phân|phương sai)/i },
  { module: 'M2', re: /(python|pandas|numpy|sql|database|query|index|b-tree|algorithm|complexity|big-o|data structure|heap|queue|hash|regex|slicing|dataframe|cơ sở dữ liệu|lập trình|cấu trúc dữ liệu|thuật toán)/i },
  { module: 'M4', re: /(ethics|bias|fairness|privacy|gdpr|law|act|security|owasp|injection|logic|fallacy|contrapositive|de morgan|đạo đức|pháp lý|bảo mật|ngụy biện|luật|quyền riêng tư)/i },
];

const GEMINI_TIMEOUT_MS = 8000;

function hasVietnameseDiacritics(text) {
  return /[àáảãạăắằẳẵặâấầẩẫậđèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵ]/i.test(
    text
  );
}

function normalizeForOverlap(str) {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function computeTokenOverlap(term, targetText) {
  const stopWords = new Set(['la', 'gi', 'cua', 'trong', 'va', 'cac', 'mot', 'the', 'of', 'in', 'and', 'for', 'a', 'an']);
  const termTokens = normalizeForOverlap(term)
    .split(' ')
    .filter((t) => t.length >= 2 && !stopWords.has(t));
  if (termTokens.length === 0) return 0;

  const targetNorm = normalizeForOverlap(targetText);
  let matched = 0;
  for (const tok of termTokens) {
    if (targetNorm.includes(tok)) matched += 1;
  }
  return matched / termTokens.length;
}

/**
 * Validates whether a fetched Wikipedia summary is genuinely on-topic
 * (AI, Math, Data, Code, Logic, or Law/Ethics) and not a junk/off-topic page like "Huế".
 */
export function isValidTechnicalWikiSummary(summary, searchedTerm, fromCanonicalMap = false) {
  if (!summary || !summary.extract || summary.extract.length < 35) return false;

  const combined = `${summary.title || ''} ${summary.description || ''} ${summary.extract || ''}`;

  // Reject geography, biographies, movies, sports, biology unconditionally
  if (OFF_TOPIC_WIKI_REGEX.test(combined)) {
    return false;
  }

  // Must actually belong to AI / Math / Data / Code / Logic / Law domain
  if (!DOMAIN_RELEVANCE_REGEX.test(combined)) {
    return false;
  }

  // If discovered via free-text search (not canonical map), ensure the article relates to the searched term
  if (!fromCanonicalMap) {
    const titleOverlap = computeTokenOverlap(searchedTerm, summary.title || '');
    const fullOverlap = computeTokenOverlap(searchedTerm, combined);
    // Reject if neither title nor text meaningfully shares tokens with searchedTerm
    if (titleOverlap < 0.34 && fullOverlap < 0.6) {
      return false;
    }
  }

  return true;
}

async function fetchJsonSafe(url, timeoutMs = 6000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchWikiSummary(lang, title) {
  if (!title) return null;
  const encoded = encodeURIComponent(title.replace(/\s+/g, '_'));
  const data = await fetchJsonSafe(
    `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encoded}`
  );
  if (!data || !data.extract || data.type === 'disambiguation') return null;
  return {
    lang,
    title: data.title,
    description: data.description || '',
    extract: data.extract.trim(),
    url:
      data.content_urls?.desktop?.page ||
      `https://${lang}.wikipedia.org/wiki/${encoded}`,
  };
}

async function fetchVietnameseLanglink(enTitle) {
  if (!enTitle) return null;
  const url = `https://en.wikipedia.org/w/api.php?action=query&prop=langlinks&lllang=vi&titles=${encodeURIComponent(
    enTitle
  )}&format=json&origin=*`;
  const data = await fetchJsonSafe(url);
  const pages = data?.query?.pages;
  if (!pages) return null;
  const firstPage = Object.values(pages)[0];
  return firstPage?.langlinks?.[0]?.['*'] || null;
}

async function searchBestWikiTitle(lang, query) {
  const clean = query.trim();
  const quoted = `"${clean.replace(/"/g, '')}"`;

  // Proper parentheses + phrase quoting so MediaWiki does NOT match unrelated articles containing only "toán học" or "AI"
  const domainQuery =
    lang === 'vi'
      ? `${quoted} (AI OR "học máy" OR "toán học" OR "lập trình" OR "thống kê" OR "dữ liệu" OR "nơ-ron")`
      : `${quoted} ("machine learning" OR "artificial intelligence" OR "deep learning" OR statistics OR "linear algebra" OR "computer science" OR algorithm)`;

  const titleQuery = `intitle:${quoted}`;

  const [titleRes, domainRes] = await Promise.all([
    fetchJsonSafe(
      `https://${lang}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
        titleQuery
      )}&srlimit=5&format=json&origin=*`
    ),
    fetchJsonSafe(
      `https://${lang}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
        domainQuery
      )}&srlimit=5&format=json&origin=*`
    ),
  ]);

  const candidates = [
    ...(titleRes?.query?.search ?? []),
    ...(domainRes?.query?.search ?? []),
  ];
  if (candidates.length === 0) return null;

  const lowerTerm = clean.toLowerCase();
  const seen = new Set();
  let best = null;
  let bestScore = 0; // Require strictly positive relevance score

  for (const item of candidates) {
    if (!item?.title || seen.has(item.title)) continue;
    seen.add(item.title);

    const titleLower = item.title.toLowerCase();
    const snippetClean = (item.snippet || '').replace(/<[^>]+>/g, '');
    const combined = `${item.title} ${snippetClean}`;

    if (/disambiguation|định hướng/i.test(titleLower)) continue;
    if (OFF_TOPIC_WIKI_REGEX.test(combined)) continue;

    const isDomainHit = DOMAIN_RELEVANCE_REGEX.test(combined);
    const titleOverlap = computeTokenOverlap(clean, item.title);
    const fullOverlap = computeTokenOverlap(clean, combined);

    // Must match our technical domain OR be an exact title match
    if (!isDomainHit && titleLower !== lowerTerm) continue;
    if (titleOverlap < 0.34 && fullOverlap < 0.5) continue;

    let score = 0;
    if (titleLower === lowerTerm) score += 120;
    else if (titleLower.includes(lowerTerm)) score += 70;
    score += Math.round(titleOverlap * 50);
    score += Math.round(fullOverlap * 20);
    if (isDomainHit) score += 45;

    if (score > bestScore) {
      bestScore = score;
      best = item.title;
    }
  }

  // Minimum quality bar to prevent garbage fallback titles
  return bestScore >= 65 ? best : null;
}

async function translateEnToVi(text) {
  const trimmed = (text || '').trim();
  if (!trimmed) return '';
  const shortened =
    trimmed.length > 460
      ? `${trimmed.slice(0, 455).replace(/\s+\S*$/, '')}.`
      : trimmed;

  const data = await fetchJsonSafe(
    `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      shortened
    )}&langpair=en|vi`,
    6000
  );
  const translated = data?.responseData?.translatedText;
  if (
    typeof translated === 'string' &&
    translated.trim() &&
    !/MYMEMORY WARNING/i.test(translated)
  ) {
    return translated.trim();
  }
  return shortened;
}

function splitSentences(text) {
  return (text || '')
    .replace(/\s+/g, ' ')
    .trim()
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function detectModule(term, combinedText, fallbackModule = 'M3') {
  const hint = CANONICAL_WIKI_MAP[term.trim().toLowerCase()];
  if (hint?.module) return hint.module;
  for (const rule of MODULE_DETECT_RULES) {
    if (rule.re.test(combinedText)) return rule.module;
  }
  return fallbackModule;
}

function findLocalExamMatches(term) {
  const lower = term.trim().toLowerCase();
  const glossaryHit = GLOSSARY_DATA.find(
    (g) =>
      g.term.toLowerCase() === lower ||
      (g.aliases ?? []).some((a) => a.toLowerCase() === lower)
  );

  const flashcardHit = (examData.flashcards ?? []).find((fc) => {
    const q = fc.question.toLowerCase();
    const tag = (fc.tag || '').toLowerCase();
    return (
      tag === lower ||
      q.startsWith(`${lower} `) ||
      q.startsWith(`${lower}:`) ||
      q.startsWith(`${lower}?`) ||
      q.includes(`(${lower})`) ||
      q.includes(` ${lower} `)
    );
  });

  return { glossaryHit, flashcardHit };
}

async function requestGeminiExplain({ term, wikiSummary = '', context = '' }) {
  if (typeof fetch !== 'function' || typeof window === 'undefined') {
    return { ok: false, reason: 'non_browser', message: '' };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);

  try {
    const res = await fetch('/api/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        term,
        wikiSummary,
        context,
      }),
      signal: controller.signal,
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      return {
        ok: false,
        reason: data?.reason || `http_${res.status}`,
        message: data?.message || '',
      };
    }

    if (
      data?.ok &&
      typeof data.whatIsIt === 'string' &&
      typeof data.aiRole === 'string' &&
      typeof data.formulaPlain === 'string' &&
      data.whatIsIt.trim() &&
      data.aiRole.trim() &&
      data.formulaPlain.trim()
    ) {
      const flashcardAnswer =
        typeof data.flashcardAnswer === 'string' && data.flashcardAnswer.trim()
          ? data.flashcardAnswer.trim()
          : `${data.whatIsIt.trim()} Vai trò trong AI: ${data.aiRole.trim()}`;

      return {
        ok: true,
        model: data.model || 'gemini',
        grounded: Boolean(data.grounded),
        groundedSources: Array.isArray(data.groundedSources)
          ? data.groundedSources
          : [],
        searchFallbackNote: data.searchFallbackNote || '',
        flashcardAnswer,
        whatIsIt: data.whatIsIt.trim(),
        aiRole: data.aiRole.trim(),
        formulaPlain: data.formulaPlain.trim(),
      };
    }
    return { ok: false, reason: 'invalid_response', message: '' };
  } catch (err) {
    return {
      ok: false,
      reason: err?.name === 'AbortError' ? 'timeout' : 'network_error',
      message:
        err?.name === 'AbortError'
          ? 'Gemini vượt quá thời gian chờ 8 giây — đã tự chuyển sang bản fallback.'
          : 'Không gọi được /api/explain — đã tự chuyển sang bản fallback.',
    };
  } finally {
    clearTimeout(timer);
  }
}

async function resolveWikipediaInfo(term, canonical) {
  let viSummary = null;
  let enSummary = null;

  if (canonical) {
    const [viDirect, enDirect] = await Promise.all([
      canonical.vi ? fetchWikiSummary('vi', canonical.vi) : Promise.resolve(null),
      canonical.en ? fetchWikiSummary('en', canonical.en) : Promise.resolve(null),
    ]);
    viSummary = isValidTechnicalWikiSummary(viDirect, term, true) ? viDirect : null;
    enSummary = isValidTechnicalWikiSummary(enDirect, term, true) ? enDirect : null;

    if (!viSummary && enSummary) {
      const viLinkedTitle = await fetchVietnameseLanglink(enSummary.title);
      if (viLinkedTitle) {
        const linked = await fetchWikiSummary('vi', viLinkedTitle);
        if (isValidTechnicalWikiSummary(linked, term, true)) {
          viSummary = linked;
        }
      }
    }
  } else {
    const isViPhrase = hasVietnameseDiacritics(term);

    const [enTitle, viTitle] = await Promise.all([
      isViPhrase ? Promise.resolve(null) : searchBestWikiTitle('en', term),
      searchBestWikiTitle('vi', term),
    ]);

    const [enRes, viRes] = await Promise.all([
      enTitle ? fetchWikiSummary('en', enTitle) : Promise.resolve(null),
      viTitle ? fetchWikiSummary('vi', viTitle) : Promise.resolve(null),
    ]);

    enSummary = isValidTechnicalWikiSummary(enRes, term, false) ? enRes : null;
    viSummary = isValidTechnicalWikiSummary(viRes, term, false) ? viRes : null;

    if (enSummary) {
      const linkedVi = await fetchVietnameseLanglink(enSummary.title);
      if (linkedVi && (!viSummary || viSummary.title !== linkedVi)) {
        const linkedSummary = await fetchWikiSummary('vi', linkedVi);
        if (isValidTechnicalWikiSummary(linkedSummary, term, true)) {
          viSummary = linkedSummary;
        }
      }
    }
  }

  return { viSummary, enSummary };
}

/**
 * Live online lookup prioritizing Gemini + Google Search Grounding (/api/explain, 8s timeout):
 * 1. Calls /api/explain IMMEDIATELY (in parallel with Wikipedia verification for link/fallback)
 * 2. If Gemini succeeds -> returns all 4 non-tech fields (flashcardAnswer, whatIsIt, aiRole, formulaPlain)
 *    with Google Search sources (or Wikipedia citation if available)
 * 3. If /api/explain fails or GEMINI_API_KEY is missing -> falls back cleanly to verified Wikipedia
 *    AND returns an explicit `apiWarning` banner so the user knows immediately if key setup is needed
 */
export async function lookupTermOnline(rawTerm, contextSentence = '') {
  const term = rawTerm
    .trim()
    .replace(/^[.,;:!?()[\]"'“”‘’]+|[.,;:!?()[\]"'“”‘’]+$/g, '');
  const lower = term.toLowerCase();
  const canonical = CANONICAL_WIKI_MAP[lower];
  const { glossaryHit, flashcardHit } = findLocalExamMatches(term);

  // Run Gemini (/api/explain, 8s timeout) and domain-filtered Wikipedia in parallel for fastest response
  const [geminiRes, wikiBundle] = await Promise.all([
    !glossaryHit
      ? requestGeminiExplain({ term, context: contextSentence })
      : Promise.resolve({ ok: false, reason: 'built_in_glossary', message: '' }),
    resolveWikipediaInfo(term, canonical),
  ]);

  const { viSummary, enSummary } = wikiBundle;

  let sourceUrl = '';
  let sourceTitle = '';
  let wikiOriginLabel = '';

  if (viSummary && viSummary.extract.length >= 50) {
    sourceUrl = viSummary.url;
    sourceTitle = viSummary.title;
    wikiOriginLabel = `Wikipedia Tiếng Việt (${viSummary.title})`;
  } else if (enSummary) {
    sourceUrl = enSummary.url;
    sourceTitle = enSummary.title;
    wikiOriginLabel = `Wikipedia (${enSummary.title})`;
  }

  // Branch A: Gemini (/api/explain) succeeded within 8 seconds!
  if (geminiRes?.ok) {
    const primaryGroundedSource = geminiRes.groundedSources?.[0];
    const finalSourceUrl = primaryGroundedSource?.url || sourceUrl;
    const finalSourceTitle = primaryGroundedSource?.title || sourceTitle;

    const combinedText = `${term} ${geminiRes.whatIsIt} ${geminiRes.aiRole} ${contextSentence}`;
    const detectedModule =
      flashcardHit?.module || detectModule(term, combinedText, 'M3');

    const displayTitle =
      sourceTitle && sourceTitle.toLowerCase() !== lower
        ? `${term} (${sourceTitle})`
        : term;

    const hasWiki = Boolean(viSummary || enSummary);
    const badgeLabel = geminiRes.grounded
      ? '✨ AI + Google Search'
      : hasWiki
        ? '✨ AI + Wikipedia'
        : '✨ Gemini AI';

    const sourceLabel = geminiRes.grounded
      ? `Gemini + Google Search (${geminiRes.groundedSources.map((s) => s.title).join(', ')})`
      : hasWiki
        ? `Gemini AI (${geminiRes.model}) kết hợp ${wikiOriginLabel}`
        : `Gemini AI (${geminiRes.model}) giải thích theo ngữ cảnh bài học`;

    return {
      foundOnline: true,
      explainMode: 'ai',
      badgeLabel,
      apiWarning: '',
      groundedSources: geminiRes.groundedSources || [],
      hasLocalMatch: Boolean(flashcardHit),
      term,
      module: detectedModule,
      tag:
        flashcardHit?.tag ||
        (geminiRes.grounded ? 'AI + Google Search' : 'Gemini AI · Tự thêm'),
      question: `${displayTitle} là gì và dùng để giải quyết bài toán nào?`,
      answer: geminiRes.flashcardAnswer,
      whatIsIt: geminiRes.whatIsIt,
      aiRole: geminiRes.aiRole,
      formulaPlain: geminiRes.formulaPlain,
      sourceUrl: finalSourceUrl,
      sourceTitle: finalSourceTitle,
      sourceLabel,
      googleSearchUrl: `https://www.google.com/search?q=${encodeURIComponent(
        `${term} là gì trong AI Machine Learning`
      )}`,
    };
  }

  // Branch B: Fallback to verified Wikipedia or local bank — WITH clear notice if API key is missing/failed
  let onlineViText = '';
  if (viSummary && viSummary.extract.length >= 50) {
    onlineViText = viSummary.extract;
  } else if (enSummary) {
    const enSentences = splitSentences(enSummary.extract).slice(0, 3).join(' ');
    onlineViText = await translateEnToVi(enSentences);
    wikiOriginLabel = `Wikipedia Tiếng Anh — dịch tự động (${enSummary.title})`;
  }

  const combinedText = `${term} ${onlineViText} ${enSummary?.extract ?? ''} ${contextSentence}`;
  const detectedModule =
    glossaryHit?.module ||
    flashcardHit?.module ||
    detectModule(term, combinedText, 'M3');

  const displayTitle =
    sourceTitle && sourceTitle.toLowerCase() !== lower
      ? `${term} (${sourceTitle})`
      : term;

  const question = `${displayTitle} là gì và dùng để giải quyết bài toán nào?`;

  const viSentences = splitSentences(onlineViText);
  const firstSentence = viSentences[0] || '';
  const secondSentence = viSentences.slice(1, 3).join(' ');

  const whatIsIt =
    glossaryHit?.whatIsIt ||
    firstSentence ||
    (flashcardHit
      ? flashcardHit.answer
      : `${term} là thuật ngữ kỹ thuật trong bài học ôn thi AI Thực chiến VinUni.`);

  const aiRole =
    glossaryHit?.aiRole ||
    secondSentence ||
    (contextSentence
      ? `Ngữ cảnh xuất hiện trong bài: "${contextSentence.slice(0, 220)}${contextSentence.length > 220 ? '…' : ''}".`
      : `Được ứng dụng trong các bài toán xây dựng, tối ưu hoặc đánh giá hệ thống AI (${detectedModule}).`);

  const formulaPlain =
    glossaryHit?.formulaPlain ||
    (flashcardHit
      ? `Ghi chú trọng tâm thi VinUni (${flashcardHit.id}): ${flashcardHit.answer}`
      : onlineViText
        ? `Tóm tắt nhanh: ${onlineViText.slice(0, 240)}${onlineViText.length > 240 ? '…' : ''}`
        : `Chưa có bài Wikipedia khớp chính xác — bạn hãy thêm GEMINI_API_KEY trên Vercel hoặc bấm nút Google ở trên để tra thêm.`);

  const answerParts = [];
  if (firstSentence) answerParts.push(firstSentence);
  if (secondSentence && answerParts.join(' ').length < 220) {
    answerParts.push(secondSentence);
  }
  if (flashcardHit && !onlineViText) {
    answerParts.push(flashcardHit.answer);
  }
  const answer = glossaryHit
    ? `${glossaryHit.whatIsIt} Ứng dụng AI: ${glossaryHit.aiRole}`
    : answerParts.join(' ') ||
      (contextSentence
        ? `Thuật ngữ xuất hiện trong ngữ cảnh: "${contextSentence.slice(0, 200)}".`
        : `Chưa tìm thấy mục Wikipedia khớp trực tiếp cho "${term}".`);

  // Explicit, helpful warning if Gemini didn't run because of missing/invalid key or server error
  let apiWarning = '';
  if (!glossaryHit && geminiRes && !geminiRes.ok) {
    if (geminiRes.reason === 'missing_api_key') {
      apiWarning =
        'Server chưa có GEMINI_API_KEY (trên Vercel: vào Settings → Environment Variables → thêm GEMINI_API_KEY rồi Redeploy) — đang tạm dùng bản fallback Wikipedia.';
    } else if (geminiRes.reason === 'invalid_api_key') {
      apiWarning =
        'GEMINI_API_KEY bị từ chối hoặc không hợp lệ — hãy kiểm tra lại key trong biến môi trường, hiện đang dùng fallback Wikipedia.';
    } else if (geminiRes.reason === 'rate_limited') {
      apiWarning =
        'Gemini API tạm chạm giới hạn hạn mức (HTTP 429) — chờ ít giây rồi bấm "Tra cứu lại", hiện đang dùng fallback Wikipedia.';
    } else if (geminiRes.reason === 'http_404') {
      apiWarning =
        'Không tìm thấy endpoint /api/explain trên máy chủ tĩnh — hãy mở đúng URL Vite (localhost:5173) hoặc Vercel deploy.';
    } else if (geminiRes.message) {
      apiWarning = geminiRes.message;
    }
  }

  const hasWiki = Boolean(onlineViText);

  return {
    foundOnline: hasWiki,
    explainMode: hasWiki ? 'wiki' : 'local',
    badgeLabel: hasWiki ? '🌐 Wikipedia' : '⚠️ Chưa có AI / Wiki',
    apiWarning,
    groundedSources: [],
    hasLocalMatch: Boolean(glossaryHit || flashcardHit),
    term,
    module: detectedModule,
    tag: flashcardHit?.tag || (hasWiki ? 'Wikipedia · Tự thêm' : 'Tự thêm'),
    question,
    answer,
    whatIsIt,
    aiRole,
    formulaPlain,
    sourceUrl,
    sourceTitle,
    sourceLabel:
      wikiOriginLabel ||
      (glossaryHit
        ? 'Từ điển có sẵn trong app'
        : flashcardHit
          ? `Kho Flashcard VinUni (${flashcardHit.id})`
          : 'Không có bài Wikipedia phù hợp'),
    googleSearchUrl: `https://www.google.com/search?q=${encodeURIComponent(
      `${term} là gì trong AI Machine Learning`
    )}`,
  };
}
