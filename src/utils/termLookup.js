import examData from '../data/index.js';
import { GLOSSARY_DATA } from '../data/glossaryData.js';

// Canonical mapping for ambiguous AI / Math / Data acronyms so Wikipedia hits the exact technical article
const CANONICAL_WIKI_MAP = {
  pca: { en: 'Principal component analysis', vi: 'Phép phân tích thành phần chính', module: 'M1' },
  svd: { en: 'Singular value decomposition', vi: 'Phân tích giá trị suy biến', module: 'M1' },
  nmf: { en: 'Non-negative matrix factorization', module: 'M1' },
  eigenvalue: { en: 'Eigenvalues and eigenvectors', vi: 'Trị riêng và vectơ riêng', module: 'M1' },
  eigenvalues: { en: 'Eigenvalues and eigenvectors', vi: 'Trị riêng và vectơ riêng', module: 'M1' },
  eigenvector: { en: 'Eigenvalues and eigenvectors', vi: 'Trị riêng và vectơ riêng', module: 'M1' },
  eigenvectors: { en: 'Eigenvalues and eigenvectors', vi: 'Trị riêng và vectơ riêng', module: 'M1' },
  'trị riêng': { en: 'Eigenvalues and eigenvectors', vi: 'Trị riêng và vectơ riêng', module: 'M1' },
  hessian: { en: 'Hessian matrix', module: 'M1' },
  jacobian: { en: 'Jacobian matrix and determinant', module: 'M1' },
  embedding: { en: 'Word embedding', module: 'M3' },
  embeddings: { en: 'Word embedding', module: 'M3' },
  softmax: { en: 'Softmax function', module: 'M1' },
  sigmoid: { en: 'Sigmoid function', module: 'M1' },
  relu: { en: 'Rectifier (neural networks)', module: 'M1' },
  adam: { en: 'Stochastic gradient descent', module: 'M1' },
  sgd: { en: 'Stochastic gradient descent', module: 'M1' },
  mse: { en: 'Mean squared error', module: 'M3' },
  rmse: { en: 'Root mean square deviation', module: 'M3' },
  mae: { en: 'Mean absolute error', module: 'M3' },
  iqr: { en: 'Interquartile range', module: 'M1' },
  ci: { en: 'Confidence interval', vi: 'Khoảng tin cậy', module: 'M1' },
  se: { en: 'Standard error', module: 'M1' },
  poisson: { en: 'Poisson distribution', vi: 'Phân phối Poisson', module: 'M1' },
  bernoulli: { en: 'Bernoulli distribution', vi: 'Phân phối Bernoulli', module: 'M1' },
  binomial: { en: 'Binomial distribution', vi: 'Phân phối nhị thức', module: 'M1' },
  gaussian: { en: 'Normal distribution', vi: 'Phân phối chuẩn', module: 'M1' },
  bonferroni: { en: 'Bonferroni correction', module: 'M1' },
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
  ner: { en: 'Named-entity recognition', module: 'M3' },
  docker: { en: 'Docker (software)', module: 'M3' },
  mlops: { en: 'MLOps', module: 'M3' },
  'ks-test': { en: 'Kolmogorov–Smirnov test', module: 'M3' },
  'b-tree': { en: 'B-tree', module: 'M2' },
  cte: { en: 'Hierarchical and recursive queries in SQL', module: 'M2' },
  pandas: { en: 'Pandas (software)', module: 'M2' },
  numpy: { en: 'NumPy', module: 'M2' },
  ndarray: { en: 'NumPy', module: 'M2' },
  regex: { en: 'Regular expression', vi: 'Biểu thức chính quy', module: 'M2' },
  heap: { en: 'Heap (data structure)', module: 'M2' },
  'min-heap': { en: 'Heap (data structure)', module: 'M2' },
  'hash table': { en: 'Hash table', vi: 'Bảng băm', module: 'M2' },
  memoization: { en: 'Memoization', module: 'M2' },
  gdpr: { en: 'General Data Protection Regulation', module: 'M4' },
  'eu ai act': { en: 'Artificial Intelligence Act', module: 'M4' },
  owasp: { en: 'OWASP', module: 'M4' },
  'survivorship bias': { en: 'Survivorship bias', module: 'M4' },
  'automation bias': { en: 'Automation bias', module: 'M4' },
};

