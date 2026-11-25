const MODEL_CANDIDATES = [
  'gemini-3.5-flash',
  'gemini-2.5-flash',
  'gemini-3.6-flash',
];

let cachedWorkingModel = null;

const SYSTEM_INSTRUCTION = [
  'Bạn là gia sư AI chuyên giảng giải cho người không chuyên IT (non-tech) đang ôn thi AI Thực chiến VinUni (SFIA Level 3).',
  'QUY TẮC BẮT BUỘC:',
  '1. Chỉ sử dụng `wikiSummary` nếu nội dung đó thực sự đúng chủ đề AI, Toán học, Thống kê, Lập trình, Dữ liệu, Logic hoặc Đạo đức/Pháp lý AI.',
  '2. Nếu `wikiSummary` bị lạc đề (như địa lý, thành phố, lịch sử, phim ảnh, thể thao...) hoặc trống, HÃY BỎ QUA HOÀN TOÀN `wikiSummary` và tự giải thích chính xác theo `term` cùng `context` đoạn văn người dùng đang đọc.',
  '3. Viết tiếng Việt bình dân, trực quan, tuyệt đối không sao chép văn phong hàn lâm khó hiểu.',
  '4. Trả về DUY NHẤT 1 JSON object hợp lệ gồm đúng 3 trường: "whatIsIt", "aiRole", "formulaPlain".',
].join('\n');

function buildPrompt({ term, wikiSummary, context }) {
  const snippet = wikiSummary ? wikiSummary.slice(0, 750) : '';
  const ctx = context ? context.slice(0, 220) : '';

  return [
    `Thuật ngữ cần giải thích: "${term}".`,
    ctx ? `Ngữ cảnh đoạn văn người dùng đang đọc: "${ctx}"` : '',
    snippet
      ? `Tóm tắt Wikipedia tham khảo (chỉ dùng nếu đúng chủ đề AI/Toán/Kỹ thuật): "${snippet}"`
      : 'wikiSummary: (trống — hãy tự giải thích chính xác theo thuật ngữ và ngữ cảnh trên).',
    '',
    'Hãy trả về JSON gồm đúng 3 trường ngắn gọn (mỗi trường 1–2 câu dễ hiểu):',
    '- "whatIsIt": Nó là cái gì theo kiểu đời thường (ví von như Excel, hình học, đời sống).',
    '- "aiRole": Đóng vai trò gì trong bài toán lớn của AI / Machine Learning / Dữ liệu.',
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
      return {
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

async function callGeminiModel({ model, apiKey, prompt, timeoutMs = 4700 }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
        model
      )}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: SYSTEM_INSTRUCTION }],
          },
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.2,
            maxOutputTokens: 900,
            thinkingConfig: { thinkingBudget: 0 },
          },
        }),
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

    return { ok: true, model, ...parsed };
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
    return { ok: false, status: 503, reason: 'missing_api_key' };
  }

  const prompt = buildPrompt({
    term: cleanTerm,
    wikiSummary: typeof wikiSummary === 'string' ? wikiSummary.trim() : '',
    context: typeof context === 'string' ? context.trim() : '',
  });
  const trimmedKey = apiKey.trim();

  const modelsToTry = [
    preferredModel,
    cachedWorkingModel,
    ...MODEL_CANDIDATES,
  ].filter((m, idx, arr) => Boolean(m) && arr.indexOf(m) === idx);

  const startedAt = Date.now();
  const totalBudgetMs = 4700;
  let lastStatus = 503;

  for (const model of modelsToTry) {
    const remainingMs = totalBudgetMs - (Date.now() - startedAt);
    if (remainingMs < 700) break;

    const res = await callGeminiModel({
      model,
      apiKey: trimmedKey,
      prompt,
      timeoutMs: remainingMs,
    });

    if (res.ok) {
      cachedWorkingModel = model;
      return res;
    }

    lastStatus = res.status || 503;
    if (res.status === 401 || res.status === 403) {
      return { ok: false, status: res.status, reason: 'invalid_api_key' };
    }
    if (model === cachedWorkingModel) {
      cachedWorkingModel = null;
    }
  }

  return {
    ok: false,
    status: lastStatus,
    reason: 'gemini_unavailable',
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
    res.end(JSON.stringify({ ok: false, reason: result.reason || 'failed' }));
    return;
  }

  res.statusCode = 200;
  res.end(
    JSON.stringify({
      ok: true,
      model: result.model,
      whatIsIt: result.whatIsIt,
      aiRole: result.aiRole,
      formulaPlain: result.formulaPlain,
    })
  );
}
