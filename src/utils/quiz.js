import { MODULES } from '../constants/modules.js';

export const MOCK_EXAM_DURATION_SECONDS = 90 * 60; // 90:00

export function shuffleList(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Stratified sampling across modules inside a bucket so no module is starved.
 */
function sampleStratifiedByModule(bucket, count) {
  if (count <= 0 || bucket.length === 0) return [];
  if (count >= bucket.length) return shuffleList(bucket);

  const byModule = new Map();
  for (const q of shuffleList(bucket)) {
    const key = q.module || 'OTHER';
    if (!byModule.has(key)) byModule.set(key, []);
    byModule.get(key).push(q);
  }

  const moduleKeys = shuffleList([...byModule.keys()]);
  const picked = [];
  let cursor = 0;

  while (picked.length < count) {
    let addedInRound = false;
    for (let i = 0; i < moduleKeys.length && picked.length < count; i += 1) {
      const key = moduleKeys[(cursor + i) % moduleKeys.length];
      const list = byModule.get(key);
      if (list && list.length > 0) {
        picked.push(list.pop());
        addedInRound = true;
      }
    }
    if (!addedInRound) break;
    cursor += 1;
  }

  return picked;
}

/**
 * Build a weighted mock exam that shuffles questions and prioritizes
 * weight >= 2 (M2, M3) over weight === 1 (M1, M4).
 *
 * Target balance:
 * - Up to 24 weight-2 questions (60% of question count, 75% of weighted score)
 * - Paired with ~2/3 as many weight-1 questions (40% of count, stratified across M1 & M4)
 * - Example with 12-question pool (6 weight-2, 6 weight-1): picks 6 weight-2 + 4 weight-1 = 10 questions.
 * - Example with 60-question pool (30 weight-2, 30 weight-1): picks 24 weight-2 + 16 weight-1 = 40 questions.
 */
export function buildWeightedMockExam(quizzes = [], maxHighWeight = 24) {
  if (!Array.isArray(quizzes) || quizzes.length === 0) return [];

  const highWeightPool = quizzes.filter((q) => (q.weight ?? 1) >= 2);
  const stdWeightPool = quizzes.filter((q) => (q.weight ?? 1) < 2);

  if (highWeightPool.length === 0) {
    return shuffleList(stdWeightPool);
  }

  const highCount = Math.min(highWeightPool.length, maxHighWeight);
  // Strictly fewer weight-1 questions than weight-2 when both buckets have enough items
  let stdTarget = Math.min(
    stdWeightPool.length,
    Math.floor((highCount * 2) / 3)
  );
  if (stdWeightPool.length > 0 && stdTarget === 0) {
    stdTarget = 1;
  }
  if (highCount > 1 && stdTarget >= highCount) {
    stdTarget = highCount - 1;
  }

  const selectedHigh = sampleStratifiedByModule(highWeightPool, highCount);
  const selectedStd = sampleStratifiedByModule(stdWeightPool, stdTarget);

  return shuffleList([...selectedHigh, ...selectedStd]);
}

export function gradeMockExam(questions = [], answers = {}) {
  let correctCount = 0;
  let answeredCount = 0;
  let weightedEarned = 0;
  let weightedTotal = 0;

  const moduleAccumulator = Object.fromEntries(
    MODULES.map((m) => [
      m.code,
      {
        ...m,
        total: 0,
        correct: 0,
        answered: 0,
        weightedEarned: 0,
        weightedTotal: 0,
      },
    ])
  );

  const wrongQuestions = [];

  for (const q of questions) {
    const weight = typeof q.weight === 'number' && q.weight > 0 ? q.weight : 1;
    const selectedIndex = answers[q.id];
    const isAnswered = typeof selectedIndex === 'number';
    const isCorrect = isAnswered && selectedIndex === q.correctIndex;

    weightedTotal += weight;
    if (isAnswered) answeredCount += 1;
    if (isCorrect) {
      correctCount += 1;
      weightedEarned += weight;
    } else {
      wrongQuestions.push({
        question: q,
        selectedIndex: isAnswered ? selectedIndex : null,
      });
    }

    const bucket = moduleAccumulator[q.module];
    if (bucket) {
      bucket.total += 1;
      bucket.weightedTotal += weight;
      if (isAnswered) bucket.answered += 1;
      if (isCorrect) {
        bucket.correct += 1;
        bucket.weightedEarned += weight;
      }
    }
  }

  const totalQuestions = questions.length;
  const accuracyPercent =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const weightedPercent =
    weightedTotal > 0 ? Math.round((weightedEarned / weightedTotal) * 100) : 0;
  const scoreOutOf10 =
    weightedTotal > 0
      ? Number(((weightedEarned / weightedTotal) * 10).toFixed(2))
      : 0;

  const moduleBreakdown = MODULES.map((m) => {
    const item = moduleAccumulator[m.code];
    const percent =
      item.total > 0 ? Math.round((item.correct / item.total) * 100) : null;
    return {
      ...item,
      percent,
    };
  });

  return {
    totalQuestions,
    answeredCount,
    correctCount,
    wrongCount: wrongQuestions.length,
    accuracyPercent,
    weightedEarned,
    weightedTotal,
    weightedPercent,
    scoreOutOf10,
    moduleBreakdown,
    wrongQuestions,
  };
}

export function formatCountdown(totalSeconds) {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
