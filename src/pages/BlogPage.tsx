import React, { useState, useEffect } from 'react';
import { BlogPost, Category } from '../types/index.js';
import { api } from '../utils/api.ts';
import { BlogCard } from '../components/BlogCard.tsx';
import { Search, X, Filter, BookOpen, ChevronDown } from 'lucide-react';

interface BlogPageProps {
  onNavigate: (page: string, param?: string) => void;
  initialCategory?: string;
  initialSearch?: string;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onNavigate, initialCategory, initialSearch }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<(Category & { post_count: number })[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All');
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch || '');
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    // Load categories
    api.getCategories().then(cats => setCategories(cats)).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    api.getPosts(selectedCategory, searchQuery)
      .then(res => {
        setPosts(res.posts);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load posts', err);
        setLoading(false);
      });
  }, [selectedCategory, searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const clearFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
  };

  const displayedPosts = posts.slice(0, visibleCount);
  const hasMore = visibleCount < posts.length;

  return (
    <div className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Page Title & Subtitle */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
          Knowledge Base & Guides
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Shikuran Skills Blog
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          Explore practical digital skills, computer knowledge, technology tips, and useful guides.
        </p>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-md">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles by title, topic, or keyword..."
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Result Count and Clear Filters */}
          <div className="flex items-center gap-3 text-xs text-slate-500 w-full md:w-auto justify-between md:justify-end">
            <span>Showing <strong className="text-slate-900 font-bold">{posts.length}</strong> articles</span>
            {(selectedCategory !== 'All' || searchQuery) && (
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-700 font-bold hover:underline"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills (Functional Filter Tabs) */}
        <div className="pt-3 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === 'All'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            All Topics
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                selectedCategory.toLowerCase() === cat.name.toLowerCase()
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <span>{cat.name}</span>
              {cat.post_count !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedCategory.toLowerCase() === cat.name.toLowerCase()
                    ? 'bg-blue-700 text-blue-100'
                    : 'bg-slate-200 text-slate-600'
                }`}>
                  {cat.post_count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Posts Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse space-y-4">
              <div className="aspect-16/10 bg-slate-200 rounded-xl" />
              <div className="h-4 bg-slate-200 rounded w-1/3" />
              <div className="h-6 bg-slate-200 rounded w-3/4" />
              <div className="h-16 bg-slate-200 rounded w-full" />
            </div>
          ))}
        </div>
      ) : posts.length > 0 ? (
        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedPosts.map((post) => (
              <BlogCard
                key={post.id}
                post={post}
                onReadMore={(slugOrId) => onNavigate('blog-post', slugOrId)}
              />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center pt-4">
              <button
                onClick={() => setVisibleCount((prev) => prev + 6)}
                className="px-6 py-3 bg-white border border-slate-300 hover:border-slate-400 text-slate-800 font-bold text-sm rounded-xl shadow-xs hover:shadow-sm transition-all inline-flex items-center gap-2"
              >
                <span>Load More Articles</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <BookOpen className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            No articles found
          </h3>
          <p className="text-sm text-slate-600">
            {searchQuery
              ? `No results found for "${searchQuery}". Try another search term or browse by category.`
              : 'No posts available yet. Check back soon for new digital-skills articles.'}
          </p>
          {(searchQuery || selectedCategory !== 'All') && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors"
            >
              Clear All Filters
            </button>
          )}
        </div>
      )}

    </div>
  );
};
