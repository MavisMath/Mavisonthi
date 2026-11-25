import { useMemo, useState } from 'react';
import examData from './data/index.js';
import CaseStudyTab from './components/CaseStudyTab';
import FlashcardTab from './components/FlashcardTab';
import Navbar from './components/Navbar';
import OverviewPage from './components/OverviewPage';
import PythonTab from './components/PythonTab';
import QuizTab from './components/QuizTab';
import SelectionLookupAssistant from './components/SelectionLookupAssistant';
import TopicsTab from './components/TopicsTab';
import TrapsTab from './components/TrapsTab';
import { computeExamStats } from './utils/stats';
import { useCustomFlashcards } from './utils/userStudyStore.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('topics');
  const [selectedFlashcardDay, setSelectedFlashcardDay] = useState('ALL');
  const [selectedQuizModule, setSelectedQuizModule] = useState('M1');
  const [quizNavNonce, setQuizNavNonce] = useState(0);
  const [manualLookupTerm, setManualLookupTerm] = useState(null);

  const customFlashcards = useCustomFlashcards();
  const allFlashcards = useMemo(
    () => [...customFlashcards, ...(examData?.flashcards ?? [])],
    [customFlashcards]
  );

  const mergedData = useMemo(
    () => ({
      ...examData,
      flashcards: allFlashcards,
    }),
    [allFlashcards]
  );

  const stats = useMemo(() => computeExamStats(mergedData), [mergedData]);

  const handleOpenStudyDay = (dayNumber) => {
    setSelectedFlashcardDay(dayNumber);
    setActiveTab('flashcards');
  };

  const handleOpenCustomFlashcards = () => {
    setSelectedFlashcardDay('CUSTOM');
    setActiveTab('flashcards');
  };

  const handlePracticeModule = (moduleCode) => {
    setSelectedQuizModule(moduleCode);
    setQuizNavNonce((n) => n + 1);
    setActiveTab('quizzes');
  };

  const renderContent = () => {
    if (activeTab === 'topics') {
      return <TopicsTab onPracticeModule={handlePracticeModule} />;
    }
    if (activeTab === 'flashcards') {
      return (
        <FlashcardTab
          flashcards={allFlashcards}
          initialDay={selectedFlashcardDay}
          onDayChange={setSelectedFlashcardDay}
          onBackToOverview={() => setActiveTab('overview')}
          onOpenTermLookup={(term) => setManualLookupTerm(term)}
        />
      );
    }
    if (activeTab === 'quizzes') {
      return (
        <QuizTab
          quizzes={examData?.quizzes ?? []}
          initialModule={selectedQuizModule}
          navigationNonce={quizNavNonce}
          onBackToOverview={() => setActiveTab('overview')}
        />
      );
    }
    if (activeTab === 'python') {
      return (
        <PythonTab
          pythonTasks={examData?.pythonTasks ?? []}
          onBackToOverview={() => setActiveTab('overview')}
        />
      );
    }
    if (activeTab === 'case-study') {
      return (
        <CaseStudyTab
          caseStudies={examData?.caseStudies ?? []}
          onBackToOverview={() => setActiveTab('overview')}
        />
      );
    }
    if (activeTab === 'traps') {
      return <TrapsTab />;
    }
    return (
      <OverviewPage
        stats={stats}
        flashcards={allFlashcards}
        onSelectTab={setActiveTab}
        onSelectStudyDay={handleOpenStudyDay}
      />
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar activeTab={activeTab} onSelectTab={setActiveTab} />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        {renderContent()}
      </main>

      <SelectionLookupAssistant
        onOpenCustomFlashcards={handleOpenCustomFlashcards}
        manualTriggerTerm={manualLookupTerm}
        onClearManualTrigger={() => setManualLookupTerm(null)}
      />

      <footer className="border-t border-slate-200/80 bg-white/70">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-slate-500 sm:flex-row sm:px-6">
          <span>
            Ôn thi AI Thực chiến VinUni · 12 Chuyên đề ({allFlashcards.length} thuật ngữ · {examData.quizzes.length} trắc nghiệm)
          </span>
          <span className="font-mono text-[11px] text-slate-400">
            Bôi đen bất kỳ từ nào để tra mạng &amp; thêm vào Flashcard
          </span>
        </div>
      </footer>
    </div>
  );
}
