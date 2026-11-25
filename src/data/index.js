import examDataCore from './examData.json';
import flashcardsM1 from './flashcards_m1.json';
import flashcardsM2 from './flashcards_m2.json';
import flashcardsM3 from './flashcards_m3.json';
import flashcardsM4 from './flashcards_m4.json';

const flashcards = [
  ...flashcardsM1,
  ...flashcardsM2,
  ...flashcardsM3,
  ...flashcardsM4,
].sort((a, b) => {
  const dayDiff = (a.day ?? 99) - (b.day ?? 99);
  if (dayDiff !== 0) return dayDiff;
  return String(a.id).localeCompare(String(b.id), undefined, { numeric: true });
});

export const examData = {
  flashcards,
  quizzes: examDataCore.quizzes ?? [],
  pythonTasks: examDataCore.pythonTasks ?? [],
  caseStudies: examDataCore.caseStudies ?? [],
};

export { flashcardsM1, flashcardsM2, flashcardsM3, flashcardsM4 };
export default examData;
