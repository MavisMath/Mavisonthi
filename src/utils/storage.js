export const STORAGE_KEYS = {
  FLASHCARD_PROGRESS: 'vinuni_ai_flashcard_progress_v1',
  QUIZ_WRONG_IDS: 'vinuni_ai_quiz_wrong_ids_v1',
  PYTHON_PROGRESS: 'vinuni_ai_python_progress_v1',
  CASE_STUDY_DRAFTS: 'vinuni_ai_case_study_drafts_v1',
  TOPICS_PROGRESS: 'vinuni_ai_topics_progress_v1',
  CUSTOM_FLASHCARDS: 'vinuni_ai_custom_flashcards_v1',
  CUSTOM_GLOSSARY: 'vinuni_ai_custom_glossary_v1',
  LAST_HTML_TRAP_LESSON: 'vinuni_ai_last_html_trap_lesson_v1',
};

const VALID_FLASHCARD_STATUSES = new Set(['unlearned', 'unsure', 'mastered']);

export function loadFlashcardProgress() {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.FLASHCARD_PROGRESS);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {};
    }
    const sanitized = {};
    for (const [id, status] of Object.entries(parsed)) {
      if (typeof id === 'string' && VALID_FLASHCARD_STATUSES.has(status)) {
        sanitized[id] = status;
      }
    }
    return sanitized;
  } catch {
    return {};
  }
}

export function saveFlashcardProgress(progress) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      STORAGE_KEYS.FLASHCARD_PROGRESS,
      JSON.stringify(progress)
    );
  } catch {
    // Ignore storage quota or private mode errors gracefully
  }
}

export function loadWrongQuizIds() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.QUIZ_WRONG_IDS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const unique = [];
    const seen = new Set();
    for (const id of parsed) {
      if (typeof id === 'string' && id.trim() && !seen.has(id)) {
        seen.add(id);
        unique.push(id);
      }
    }
    return unique;
  } catch {
    return [];
  }
}

export function saveWrongQuizIds(ids) {
  if (typeof window === 'undefined') return;
  try {
    const unique = [...new Set((ids ?? []).filter((id) => typeof id === 'string'))];
    window.localStorage.setItem(
      STORAGE_KEYS.QUIZ_WRONG_IDS,
      JSON.stringify(unique)
    );
  } catch {
    // Ignore storage quota or private mode errors gracefully
  }
}

export function loadPythonProgress() {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.PYTHON_PROGRESS);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {};
    }
    const sanitized = {};
    for (const [taskId, entry] of Object.entries(parsed)) {
      if (!entry || typeof entry !== 'object' || Array.isArray(entry)) continue;
      const checkedIndices = Array.isArray(entry.checkedIndices)
        ? [
            ...new Set(
              entry.checkedIndices.filter(
                (n) => Number.isInteger(n) && n >= 0
              )
            ),
          ]
        : [];
      sanitized[taskId] = {
        ...(typeof entry.code === 'string' ? { code: entry.code } : {}),
        checkedIndices,
      };
    }
    return sanitized;
  } catch {
    return {};
  }
}

export function savePythonProgress(progress) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      STORAGE_KEYS.PYTHON_PROGRESS,
      JSON.stringify(progress)
    );
  } catch {
    // Ignore storage quota or private mode errors gracefully
  }
}

const RATSM_KEYS = [
  'rootCause',
  'architecture',
  'tradeoffs',
  'safetyEthics',
  'metricsRollout',
];

export function loadCaseStudyDrafts() {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.CASE_STUDY_DRAFTS);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {};
    }
    const sanitized = {};
    for (const [caseId, entry] of Object.entries(parsed)) {
      if (!entry || typeof entry !== 'object' || Array.isArray(entry)) continue;
      const cleanEntry = {};
      for (const key of RATSM_KEYS) {
        cleanEntry[key] = typeof entry[key] === 'string' ? entry[key] : '';
      }
      cleanEntry.compared = Boolean(entry.compared);
      sanitized[caseId] = cleanEntry;
    }
    return sanitized;
  } catch {
    return {};
  }
}

export function saveCaseStudyDrafts(drafts) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      STORAGE_KEYS.CASE_STUDY_DRAFTS,
      JSON.stringify(drafts)
    );
  } catch {
    // Ignore storage quota or private mode errors gracefully
  }
}

