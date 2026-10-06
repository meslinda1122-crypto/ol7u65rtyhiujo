import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { dbManager } from './src/server/db.ts';
import { verifyPassword, generateToken, requireAdmin, AuthRequest } from './src/server/auth.ts';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize database
await dbManager.init();

// --- PUBLIC API ROUTES ---

// 1. Get published blog posts (with search & category filter)
app.get('/api/posts', async (req: Request, res: Response) => {
  try {
    const { category, search, limit, offset } = req.query;
    let posts = await dbManager.getPosts(false);

    if (category && category !== 'All') {
      posts = posts.filter(p => p.category.toLowerCase() === (category as string).toLowerCase());
    }

    if (search) {
      const q = (search as string).toLowerCase().trim();
      posts = posts.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q))) ||
        p.content.toLowerCase().includes(q)
      );
    }

    const total = posts.length;
    const off = offset ? parseInt(offset as string) : 0;
    const lim = limit ? parseInt(limit as string) : posts.length;
    const paginated = posts.slice(off, off + lim);

    res.json({ posts: paginated, total });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch blog posts', details: err.message });
  }
});

// 2. Get single post by slug or ID + related posts
app.get('/api/posts/:slugOrId', async (req: Request, res: Response) => {
  try {
    const { slugOrId } = req.params;
    const post = await dbManager.getPostBySlugOrId(slugOrId);
    if (!post) {
      res.status(404).json({ error: 'Blog post not found.' });
      return;
    }

    // Get 3 related posts in same category (or other published posts)
    const all = await dbManager.getPosts(false);
    const related = all
      .filter(p => p.id !== post.id && (p.category === post.category || true))
      .slice(0, 3);

    res.json({ post, related });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch blog post', details: err.message });
  }
});

// 3. Get categories
app.get('/api/categories', async (_req: Request, res: Response) => {
  try {
    const categories = await dbManager.getCategories();
    const posts = await dbManager.getPosts(false);
    const categoriesWithCount = categories.map(cat => ({
      ...cat,
      post_count: posts.filter(p => p.category.toLowerCase() === cat.name.toLowerCase()).length
    }));
    res.json(categoriesWithCount);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch categories', details: err.message });
  }
});

// 4. Get tutorials
app.get('/api/tutorials', async (_req: Request, res: Response) => {
  try {
    const tutorials = await dbManager.getTutorials(false);
    res.json(tutorials);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch tutorials', details: err.message });
  }
});

// 5. Get single tutorial
app.get('/api/tutorials/:slugOrId', async (req: Request, res: Response) => {
  try {
    const { slugOrId } = req.params;
    const tutorial = await dbManager.getTutorialBySlugOrId(slugOrId);
    if (!tutorial) {
      res.status(404).json({ error: 'Tutorial not found.' });
      return;
    }
    res.json(tutorial);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch tutorial', details: err.message });
  }
});

// 6. Get comments for a post
app.get('/api/comments', async (req: Request, res: Response) => {
  try {
    const { postId } = req.query;
    const comments = await dbManager.getComments(postId as string | undefined, false);
    res.json(comments);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch comments', details: err.message });
  }
});

// 7. Add a comment (with honeypot spam protection)
app.post('/api/comments', async (req: Request, res: Response) => {
  try {
    const { post_id, post_title, name, email, content, honeypot, parent_id } = req.body;

    // Spam honeypot check
    if (honeypot) {
      res.status(400).json({ error: 'Spam detected.' });
      return;
    }

    if (!name || !content || !post_id) {
      res.status(400).json({ error: 'Name, comment message, and post ID are required.' });
      return;
    }

    const emailClean = (email || '').trim().toLowerCase();
    const comment = await dbManager.addComment({
      post_id,
      post_title: post_title || 'Blog Post',
      parent_id: parent_id || null,
      name: name.trim().slice(0, 80),
      email: emailClean,
      content: content.trim().slice(0, 2000)
    });

    res.status(201).json({ message: 'Comment submitted successfully.', comment });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to submit comment', details: err.message });
  }
});

// 8. Get public page content
app.get('/api/page-content', async (_req: Request, res: Response) => {
  try {
    const content = await dbManager.getPageContent();
    res.json(content);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch page content', details: err.message });
  }
});

// 9. Contact inquiry submission
app.post('/api/contact', async (req: Request, res: Response) => {
  try {
    const { name, email, message, honeypot } = req.body;

    if (honeypot) {
      res.status(400).json({ error: 'Spam detected.' });
      return;
    }

    if (!name || !email || !message) {
      res.status(400).json({ error: 'Please provide your name, email, and message.' });
      return;
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: 'Please provide a valid email address.' });
      return;
    }

    const inquiry = await dbManager.addInquiry(name.trim(), email.trim(), message.trim());
    res.status(201).json({ message: 'Thank you! Your message has been received.', inquiryId: inquiry.id });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to send message. Please try again.', details: err.message });
  }
});

// --- ADMIN AUTHENTICATION ---

