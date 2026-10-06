import React from 'react';
import { BlogPost } from '../types/index.js';
import { ArrowRight, Calendar, Clock } from 'lucide-react';

interface BlogCardProps {
  post: BlogPost;
  onReadMore: (slugOrId: string) => void;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post, onReadMore }) => {
  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Recently';

  return (
    <article className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col h-full hover:border-slate-300">
      {/* Featured Image */}
      <div 
        className="relative aspect-16/10 overflow-hidden bg-slate-100 cursor-pointer"
        onClick={() => onReadMore(post.slug || post.id)}
      >
        <img
          src={post.featured_image}
          alt={post.alt_text || post.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300 ease-out"
          onError={(e) => {
            // fallback image if broken link
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop';
          }}
        />
      </div>

      {/* Card Content */}
      <div className="p-6 flex flex-col flex-1">
        {/* Zero-Pill Unboxed Metadata */}
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-2.5">
          <span>{post.category}</span>
          <span className="text-slate-300 font-bold" aria-hidden="true">·</span>
          <span className="text-slate-500 font-normal">{formattedDate}</span>
          {post.read_time && (
            <>
              <span className="text-slate-300 font-bold" aria-hidden="true">·</span>
              <span className="text-slate-500 font-normal">{post.read_time}</span>
            </>
          )}
        </div>

        {/* Title */}
        <h3 
          onClick={() => onReadMore(post.slug || post.id)}
          className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug mb-3 cursor-pointer line-clamp-2"
        >
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-slate-600 line-clamp-3 mb-5 leading-relaxed flex-1">
          {post.excerpt}
        </p>

        {/* Read More Action */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
          <span className="text-xs text-slate-500 font-medium">By {post.author || 'Shikuran Team'}</span>
          <button
            onClick={() => onReadMore(post.slug || post.id)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all"
          >
            <span>Read More</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
};
