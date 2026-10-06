import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { BlogPage } from './pages/BlogPage.tsx';
import { BlogPostPage } from './pages/BlogPostPage.tsx';
import { TutorialsPage } from './pages/TutorialsPage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';
import { AdminLoginPage } from './pages/AdminLoginPage.tsx';
import { AdminDashboard } from './pages/admin/AdminDashboard.tsx';
import { PageContent } from './types/index.js';
import { api, getAuthToken } from './utils/api.ts';
import { Search, X, BookOpen, ArrowRight } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [currentParam, setCurrentParam] = useState<string | undefined>(undefined);
  const [pageContent, setPageContent] = useState<PageContent | null>(null);

  // Quick Search Dialog state
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [quickSearchQuery, setQuickSearchQuery] = useState('');
  const [quickSearchResults, setQuickSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  // Load public page content
  const loadPageContent = () => {
    api.getPageContent()
      .then(content => setPageContent(content))
      .catch(err => console.error('Failed to load page content', err));
  };

  useEffect(() => {
    loadPageContent();

    // Check URL hash for direct routing (e.g. #blog, #tutorials, #about, #contact, #post-slug, #admin)
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('blog-post/')) {
        const slug = hash.replace('blog-post/', '');
        setCurrentPage('blog-post');
        setCurrentParam(slug);
      } else if (hash === 'blog' || hash === 'tutorials' || hash === 'about' || hash === 'contact' || hash === 'admin-login' || hash === 'admin-dashboard') {
        setCurrentPage(hash);
        setCurrentParam(undefined);
      } else {
        setCurrentPage('home');
        setCurrentParam(undefined);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleNavigate = (page: string, param?: string) => {
    setCurrentPage(page);
    setCurrentParam(param);

    if (page === 'blog-post' && param) {
      window.location.hash = `blog-post/${param}`;
    } else if (page === 'home') {
      window.location.hash = '';
    } else {
      window.location.hash = page;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Quick search handler
  useEffect(() => {
    if (!quickSearchQuery.trim()) {
      setQuickSearchResults([]);
      return;
    }

    setSearching(true);
    const timeout = setTimeout(() => {
      api.getPosts(undefined, quickSearchQuery.trim())
        .then(res => {
          setQuickSearchResults(res.posts.slice(0, 5));
          setSearching(false);
        })
        .catch(() => setSearching(false));
    }, 250);

    return () => clearTimeout(timeout);
  }, [quickSearchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* If in Admin Dashboard, render full screen admin layout */}
      {currentPage === 'admin-dashboard' ? (
        getAuthToken() ? (
          <AdminDashboard
            onLogout={() => handleNavigate('admin-login')}
            onNavigateHome={() => handleNavigate('home')}
            onRefreshPublicData={loadPageContent}
          />
        ) : (
          <AdminLoginPage
            onLoginSuccess={() => handleNavigate('admin-dashboard')}
            onNavigate={handleNavigate}
          />
        )
      ) : currentPage === 'admin-login' ? (
        <AdminLoginPage
          onLoginSuccess={() => handleNavigate('admin-dashboard')}
          onNavigate={handleNavigate}
        />
      ) : (
        <>
          {/* Public Header */}
          <Header
            currentPage={currentPage}
            onNavigate={handleNavigate}
            onOpenSearch={() => setSearchModalOpen(true)}
          />

          {/* Main Content Area */}
          <main className="flex-1">
            {currentPage === 'home' && (
              <HomePage
                onNavigate={handleNavigate}
                pageContent={pageContent}
              />
            )}

            {currentPage === 'blog' && (
              <BlogPage
                onNavigate={handleNavigate}
                initialCategory={currentParam}
              />
            )}

            {currentPage === 'blog-post' && currentParam && (
              <BlogPostPage
                slugOrId={currentParam}
                onNavigate={handleNavigate}
              />
            )}

            {currentPage === 'tutorials' && (
              <TutorialsPage
                onNavigate={handleNavigate}
              />
            )}

            {currentPage === 'about' && (
              <AboutPage
                pageContent={pageContent}
                onNavigate={handleNavigate}
              />
            )}

            {currentPage === 'contact' && (
              <ContactPage
                pageContent={pageContent}
              />
            )}
          </main>

          {/* Public Footer */}
          <Footer onNavigate={handleNavigate} />
        </>
      )}

      {/* Quick Search Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-20 px-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-4 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 flex-1">
                <Search className="w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  autoFocus
                  value={quickSearchQuery}
                  onChange={(e) => setQuickSearchQuery(e.target.value)}
                  placeholder="Search articles and topics..."
                  className="w-full text-sm text-slate-900 focus:outline-none placeholder-slate-400"
                />
              </div>
              <button
                onClick={() => {
                  setSearchModalOpen(false);
                  setQuickSearchQuery('');
                }}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Results */}
            <div className="py-2 max-h-80 overflow-y-auto">
              {searching ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  Searching knowledge base...
                </div>
              ) : quickSearchResults.length > 0 ? (
                <div className="space-y-1">
                  {quickSearchResults.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => {
                        setSearchModalOpen(false);
                        setQuickSearchQuery('');
                        handleNavigate('blog-post', post.slug || post.id);
                      }}
                      className="p-3 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors group"
                    >
                      <div>
                        <div className="text-xs font-semibold text-blue-600">{post.category}</div>
                        <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {post.title}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  ))}
                </div>
              ) : quickSearchQuery.trim() ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  No matching articles found.
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-slate-400">
                  Type a keyword like "computer", "password", or "files".
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Shikuran Skills Search</span>
              <button
                onClick={() => {
                  setSearchModalOpen(false);
                  handleNavigate('blog', quickSearchQuery);
                }}
                className="text-blue-600 font-bold hover:underline"
              >
                Open Full Search
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
