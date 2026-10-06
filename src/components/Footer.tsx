import React, { useState } from 'react';
import { BookOpen, ExternalLink, ShieldCheck, FileText, ArrowUp } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [modalType, setModalType] = useState<'privacy' | 'terms' | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-1 space-y-4">
            <div 
              onClick={() => { onNavigate('home'); scrollToTop(); }}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                <BookOpen className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">
                SHIKURAN <span className="text-blue-400">SKILLS</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Practical digital skills and technology education for everyone. Helping beginners, students, workers, and professionals build a confident digital future.
            </p>
            <p className="text-xs text-slate-500 font-mono">
              Future domain: shikurandigital.com
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => { onNavigate('home'); scrollToTop(); }}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onNavigate('blog'); scrollToTop(); }}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Blog & Articles
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onNavigate('tutorials'); scrollToTop(); }}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Digital Tutorials
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onNavigate('about'); scrollToTop(); }}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onNavigate('contact'); scrollToTop(); }}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Learning Topics */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Learning Focus
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>Computer Fundamentals</li>
              <li>File & Folder Management</li>
              <li>Online Safety & Privacy</li>
              <li>Email & Office Productivity</li>
              <li>Effective Internet Research</li>
              <li>Remote Work Readiness</li>
            </ul>
          </div>

          {/* Connect & Social */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Connect With Us
            </h3>
            <p className="text-sm text-slate-400">
              Follow our practical digital tips, bite-sized tutorials, and technology updates on TikTok:
            </p>
            <a
              href="https://www.tiktok.com/@shikuranskills"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-semibold transition-all border border-slate-700 hover:border-slate-600 group"
            >
              {/* TikTok Icon SVG */}
              <svg className="w-4 h-4 fill-current text-white group-hover:text-blue-400 transition-colors" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.85.12V9.41a6.33 6.33 0 0 0-.85-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 9.17 5.61 6.3 6.3 0 0 0 3.52-5.61V8.41a8.18 8.18 0 0 0 4.76 1.72V6.69z"/>
              </svg>
              <span>Follow on TikTok</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Shikuran Skills. All rights reserved.</p>
          
          <div className="flex items-center gap-6">
            <button
              onClick={() => setModalType('privacy')}
              className="hover:text-slate-300 transition-colors underline-offset-4 hover:underline"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setModalType('terms')}
              className="hover:text-slate-300 transition-colors underline-offset-4 hover:underline"
            >
              Terms of Service
            </button>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 hover:text-white transition-colors"
              title="Back to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Back to Top</span>
            </button>
          </div>
        </div>
      </div>

      {/* Privacy Policy / Terms Modal */}
      {modalType && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-2xl max-w-xl w-full p-6 max-h-[85vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                {modalType === 'privacy' ? (
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                ) : (
                  <FileText className="w-5 h-5 text-blue-600" />
                )}
                <h3 className="text-lg font-bold">
                  {modalType === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
                </h3>
              </div>
              <button
                onClick={() => setModalType(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1 rounded-md"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4 text-sm text-slate-600 leading-relaxed">
              {modalType === 'privacy' ? (
                <>
                  <p>
                    <strong>Shikuran Skills</strong> is committed to safeguarding the privacy of our visitors, learners, and community members.
                  </p>
                  <h4 className="font-bold text-slate-900 text-sm">1. Information We Collect</h4>
                  <p>
                    We collect only the information you voluntarily provide when submitting a comment or contacting us through our contact form (such as your name and email address).
                  </p>
                  <h4 className="font-bold text-slate-900 text-sm">2. How We Use Information</h4>
                  <p>
                    Information submitted is used solely to respond to your inquiries and display your community comments. We never sell, rent, or trade your personal information to third parties.
                  </p>
                  <h4 className="font-bold text-slate-900 text-sm">3. Security</h4>
                  <p>
                    We employ industry-standard security measures and encryption to safeguard your data against unauthorized access.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Welcome to <strong>Shikuran Skills</strong>. By accessing our educational articles, guides, and tutorials, you agree to these standard terms.
                  </p>
                  <h4 className="font-bold text-slate-900 text-sm">1. Educational Purpose</h4>
                  <p>
                    All articles, guides, and tutorials provided on Shikuran Skills are for educational and informational purposes to help beginners develop digital skills.
                  </p>
                  <h4 className="font-bold text-slate-900 text-sm">2. Intellectual Property</h4>
                  <p>
                    All original articles and tutorial materials are the property of Shikuran Skills. You may share links to our articles freely with attribution.
                  </p>
                  <h4 className="font-bold text-slate-900 text-sm">3. Community Conduct</h4>
                  <p>
                    When posting comments, please maintain respectful and constructive dialogue. Spam, abusive language, or misleading promotional links will be removed.
                  </p>
                </>
              )}
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setModalType(null)}
                className="px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