app.post('/api/admin/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: 'Username and password are required.' });
      return;
    }

    const admin = await dbManager.getAdmin();

    const isUsernameMatch = (username.trim().toLowerCase() === admin.username.toLowerCase());
    const isPasswordMatch = await verifyPassword(password, admin.passwordHash);

    if (!isUsernameMatch || !isPasswordMatch) {
      res.status(401).json({ error: 'Invalid credentials. Please check your username and password.' });
      return;
    }

    const token = generateToken({
      userId: admin.id,
      username: admin.username,
      role: 'admin'
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: admin.id,
        username: admin.username
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Authentication failed', details: err.message });
  }
});

app.get('/api/admin/verify', requireAdmin, async (req: AuthRequest, res: Response) => {
  res.json({ valid: true, user: req.user });
});

// --- ADMIN DASHBOARD DATA & CRUD ---

// Stats overview
app.get('/api/admin/stats', requireAdmin, async (_req: AuthRequest, res: Response) => {
  try {
    const posts = await dbManager.getPosts(true);
    const comments = await dbManager.getComments(undefined, true);
    const tutorials = await dbManager.getTutorials(true);
    const inquiries = await dbManager.getInquiries();

    const publishedPosts = posts.filter(p => p.status === 'published').length;
    const draftPosts = posts.filter(p => p.status === 'draft').length;
    const pendingComments = comments.filter(c => c.status === 'pending').length;
    const unreadInquiries = inquiries.filter(i => !i.read).length;

    res.json({
      totalPosts: posts.length,
      publishedPosts,
      draftPosts,
      totalComments: comments.length,
      pendingComments,
      totalTutorials: tutorials.length,
      totalInquiries: inquiries.length,
      unreadInquiries
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch dashboard stats', details: err.message });
  }
});

// Admin posts
app.get('/api/admin/posts', requireAdmin, async (_req: AuthRequest, res: Response) => {
  try {
    const posts = await dbManager.getPosts(true);
    res.json(posts);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to load posts', details: err.message });
  }
});

app.post('/api/admin/posts', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { title, excerpt, content, featured_image, alt_text, category, tags, author, status, read_time, published_at } = req.body;

    if (!title || !content) {
      res.status(400).json({ error: 'Post title and content are required.' });
      return;
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newPost = await dbManager.createPost({
      title: title.trim(),
      slug: slug || `post-${Date.now()}`,
      excerpt: excerpt ? excerpt.trim() : (content.replace(/<[^>]*>?/gm, '').slice(0, 150) + '...'),
      content,
      featured_image: featured_image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop',
      alt_text: alt_text || title,
      category: category || 'Digital Skills',
      tags: Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(Boolean) : ['Digital Skills']),
      author: author || 'Shikuran Skills Team',
      status: status === 'draft' ? 'draft' : 'published',
      read_time: read_time || '5 min read',
      published_at: status === 'published' ? (published_at || new Date().toISOString()) : ''
    });

    res.status(201).json({ message: 'Blog post created successfully.', post: newPost });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create blog post', details: err.message });
  }
});

app.put('/api/admin/posts/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.title && !updates.slug) {
      updates.slug = updates.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    if (typeof updates.tags === 'string') {
      updates.tags = updates.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
    }

    const updated = await dbManager.updatePost(id, updates);
    if (!updated) {
      res.status(404).json({ error: 'Post not found.' });
      return;
    }

    res.json({ message: 'Post updated successfully.', post: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update post', details: err.message });
  }
});

app.delete('/api/admin/posts/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const success = await dbManager.deletePost(id);
    if (!success) {
      res.status(404).json({ error: 'Post not found.' });
      return;
    }
    res.json({ message: 'Post deleted successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete post', details: err.message });
  }
});

// Admin categories
app.post('/api/admin/categories', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      res.status(400).json({ error: 'Category name is required.' });
      return;
    }
    const cat = await dbManager.createCategory(name.trim(), description || '');
    res.status(201).json({ message: 'Category created successfully.', category: cat });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create category', details: err.message });
  }
});

app.put('/api/admin/categories/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    if (!name) {
      res.status(400).json({ error: 'Category name is required.' });
      return;
    }
    const cat = await dbManager.updateCategory(id, name.trim(), description || '');
    if (!cat) {
      res.status(404).json({ error: 'Category not found.' });
      return;
    }
    res.json({ message: 'Category updated successfully.', category: cat });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update category', details: err.message });
  }
});

app.delete('/api/admin/categories/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const success = await dbManager.deleteCategory(id);
    if (!success) {
      res.status(404).json({ error: 'Category not found.' });
      return;
    }
    res.json({ message: 'Category deleted successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete category', details: err.message });
  }
});

// Admin tutorials
app.get('/api/admin/tutorials', requireAdmin, async (_req: AuthRequest, res: Response) => {
  try {
    const tutorials = await dbManager.getTutorials(true);
    res.json(tutorials);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to load tutorials', details: err.message });
  }
});