const DOMAIN_SCORING_REGEX =
  /(machine learning|artificial intelligence|deep learning|neural|statistics|statistical|probability|linear algebra|matrix|vector|algorithm|data structure|database|sql|python|software|computer science|mathematics|mathematical|optimization|regression|classification|clustering|học máy|trí tuệ nhân tạo|thống kê|xác suất|đại số|ma trận|thuật toán|cơ sở dữ liệu|dữ liệu|toán học|mạng nơ-ron)/i;

const MODULE_DETECT_RULES = [
  { module: 'M1', re: /(matrix|vector|algebra|eigen|svd|pca|calculus|gradient|derivative|probability|bayes|variance|statistic|distribution|p-value|confidence|test|ma trận|vectơ|xác suất|thống kê|đạo hàm|tích phân|phương sai)/i },
  { module: 'M2', re: /(python|pandas|numpy|sql|database|query|index|b-tree|algorithm|complexity|big-o|data structure|heap|queue|hash|regex|slicing|dataframe|cơ sở dữ liệu|lập trình|cấu trúc dữ liệu|thuật toán)/i },
  { module: 'M4', re: /(ethics|bias|fairness|privacy|gdpr|law|act|security|owasp|injection|logic|fallacy|contrapositive|de morgan|đạo đức|pháp lý|bảo mật|ngụy biện|luật|quyền riêng tư)/i },
];

async function fetchJsonSafe(url, timeoutMs = 8000) {
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
  const domainBoost =
    lang === 'vi'
      ? `${clean} học máy OR AI OR toán học OR thống kê OR lập trình`
      : `${clean} (machine learning OR statistics OR linear algebra OR computer science)`;

  const [exactRes, domainRes] = await Promise.all([
    fetchJsonSafe(
      `https://${lang}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
        clean
      )}&srlimit=5&format=json&origin=*`
    ),
    fetchJsonSafe(
      `https://${lang}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
        domainBoost
      )}&srlimit=5&format=json&origin=*`
    ),
  ]);

  const candidates = [
    ...(exactRes?.query?.search ?? []),
    ...(domainRes?.query?.search ?? []),
  ];
  if (candidates.length === 0) return null;

  const lowerTerm = clean.toLowerCase();
  const seen = new Set();
  let best = null;
  let bestScore = -1;

  for (const item of candidates) {
    if (!item?.title || seen.has(item.title)) continue;
    seen.add(item.title);
    const titleLower = item.title.toLowerCase();
    const snippetClean = (item.snippet || '').replace(/<[^>]+>/g, '');
    const combined = `${item.title} ${snippetClean}`;

    if (/disambiguation|định hướng/i.test(titleLower)) continue;

    let score = 0;
    if (titleLower === lowerTerm) score += 100;
    else if (titleLower.includes(lowerTerm)) score += 60;
    else if (snippetClean.toLowerCase().includes(lowerTerm)) score += 25;

    if (DOMAIN_SCORING_REGEX.test(combined)) score += 45;
    if (titleLower.length < 45) score += 5;

    if (score > bestScore) {
      bestScore = score;
      best = item.title;
    }
  }

  return best;
}

