import React from 'react';
import { Tutorial } from '../types/index.js';
import { 
  Monitor, FolderKanban, FileText, Search, Mail, ShieldCheck, 
  Cloud, ArrowRight, Clock, Award 
} from 'lucide-react';

interface TutorialCardProps {
  tutorial: Tutorial;
  onStart: (tutorial: Tutorial) => void;
}

export const TutorialCard: React.FC<TutorialCardProps> = ({ tutorial, onStart }) => {
  // Map icon name to Lucide component
  const renderIcon = (iconName: string) => {
    const props = { className: "w-6 h-6 text-blue-600" };
    switch (iconName) {
      case 'Monitor': return <Monitor {...props} />;
      case 'FolderKanban': return <FolderKanban {...props} />;
      case 'FileText': return <FileText {...props} />;
      case 'Search': return <Search {...props} />;
      case 'Mail': return <Mail {...props} />;
      case 'ShieldCheck': return <ShieldCheck {...props} />;
      case 'Cloud': return <Cloud {...props} />;
      default: return <Monitor {...props} />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col h-full shadow-xs hover:shadow-md transition-all duration-200 hover:border-slate-300 group">
      {/* Icon & Metadata */}
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 transition-colors">
          <span className="group-hover:text-white transition-colors [&>svg]:group-hover:text-white">
            {renderIcon(tutorial.icon)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span>{tutorial.level}</span>
          <span className="text-slate-300" aria-hidden="true">·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            {tutorial.read_time}
          </span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug mb-2.5">
        {tutorial.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-slate-600 leading-relaxed mb-6 flex-1">
        {tutorial.short_description}
      </p>

      {/* Steps Count & Action */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-blue-600" />
          <span>{tutorial.steps?.length || 4} Practical Steps</span>
        </span>
        <button
          onClick={() => onStart(tutorial)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs group-hover:shadow-blue-500/20"
        >
          <span>Start Tutorial</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
