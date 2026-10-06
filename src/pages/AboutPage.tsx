import React from 'react';
import { PageContent } from '../types/index.js';
import { 
  BookOpen, Users, Compass, Eye, ShieldCheck, HeartHandshake, 
  GraduationCap, Briefcase, Sparkles, CheckCircle2, ArrowRight 
} from 'lucide-react';

interface AboutPageProps {
  pageContent: PageContent | null;
  onNavigate: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ pageContent, onNavigate }) => {
  const story = pageContent?.aboutStory || 'Shikuran Skills was founded with a clear, inspiring mission: to make practical technology and digital literacy accessible to everyone, everywhere. Too often, technology tutorials are packed with confusing jargon and assume prior computer experience. We built Shikuran Skills to be the warm, welcoming, and empowering classroom you have always wanted.';
  const mission = pageContent?.missionText || 'To empower everyday learners with practical, beginner-friendly digital skills and technological confidence, unlocking greater career opportunities, academic success, and digital independence.';
  const vision = pageContent?.visionText || 'A world where no one is left behind by rapid technological change, and where digital literacy is an accessible bridge to personal advancement for everyone.';

  const audienceGroups = [
    {
      title: 'Students & Youth',
      desc: 'Master academic research, collaborative online tools, typing efficiency, and digital assignment submissions.',
      icon: GraduationCap
    },
    {
      title: 'Job Seekers & Workers',
      desc: 'Build resumes, master office productivity suites (Word, Excel), and unlock flexible remote work opportunities.',
      icon: Briefcase
    },
    {
      title: 'Teachers & Educators',
      desc: 'Integrate technology seamlessly into classrooms and create engaging digital presentations for students.',
      icon: BookOpen
    },
    {
      title: 'Everyday Technology Users',
      desc: 'Gain computer confidence, navigate digital banking, manage online accounts, and stay protected from scams.',
      icon: Users
    }
  ];

  const whyChoosePillars = [
    {
      title: 'Zero Technical Jargon',
      desc: 'We explain concepts in simple, everyday language that anyone can easily understand.'
    },
    {
      title: 'Practical, Actionable Steps',
      desc: 'Every tutorial focuses on real tasks you actually need in school, work, and personal life.'
    },
    {
      title: 'Safe & Respectful Learning',
      desc: 'We prioritize online privacy, cyber safety, and patient learning without judgment.'
    },
    {
      title: 'Modern & Constantly Updated',
      desc: 'Our guides reflect the current tools and interfaces you encounter in today\'s digital world.'
    }
  ];

  return (
    <div className="py-12 md:py-16 space-y-20">
      
      {/* Header Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
          Our Purpose & Story
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          About Shikuran Skills
        </h1>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
          A dedicated digital-skills and technology learning platform focused on helping people understand and use technology with confidence.
        </p>
      </section>

      {/* Who We Are & Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Who We Are
            </span>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight leading-tight">
              Demystifying Technology For Everyday People
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              {story}
            </p>
            <p className="text-base text-slate-600 leading-relaxed">
              Whether you are a student preparing for college, a worker aiming for promotion, a business owner modernizing operations, or someone using a computer for the first time, you belong here.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('tutorials')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all shadow-xs inline-flex items-center gap-2"
              >
                <span>Browse Our Tutorials</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-white">
              <img
                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1200&auto=format&fit=crop"
                alt="Modern technology education classroom and collaborative digital workspace"
                className="w-full h-[380px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Our Methodology
            </span>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              What We Do
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              We bridge the gap between complex digital tools and real-world learners through four core educational pillars:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Digital-Skills Articles</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                In-depth educational articles breaking down why modern digital capabilities matter and how to cultivate them.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Computer Learning</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clear guides for operating systems, hardware setups, keyboard shortcuts, and file management.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Practical Guides</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Step-by-step checklists for creating emails, formatting resumes, using cloud storage, and searching the web.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Online Safety</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Essential defenses to protect your identity, detect scams, create secure passwords, and protect your privacy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <Compass className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Our Mission
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              {mission}
            </p>
          </div>

          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <Eye className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Our Vision
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              {vision}
            </p>
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Inclusive Tech Education
          </span>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Who We Serve
          </h2>
          <p className="text-base text-slate-600">
            Shikuran Skills is designed for anyone ready to expand their digital horizons:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {audienceGroups.map((group, idx) => {
            const Icon = group.icon;
            return (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">{group.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{group.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why Choose Shikuran Skills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 lg:p-16">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Our Promise
            </span>
            <h2 className="text-3xl font-bold tracking-tight">
              Why Choose Shikuran Skills
            </h2>
            <p className="text-base text-slate-300">
              We stand apart through our human-centered approach to digital learning:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {whyChoosePillars.map((pillar, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-1 font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">{pillar.title}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{pillar.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