async function translateEnToVi(text) {
  const trimmed = (text || '').trim();
  if (!trimmed) return '';
  // Keep within MyMemory 500-char safe chunk limit
  const shortened =
    trimmed.length > 460
      ? `${trimmed.slice(0, 455).replace(/\s+\S*$/, '')}.`
      : trimmed;

  const data = await fetchJsonSafe(
    `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      shortened
    )}&langpair=en|vi`,
    7000
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

const GEMINI_TIMEOUT_MS = 5000;

async function requestGeminiExplain({ term, wikiSummary, context }) {
  // Skip relative API call outside browser (e.g. SSR) unless explicitly running with origin
  if (typeof fetch !== 'function' || typeof window === 'undefined') {
    return null;
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

    if (!res.ok) return null;
    const data = await res.json();
    if (
      data?.ok &&
      typeof data.whatIsIt === 'string' &&
      typeof data.aiRole === 'string' &&
      typeof data.formulaPlain === 'string' &&
      data.whatIsIt.trim() &&
      data.aiRole.trim() &&
      data.formulaPlain.trim()
    ) {
      return {
        model: data.model || 'gemini',
        whatIsIt: data.whatIsIt.trim(),
        aiRole: data.aiRole.trim(),
        formulaPlain: data.formulaPlain.trim(),
      };
    }
    return null;
  } catch {
    // Timeout (>5s), offline, or unavailable -> safe fallback to Wikipedia
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Live online lookup for any user-highlighted term (Wikipedia + Gemini 5s timeout fallback):
 * 1. Fetches authoritative summary from Wikipedia (VI + EN via langlinks + EN->VI fallback)
 * 2. Sends wikiSummary to /api/explain (Gemini) with a strict 5-second AbortController timeout
 * 3. If Gemini responds in time -> returns plain-language Vietnamese explanation ("✨ AI + Wikipedia")
 *    Otherwise -> falls back seamlessly to Wikipedia result ("🌐 Wikipedia") without error or delay
 */
export async function lookupTermOnline(rawTerm, contextSentence = '') {
  const term = rawTerm.trim().replace(/^[.,;:!?()[\]"'“”‘’]+|[.,;:!?()[\]"'“”‘’]+$/g, '');
  const lower = term.toLowerCase();
  const canonical = CANONICAL_WIKI_MAP[lower];
  const { glossaryHit, flashcardHit } = findLocalExamMatches(term);

  let viSummary = null;
  let enSummary = null;

  // Step 1: Canonical fast-path or live search on Wikipedia (EN + VI)
  if (canonical) {
    const [viDirect, enDirect] = await Promise.all([
      canonical.vi ? fetchWikiSummary('vi', canonical.vi) : Promise.resolve(null),
      canonical.en ? fetchWikiSummary('en', canonical.en) : Promise.resolve(null),
    ]);
    viSummary = viDirect;
    enSummary = enDirect;

    // Resolve official Vietnamese Wikipedia article via langlinks if we only had EN canonical title
    if (!viSummary && enSummary) {
      const viLinkedTitle = await fetchVietnameseLanglink(enSummary.title);
      if (viLinkedTitle) {
        viSummary = await fetchWikiSummary('vi', viLinkedTitle);
      }
    }
  } else {
    const [viTitle, enTitle] = await Promise.all([
      searchBestWikiTitle('vi', term),
      searchBestWikiTitle('en', term),
    ]);

    const [viRes, enRes] = await Promise.all([
      viTitle ? fetchWikiSummary('vi', viTitle) : Promise.resolve(null),
      enTitle ? fetchWikiSummary('en', enTitle) : Promise.resolve(null),
    ]);

    viSummary = viRes;
    enSummary = enRes;

    // Prefer exact Vietnamese langlink of the winning EN AI article over unrelated VI search
    if (enSummary) {
      const linkedVi = await fetchVietnameseLanglink(enSummary.title);
      if (linkedVi && (!viSummary || viSummary.title !== linkedVi)) {
        const linkedSummary = await fetchWikiSummary('vi', linkedVi);
        if (linkedSummary) viSummary = linkedSummary;
      }
    }
  }

  // Raw Wikipedia context prepared for both fallback AND Gemini prompt
  const wikiRawForGemini =
    viSummary?.extract || enSummary?.extract || flashcardHit?.answer || '';

  let sourceUrl = '';
  let sourceTitle = '';
  let wikiOriginLabel = '';

  if (viSummary && viSummary.extract.length >= 60) {
    sourceUrl = viSummary.url;
    sourceTitle = viSummary.title;
    wikiOriginLabel = `Wikipedia Tiếng Việt (${viSummary.title})`;
  } else if (enSummary) {
    sourceUrl = enSummary.url;
    sourceTitle = enSummary.title;
    wikiOriginLabel = `Wikipedia (${enSummary.title})`;
  }

  // Step 2: Try Gemini (/api/explain) with 5s timeout.
  // Only translate EN->VI via MyMemory if we don't have VI wiki AND Gemini isn't used (or run fallback cleanly).
  const geminiResult = !glossaryHit
    ? await requestGeminiExplain({
        term,
        wikiSummary: wikiRawForGemini,
        context: contextSentence,
      })
    : null;

  // Step 3: Build Wikipedia fallback text only if needed (or already in Vietnamese)
  let onlineViText = '';
  if (viSummary && viSummary.extract.length >= 60) {
    onlineViText = viSummary.extract;
  } else if (enSummary) {
    if (geminiResult) {
      onlineViText = enSummary.extract;
    } else {
      const enSentences = splitSentences(enSummary.extract).slice(0, 3).join(' ');
      onlineViText = await translateEnToVi(enSentences);
      wikiOriginLabel = `Wikipedia Tiếng Anh — dịch tự động (${enSummary.title})`;
    }
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

  // Branch A: Gemini succeeded within 5 seconds -> "✨ AI + Wikipedia"
  if (geminiResult) {
    const hasWiki = Boolean(viSummary || enSummary);
    const badgeLabel = hasWiki ? '✨ AI + Wikipedia' : '✨ AI';
    const sourceLabel = hasWiki
      ? `AI (Gemini) viết lại dễ hiểu từ ${wikiOriginLabel}`
      : 'AI (Gemini) giải thích cho Non-tech';

    return {
      foundOnline: true,
      explainMode: 'ai',
      badgeLabel,
      hasLocalMatch: Boolean(flashcardHit),
      term,
      module: detectedModule,
      tag: flashcardHit?.tag || 'AI + Wikipedia',
      question,
      answer: `${geminiResult.whatIsIt} Vai trò trong AI: ${geminiResult.aiRole}`,
      whatIsIt: geminiResult.whatIsIt,
      aiRole: geminiResult.aiRole,
      formulaPlain: geminiResult.formulaPlain,
      sourceUrl,
      sourceTitle,
      sourceLabel,
      googleSearchUrl: `https://www.google.com/search?q=${encodeURIComponent(
        `${term} là gì trong AI Machine Learning`
      )}`,
    };
  }

  // Branch B: Fallback to Wikipedia (or local built-in glossary/flashcard if offline) -> "🌐 Wikipedia"
  const viSentences = splitSentences(onlineViText);
  const firstSentence = viSentences[0] || '';
  const secondSentence = viSentences.slice(1, 3).join(' ');

  const whatIsIt =
    glossaryHit?.whatIsIt ||
    firstSentence ||
    (flashcardHit
      ? flashcardHit.answer
      : `${term} là một thuật ngữ chuyên ngành quan trọng trong ôn thi AI Thực chiến VinUni.`);

  const aiRole =
    glossaryHit?.aiRole ||
    secondSentence ||
    (contextSentence
      ? `Trong ngữ cảnh bài học hiện tại: "${contextSentence.slice(0, 220)}${contextSentence.length > 220 ? '…' : ''}".`
      : `Được ứng dụng trực tiếp trong các bài toán xây dựng, tối ưu hoặc đánh giá hệ thống AI (${detectedModule}).`);

  const formulaPlain =
    glossaryHit?.formulaPlain ||
    (flashcardHit
      ? `Ghi chú trọng tâm thi VinUni (${flashcardHit.id}): ${flashcardHit.answer}`
      : enSummary?.description
        ? `Tóm tắt nhanh: ${term} (${enSummary.title}) — ${onlineViText.slice(0, 240)}${onlineViText.length > 240 ? '…' : ''}`
        : `Mẹo ghi nhớ: Gắn "${term}" với 1 ví dụ số nhỏ hoặc câu hỏi thực tế trong bài học rồi tự nhẩm lại bằng lời của bạn.`);

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
      `Chưa tìm thấy mục Wikipedia khớp trực tiếp cho "${term}" — bạn có thể bấm nút Google phía dưới hoặc tự nhập định nghĩa ngắn gọn để lưu Flashcard.`;

  const hasWiki = Boolean(onlineViText);

  return {
    foundOnline: hasWiki,
    explainMode: hasWiki ? 'wiki' : 'local',
    badgeLabel: hasWiki ? '🌐 Wikipedia' : '📚 Nội bộ',
    hasLocalMatch: Boolean(glossaryHit || flashcardHit),
    term,
    module: detectedModule,
    tag: flashcardHit?.tag || 'Wikipedia · Tự thêm',
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
          : 'Không tìm thấy bài viết tự động'),
    googleSearchUrl: `https://www.google.com/search?q=${encodeURIComponent(
      `${term} là gì trong AI Machine Learning`
    )}`,
  };
}
