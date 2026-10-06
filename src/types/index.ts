export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  alt_text: string;
  category: string;
  tags: string[];
  author: string;
  status: 'published' | 'draft';
  read_time: string;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface TutorialStep {
  stepNumber: number;
  title: string;
  content: string;
  keyTip?: string;
  image?: string;
}

export interface Tutorial {
  id: string;
  title: string;
  slug: string;
  icon: string;
  short_description: string;
  level: 'Beginner' | 'Intermediate' | 'All Levels';
  read_time: string;
  steps: TutorialStep[];
  status: 'published' | 'draft';
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  post_title: string;
  parent_id?: string | null;
  name: string;
  email: string;
  content: string;
  status: 'approved' | 'pending' | 'hidden';
  created_at: string;
}

export interface PageContent {
  heroHeading: string;
  heroSubtext: string;
  welcomeHeading: string;
  welcomeText: string;
  aboutStory: string;
  missionText: string;
  visionText: string;
  contactEmail: string;
  contactPhonePlaceholder: string;
  contactAddressPlaceholder: string;
  tiktokHandle: string;
  formspreeId: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  read: boolean;
}

export interface AdminUser {
  id: string;
  username: string;
  passwordHash: string;
  updated_at: string;
}

export interface DatabaseSchema {
  admin: AdminUser;
  posts: BlogPost[];
  categories: Category[];
  tutorials: Tutorial[];
  comments: Comment[];
  pageContent: PageContent;
  inquiries: ContactInquiry[];
}
