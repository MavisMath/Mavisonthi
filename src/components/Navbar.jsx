import {
  BookOpen,
  BriefcaseBusiness,
  ClipboardList,
  Code2,
  Compass,
  Flame,
  LayoutGrid,
  Zap,
} from 'lucide-react';
import { NAV_TABS } from '../constants/modules';

const TAB_ICONS = {
  topics: Compass,
  flashcards: Zap,
  quizzes: ClipboardList,
  python: Code2,
  'case-study': BriefcaseBusiness,
  traps: Flame,
};

export default function Navbar({ activeTab, onSelectTab }) {
  const isOverview = activeTab === 'overview';

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-2.5 py-2.5 2xl:h-16 2xl:flex-row 2xl:items-center 2xl:justify-between 2xl:gap-3 2xl:py-0">
          {/* Brand & Overview trigger */}
          <div className="flex shrink-0 items-center justify-between gap-2.5">
            <button
              type="button"
              onClick={() => onSelectTab('topics')}
              className="group flex items-center gap-2 text-left focus:outline-none"
              title="Về 12 Chuyên đề"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white transition-colors group-hover:bg-blue-700">
                <BookOpen className="h-4 w-4" strokeWidth={2} />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="whitespace-nowrap text-sm font-semibold tracking-tight text-slate-900">
                  AI Thực chiến VinUni
                </span>
                <span className="whitespace-nowrap font-mono text-[11px] text-slate-500">
                  SFIA Level 3 · AI20K
                </span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('overview')}
              className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                isOverview
                  ? 'border-blue-200 bg-blue-50 text-blue-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Tổng quan</span>
            </button>
          </div>

          {/* 6 Navigation Tabs */}
          <nav
            aria-label="Thanh điều hướng chính"
            className="flex flex-wrap items-center gap-1"
          >
            {NAV_TABS.map((tab) => {
              const Icon = TAB_ICONS[tab.id];
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onSelectTab(tab.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon
                    className={`h-3.5 w-3.5 shrink-0 ${
                      isActive
                        ? tab.id === 'traps'
                          ? 'text-rose-300'
                          : 'text-blue-300'
                        : 'text-slate-400'
                    }`}
                    strokeWidth={1.9}
                  />
                  <span className="whitespace-nowrap">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
