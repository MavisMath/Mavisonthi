const MODEL_CANDIDATES = [
  'gemini-2.5-flash',
  'gemini-3-flash-preview',
  'gemini-3.5-flash',
  'gemini-3.6-flash',
];

let cachedWorkingModel = null;
const unavailableModels = new Set();
let searchGroundingQuotaExhaustedUntil = 0;

const SYSTEM_INSTRUCTION = [
  'Bạn là gia sư AI chuyên giảng bài cho người không chuyên IT (non-tech) đang ôn thi AI Thực chiến VinUni (SFIA Level 3).',
  'QUY TẮC BẮT BUỘC:',
  '1. Giải thích chính xác thuật ngữ `term` dựa trên ngữ cảnh `context` (và kết quả Google Search nếu có). Nếu có `wikiSummary` bị lạc đề (như địa lý, thành phố, lịch sử, giải trí...) hoặc trống thì bỏ qua hoàn toàn.',
  '2. Viết bằng tiếng Việt bình dân, trực quan, ngắn gọn, dễ nhớ cho kỳ thi thực chiến.',
  '3. Trường "aiRole" PHẢI nói rõ thuật ngữ này đóng vai trò gì trong bài toán lớn của AI / Machine Learning / Data (KHÔNG viết tên nghề nghiệp hay chức danh).',
  '4. Trả về DUY NHẤT 1 JSON object thuần hợp lệ (không bọc ```json, không viết thêm chữ ngoài JSON) gồm đúng 4 trường: "flashcardAnswer", "whatIsIt", "aiRole", "formulaPlain".',
].join('\n');

function buildPrompt({ term, wikiSummary, context }) {
  const ctx = context ? context.slice(0, 260) : '';
  const snippet = wikiSummary ? wikiSummary.slice(0, 600) : '';

  return [
    `Thuật ngữ cần tra cứu & giải thích: "${term}".`,
    ctx ? `Ngữ cảnh câu người dùng đang đọc: "${ctx}"` : '',
    snippet ? `Tham khảo phụ (chỉ dùng nếu đúng chủ đề AI/Toán/Kỹ thuật): "${snippet}"` : '',
    '',
    'Hãy trả về DUY NHẤT 1 JSON object hợp lệ gồm đúng 4 trường ngắn gọn (mỗi trường 1–2 câu):',
    '- "flashcardAnswer": 1–2 câu tóm tắt đắt giá, chính xác nhất để làm Mặt sau Flashcard ôn thi.',
    '- "whatIsIt": Nó là cái gì theo kiểu đời thường (ví von như Excel, hình học, cuộc sống).',
    '- "aiRole": Thuật ngữ này đóng vai trò gì trong bài toán lớn của AI / Machine Learning / Data.',
    '- "formulaPlain": Cách tính bằng lời ("lấy cái gì + / − / × / ÷ cái gì") kèm 1 ví dụ số siêu nhỏ (hoặc quy tắc 2 bước dễ nhớ nếu là khái niệm).',
  ]
    .filter(Boolean)
    .join('\n');
}

