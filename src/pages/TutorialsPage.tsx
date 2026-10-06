import React, { useState, useEffect } from 'react';
import { Tutorial } from '../types/index.js';
import { api } from '../utils/api.ts';
import { TutorialCard } from '../components/TutorialCard.tsx';
import { TutorialModal } from '../components/TutorialModal.tsx';
import { BookOpen, Sparkles, Filter, CheckCircle2 } from 'lucide-react';

interface TutorialsPageProps {
  onNavigate: (page: string) => void;
}

export const TutorialsPage: React.FC<TutorialsPageProps> = () => {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [filterLevel, setFilterLevel] = useState<string>('All');

  useEffect(() => {
    api.getTutorials()
      .then(tuts => {
        setTutorials(tuts);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load tutorials', err);
        setLoading(false);
      });
  }, []);

  const filteredTutorials = tutorials.filter(t => {
    if (filterLevel === 'All') return true;
    return t.level.toLowerCase() === filterLevel.toLowerCase();
  });

  return (
    <div className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Page Heading */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4" />
          <span>Interactive Learning Guides</span>
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Digital Skills Tutorials
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          Step-by-step practical guides designed for absolute beginners and everyday computer users. Click any tutorial below to learn at your own pace.
        </p>
      </div>

      {/* Level Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
            Skill Level:
          </span>
          {['All', 'Beginner', 'Intermediate', 'All Levels'].map((level) => (
            <button
              key={level}
              onClick={() => setFilterLevel(level)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filterLevel === level
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {level}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500">
          Showing <strong className="text-slate-900">{filteredTutorials.length}</strong> available tutorials
        </div>
      </div>

      {/* Tutorials Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse space-y-4">
              <div className="w-12 h-12 bg-slate-200 rounded-xl" />
              <div className="h-6 bg-slate-200 rounded w-3/4" />
              <div className="h-16 bg-slate-200 rounded w-full" />
              <div className="h-8 bg-slate-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : filteredTutorials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredTutorials.map((tutorial) => (
            <TutorialCard
              key={tutorial.id}
              tutorial={tutorial}
              onStart={(tut) => setSelectedTutorial(tut)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 max-w-md mx-auto space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No tutorials in this level</h3>
          <button
            onClick={() => setFilterLevel('All')}
            className="text-xs font-bold text-blue-600 hover:underline"
          >
            Show all tutorials
          </button>
        </div>
      )}

      {/* Feature banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-blue-950">
            Want to learn a specific digital tool?
          </h3>
          <p className="text-sm text-blue-800 leading-relaxed max-w-2xl">
            We regularly update our digital skills curriculum based on community requests. All tutorials include step-by-step checklists, pro-tips, and keyboard shortcuts.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900 bg-white px-3.5 py-2 rounded-xl border border-blue-200 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Interactive Steps</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900 bg-white px-3.5 py-2 rounded-xl border border-blue-200 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Pro Tips</span>
          </div>
        </div>
      </div>

      {/* Step-by-Step Interactive Modal */}
      {selectedTutorial && (
        <TutorialModal
          tutorial={selectedTutorial}
          onClose={() => setSelectedTutorial(null)}
        />
      )}

    </div>
  );
};
