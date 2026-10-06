import React, { useState, useEffect } from 'react';
import { BlogPost, Comment } from '../types/index.js';
import { api } from '../utils/api.ts';
import { RichTextRenderer } from '../components/RichTextRenderer.tsx';
import { BlogCard } from '../components/BlogCard.tsx';
import { 
  Calendar, Clock, User, Share2, Copy, Check, MessageSquare, 
  ArrowLeft, CornerDownRight, Send, AlertCircle, ShieldAlert 
} from 'lucide-react';

interface BlogPostPageProps {
  slugOrId: string;
  onNavigate: (page: string, param?: string) => void;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({ slugOrId, onNavigate }) => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Social sharing copy status
  const [copied, setCopied] = useState(false);

  // Comment Form state
  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [commentText, setCommentText] = useState('');
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentSuccess, setCommentSuccess] = useState<string | null>(null);
  const [commentError, setCommentError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    api.getPost(slugOrId)
      .then(res => {
        setPost(res.post);
        setRelated(res.related);
        return api.getComments(res.post.id);
      })
      .then(commRes => {
        setComments(commRes);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load post', err);
        setError('Blog post not found. It may have been moved or removed.');
        setLoading(false);
      });
  }, [slugOrId]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareTwitter = () => {
    if (!post) return;
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Read "${post.title}" on Shikuran Skills:`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'noopener,noreferrer');
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'noopener,noreferrer');
  };

  const handleShareWhatsApp = () => {
    if (!post) return;
    const text = encodeURIComponent(`Check out this guide: "${post.title}" on Shikuran Skills - ${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCommentError(null);
    setCommentSuccess(null);

    if (honeypot) {
      // Spam honeypot triggered
      return;
    }

    if (!commentName.trim() || !commentText.trim()) {
      setCommentError('Please enter your name and comment message.');
      return;
    }

    if (!post) return;

    setSubmittingComment(true);
    try {
      const res = await api.addComment({
        post_id: post.id,
        post_title: post.title,
        parent_id: replyToId,
        name: commentName.trim(),
        email: commentEmail.trim(),
        content: commentText.trim(),
        honeypot,
      });

      setComments([res.comment, ...comments]);
      setCommentName('');
      setCommentEmail('');
      setCommentText('');
      setReplyToId(null);
      setCommentSuccess('Thank you! Your comment has been posted.');
      setTimeout(() => setCommentSuccess(null), 5000);
    } catch (err: any) {
      setCommentError(err.message || 'Failed to submit comment. Please try again.');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 animate-pulse space-y-6">
        <div className="h-6 bg-slate-200 rounded w-1/4" />
        <div className="h-12 bg-slate-200 rounded w-3/4" />
        <div className="h-4 bg-slate-200 rounded w-1/2" />
        <div className="aspect-16/9 bg-slate-200 rounded-2xl" />
        <div className="space-y-3 pt-6">
          <div className="h-4 bg-slate-200 rounded w-full" />
          <div className="h-4 bg-slate-200 rounded w-full" />
          <div className="h-4 bg-slate-200 rounded w-5/6" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <ShieldAlert className="w-16 h-16 text-slate-300 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-900">Blog Post Not Found</h2>
        <p className="text-base text-slate-600">
          The article you are looking for does not exist or may have been unlisted.
        </p>
        <button
          onClick={() => onNavigate('blog')}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Blog</span>
        </button>
      </div>
    );
  }

  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recently';

  return (
    <article className="py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <button
            onClick={() => onNavigate('home')}
            className="hover:text-blue-600 transition-colors"
          >
            Home
          </button>
          <span>/</span>
          <button
            onClick={() => onNavigate('blog')}
            className="hover:text-blue-600 transition-colors"
          >
            Blog
          </button>
          <span>/</span>
          <span className="text-slate-900 truncate max-w-xs">{post.category}</span>
        </div>

        {/* Article Header */}
        <header className="space-y-5">
          {/* Zero-Pill Unboxed Metadata */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold text-blue-600">
            <span>{post.category}</span>
            <span className="text-slate-300 font-bold" aria-hidden="true">·</span>
            <span className="text-slate-500 font-normal">{formattedDate}</span>
            {post.read_time && (
              <>
                <span className="text-slate-300 font-bold" aria-hidden="true">·</span>
                <span className="text-slate-500 font-normal">{post.read_time}</span>
              </>
            )}
            <span className="text-slate-300 font-bold" aria-hidden="true">·</span>
            <span className="text-slate-500 font-normal">By {post.author || 'Shikuran Skills Team'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            {post.title}
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-normal">
            {post.excerpt}
          </p>
        </header>

        {/* Featured Image */}
        <div className="rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-slate-100">
          <img
            src={post.featured_image}
            alt={post.alt_text || post.title}
            className="w-full max-h-[480px] object-cover"
          />
          {post.alt_text && (
            <p className="text-xs text-center text-slate-500 py-2 bg-slate-50/80 border-t border-slate-100">
              {post.alt_text}
            </p>
          )}
        </div>

        {/* Full Article Rich Content */}
        <div className="pt-4 border-b border-slate-200 pb-12">
          <RichTextRenderer content={post.content} />
        </div>

        {/* Social Sharing Section */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Share2 className="w-4 h-4 text-blue-600" />
            <span>Share this practical guide:</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              title="Copy link to clipboard"
              className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
            </button>

            <button
              onClick={handleShareTwitter}
              title="Share on X / Twitter"
              className="p-2 bg-white hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 transition-colors shadow-xs"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </button>

            <button
              onClick={handleShareLinkedIn}
              title="Share on LinkedIn"
              className="p-2 bg-white hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 transition-colors shadow-xs"
            >
              <svg className="w-4 h-4 fill-current text-blue-700" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </button>

            <button
              onClick={handleShareWhatsApp}
              title="Share on WhatsApp"
              className="p-2 bg-white hover:bg-slate-100 text-emerald-600 rounded-lg border border-slate-200 transition-colors shadow-xs"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.353.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* 17. COMMENTS SECTION */}
        <section className="pt-6 space-y-8">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <span>Comments ({comments.length})</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">Join the discussion</span>
          </div>

          {/* Comment submission form */}
          <form onSubmit={handleCommentSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {replyToId ? 'Leave a Reply' : 'Leave a Comment'}
            </h3>
            {replyToId && (
              <div className="flex items-center justify-between bg-blue-50 text-blue-800 text-xs px-3 py-1.5 rounded-lg">
                <span>Replying to comment</span>
                <button
                  type="button"
                  onClick={() => setReplyToId(null)}
                  className="font-bold underline"
                >
                  Cancel reply
                </button>
              </div>
            )}

            {/* Spam Honeypot (Hidden from real users) */}
            <div className="hidden" aria-hidden="true">
              <label>Leave this field blank:</label>
              <input
                type="text"
                tabIndex={-1}
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                autoComplete="off"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email (Optional, kept private)
                </label>
                <input
                  type="email"
                  value={commentEmail}
                  onChange={(e) => setCommentEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Comment *
              </label>
              <textarea
                required
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your thoughts, questions, or learning experience..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-y"
              />
            </div>

            {commentSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{commentSuccess}</span>
              </div>
            )}

            {commentError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>{commentError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submittingComment}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all inline-flex items-center gap-2 shadow-xs disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submittingComment ? 'Posting...' : 'Post Comment'}</span>
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.map((comm) => (
                <div
                  key={comm.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                        {comm.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-bold text-slate-900">{comm.name}</span>
                    </div>
                    <span className="text-slate-400">
                      {new Date(comm.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <p className="text-sm text-slate-700 leading-relaxed pl-9">
                    {comm.content}
                  </p>

                  <div className="pl-9 pt-1">
                    <button
                      onClick={() => {
                        setReplyToId(comm.id);
                        window.scrollTo({ top: 900, behavior: 'smooth' });
                      }}
                      className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      <CornerDownRight className="w-3 h-3" />
                      <span>Reply</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic py-4 text-center">
                No comments yet. Be the first to share your thoughts on this article!
              </p>
            )}
          </div>
        </section>

        {/* Related Posts Section */}
        {related.length > 0 && (
          <section className="pt-12 border-t border-slate-200 space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((relPost) => (
                <BlogCard
                  key={relPost.id}
                  post={relPost}
                  onReadMore={(relSlug) => onNavigate('blog-post', relSlug)}
                />
              ))}
            </div>
          </section>
        )}

      </div>
    </article>
  );
};
