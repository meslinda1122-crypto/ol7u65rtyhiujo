import { BlogPost, Category, Tutorial, Comment, PageContent, ContactInquiry } from '../types/index.js';

export const AUTH_TOKEN_KEY = 'shikuran_admin_token';
export const AUTH_USER_KEY = 'shikuran_admin_user';

export function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthSession(token: string, user: { id: string; username: string }) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

export function getStoredUser(): { id: string; username: string } | null {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || data.details || `Request failed with status ${res.status}`);
  }

  return data as T;
}

export const api = {
  // Public
  getPosts: (category?: string, search?: string) => {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (search) params.append('search', search);
    return request<{ posts: BlogPost[]; total: number }>(`/api/posts?${params.toString()}`);
  },

  getPost: (slugOrId: string) => {
    return request<{ post: BlogPost; related: BlogPost[] }>(`/api/posts/${slugOrId}`);
  },

  getCategories: () => {
    return request<(Category & { post_count: number })[]>('/api/categories');
  },

  getTutorials: () => {
    return request<Tutorial[]>('/api/tutorials');
  },

  getTutorial: (slugOrId: string) => {
    return request<Tutorial>(`/api/tutorials/${slugOrId}`);
  },

  getComments: (postId?: string) => {
    const params = postId ? `?postId=${postId}` : '';
    return request<Comment[]>(`/api/comments${params}`);
  },

  addComment: (data: { post_id: string; post_title: string; name: string; email: string; content: string; honeypot?: string; parent_id?: string | null }) => {
    return request<{ message: string; comment: Comment }>('/api/comments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getPageContent: () => {
    return request<PageContent>('/api/page-content');
  },

  submitContact: (data: { name: string; email: string; message: string; honeypot?: string }, formspreeId?: string) => {
    // If Formspree ID is provided and valid, also notify formspree
    if (formspreeId && formspreeId.trim()) {
      const cleanId = formspreeId.trim().replace(/^https?:\/\/formspree\.io\/f\//, '');
      fetch(`https://formspree.io/f/${cleanId}`, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data.name, email: data.email, message: data.message }),
      }).catch(err => console.warn('Formspree notification note:', err));
    }

    // Always log to local persistent database for admin viewing
    return request<{ message: string; inquiryId: string }>('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Admin Auth
  login: (username: string, password: string) => {
    return request<{ message: string; token: string; user: { id: string; username: string } }>('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  verifyAdmin: () => {
    return request<{ valid: boolean; user: any }>('/api/admin/verify');
  },

  // Admin Dashboard
  getStats: () => {
    return request<{
      totalPosts: number;
      publishedPosts: number;
      draftPosts: number;
      totalComments: number;
      pendingComments: number;
      totalTutorials: number;
      totalInquiries: number;
      unreadInquiries: number;
    }>('/api/admin/stats');
  },

  getAdminPosts: () => {
    return request<BlogPost[]>('/api/admin/posts');
  },

  createPost: (postData: Partial<BlogPost>) => {
    return request<{ message: string; post: BlogPost }>('/api/admin/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  },

  updatePost: (id: string, updates: Partial<BlogPost>) => {
    return request<{ message: string; post: BlogPost }>(`/api/admin/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  deletePost: (id: string) => {
    return request<{ message: string }>(`/api/admin/posts/${id}`, {
      method: 'DELETE',
    });
  },

  // Categories
  createCategory: (name: string, description: string) => {
    return request<{ message: string; category: Category }>('/api/admin/categories', {
      method: 'POST',
      body: JSON.stringify({ name, description }),
    });
  },

  updateCategory: (id: string, name: string, description: string) => {
    return request<{ message: string; category: Category }>(`/api/admin/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name, description }),
    });
  },

  deleteCategory: (id: string) => {
    return request<{ message: string }>(`/api/admin/categories/${id}`, {
      method: 'DELETE',
    });
  },

  // Tutorials
  getAdminTutorials: () => {
    return request<Tutorial[]>('/api/admin/tutorials');
  },

  createTutorial: (tutData: Partial<Tutorial>) => {
    return request<{ message: string; tutorial: Tutorial }>('/api/admin/tutorials', {
      method: 'POST',
      body: JSON.stringify(tutData),
    });
  },

  updateTutorial: (id: string, updates: Partial<Tutorial>) => {
    return request<{ message: string; tutorial: Tutorial }>(`/api/admin/tutorials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  deleteTutorial: (id: string) => {
    return request<{ message: string }>(`/api/admin/tutorials/${id}`, {
      method: 'DELETE',
    });
  },

  // Comments
  getAdminComments: () => {
    return request<Comment[]>('/api/admin/comments');
  },

  updateCommentStatus: (id: string, status: 'approved' | 'hidden' | 'pending') => {
    return request<{ message: string }>(`/api/admin/comments/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  deleteComment: (id: string) => {
    return request<{ message: string }>(`/api/admin/comments/${id}`, {
      method: 'DELETE',
    });
  },

  // Page Content
  updatePageContent: (content: Partial<PageContent>) => {
    return request<{ message: string; content: PageContent }>('/api/admin/page-content', {
      method: 'PUT',
      body: JSON.stringify(content),
    });
  },

  // Inquiries
  getInquiries: () => {
    return request<ContactInquiry[]>('/api/admin/inquiries');
  },

  markInquiryRead: (id: string) => {
    return request<{ message: string }>(`/api/admin/inquiries/${id}/read`, {
      method: 'PUT',
    });
  },

  deleteInquiry: (id: string) => {
    return request<{ message: string }>(`/api/admin/inquiries/${id}`, {
      method: 'DELETE',
    });
  },

  // Credentials
  updateCredentials: (data: { currentPassword: string; newUsername?: string; newPassword?: string }) => {
    return request<{ message: string }>('/api/admin/credentials', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Backup & Restore
  exportBackupUrl: '/api/admin/backup',

  restoreBackup: (backupData: any) => {
    return request<{ message: string }>('/api/admin/restore', {
      method: 'POST',
      body: JSON.stringify(backupData),
    });
  },
};