function parseJsonResponse(rawText) {
  if (!rawText || typeof rawText !== 'string') return null;
  const cleaned = rawText
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  const tryExtract = (str) => {
    const parsed = JSON.parse(str);
    if (
      parsed &&
      typeof parsed === 'object' &&
      typeof parsed.whatIsIt === 'string' &&
      typeof parsed.aiRole === 'string' &&
      typeof parsed.formulaPlain === 'string' &&
      parsed.whatIsIt.trim() &&
      parsed.aiRole.trim() &&
      parsed.formulaPlain.trim()
    ) {
      const flashcardAnswer =
        typeof parsed.flashcardAnswer === 'string' && parsed.flashcardAnswer.trim()
          ? parsed.flashcardAnswer.trim()
          : `${parsed.whatIsIt.trim()} ${parsed.aiRole.trim()}`;

      return {
        flashcardAnswer,
        whatIsIt: parsed.whatIsIt.trim(),
        aiRole: parsed.aiRole.trim(),
        formulaPlain: parsed.formulaPlain.trim(),
      };
    }
    return null;
  };

  try {
    return tryExtract(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return tryExtract(match[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

function extractGroundedSources(data) {
  const chunks = data?.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (!Array.isArray(chunks)) return [];
  const seen = new Set();
  const sources = [];
  for (const chunk of chunks) {
    const uri = chunk?.web?.uri;
    const title = chunk?.web?.title;
    if (typeof uri === 'string' && uri.startsWith('http') && !seen.has(uri)) {
      seen.add(uri);
      sources.push({
        title: typeof title === 'string' && title.trim() ? title.trim() : 'Google Search',
        url: uri,
      });
    }
  }
  return sources.slice(0, 3);
}

async function callGeminiModel({
  model,
  apiKey,
  prompt,
  useGoogleSearch = true,
  timeoutMs = 7400,
}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const payload = {
    systemInstruction: {
      parts: [{ text: SYSTEM_INSTRUCTION }],
    },
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    ...(useGoogleSearch ? { tools: [{ google_search: {} }] } : {}),
    generationConfig: {
      ...(useGoogleSearch ? {} : { responseMimeType: 'application/json' }),
      temperature: 0.2,
      maxOutputTokens: 900,
      thinkingConfig: { thinkingBudget: 0 },
    },
  };

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
        model
      )}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      }
    );

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        message: data?.error?.message || `HTTP ${res.status}`,
      };
    }

    const parts = data?.candidates?.[0]?.content?.parts ?? [];
    const text = parts
      .map((p) => (typeof p?.text === 'string' ? p.text : ''))
      .join('\n')
      .trim();

    const parsed = parseJsonResponse(text);
    if (!parsed) {
      return { ok: false, status: 502, message: 'Invalid JSON from Gemini' };
    }

    const groundedSources = useGoogleSearch ? extractGroundedSources(data) : [];

    return {
      ok: true,
      model,
      grounded: useGoogleSearch && groundedSources.length > 0,
      groundedSources,
      ...parsed,
    };
  } catch (err) {
    return {
      ok: false,
      status: err?.name === 'AbortError' ? 504 : 502,
      message: err?.message || 'Network error',
    };
  } finally {
    clearTimeout(timer);
  }
}

