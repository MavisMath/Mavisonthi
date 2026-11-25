import { MODULES } from '../constants/modules.js';

export function computeExamStats(data) {
  const flashcards = Array.isArray(data?.flashcards) ? data.flashcards : [];
  const quizzes = Array.isArray(data?.quizzes) ? data.quizzes : [];
  const pythonTasks = Array.isArray(data?.pythonTasks) ? data.pythonTasks : [];
  const caseStudies = Array.isArray(data?.caseStudies) ? data.caseStudies : [];

  const moduleRows = MODULES.map((mod) => {
    const modFlashcards = flashcards.filter((item) => item.module === mod.code);
    const modQuizzes = quizzes.filter((item) => item.module === mod.code);
    const weights = modQuizzes
      .map((item) => item.weight)
      .filter((w) => typeof w === 'number');
    const weight = weights.length > 0 ? Math.max(...weights) : mod.defaultWeight;
    const tags = [...new Set(modFlashcards.map((item) => item.tag).filter(Boolean))];
    const total = modFlashcards.length + modQuizzes.length;

    return {
      ...mod,
      weight,
      flashcardsCount: modFlashcards.length,
      quizzesCount: modQuizzes.length,
      total,
      tags,
    };
  });

  const totalFlashcards = flashcards.length;
  const totalQuizzes = quizzes.length;
  const totalModuleItems = moduleRows.reduce((sum, row) => sum + row.total, 0);
  const totalPythonTasks = pythonTasks.length;
  const totalCaseStudies = caseStudies.length;
  const grandTotal = totalModuleItems + totalPythonTasks + totalCaseStudies;
  const maxModuleTotal = Math.max(...moduleRows.map((row) => row.total), 1);

  return {
    moduleRows,
    totals: {
      flashcards: totalFlashcards,
      quizzes: totalQuizzes,
      moduleItems: totalModuleItems,
      pythonTasks: totalPythonTasks,
      caseStudies: totalCaseStudies,
      grandTotal,
      maxModuleTotal,
    },
  };
}
