import React, { useState, useEffect } from 'react';
import { 
  BlogPost, Category, Tutorial, Comment, PageContent, ContactInquiry 
} from '../../types/index.js';
import { api, clearAuthSession, getStoredUser } from '../../utils/api.ts';
import { RichTextEditor } from '../../components/RichTextEditor.tsx';
import { 
  LayoutDashboard, FileText, PlusCircle, BookOpen, MessageSquare, 
  Layers, Sliders, Settings, LogOut, CheckCircle2, AlertCircle, 
  Trash2, Edit3, Eye, Search, ExternalLink, Download, Upload, 
  Shield, Image as ImageIcon, Check, RefreshCw, Mail, UserCheck 
} from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
  onNavigateHome: () => void;
  onRefreshPublicData?: () => void;
}

const TECH_IMAGE_PRESETS = [
  {
    title: 'Modern Laptop & Graphs',
    url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop',
    alt: 'Person working on laptop with digital workflow'
  },
  {
    title: 'Computer Keyboard & Desk',
    url: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?q=80&w=1200&auto=format&fit=crop',
    alt: 'Clean modern keyboard and computer setup'
  },
  {
    title: 'Students & Collaborative Tech',
    url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop',
    alt: 'Group of diverse learners studying around a laptop'
  },
  {
    title: 'Cyber Security & Network Lock',
    url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop',
    alt: 'Digital lock symbol showing online security'
  },
  {
    title: 'Global Connected Earth',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
    alt: 'Glowing technology network connecting the planet'
  },
  {
    title: 'Digital Workspace & Workshop',
    url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop',
    alt: 'Modern technology workshop and computers'
  },
  {
    title: 'Typing & Hands on Laptop',
    url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=1200&auto=format&fit=crop',
    alt: 'Hands typing code and documents on a sleek laptop'
  },
  {
    title: 'Modern Learning Classroom',
    url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1200&auto=format&fit=crop',
    alt: 'Students engaged in interactive digital lesson'
  }
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, onNavigateHome, onRefreshPublicData }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'posts' | 'edit-post' | 'tutorials' | 'categories' | 'comments' | 'pages' | 'inquiries' | 'settings'>('overview');

  // Stats
  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Posts
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [postSearch, setPostSearch] = useState('');
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  // Post Editor Form
  const [postTitle, setPostTitle] = useState('');
  const [postExcerpt, setPostExcerpt] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postCategory, setPostCategory] = useState('Digital Skills');
  const [postTags, setPostTags] = useState('Digital Skills, Beginner Guides');
  const [postAuthor, setPostAuthor] = useState('Shikuran Skills Team');
  const [postStatus, setPostStatus] = useState<'published' | 'draft'>('published');
  const [postFeaturedImage, setPostFeaturedImage] = useState(TECH_IMAGE_PRESETS[0].url);
  const [postAltText, setPostAltText] = useState('Digital skills guide graphic');
  const [postReadTime, setPostReadTime] = useState('6 min read');

  // Categories
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  // Tutorials
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [editingTut, setEditingTut] = useState<Tutorial | null>(null);
  const [tutTitle, setTutTitle] = useState('');
  const [tutDesc, setTutDesc] = useState('');
  const [tutIcon, setTutIcon] = useState('Monitor');
  const [tutLevel, setTutLevel] = useState<'Beginner' | 'Intermediate' | 'All Levels'>('Beginner');
  const [tutReadTime, setTutReadTime] = useState('8 min');
  const [tutSteps, setTutSteps] = useState<any[]>([
    { stepNumber: 1, title: 'Getting Started', content: 'Step details...', keyTip: 'Helpful beginner advice' }
  ]);

  // Comments
  const [comments, setComments] = useState<Comment[]>([]);

  // Page Content
  const [pageContent, setPageContent] = useState<PageContent | null>(null);

  // Inquiries
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);

  // Security Credentials form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState('admin');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notifications
  const [alertSuccess, setAlertSuccess] = useState<string | null>(null);
  const [alertError, setAlertError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const currentUser = getStoredUser();

  const showSuccess = (msg: string) => {
    setAlertSuccess(msg);
    setAlertError(null);
    setTimeout(() => setAlertSuccess(null), 4000);
  };

  const showError = (msg: string) => {
    setAlertError(msg);
    setAlertSuccess(null);
    setTimeout(() => setAlertError(null), 5000);
  };

  // Load Initial Data
  const refreshAllData = async () => {
    setLoadingStats(true);
    try {
      const [s, p, c, t, com, pc, inq] = await Promise.all([
        api.getStats(),
        api.getAdminPosts(),
        api.getCategories(),
        api.getAdminTutorials(),
        api.getAdminComments(),
        api.getPageContent(),
        api.getInquiries()
      ]);
      setStats(s);
      setPosts(p);
      setCategories(c);
      setTutorials(t);
      setComments(com);
      setPageContent(pc);
      setInquiries(inq);
      if (onRefreshPublicData) onRefreshPublicData();
    } catch (err: any) {
      showError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  // --- POST MANAGEMENT ---
  const handleStartNewPost = () => {
    setEditingPostId(null);
    setPostTitle('');
    setPostExcerpt('');
    setPostContent('<h2>Overview</h2>\n<p>Start writing your practical digital skills article here...</p>');
    setPostCategory(categories[0]?.name || 'Digital Skills');
    setPostTags('Digital Skills, Beginner Guides');
    setPostAuthor('Shikuran Skills Team');
    setPostStatus('published');
    setPostFeaturedImage(TECH_IMAGE_PRESETS[0].url);
    setPostAltText(TECH_IMAGE_PRESETS[0].alt);
    setPostReadTime('6 min read');
    setActiveTab('edit-post');
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPostId(post.id);
    setPostTitle(post.title);
    setPostExcerpt(post.excerpt);
    setPostContent(post.content);
    setPostCategory(post.category);
    setPostTags(Array.isArray(post.tags) ? post.tags.join(', ') : 'Digital Skills');
    setPostAuthor(post.author || 'Shikuran Skills Team');
    setPostStatus(post.status);
    setPostFeaturedImage(post.featured_image);
    setPostAltText(post.alt_text || post.title);
    setPostReadTime(post.read_time || '5 min read');
    setActiveTab('edit-post');
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) {
      showError('Please provide both an article title and content.');
      return;
    }

    setActionLoading(true);
    try {
      const payload: Partial<BlogPost> = {
        title: postTitle.trim(),
        excerpt: postExcerpt.trim() || (postContent.replace(/<[^>]*>?/gm, '').slice(0, 160) + '...'),
        content: postContent,
        category: postCategory,
        tags: postTags.split(',').map(t => t.trim()).filter(Boolean),
        author: postAuthor.trim(),
        status: postStatus,
        featured_image: postFeaturedImage,
        alt_text: postAltText.trim() || postTitle,
        read_time: postReadTime
      };

      if (editingPostId) {
        await api.updatePost(editingPostId, payload);
        showSuccess('Your post has been updated.');
      } else {
        await api.createPost(payload);
        showSuccess('Your post has been published.');
      }

      await refreshAllData();
      setActiveTab('posts');
    } catch (err: any) {
      showError(err.message || 'Failed to save post.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeletePost = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete the post "${title}"? This cannot be undone.`)) {
      return;
    }
    try {
      await api.deletePost(id);
      showSuccess('Post deleted successfully.');
      await refreshAllData();
    } catch (err: any) {
      showError(err.message || 'Failed to delete post.');
    }
  };

  const handleTogglePostStatus = async (post: BlogPost) => {
    const newStatus = post.status === 'published' ? 'draft' : 'published';
    try {
      await api.updatePost(post.id, { status: newStatus });
      showSuccess(`Post marked as ${newStatus}.`);
      await refreshAllData();
    } catch (err: any) {
      showError(err.message || 'Failed to update post status.');
    }
  };

  // --- CATEGORIES ---
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      await api.createCategory(newCatName.trim(), newCatDesc.trim());
      setNewCatName('');
      setNewCatDesc('');
      showSuccess('New category created.');
      await refreshAllData();
    } catch (err: any) {
      showError(err.message || 'Failed to create category.');
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try {
      await api.deleteCategory(id);
      showSuccess('Category deleted.');
      await refreshAllData();
    } catch (err: any) {
      showError(err.message || 'Failed to delete category.');
    }
  };

  // --- TUTORIALS ---
  const handleSaveTutorial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tutTitle.trim() || !tutDesc.trim()) {
      showError('Tutorial title and description are required.');
      return;
    }
    try {
      const payload: Partial<Tutorial> = {
        title: tutTitle.trim(),
        short_description: tutDesc.trim(),
        icon: tutIcon,
        level: tutLevel,
        read_time: tutReadTime,
        steps: tutSteps,
        status: 'published'
      };

      if (editingTut) {
        await api.updateTutorial(editingTut.id, payload);
        showSuccess('Tutorial updated.');
      } else {
        await api.createTutorial(payload);
        showSuccess('New tutorial added.');
      }
      setEditingTut(null);
      setTutTitle('');
      setTutDesc('');
      await refreshAllData();
    } catch (err: any) {
      showError(err.message || 'Failed to save tutorial.');
    }
  };

  const handleDeleteTutorial = async (id: string, title: string) => {
    if (!window.confirm(`Delete tutorial "${title}"?`)) return;
    try {
      await api.deleteTutorial(id);
      showSuccess('Tutorial deleted.');
      await refreshAllData();
    } catch (err: any) {
      showError(err.message || 'Failed to delete tutorial.');
    }
  };

  // --- COMMENTS ---
  const handleCommentStatus = async (id: string, status: 'approved' | 'hidden' | 'pending') => {
    try {
      await api.updateCommentStatus(id, status);
      showSuccess(`Comment marked as ${status}.`);
      await refreshAllData();
    } catch (err: any) {
      showError(err.message || 'Failed to update comment.');
    }
  };

  const handleDeleteComment = async (id: string) => {
    if (!window.confirm('Delete this comment permanently?')) return;
    try {
      await api.deleteComment(id);
      showSuccess('Comment deleted.');
      await refreshAllData();
    } catch (err: any) {
      showError(err.message || 'Failed to delete comment.');
    }
  };

  // --- PAGE CONTENT ---
  const handleSavePageContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pageContent) return;
    try {
      await api.updatePageContent(pageContent);
      showSuccess('Website page content saved successfully.');
      await refreshAllData();
    } catch (err: any) {
      showError(err.message || 'Failed to update page content.');
    }
  };

  // --- CREDENTIALS UPDATE ---
  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      showError('Current password is required.');
      return;
    }
    if (newPassword && newPassword !== confirmPassword) {
      showError('New passwords do not match.');
      return;
    }
    try {
      await api.updateCredentials({
        currentPassword,
        newUsername: newUsername.trim(),
        newPassword: newPassword || undefined
      });
      showSuccess('Admin credentials updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      showError(err.message || 'Failed to update credentials.');
    }
  };

  // --- BACKUP RESTORE ---
  const handleRestoreFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      await api.restoreBackup(json);
      showSuccess('Database restored successfully from backup file.');
      await refreshAllData();
    } catch (err: any) {
      showError('Failed to restore backup file: ' + err.message);
    }
  };

  const filteredPosts = posts.filter(p =>
    p.title.toLowerCase().includes(postSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(postSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      
      {/* Top Admin Bar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm text-white">
                SHIKURAN SKILLS
              </span>
              <span className="text-xs text-blue-400 font-semibold ml-2">
                Content Management System
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onNavigateHome}
              className="text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <span>View Public Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <div className="h-4 w-px bg-slate-700" />

            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-900 text-blue-300 text-[10px] font-bold flex items-center justify-center">
                A
              </div>
              <span className="text-xs font-semibold text-slate-200">
                {currentUser?.username || 'admin'}
              </span>
            </div>

            <button
              onClick={() => {
                clearAuthSession();
                onLogout();
              }}
              title="Logout"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Navigation Sidebar */}
        <aside className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-3 shadow-xs space-y-1">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Admin Modules
          </div>

          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('posts')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'posts'
                ? 'bg-blue-600 text-white'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4" />
              <span>Blog Posts</span>
            </div>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === 'posts' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
              {posts.length}
            </span>
          </button>

          <button
            onClick={handleStartNewPost}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'edit-post' && !editingPostId
                ? 'bg-blue-600 text-white'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Post</span>
          </button>

          <button
            onClick={() => setActiveTab('tutorials')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'tutorials'
                ? 'bg-blue-600 text-white'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <BookOpen className="w-4 h-4" />
              <span>Tutorials</span>
            </div>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === 'tutorials' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
              {tutorials.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'categories'
                ? 'bg-blue-600 text-white'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Layers className="w-4 h-4" />
              <span>Categories</span>
            </div>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === 'categories' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
              {categories.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('comments')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'comments'
                ? 'bg-blue-600 text-white'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="w-4 h-4" />
              <span>Comments</span>
            </div>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === 'comments' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
              {comments.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('pages')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'pages'
                ? 'bg-blue-600 text-white'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Pages Content</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'inquiries'
                ? 'bg-blue-600 text-white'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4" />
              <span>Inquiries</span>
            </div>
            {inquiries.filter(i => !i.read).length > 0 && (
              <span className="text-[10px] font-bold bg-amber-500 text-white px-1.5 py-0.2 rounded-full">
                {inquiries.filter(i => !i.read).length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'settings'
                ? 'bg-blue-600 text-white'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings & Backup</span>
          </button>
        </aside>

        {/* Right Content Area */}
        <main className="lg:col-span-9 space-y-6">
          
          {/* Notifications */}
          {alertSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xs animate-in fade-in duration-150">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{alertSuccess}</span>
            </div>
          )}

          {alertError && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xs animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{alertError}</span>
            </div>
          )}

          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Welcome back, {currentUser?.username || 'Administrator'}
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Manage and publish digital-skills education content without touching any source code.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={refreshAllData}
                    className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
                    title="Refresh data"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleStartNewPost}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Create Post</span>
                  </button>
                </div>
              </div>

              {/* Simple Stats Cards (as required: total posts, published, draft, total comments) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Posts</div>
                  <div className="text-3xl font-extrabold text-slate-900">{stats?.totalPosts ?? posts.length}</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                  <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Published</div>
                  <div className="text-3xl font-extrabold text-emerald-700">{stats?.publishedPosts ?? posts.filter(p => p.status === 'published').length}</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                  <div className="text-xs font-bold text-amber-600 uppercase tracking-wider">Drafts</div>
                  <div className="text-3xl font-extrabold text-amber-700">{stats?.draftPosts ?? posts.filter(p => p.status === 'draft').length}</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                  <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">Comments</div>
                  <div className="text-3xl font-extrabold text-blue-700">{stats?.totalComments ?? comments.length}</div>
                </div>
              </div>

              {/* Quick Actions & Recent Activity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Quick Operations
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleStartNewPost}
                      className="p-4 bg-slate-50 hover:bg-blue-50 text-left rounded-xl border border-slate-200 hover:border-blue-200 transition-all group"
                    >
                      <PlusCircle className="w-5 h-5 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                      <div className="text-xs font-bold text-slate-900">New Article</div>
                      <div className="text-[11px] text-slate-500">Draft or publish</div>
                    </button>

                    <button
                      onClick={() => setActiveTab('tutorials')}
                      className="p-4 bg-slate-50 hover:bg-blue-50 text-left rounded-xl border border-slate-200 hover:border-blue-200 transition-all group"
                    >
                      <BookOpen className="w-5 h-5 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                      <div className="text-xs font-bold text-slate-900">Tutorials</div>
                      <div className="text-[11px] text-slate-500">{tutorials.length} interactive guides</div>
                    </button>

                    <button
                      onClick={() => setActiveTab('pages')}
                      className="p-4 bg-slate-50 hover:bg-blue-50 text-left rounded-xl border border-slate-200 hover:border-blue-200 transition-all group"
                    >
                      <Sliders className="w-5 h-5 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                      <div className="text-xs font-bold text-slate-900">Edit Site Pages</div>
                      <div className="text-[11px] text-slate-500">Hero, About, Contact</div>
                    </button>

                    <button
                      onClick={() => setActiveTab('settings')}
                      className="p-4 bg-slate-50 hover:bg-blue-50 text-left rounded-xl border border-slate-200 hover:border-blue-200 transition-all group"
                    >
                      <Download className="w-5 h-5 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                      <div className="text-xs font-bold text-slate-900">Backup DB</div>
                      <div className="text-[11px] text-slate-500">1-click JSON backup</div>
                    </button>
                  </div>
                </div>

                {/* Recent Inquiries or Comments */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Recent Inquiries ({inquiries.length})
                    </h3>
                    <button
                      onClick={() => setActiveTab('inquiries')}
                      className="text-xs font-bold text-blue-600 hover:underline"
                    >
                      View all
                    </button>
                  </div>
                  {inquiries.length > 0 ? (
                    <div className="space-y-3">
                      {inquiries.slice(0, 3).map((inq) => (
                        <div key={inq.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1">
                          <div className="flex items-center justify-between font-bold text-slate-900">
                            <span>{inq.name}</span>
                            <span className="text-slate-400 font-normal">
                              {new Date(inq.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-slate-600 line-clamp-1">{inq.message}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No contact inquiries yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BLOG POSTS LIST */}
          {activeTab === 'posts' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    All Blog Posts ({posts.length})
                  </h2>
                  <p className="text-xs text-slate-500">
                    Manage, edit, publish, or delete your educational articles.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={postSearch}
                      onChange={(e) => setPostSearch(e.target.value)}
                      placeholder="Search articles..."
                      className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 w-48 sm:w-60"
                    />
                  </div>
                  <button
                    onClick={handleStartNewPost}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>New Post</span>
                  </button>
                </div>
              </div>

              {/* Table of posts */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-y border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Title & Excerpt</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3">Date</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPosts.map((post) => (
                      <tr key={post.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 max-w-xs">
                          <div className="font-bold text-slate-900 truncate">{post.title}</div>
                          <div className="text-slate-500 line-clamp-1 text-[11px]">{post.excerpt}</div>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap text-slate-700 font-medium">
                          {post.category}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <button
                            onClick={() => handleTogglePostStatus(post)}
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                              post.status === 'published'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                            }`}
                            title="Click to toggle publish/draft"
                          >
                            {post.status === 'published' ? 'Published' : 'Draft'}
                          </button>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap text-slate-500 text-[11px]">
                          {post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Draft'}
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap space-x-2">
                          <button
                            onClick={() => handleEditPost(post)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Post"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id, post.title)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Post"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredPosts.length === 0 && (
                  <div className="py-12 text-center text-slate-400 text-xs">
                    No blog posts match your filter.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: ADD / EDIT BLOG POST (WORDPRESS-LIKE CONTENT EDITOR & IMAGE MANAGER) */}
          {activeTab === 'edit-post' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {editingPostId ? 'Edit Blog Post' : 'Create New Blog Post'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Write content using the visual toolbar. Changes automatically appear on the live site.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('posts')}
                  className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleSavePost} className="space-y-6">
                
                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Post Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    placeholder="e.g. How to Search the Web Effectively"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Short Excerpt / Summary (Displayed on Blog Cards)
                  </label>
                  <textarea
                    rows={2}
                    value={postExcerpt}
                    onChange={(e) => setPostExcerpt(e.target.value)}
                    placeholder="Brief 1-2 sentence preview for visitors..."
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-y"
                  />
                </div>

                {/* Categories & Author & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Category
                    </label>
                    <select
                      value={postCategory}
                      onChange={(e) => setPostCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Author Name
                    </label>
                    <input
                      type="text"
                      value={postAuthor}
                      onChange={(e) => setPostAuthor(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Publication Status
                    </label>
                    <select
                      value={postStatus}
                      onChange={(e) => setPostStatus(e.target.value as 'published' | 'draft')}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="published">Published (Visible to all)</option>
                      <option value="draft">Draft (Unpublished)</option>
                    </select>
                  </div>
                </div>

                {/* 22. IMAGE MANAGEMENT SECTION */}
                <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-blue-600" />
                      <span>Featured Image Manager</span>
                    </label>
                    <span className="text-[11px] text-slate-500">Pick preset or paste custom URL</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                    <div className="sm:col-span-8 space-y-2">
                      <input
                        type="url"
                        value={postFeaturedImage}
                        onChange={(e) => setPostFeaturedImage(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={postAltText}
                        onChange={(e) => setPostAltText(e.target.value)}
                        placeholder="Image Alt Text (for accessibility)"
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <div className="relative aspect-16/10 rounded-xl overflow-hidden border border-slate-300 bg-white">
                        <img
                          src={postFeaturedImage}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 1-click curated digital skills tech image presets */}
                  <div>
                    <span className="text-[11px] font-bold text-slate-600 block mb-2">
                      High Quality Digital Skills Image Presets:
                    </span>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                      {TECH_IMAGE_PRESETS.map((preset, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setPostFeaturedImage(preset.url);
                            setPostAltText(preset.alt);
                          }}
                          className={`aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                            postFeaturedImage === preset.url
                              ? 'border-blue-600 ring-2 ring-blue-500/30'
                              : 'border-slate-200 hover:border-slate-400'
                          }`}
                          title={preset.title}
                        >
                          <img
                            src={preset.url}
                            alt={preset.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 21. WORDPRESS-LIKE CONTENT EDITOR */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Article Body & Rich Content *
                  </label>
                  <RichTextEditor
                    value={postContent}
                    onChange={(val) => setPostContent(val)}
                  />
                </div>

                {/* Tags & Read Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Tags (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={postTags}
                      onChange={(e) => setPostTags(e.target.value)}
                      placeholder="Digital Skills, Beginner Guides, Tutorials"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Estimated Read Time
                    </label>
                    <input
                      type="text"
                      value={postReadTime}
                      onChange={(e) => setPostReadTime(e.target.value)}
                      placeholder="6 min read"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('posts')}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>{editingPostId ? 'Update Post' : 'Save & Publish Post'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 4: TUTORIALS MANAGEMENT */}
          {activeTab === 'tutorials' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Manage Tutorials ({tutorials.length})
                    </h2>
                    <p className="text-xs text-slate-500">
                      Add, edit, or remove practical interactive learning tracks.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingTut(null);
                      setTutTitle('');
                      setTutDesc('');
                      setTutIcon('Monitor');
                      setTutLevel('Beginner');
                      setTutReadTime('8 min');
                      setTutSteps([
                        { stepNumber: 1, title: 'Step 1: Introduction', content: 'Explain what the student will do...', keyTip: 'Helpful advice' },
                        { stepNumber: 2, title: 'Step 2: Core Action', content: 'Describe the action...', keyTip: 'Shortcut to use' }
                      ]);
                    }}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Add Tutorial</span>
                  </button>
                </div>

                {/* Form to create/edit tutorial */}
                <form onSubmit={handleSaveTutorial} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    {editingTut ? `Edit Tutorial: ${editingTut.title}` : 'Add New Tutorial'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={tutTitle}
                        onChange={(e) => setTutTitle(e.target.value)}
                        placeholder="e.g. How to Create an Email Account"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Icon
                      </label>
                      <select
                        value={tutIcon}
                        onChange={(e) => setTutIcon(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="Monitor">Monitor (Computer)</option>
                        <option value="FolderKanban">FolderKanban (Files)</option>
                        <option value="FileText">FileText (Documents)</option>
                        <option value="Search">Search (Web)</option>
                        <option value="Mail">Mail (Email)</option>
                        <option value="ShieldCheck">ShieldCheck (Safety)</option>
                        <option value="Cloud">Cloud (Productivity)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Short Description *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={tutDesc}
                      onChange={(e) => setTutDesc(e.target.value)}
                      placeholder="Brief overview of what the learner will gain..."
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Skill Level
                      </label>
                      <select
                        value={tutLevel}
                        onChange={(e) => setTutLevel(e.target.value as any)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="All Levels">All Levels</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Estimated Time
                      </label>
                      <input
                        type="text"
                        value={tutReadTime}
                        onChange={(e) => setTutReadTime(e.target.value)}
                        placeholder="8 min"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    {editingTut && (
                      <button
                        type="button"
                        onClick={() => setEditingTut(null)}
                        className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800"
                      >
                        Cancel Edit
                      </button>
                    )}
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-xs"
                    >
                      {editingTut ? 'Update Tutorial' : 'Save Tutorial'}
                    </button>
                  </div>
                </form>

                {/* Tutorials list */}
                <div className="space-y-3">
                  {tutorials.map((tut) => (
                    <div
                      key={tut.id}
                      className="p-4 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-4 hover:border-slate-300 transition-colors"
                    >
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{tut.title}</div>
                        <div className="text-xs text-slate-500 line-clamp-1">{tut.short_description}</div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                          <span>{tut.level}</span>
                          <span>·</span>
                          <span>{tut.read_time}</span>
                          <span>·</span>
                          <span>{tut.steps?.length || 0} steps</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingTut(tut);
                            setTutTitle(tut.title);
                            setTutDesc(tut.short_description);
                            setTutIcon(tut.icon);
                            setTutLevel(tut.level);
                            setTutReadTime(tut.read_time);
                            setTutSteps(tut.steps || []);
                          }}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTutorial(tut.id, tut.title)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CATEGORIES MANAGEMENT */}
          {activeTab === 'categories' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="pb-4 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900">
                  Manage Categories
                </h2>
                <p className="text-xs text-slate-500">
                  Organize articles and learning guides into topics.
                </p>
              </div>

              {/* Add category form */}
              <form onSubmit={handleAddCategory} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Add New Category</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="Category Name (e.g. Artificial Intelligence)"
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={newCatDesc}
                    onChange={(e) => setNewCatDesc(e.target.value)}
                    placeholder="Short description..."
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  Create Category
                </button>
              </form>

              {/* Categories table */}
              <div className="space-y-2">
                {categories.map((cat) => (
                  <div key={cat.id} className="p-3.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">{cat.name}</span>
                      <p className="text-xs text-slate-500">{cat.description || 'No description'}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteCategory(cat.id, cat.name)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: COMMENTS MANAGEMENT */}
          {activeTab === 'comments' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="pb-4 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900">
                  Manage Comments ({comments.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Approve, hide, or delete community comments from blog posts.
                </p>
              </div>

              {comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map((comm) => (
                    <div key={comm.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="font-bold text-slate-900">
                          {comm.name} <span className="font-normal text-slate-500">on "{comm.post_title}"</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          comm.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {comm.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-200/60">
                        {comm.content}
                      </p>
                      <div className="flex items-center justify-end gap-2 pt-1 text-xs">
                        {comm.status === 'hidden' ? (
                          <button
                            onClick={() => handleCommentStatus(comm.id, 'approved')}
                            className="text-emerald-600 hover:underline font-bold"
                          >
                            Approve
                          </button>
                        ) : (
                          <button
                            onClick={() => handleCommentStatus(comm.id, 'hidden')}
                            className="text-amber-600 hover:underline font-bold"
                          >
                            Hide
                          </button>
                        )}
                        <span className="text-slate-300">·</span>
                        <button
                          onClick={() => handleDeleteComment(comm.id)}
                          className="text-rose-600 hover:underline font-bold"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-slate-400">
                  No comments submitted yet.
                </div>
              )}
            </div>
          )}

          {/* TAB 7: PAGE CONTENT MANAGEMENT */}
          {activeTab === 'pages' && pageContent && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="pb-4 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900">
                  Page Content Management
                </h2>
                <p className="text-xs text-slate-500">
                  Edit homepage banners, welcome text, about stories, and contact details without code.
                </p>
              </div>

              <form onSubmit={handleSavePageContent} className="space-y-6">
                
                {/* Hero section */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600">Homepage Hero</h3>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Hero Heading</label>
                    <input
                      type="text"
                      value={pageContent.heroHeading}
                      onChange={(e) => setPageContent({ ...pageContent, heroHeading: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Hero Subtext</label>
                    <textarea
                      rows={2}
                      value={pageContent.heroSubtext}
                      onChange={(e) => setPageContent({ ...pageContent, heroSubtext: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                    />
                  </div>
                </div>

                {/* Welcome section */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600">Homepage Welcome Section</h3>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Welcome Heading</label>
                    <input
                      type="text"
                      value={pageContent.welcomeHeading}
                      onChange={(e) => setPageContent({ ...pageContent, welcomeHeading: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Welcome Text</label>
                    <textarea
                      rows={3}
                      value={pageContent.welcomeText}
                      onChange={(e) => setPageContent({ ...pageContent, welcomeText: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                    />
                  </div>
                </div>

                {/* About & Mission */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600">About Us Page</h3>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Our Story</label>
                    <textarea
                      rows={3}
                      value={pageContent.aboutStory}
                      onChange={(e) => setPageContent({ ...pageContent, aboutStory: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Mission Statement</label>
                      <textarea
                        rows={2}
                        value={pageContent.missionText}
                        onChange={(e) => setPageContent({ ...pageContent, missionText: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Vision Statement</label>
                      <textarea
                        rows={2}
                        value={pageContent.visionText}
                        onChange={(e) => setPageContent({ ...pageContent, visionText: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact & Formspree configuration */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600">Contact & Social Integration</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Contact Email</label>
                      <input
                        type="email"
                        value={pageContent.contactEmail}
                        onChange={(e) => setPageContent({ ...pageContent, contactEmail: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">TikTok Handle</label>
                      <input
                        type="text"
                        value={pageContent.tiktokHandle}
                        onChange={(e) => setPageContent({ ...pageContent, tiktokHandle: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Formspree Endpoint / Form ID (e.g. "xpzgklvd" or full Formspree URL)
                    </label>
                    <input
                      type="text"
                      value={pageContent.formspreeId}
                      onChange={(e) => setPageContent({ ...pageContent, formspreeId: e.target.value })}
                      placeholder="e.g. xpzgklvd"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      *Optional: If set, contact form submissions will also post directly to your Formspree account!
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs"
                  >
                    Save Page Content
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 8: CONTACT INQUIRIES */}
          {activeTab === 'inquiries' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="pb-4 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900">
                  Contact Inquiries ({inquiries.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Messages received via the Contact Us form.
                </p>
              </div>

              {inquiries.length > 0 ? (
                <div className="space-y-4">
                  {inquiries.map((inq) => (
                    <div key={inq.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          <span>{inq.name}</span>
                          <span className="text-slate-400 font-normal">({inq.email})</span>
                        </div>
                        <span className="text-slate-400">
                          {new Date(inq.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-200/60">
                        {inq.message}
                      </p>
                      <div className="flex justify-end gap-2 pt-1 text-xs">
                        <a
                          href={`mailto:${inq.email}?subject=Reply from Shikuran Skills`}
                          className="text-blue-600 hover:underline font-bold inline-flex items-center gap-1"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Reply via Email</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-slate-400">
                  No contact messages received yet.
                </div>
              )}
            </div>
          )}

          {/* TAB 9: SETTINGS & BACKUP */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* Credentials Form */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div className="pb-4 border-b border-slate-100">
                  <h2 className="text-xl font-bold text-slate-900">
                    Administrator Security Settings
                  </h2>
                  <p className="text-xs text-slate-500">
                    Change your admin username and password. Passwords are salted and hashed securely using bcrypt.
                  </p>
                </div>

                <form onSubmit={handleUpdateCredentials} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Current Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Admin Username / Identifier
                    </label>
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      New Password (Min 8 characters)
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Leave blank to keep current password"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                  >
                    Update Admin Credentials
                  </button>
                </form>
              </div>

              {/* Database Backup & Restore */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div className="pb-4 border-b border-slate-100">
                  <h2 className="text-xl font-bold text-slate-900">
                    Database Backup & Restore
                  </h2>
                  <p className="text-xs text-slate-500">
                    Download a full snapshot of your articles, categories, tutorials, and comments anytime.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Download Backup */}
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Download className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm">Download Full Backup</h3>
                    <p className="text-xs text-slate-500">
                      Exports all database collections (posts, tutorials, comments, and pages) as a timestamped JSON file.
                    </p>
                    <a
                      href="/api/admin/backup"
                      download={`shikuran_backup_${Date.now()}.json`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download JSON Backup</span>
                    </a>
                  </div>

                  {/* Restore Backup */}
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Upload className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm">Restore From Backup</h3>
                    <p className="text-xs text-slate-500">
                      Upload a previously exported backup file to restore database contents.
                    </p>
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer">
                      <Upload className="w-4 h-4 text-blue-600" />
                      <span>Select Backup JSON File</span>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleRestoreFile}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Custom Domain Note */}
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 text-xs text-blue-900 space-y-1">
                  <div className="font-bold text-blue-950 flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                    <span>Future Domain Setup (shikurandigital.com):</span>
                  </div>
                  <p className="text-blue-800 leading-relaxed">
                    This platform is configured for custom domain mapping. When ready, point the A / CNAME DNS records of <code>shikurandigital.com</code> to this application deployment. All internal routes and links will seamlessly map.
                  </p>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
};