export function loadTopicsProgress() {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.TOPICS_PROGRESS);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {};
    }
    const sanitized = {};
    for (const [topicId, entry] of Object.entries(parsed)) {
      if (!entry || typeof entry !== 'object' || Array.isArray(entry)) continue;
      const bestScore = Number.isInteger(entry.bestScore) ? entry.bestScore : 0;
      const bestTotal =
        Number.isInteger(entry.bestTotal) && entry.bestTotal > 0
          ? entry.bestTotal
          : 3;
      const bestPercent =
        Number.isInteger(entry.bestPercent) && entry.bestPercent >= 0
          ? entry.bestPercent
          : Math.round((bestScore / bestTotal) * 100);
      sanitized[topicId] = {
        passed: Boolean(entry.passed),
        bestScore,
        bestTotal,
        bestPercent,
        lastScore: Number.isInteger(entry.lastScore) ? entry.lastScore : 0,
        lastTotal:
          Number.isInteger(entry.lastTotal) && entry.lastTotal > 0
            ? entry.lastTotal
            : bestTotal,
        xp: Number.isInteger(entry.xp) && entry.xp >= 0 ? entry.xp : entry.passed ? 100 : 0,
      };
    }
    return sanitized;
  } catch {
    return {};
  }
}

export function saveTopicsProgress(progress) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      STORAGE_KEYS.TOPICS_PROGRESS,
      JSON.stringify(progress)
    );
  } catch {
    // Ignore storage quota or private mode errors gracefully
  }
}

const VALID_MODULES = new Set(['M1', 'M2', 'M3', 'M4']);

export function loadCustomFlashcards() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.CUSTOM_FLASHCARDS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item) =>
          item &&
          typeof item === 'object' &&
          typeof item.id === 'string' &&
          typeof item.question === 'string' &&
          typeof item.answer === 'string' &&
          item.question.trim() &&
          item.answer.trim()
      )
      .map((item) => ({
        id: item.id,
        module: VALID_MODULES.has(item.module) ? item.module : 'M3',
        tag: typeof item.tag === 'string' && item.tag.trim() ? item.tag.trim() : 'Tự thêm',
        question: item.question.trim(),
        answer: item.answer.trim(),
        sourceUrl: typeof item.sourceUrl === 'string' ? item.sourceUrl : '',
        sourceTitle: typeof item.sourceTitle === 'string' ? item.sourceTitle : '',
        isCustom: true,
        createdAt: typeof item.createdAt === 'number' ? item.createdAt : Date.now(),
      }));
  } catch {
    return [];
  }
}

export function saveCustomFlashcards(cards) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      STORAGE_KEYS.CUSTOM_FLASHCARDS,
      JSON.stringify(cards ?? [])
    );
  } catch {
    // Ignore storage quota or private mode errors gracefully
  }
}

export function loadCustomGlossary() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.CUSTOM_GLOSSARY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item) =>
          item &&
          typeof item === 'object' &&
          typeof item.id === 'string' &&
          typeof item.term === 'string' &&
          item.term.trim()
      )
      .map((item) => ({
        id: item.id,
        module: VALID_MODULES.has(item.module) ? item.module : 'M3',
        term: item.term.trim(),
        aliases: Array.isArray(item.aliases)
          ? item.aliases.filter((a) => typeof a === 'string' && a.trim())
          : [item.term.trim()],
        whatIsIt: typeof item.whatIsIt === 'string' ? item.whatIsIt.trim() : '',
        aiRole: typeof item.aiRole === 'string' ? item.aiRole.trim() : '',
        formulaPlain:
          typeof item.formulaPlain === 'string' ? item.formulaPlain.trim() : '',
        sourceUrl: typeof item.sourceUrl === 'string' ? item.sourceUrl : '',
        sourceTitle: typeof item.sourceTitle === 'string' ? item.sourceTitle : '',
        isCustom: true,
      }));
  } catch {
    return [];
  }
}

export function saveCustomGlossary(entries) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      STORAGE_KEYS.CUSTOM_GLOSSARY,
      JSON.stringify(entries ?? [])
    );
  } catch {
    // Ignore storage quota or private mode errors gracefully
  }
}

export function loadLastHtmlTrapLessonId(validIds = [], fallbackId = 'cau-01') {
  if (typeof window === 'undefined') return fallbackId;
  try {
    const saved = window.localStorage.getItem(
      STORAGE_KEYS.LAST_HTML_TRAP_LESSON
    );
    if (saved && (!validIds.length || validIds.includes(saved))) {
      return saved;
    }
    return fallbackId;
  } catch {
    return fallbackId;
  }
}

export function saveLastHtmlTrapLessonId(lessonId) {
  if (typeof window === 'undefined' || typeof lessonId !== 'string') return;
  try {
    window.localStorage.setItem(STORAGE_KEYS.LAST_HTML_TRAP_LESSON, lessonId);
  } catch {
    // Ignore storage quota or private mode errors gracefully
  }
}
