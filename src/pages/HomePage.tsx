import React, { useEffect, useState } from 'react';
import { BlogPost, PageContent } from '../types/index.js';
import { api } from '../utils/api.ts';
import { BlogCard } from '../components/BlogCard.tsx';
import { 
  ArrowRight, Sparkles, Laptop, Globe, Wrench, ShieldCheck, 
  Cpu, Zap, CheckCircle2, BookOpen, Layers, Award, Users 
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string, param?: string) => void;
  pageContent: PageContent | null;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, pageContent }) => {
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    let mounted = true;
    api.getPosts(undefined, undefined)
      .then(res => {
        if (mounted) {
          // Display up to 3 latest posts
          setLatestPosts(res.posts.slice(0, 3));
          setLoadingPosts(false);
        }
      })
      .catch(err => {
        console.error('Failed to load latest posts', err);
        if (mounted) setLoadingPosts(false);
      });

    return () => { mounted = false; };
  }, []);

  const heroHeading = pageContent?.heroHeading || 'Learn Digital Skills. Build Your Future.';
  const heroSubtext = pageContent?.heroSubtext || 'Welcome to Shikuran Skills, a practical digital-learning platform helping beginners, students, professionals, and everyday technology users develop useful digital skills for school, work, business, and everyday life.';
  const welcomeHeading = pageContent?.welcomeHeading || 'Welcome to Shikuran Skills';
  const welcomeText = pageContent?.welcomeText || 'Technology is becoming increasingly important in education, employment, business, communication, and everyday life. At Shikuran Skills, we believe anyone can learn to use digital tools with confidence. Our tutorials, guides, and articles break down complex technology into clear, everyday steps that anyone can follow without technical jargon.';

  // 6 Digital Skills Areas
  const digitalSkillsAreas = [
    {
      title: 'Computer Basics',
      description: 'Master hardware, desktop navigation, keyboard shortcuts, and file management with zero confusion.',
      icon: Laptop,
      categoryFilter: 'Computer Basics',
    },
    {
      title: 'Internet Skills',
      description: 'Search effectively, verify credible information, bookmark resources, and use web browsers like an expert.',
      icon: Globe,
      categoryFilter: 'Digital Skills',
    },
    {
      title: 'Digital Tools',
      description: 'Harness Microsoft Word, Google Docs, spreadsheets, and presentation software to elevate your daily work.',
      icon: Wrench,
      categoryFilter: 'Productivity Tools',
    },
    {
      title: 'Online Safety',
      description: 'Protect your identity, create unbreakable passwords, spot phishing scams, and browse with complete security.',
      icon: ShieldCheck,
      categoryFilter: 'Online Safety',
    },
    {
      title: 'Technology',
      description: 'Understand emerging digital trends, cloud systems, and how the modern connected economy functions.',
      icon: Cpu,
      categoryFilter: 'Technology',
    },
    {
      title: 'Digital Productivity',
      description: 'Streamline workflows with cloud storage, collaborative files, digital calendars, and task management.',
      icon: Zap,
      categoryFilter: 'Productivity Tools',
    },
  ];

  // 8 Benefits for Why Digital Skills Matter
  const whyLearnBenefits = [
    {
      title: 'Improve computer confidence',
      desc: 'Eliminate hesitation and fear of breaking things. Approach any computer or app with self-assurance.'
    },
    {
      title: 'Improve education',
      desc: 'Conduct thorough academic research, format assignments properly, and excel in modern digital classrooms.'
    },
    {
      title: 'Increase workplace productivity',
      desc: 'Automate repetitive tasks, organize clear documents, and save hours every single work week.'
    },
    {
      title: 'Communicate effectively',
      desc: 'Write polished professional emails, collaborate in shared docs, and connect via video conferencing.'
    },
    {
      title: 'Access online opportunities',
      desc: 'Apply for remote employment, freelance contracts, and discover international educational scholarships.'
    },
    {
      title: 'Improve problem-solving',
      desc: 'Troubleshoot minor tech glitches, understand file formats, and think systematically about solutions.'
    },
    {
      title: 'Prepare for future careers',
      desc: 'Gain the foundational digital competence that almost every employer across all industries demands.'
    },
    {
      title: 'Use technology safely',
      desc: 'Safeguard your personal data, avoid deceptive online scams, and keep your family secure online.'
    },
  ];

  return (
    <div className="space-y-24 md:space-y-32 pb-20">
      
      {/* 4. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 md:pt-20 pb-16 md:pb-24 border-b border-slate-200 bg-gradient-to-b from-blue-50/40 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Domain kicker (Clean typography, no garish pill) */}
              <div className="text-xs font-bold text-blue-600 tracking-wider uppercase flex items-center gap-2">
                <span>Shikuran Skills Learning Platform</span>
                <span className="text-slate-300">·</span>
                <span className="text-slate-500 font-medium">Digital Literacy For Everyone</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                {heroHeading}
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl font-normal">
                {heroSubtext}
              </p>

              {/* Working Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onNavigate('blog')}
                  className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2 text-sm"
                >
                  <span>Start Learning</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('tutorials')}
                  className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-xl border border-slate-200 hover:border-slate-300 transition-all flex items-center gap-2 text-sm shadow-xs"
                >
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span>Explore Tutorials</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-100 grid grid-cols-3 gap-4 text-left">
                <div>
                  <div className="text-2xl font-bold text-slate-900">100%</div>
                  <div className="text-xs text-slate-500 font-medium">Beginner Friendly</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">Free</div>
                  <div className="text-xs text-slate-500 font-medium">Practical Guides</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">Real</div>
                  <div className="text-xs text-slate-500 font-medium">Everyday Skills</div>
                </div>
              </div>
            </div>

            {/* Right Visual Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-white">
                <img
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop"
                  alt="Students and professionals learning digital skills on laptops in a modern tech workshop"
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-300 mb-1">
                    Hands-On Experience
                  </span>
                  <p className="text-sm font-medium text-slate-100">
                    Master modern technology step-by-step with clear, jargon-free tutorials.
                  </p>
                </div>
              </div>

              {/* Floating decorative badge */}
              <div className="hidden sm:flex items-center gap-3 absolute -bottom-5 -left-5 bg-white p-4 rounded-xl shadow-lg border border-slate-200 text-slate-800">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Practical & Accessible</div>
                  <div className="text-[11px] text-slate-500">For students, workers & seniors</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. INTRODUCTION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-3xl space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Technology Education For Everyone</span>
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {welcomeHeading}
            </h2>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              {welcomeText}
            </p>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('about')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all inline-flex items-center gap-2 text-sm shadow-md"
              >
                <span>Learn More About Us</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Decorative background visual */}
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-12 translate-y-12">
            <Laptop className="w-96 h-96 text-white stroke-[1]" />
          </div>
        </div>
      </section>

      {/* 6. DIGITAL SKILLS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Comprehensive Learning Tracks
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Build Your Digital Skills
          </h2>
          <p className="text-base text-slate-600">
            Select a learning pathway below to discover targeted guides, foundational concepts, and practical step-by-step tutorials.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {digitalSkillsAreas.map((area, idx) => {
            const IconComponent = area.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 p-8 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-blue-200 transition-all group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-3">
                    {area.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {area.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">Step-by-step guides</span>
                  <button
                    onClick={() => onNavigate('blog', area.categoryFilter)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. LATEST BLOG POSTS SECTION (DYNAMIC FROM DATABASE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
              Fresh Insights & Guides
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Latest From Our Blog
            </h2>
          </div>
          <button
            onClick={() => onNavigate('blog')}
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span>View All Articles</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {loadingPosts ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(n => (
              <div key={n} className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse space-y-4">
                <div className="aspect-16/10 bg-slate-200 rounded-xl" />
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-6 bg-slate-200 rounded w-3/4" />
                <div className="h-16 bg-slate-200 rounded w-full" />
              </div>
            ))}
          </div>
        ) : latestPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestPosts.map((post) => (
              <BlogCard
                key={post.id}
                post={post}
                onReadMore={(slugOrId) => onNavigate('blog-post', slugOrId)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-base font-medium">No posts available yet. Check back soon for new digital-skills articles.</p>
          </div>
        )}
      </section>

      {/* 8. WHY LEARN DIGITAL SKILLS SECTION */}
      <section className="bg-slate-50/80 py-20 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Transform Your Life & Work
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Why Digital Skills Matter
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Digital competence is no longer just for software engineers. It is an essential life capability that improves your daily confidence, academic success, and financial well-being.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyLearnBenefits.map((benefit, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs mb-4">
                  0{idx + 1}
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                  {benefit.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {benefit.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. CALL TO ACTION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl p-10 sm:p-14 lg:p-16 text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Start Learning Today
            </h2>
            <p className="text-base sm:text-lg text-blue-100 leading-relaxed">
              Technology is changing the way we learn, work, communicate, and do business. Start developing practical digital skills today and prepare yourself for a more connected future.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => onNavigate('blog')}
                className="px-8 py-3.5 bg-white hover:bg-slate-100 text-blue-700 font-bold rounded-xl transition-all shadow-md text-sm flex items-center gap-2"
              >
                <span>Explore Digital Skills</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('tutorials')}
                className="px-8 py-3.5 bg-blue-700/60 hover:bg-blue-700 text-white font-bold rounded-xl border border-white/20 transition-all text-sm flex items-center gap-2"
              >
                <span>View Free Tutorials</span>
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
