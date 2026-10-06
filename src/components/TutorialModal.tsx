import React, { useState } from 'react';
import { Tutorial } from '../types/index.js';
import { 
  X, CheckCircle, ChevronRight, ChevronLeft, Lightbulb, 
  RotateCcw, Award, BookOpen 
} from 'lucide-react';

interface TutorialModalProps {
  tutorial: Tutorial;
  onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ tutorial, onClose }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = tutorial.steps && tutorial.steps.length > 0 ? tutorial.steps : [
    {
      stepNumber: 1,
      title: 'Introduction to this skill',
      content: tutorial.short_description,
      keyTip: 'Take your time and practice each action carefully.'
    }
  ];

  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;
  const isFirstStep = currentStepIndex === 0;

  const toggleStepCompleted = (index: number) => {
    if (completedSteps.includes(index)) {
      setCompletedSteps(completedSteps.filter(i => i !== index));
    } else {
      setCompletedSteps([...completedSteps, index]);
    }
  };

  const handleNext = () => {
    if (!completedSteps.includes(currentStepIndex)) {
      setCompletedSteps([...completedSteps, currentStepIndex]);
    }
    if (!isLastStep) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const progressPercent = Math.round((completedSteps.length / steps.length) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div className="bg-white text-slate-900 rounded-2xl max-w-3xl w-full flex flex-col max-h-[92vh] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                Step-By-Step Tutorial
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 line-clamp-1">
                {tutorial.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close tutorial"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5">
          <div 
            className="bg-blue-600 h-1.5 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {/* Step Pill & Step Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Step {currentStepIndex + 1} of {steps.length}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                {currentStep.title}
              </h3>
            </div>
            <button
              onClick={() => toggleStepCompleted(currentStepIndex)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                completedSteps.includes(currentStepIndex)
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              <CheckCircle className={`w-4 h-4 ${completedSteps.includes(currentStepIndex) ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>{completedSteps.includes(currentStepIndex) ? 'Completed' : 'Mark as done'}</span>
            </button>
          </div>

          {/* Step Content */}
          <div className="prose max-w-none text-slate-700 leading-relaxed text-base">
            <p className="whitespace-pre-line">{currentStep.content}</p>
          </div>

          {/* Key Tip Box */}
          {currentStep.keyTip && (
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-4 flex items-start gap-3 text-amber-900">
              <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-xs font-bold uppercase tracking-wider text-amber-800 block mb-0.5">
                  Pro-Tip for Beginners
                </strong>
                <p className="text-sm leading-relaxed">{currentStep.keyTip}</p>
              </div>
            </div>
          )}

          {/* Step Quick Jump Checklist */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              All Tutorial Steps
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {steps.map((st, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`px-3 py-2 text-left rounded-lg text-xs font-medium border flex items-center justify-between gap-1 transition-all ${
                    currentStepIndex === idx
                      ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                      : completedSteps.includes(idx)
                      ? 'border-emerald-200 bg-emerald-50/50 text-emerald-800'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span className="truncate">
                    {idx + 1}. {st.title}
                  </span>
                  {completedSteps.includes(idx) && (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Completion Celebration if all completed */}
          {completedSteps.length === steps.length && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center space-y-2 animate-in fade-in duration-200">
              <Award className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="text-sm font-bold text-emerald-900">Tutorial Completed!</h4>
              <p className="text-xs text-emerald-700">
                Outstanding work! You have finished all steps in "{tutorial.title}". Keep practicing to reinforce your digital skills!
              </p>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={isFirstStep}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg border transition-all ${
              isFirstStep
                ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400 border-transparent'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>

          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            Step {currentStepIndex + 1} of {steps.length} ({progressPercent}% complete)
          </span>

          <div className="flex items-center gap-2">
            {!isLastStep ? (
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all shadow-xs"
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-all shadow-xs"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Finish Tutorial</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