export async function explainTermWithGemini({
  term,
  wikiSummary = '',
  context = '',
  apiKey = process.env.GEMINI_API_KEY,
  preferredModel = process.env.GEMINI_MODEL,
}) {
  const cleanTerm = typeof term === 'string' ? term.trim() : '';
  if (!cleanTerm) {
    return { ok: false, status: 400, reason: 'missing_term' };
  }
  if (!apiKey || !apiKey.trim()) {
    return {
      ok: false,
      status: 503,
      reason: 'missing_api_key',
      message: 'Chưa cấu hình GEMINI_API_KEY trong biến môi trường server.',
    };
  }

  const prompt = buildPrompt({
    term: cleanTerm,
    wikiSummary: typeof wikiSummary === 'string' ? wikiSummary.trim() : '',
    context: typeof context === 'string' ? context.trim() : '',
  });
  const trimmedKey = apiKey.trim();

  // Prefer cached working model first, skipping any model already known to 404 on this key
  const modelsToTry = [
    preferredModel,
    cachedWorkingModel,
    ...MODEL_CANDIDATES,
  ].filter(
    (m, idx, arr) =>
      Boolean(m) && !unavailableModels.has(m) && arr.indexOf(m) === idx
  );

  const startedAt = Date.now();
  const totalBudgetMs = 7600;
  let lastStatus = 503;
  let lastReason = 'gemini_unavailable';

  // Phase 1: Try with Google Search Grounding enabled (unless recently quota-blocked on free tier)
  const canTrySearch = Date.now() >= searchGroundingQuotaExhaustedUntil;
  if (canTrySearch) {
    for (const model of modelsToTry) {
      if (unavailableModels.has(model)) continue;
      const remainingMs = totalBudgetMs - (Date.now() - startedAt);
      if (remainingMs < 1200) break;

      const res = await callGeminiModel({
        model,
        apiKey: trimmedKey,
        prompt,
        useGoogleSearch: true,
        timeoutMs: Math.min(remainingMs, 4200),
      });

      if (res.ok) {
        cachedWorkingModel = model;
        return res;
      }

      lastStatus = res.status || 503;
      if (res.status === 401 || res.status === 403) {
        return {
          ok: false,
          status: res.status,
          reason: 'invalid_api_key',
          message: 'GEMINI_API_KEY không hợp lệ hoặc bị từ chối quyền truy cập.',
        };
      }
      if (res.status === 404) {
        unavailableModels.add(model);
        continue;
      }
      // If Google Search Grounding hits 429 quota on Free Tier, remember briefly and immediately fall through to standard Gemini
      if (res.status === 429) {
        searchGroundingQuotaExhaustedUntil = Date.now() + 5 * 60 * 1000;
        lastReason = 'search_grounding_quota';
        break;
      }
      if (res.status === 400) {
        break;
      }
    }
  }

  // Phase 2: Standard Gemini Flash generation (cap each attempt so backup Flash model can rescue tail latency inside 8s)
  const activeModels = modelsToTry.filter((m) => !unavailableModels.has(m));
  for (let i = 0; i < activeModels.length; i += 1) {
    const model = activeModels[i];
    const remainingMs = totalBudgetMs - (Date.now() - startedAt);
    if (remainingMs < 1000) break;

    const isLast = i === activeModels.length - 1;
    const attemptTimeout = isLast ? remainingMs : Math.min(remainingMs, 4500);

    const res = await callGeminiModel({
      model,
      apiKey: trimmedKey,
      prompt,
      useGoogleSearch: false,
      timeoutMs: attemptTimeout,
    });

    if (res.ok) {
      cachedWorkingModel = model;
      return {
        ...res,
        searchFallbackNote:
          lastReason === 'search_grounding_quota'
            ? 'Gói miễn phí chưa mở hạn mức Google Search Grounding — đã tự chuyển sang Gemini AI trả lời trực tiếp.'
            : '',
      };
    }

    lastStatus = res.status || 503;
    if (res.status === 401 || res.status === 403) {
      return {
        ok: false,
        status: res.status,
        reason: 'invalid_api_key',
        message: 'GEMINI_API_KEY không hợp lệ hoặc bị từ chối quyền truy cập.',
      };
    }
    if (res.status === 404) {
      unavailableModels.add(model);
    } else if (res.status === 429) {
      lastReason = 'rate_limited';
    }
    if (model === cachedWorkingModel) {
      cachedWorkingModel = null;
    }
  }

  return {
    ok: false,
    status: lastStatus,
    reason: lastReason,
    message:
      lastReason === 'rate_limited'
        ? 'Gemini API tạm hết hạn mức gọi (HTTP 429) — đang dùng bản fallback Wikipedia.'
        : 'Không kết nối được Gemini API trong 8 giây — đang dùng bản fallback Wikipedia.',
  };
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  if (chunks.length === 0) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    return {};
  }
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.end(JSON.stringify({ ok: false, reason: 'method_not_allowed' }));
    return;
  }

  const body = await readJsonBody(req);
  const result = await explainTermWithGemini({
    term: body?.term,
    wikiSummary: body?.wikiSummary,
    context: body?.context,
  });

  if (!result.ok) {
    res.statusCode = result.status || 503;
    res.end(
      JSON.stringify({
        ok: false,
        reason: result.reason || 'failed',
        message: result.message || '',
      })
    );
    return;
  }

  res.statusCode = 200;
  res.end(
    JSON.stringify({
      ok: true,
      model: result.model,
      grounded: Boolean(result.grounded),
      groundedSources: result.groundedSources || [],
      searchFallbackNote: result.searchFallbackNote || '',
      flashcardAnswer: result.flashcardAnswer,
      whatIsIt: result.whatIsIt,
      aiRole: result.aiRole,
      formulaPlain: result.formulaPlain,
    })
  );
}