app.post('/api/admin/tutorials', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { title, short_description, icon, level, read_time, steps, status } = req.body;
    if (!title || !short_description) {
      res.status(400).json({ error: 'Tutorial title and description are required.' });
      return;
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const tut = await dbManager.createTutorial({
      title: title.trim(),
      slug: slug || `tut-${Date.now()}`,
      short_description: short_description.trim(),
      icon: icon || 'Monitor',
      level: level || 'Beginner',
      read_time: read_time || '8 min',
      steps: Array.isArray(steps) ? steps : [],
      status: status === 'draft' ? 'draft' : 'published'
    });

    res.status(201).json({ message: 'Tutorial created successfully.', tutorial: tut });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create tutorial', details: err.message });
  }
});

app.put('/api/admin/tutorials/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (updates.title && !updates.slug) {
      updates.slug = updates.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    const tut = await dbManager.updateTutorial(id, updates);
    if (!tut) {
      res.status(404).json({ error: 'Tutorial not found.' });
      return;
    }
    res.json({ message: 'Tutorial updated successfully.', tutorial: tut });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update tutorial', details: err.message });
  }
});

app.delete('/api/admin/tutorials/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const success = await dbManager.deleteTutorial(id);
    if (!success) {
      res.status(404).json({ error: 'Tutorial not found.' });
      return;
    }
    res.json({ message: 'Tutorial deleted successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete tutorial', details: err.message });
  }
});

// Admin comments management
app.get('/api/admin/comments', requireAdmin, async (_req: AuthRequest, res: Response) => {
  try {
    const comments = await dbManager.getComments(undefined, true);
    res.json(comments);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to load comments', details: err.message });
  }
});

app.put('/api/admin/comments/:id/status', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['approved', 'hidden', 'pending'].includes(status)) {
      res.status(400).json({ error: 'Invalid status' });
      return;
    }
    const success = await dbManager.updateCommentStatus(id, status);
    if (!success) {
      res.status(404).json({ error: 'Comment not found.' });
      return;
    }
    res.json({ message: `Comment marked as ${status}.` });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update comment', details: err.message });
  }
});

app.delete('/api/admin/comments/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const success = await dbManager.deleteComment(id);
    if (!success) {
      res.status(404).json({ error: 'Comment not found.' });
      return;
    }
    res.json({ message: 'Comment deleted successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete comment', details: err.message });
  }
});

// Admin page content management
app.put('/api/admin/page-content', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const updated = await dbManager.updatePageContent(req.body);
    res.json({ message: 'Page content updated successfully.', content: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update page content', details: err.message });
  }
});

// Admin inquiries
app.get('/api/admin/inquiries', requireAdmin, async (_req: AuthRequest, res: Response) => {
  try {
    const inquiries = await dbManager.getInquiries();
    res.json(inquiries);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch inquiries', details: err.message });
  }
});

app.put('/api/admin/inquiries/:id/read', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await dbManager.markInquiryRead(id);
    res.json({ message: 'Inquiry marked as read.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update inquiry', details: err.message });
  }
});

app.delete('/api/admin/inquiries/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const success = await dbManager.deleteInquiry(id);
    if (!success) {
      res.status(404).json({ error: 'Inquiry not found.' });
      return;
    }
    res.json({ message: 'Inquiry deleted successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete inquiry', details: err.message });
  }
});

// Admin credentials update
app.put('/api/admin/credentials', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newUsername, newPassword } = req.body;

    if (!currentPassword) {
      res.status(400).json({ error: 'Current password is required to make security changes.' });
      return;
    }

    const admin = await dbManager.getAdmin();
    const isValid = await verifyPassword(currentPassword, admin.passwordHash);
    if (!isValid) {
      res.status(401).json({ error: 'Incorrect current password.' });
      return;
    }

    if (newPassword && newPassword.length < 8) {
      res.status(400).json({ error: 'New password must be at least 8 characters long.' });
      return;
    }

    await dbManager.updateAdminCredentials(newUsername, newPassword);
    res.json({ message: 'Admin credentials updated successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update credentials', details: err.message });
  }
});

// Backup & Restore
app.get('/api/admin/backup', requireAdmin, async (_req: AuthRequest, res: Response) => {
  try {
    const backup = await dbManager.exportBackup();
    // sanitize password hash out of public export
    const safeBackup = {
      ...backup,
      admin: {
        id: backup.admin.id,
        username: backup.admin.username,
        updated_at: backup.admin.updated_at
      }
    };
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="shikuran_backup_${Date.now()}.json"`);
    res.send(JSON.stringify(safeBackup, null, 2));
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to generate backup', details: err.message });
  }
});

app.post('/api/admin/restore', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const backupData = req.body;
    const currentAdmin = await dbManager.getAdmin();
    // retain existing admin credentials
    backupData.admin = currentAdmin;
    await dbManager.importBackup(backupData);
    res.json({ message: 'Database backup restored successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to restore backup', details: err.message });
  }
});

// --- VITE MIDDLEWARE / STATIC ASSETS ---

const isProduction = process.env.NODE_ENV === 'production';
const distPath = path.resolve(process.cwd(), 'dist');

if (!isProduction && !fs.existsSync(path.join(distPath, 'index.html'))) {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Shikuran Skills server running on http://0.0.0.0:${PORT}`);
});
