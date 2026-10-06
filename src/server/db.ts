import fs from 'fs/promises';
import path from 'path';
import { DatabaseSchema, BlogPost, Category, Tutorial, Comment, PageContent, ContactInquiry, AdminUser } from '../types/index.js';
import bcrypt from 'bcryptjs';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'shikuran_db.json');

// Default initial admin password hash for: Shikuran2026!
const DEFAULT_ADMIN_HASH = '$2b$10$wbxjHeXkCxjTU9Ow7iImg.AW508h/FLusF0Rq5joMQ2nOlAfO.H9O';

export const initialCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Digital Skills',
    slug: 'digital-skills',
    description: 'Core foundational abilities to thrive in the modern technology-driven world.'
  },
  {
    id: 'cat-2',
    name: 'Computer Basics',
    slug: 'computer-basics',
    description: 'Hardware, operating systems, mouse & keyboard usage, and file management.'
  },
  {
    id: 'cat-3',
    name: 'Online Safety',
    slug: 'online-safety',
    description: 'Cybersecurity, password protection, scam identification, and privacy best practices.'
  },
  {
    id: 'cat-4',
    name: 'Productivity Tools',
    slug: 'productivity-tools',
    description: 'Word processing, spreadsheets, email management, and digital collaboration software.'
  },
  {
    id: 'cat-5',
    name: 'Career & Education',
    slug: 'career-and-education',
    description: 'Using technology to excel in school, advance careers, and unlock remote opportunities.'
  }
];

export const initialPosts: BlogPost[] = [
  {
    id: 'post-1',
    title: 'Why Everyone Should Learn Digital Skills',
    slug: 'why-everyone-should-learn-digital-skills',
    excerpt: 'Discover why digital literacy is no longer just a technical specialty, but an indispensable life skill for work, schooling, and day-to-day living.',
    category: 'Digital Skills',
    tags: ['Digital Literacy', 'Beginner Guides', 'Future of Work', 'Self Improvement'],
    author: 'Shikuran Skills Team',
    status: 'published',
    read_time: '6 min read',
    featured_image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop',
    alt_text: 'Hands typing on a modern laptop with digital graphs and notes',
    published_at: '2026-03-15T09:00:00.000Z',
    created_at: '2026-03-15T09:00:00.000Z',
    updated_at: '2026-03-15T09:00:00.000Z',
    content: `
<h2>The Shift From Optional Bonus to Everyday Essential</h2>
<p>Only a decade ago, being "good with computers" was viewed as a specialized trait reserved for IT technicians, software developers, and administrative assistants. Today, technology has woven itself into nearly every facet of our daily existence. Whether you are applying for a job, paying your electricity bill, communicating with your child's teacher, or booking medical appointments, digital competence is at the heart of daily life.</p>

<p>At Shikuran Skills, our foundational conviction is simple: <strong>digital skills are not just for engineers—they are for everyone</strong>. Anyone, regardless of their age or educational background, can master the practical digital tools needed to build a brighter future.</p>

<h2>1. Empowering Your Career and Employment Opportunities</h2>
<p>Modern workplaces have transitioned almost entirely to digital workflows. Regardless of your industry—healthcare, retail, transportation, agriculture, or finance—employers prioritize team members who can interact comfortably with computers.</p>

<ul>
  <li><strong>Online Job Searches:</strong> Writing a clean digital resume, submitting applications through career portals, and communicating professionally via email.</li>
  <li><strong>Workplace Software:</strong> Creating documents in Microsoft Word or Google Docs, organizing spreadsheets, and collaborating with teammates on messaging tools.</li>
  <li><strong>Remote & Flexible Opportunities:</strong> Possessing digital skills opens the door to working from home or earning income through freelance work.</li>
</ul>

<blockquote>"Digital literacy is the gateway to equal opportunity in the 21st-century economy. When you learn to command technology, you take control of your career trajectory."</blockquote>

<h2>2. Transforming Education and Knowledge Access</h2>
<p>For students and adult learners alike, the internet is the greatest library ever created. However, having access to the internet is only valuable if you know how to navigate it purposefully:</p>
<ol>
  <li><strong>Effective Research:</strong> Knowing how to verify credible sources rather than relying on unverified rumors or outdated websites.</li>
  <li><strong>Online Courses and Certifications:</strong> Millions of free and low-cost courses exist on platforms like Coursera, edX, and YouTube. Knowing how to register, submit assignments, and organize study files unlocks continuous growth.</li>
  <li><strong>Interactive Homework Submissions:</strong> Schools increasingly rely on portals like Google Classroom to manage assignments and teacher-student correspondence.</li>
</ol>

<h2>3. Navigating Everyday Life With Greater Independence</h2>
<p>Have you ever had to stand in a long queue at a bank, post office, or government agency just to submit a single paper form? With foundational digital skills, tasks that previously consumed hours can be completed in minutes from your phone or laptop:</p>
<ul>
  <li><strong>Digital Banking:</strong> Checking account balances, transferring funds, and monitoring transactions safely without visiting a physical branch.</li>
  <li><strong>Healthcare Portals:</strong> Scheduling appointments, checking lab results, and requesting medication refills online.</li>
  <li><strong>Connecting With Loved Ones:</strong> Video calling relatives across the world and sharing family milestones securely.</li>
</ul>

<h2>Overcoming the Fear of Technology</h2>
<p>Many beginners hesitate because they fear "breaking the computer" or clicking the wrong button. Remember this golden rule: modern computers and smartphones are resilient. Unless you drop the physical device, it is very difficult to permanently break anything by simply clicking an icon. If you make a mistake, there is almost always an <em>Undo</em> button (like Ctrl+Z) or a Back button.</p>

<h2>Conclusion: Your Journey Starts Today</h2>
<p>Learning digital skills is a journey of small, steady steps. You do not need to learn everything at once. Start by mastering one practical skill this week—such as organizing your desktop files, creating a professional email signature, or learning basic keyboard shortcuts. Explore the tutorials right here on Shikuran Skills and watch your digital confidence soar!</p>
`
  },
  {
    id: 'post-2',
    title: 'Essential Computer Skills Every Beginner Should Know',
    slug: 'essential-computer-skills-every-beginner-should-know',
    excerpt: 'From understanding folders and keyboard shortcuts to basic troubleshooting, here is the complete checklist of fundamentals to master any computer.',
    category: 'Computer Basics',
    tags: ['Computer Basics', 'File Management', 'Shortcuts', 'Beginner Guides'],
    author: 'Shikuran Skills Team',
    status: 'published',
    read_time: '7 min read',
    featured_image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?q=80&w=1200&auto=format&fit=crop',
    alt_text: 'Close up of hands using a clean desktop keyboard with mouse and notebook',
    published_at: '2026-03-18T10:30:00.000Z',
    created_at: '2026-03-18T10:30:00.000Z',
    updated_at: '2026-03-18T10:30:00.000Z',
    content: `
<h2>Building a Solid Foundation With Your Computer</h2>
<p>Stepping in front of a computer for the first time can feel overwhelming with all the menus, icons, and notifications. However, once you understand the basic mechanics, computers become intuitive tools that multiply your productivity. Here are the core computer skills every beginner should focus on first.</p>

<h2>1. Mastering Mouse and Trackpad Control</h2>
<p>Your cursor is your digital hand. Getting comfortable with these four basic actions will make everything smoother:</p>
<ul>
  <li><strong>Left-Click:</strong> Selects an item, places your cursor in text, or activates a button.</li>
  <li><strong>Double-Click:</strong> Rapidly pressing the left button twice opens a program, folder, or document.</li>
  <li><strong>Right-Click:</strong> Opens a context menu showing available options (such as Copy, Rename, Delete, or Properties). When in doubt, right-click!</li>
  <li><strong>Drag-and-Drop:</strong> Click and hold an icon, drag it to a new location or folder, and release the button to move it.</li>
</ul>

<h2>2. The Core Keyboard Shortcuts That Save Hours</h2>
<p>Using keyboard shortcuts makes you exponentially faster and reduces hand fatigue. Practice these essential combinations every day:</p>

<ul>
  <li><strong>Ctrl + C (Cmd + C on Mac):</strong> Copy the selected text or file without deleting the original.</li>
  <li><strong>Ctrl + X (Cmd + X on Mac):</strong> Cut the selected item (removes it so you can paste it elsewhere).</li>
  <li><strong>Ctrl + V (Cmd + V on Mac):</strong> Paste whatever you previously copied or cut.</li>
  <li><strong>Ctrl + Z (Cmd + Z on Mac):</strong> The magical "Undo" command. If you accidentally delete text or make a mistake, press this immediately!</li>
  <li><strong>Ctrl + S (Cmd + S on Mac):</strong> Save your current file or document. Press this frequently while writing!</li>
  <li><strong>Alt + Tab (Cmd + Tab on Mac):</strong> Quickly switch between open windows and programs.</li>
</ul>

<h2>3. File and Folder Management: Keeping Your Digital House Clean</h2>
<p>A cluttered computer desktop makes finding important documents stressful. Just like a physical filing cabinet, a computer uses <strong>folders</strong> to organize your work.</p>

<p>Follow these 3 file organization golden rules:</p>
<ol>
  <li><strong>Create Meaningful Folders:</strong> Create folders named after clear categories, such as <em>Personal Documents</em>, <em>Work Invoices</em>, or <em>School Assignments</em>.</li>
  <li><strong>Use Descriptive Names:</strong> Never save a file as <em>Document1.docx</em> or <em>Untitled.pdf</em>. Instead, use names like <em>Resume_JohnDoe_March2026.docx</em> or <em>ElectricityBill_February2026.pdf</em>.</li>
  <li><strong>Understand Common File Extensions:</strong>
    <ul>
      <li><code>.docx</code> - Microsoft Word text document</li>
      <li><code>.pdf</code> - Portable Document Format (great for sharing because formatting never shifts)</li>
      <li><code>.jpg</code> / <code>.png</code> - Image files</li>
      <li><code>.xlsx</code> - Excel spreadsheet file</li>
      <li><code>.zip</code> - Compressed folder containing multiple files packaged together</li>
    </ul>
  </li>
</ol>

<h2>4. Basic Troubleshooting When Things Go Wrong</h2>
<p>Every computer user encounters frozen apps or connection glitches. Before calling a technician, try these proven first steps:</p>
<ul>
  <li><strong>Restart the Computer:</strong> Turning your computer off and on again clears temporary system memory and solves over 70% of common software glitches.</li>
  <li><strong>Check Physical Cables:</strong> Ensure your monitor cable, power cord, and network cable are firmly seated in their ports.</li>
  <li><strong>Close Unresponsive Programs:</strong> On Windows, press <code>Ctrl + Shift + Esc</code> to open Task Manager and close frozen applications. On Mac, press <code>Option + Command + Esc</code>.</li>
</ul>

<h2>Conclusion</h2>
<p>Mastering these foundational skills gives you the confidence to explore more advanced digital tools. Open your computer today, try using Ctrl+C and Ctrl+V, organize three messy files into a new folder, and celebrate your progress!</p>
`
  },
  {
    id: 'post-3',
    title: 'How Digital Skills Can Improve Your Education and Career',
    slug: 'how-digital-skills-can-improve-your-education-and-career',
    excerpt: 'Unlock higher wages, academic excellence, and international job opportunities by turning everyday technology into your greatest professional asset.',
    category: 'Career & Education',
    tags: ['Career Growth', 'Productivity', 'Job Skills', 'Lifelong Learning'],
    author: 'Shikuran Skills Team',
    status: 'published',
    read_time: '6 min read',
    featured_image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop',
    alt_text: 'Group of young diverse students and professionals collaborating around a laptop',
    published_at: '2026-03-21T11:15:00.000Z',
    created_at: '2026-03-21T11:15:00.000Z',
    updated_at: '2026-03-21T11:15:00.000Z',
    content: `
<h2>The Bridge Between Knowledge and Opportunity</h2>
<p>In almost every profession today, knowledge alone is not enough. You must also know how to apply that knowledge using digital tools. A teacher who knows how to create engaging visual presentations, a nurse who understands electronic health records, an accountant proficient in spreadsheets, or an entrepreneur marketing products on social media all share one advantage: digital proficiency.</p>

<h2>1. Supercharging Academic Success for Students</h2>
<p>Students who master digital literacy consistently outperform their peers in research depth, presentation quality, and time management:</p>

<ul>
  <li><strong>Speed and Accuracy in Writing:</strong> Touch-typing and using grammar checkers (like Grammarly or built-in spellcheck) allows students to articulate complex thoughts without getting bogged down by mechanics.</li>
  <li><strong>Cloud Collaboration:</strong> With Google Drive or Microsoft OneDrive, group projects no longer require emailing conflicting file versions back and forth. Multiple students can edit the same document simultaneously in real time.</li>
  <li><strong>Citation and Reference Tools:</strong> Organizing bibliographies and academic sources with tools like Zotero or Google Scholar saves countless hours during term paper writing.</li>
</ul>

<h2>2. Accelerating Workplace Productivity and Standing Out</h2>
<p>Employers love workers who solve problems rather than create them. Knowing how to leverage standard productivity tools is one of the quickest ways to earn promotions and salary increases:</p>

<ol>
  <li><strong>Spreadsheet Mastery (Excel / Google Sheets):</strong> You don't need to be a data scientist. Simply knowing how to sort tables, calculate sums with <code>=SUM()</code>, and format numbers makes you an indispensable asset in any office.</li>
  <li><strong>Clear, Professional Email Communication:</strong> Crafting concise subject lines, using polite greeting formulas, attaching relevant files properly, and proofreading before sending builds a reputation for reliability.</li>
  <li><strong>Presentation Design:</strong> Crafting visual, bullet-point-restrained slide decks in PowerPoint, Canva, or Google Slides ensures your proposals receive serious attention from management.</li>
</ol>

<blockquote>"Technology does not replace talent; it magnifies it. The professional who understands digital tools will always surpass the one who resists them."</blockquote>

<h2>3. Tapping Into the Global Remote Work Economy</h2>
<p>Perhaps the most exciting benefit of acquiring digital skills is geographical freedom. Platforms like Upwork, Fiverr, LinkedIn, and remote job boards allow talented individuals to work with international clients right from home:</p>
<ul>
  <li>Virtual assistance and administrative management</li>
  <li>Content writing and digital proofreading</li>
  <li>Social media management and community moderation</li>
  <li>Data entry, data cleaning, and online research</li>
</ul>

<h2>Action Steps to Take This Week</h2>
<p>Pick one skill area that aligns with your next career goal. Spend 20 minutes a day following a tutorial, practicing typing, or testing a spreadsheet formula. Small daily investments compound into life-changing capabilities.</p>
`
  },
  {
    id: 'post-4',
    title: 'How to Use the Internet Safely and Effectively',
    slug: 'how-to-use-the-internet-safely-and-effectively',
    excerpt: 'Protect your identity, avoid dangerous online scams, and master search engine tricks to find exact information in seconds.',
    category: 'Online Safety',
    tags: ['Cybersecurity', 'Online Privacy', 'Passwords', 'Internet Tips'],
    author: 'Shikuran Skills Team',
    status: 'published',
    read_time: '7 min read',
    featured_image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop',
    alt_text: 'Cyber security lock symbol overlaid on a glowing digital network background',
    published_at: '2026-03-24T14:00:00.000Z',
    created_at: '2026-03-24T14:00:00.000Z',
    updated_at: '2026-03-24T14:00:00.000Z',
    content: `
<h2>The Two Sides of the Internet</h2>
<p>The internet connects billions of people and stores the sum of human knowledge. However, just like walking through a bustling international city, you need to know how to navigate safely, protect your valuables, and avoid shady alleyways. Cybersecurity is not about living in fear—it is about following smart, simple habits that keep you in control.</p>

<h2>1. Spotting Phishing Scams Before They Bite</h2>
<p>Phishing is the most common cyber attack in the world. Fraudsters send deceptive emails, text messages (SMS), or social media messages pretending to be your bank, a delivery company, or a government service.</p>

<p>Watch for these telltale red flags:</p>
<ul>
  <li><strong>Artificial Urgency:</strong> Messages stating <em>"Your account will be suspended within 24 hours!"</em> or <em>"Click immediately to claim your $1,000 lottery prize!"</em> Scammers use panic or greed to stop you from thinking clearly.</li>
  <li><strong>Suspicious Sender Addresses:</strong> Check the actual email address, not just the display name. If an email claims to be from Netflix but originates from <code>support@netflix-service-verify892.xyz</code>, it is 100% fake.</li>
  <li><strong>Requests for Passwords or PINs:</strong> Legitimate banks and services will NEVER ask for your password or SMS verification code via email or phone call.</li>
</ul>

<h2>2. Creating Passwords You Can Remember (And Hackers Cannot Guess)</h2>
<p>Do you still use the same password across multiple websites, or use simple words like <em>password123</em> or your birthdate? If one website suffers a data leak, hackers will try that exact password on your email, bank, and social media accounts.</p>

<p>Instead, use the <strong>Passphrase Method</strong>:</p>
<ul>
  <li>Combine four random, memorable words into a sentence: e.g., <code>BlueElephantEatsTacos!2026</code>.</li>
  <li>It is over 24 characters long—making it virtually uncrackable by automated hacker tools—yet easy for human memory to picture.</li>
  <li>Enable <strong>Two-Factor Authentication (2FA)</strong> whenever offered. 2FA requires both your password and a temporary verification code sent to your phone or authenticator app. Even if someone steals your password, they cannot log in without your phone.</li>
</ul>

<h2>3. Searching the Internet Like an Expert Researcher</h2>
<p>Most people type full questions into Google and scroll through pages of ads. Use these search engine tricks to find exact answers immediately:</p>

<ol>
  <li><strong>Exact Phrase Search:</strong> Put quotation marks around your words, like <code>"how to create a budget spreadsheet"</code>. Google will only return results containing that exact phrase.</li>
  <li><strong>Exclude Unwanted Words:</strong> Use a minus sign. For example: <code>jaguar -car</code> will show you results about the wild animal, excluding the luxury car brand.</li>
  <li><strong>Search Inside a Specific Site:</strong> Type <code>site:edu digital literacy</code> to find high-quality research papers from university websites only.</li>
  <li><strong>Search for Specific File Types:</strong> Type <code>job application template filetype:pdf</code> to directly find downloadable PDF documents.</li>
</ol>

<h2>Conclusion</h2>
<p>Practicing internet safety is like wearing a seatbelt: once it becomes second nature, you never think twice about it, and it keeps you safe on every digital journey. Review your passwords today, turn on two-factor authentication on your primary email, and explore the web with total peace of mind!</p>
`
  },
  {
    id: 'post-5',
    title: 'The Importance of Technology Skills in the Modern World',
    slug: 'the-importance-of-technology-skills-in-the-modern-world',
    excerpt: 'Why embracing technology is the single most valuable decision for personal growth, family well-being, and societal progress in 2026 and beyond.',
    category: 'Technology',
    tags: ['Technology', 'Future Trends', 'Digital Society', 'Innovation'],
    author: 'Shikuran Skills Team',
    status: 'published',
    read_time: '6 min read',
    featured_image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
    alt_text: 'Planet earth illuminated with digital connectivity lines and glowing data points',
    published_at: '2026-03-27T08:00:00.000Z',
    created_at: '2026-03-27T08:00:00.000Z',
    updated_at: '2026-03-27T08:00:00.000Z',
    content: `
<h2>A Connected Planet in Transformation</h2>
<p>We are living through one of the most transformative eras in human history. Digital networks, automated systems, cloud computing, and intelligent software are reshaping how communities trade, communicate, and solve problems. Standing on the sidelines is no longer a viable option.</p>

<p>When you develop technology skills, you transform from a passive consumer of devices into an active participant who can shape their environment.</p>

<h2>1. Bridging the Digital Divide</h2>
<p>The "digital divide" refers to the gap between those who have the resources and know-how to use technology, and those who do not. This gap impacts income levels, civic participation, and social mobility.</p>

<ul>
  <li><strong>Equal Access for Rural Communities:</strong> Digital learning allows individuals in small towns and developing regions to access the exact same university lectures and global employment markets as residents of major tech hubs.</li>
  <li><strong>Empowering Older Generations:</strong> Technology helps seniors stay connected with grandchildren, access telehealth appointments, and manage finances independently without relying on third parties.</li>
  <li><strong>Fostering Entrepreneurship:</strong> Anyone with a smartphone can now start a business, display products on an e-commerce platform, accept payments digitally, and ship across borders.</li>
</ul>

<h2>2. Adapting to New Tools Without Intimidation</h2>
<p>People often ask: <em>"With technology advancing so quickly, won't whatever I learn today become obsolete tomorrow?"</em></p>
<p>The answer is that foundational digital principles rarely change. Once you understand how databases work, how files are structured, how user interfaces communicate, and how network security functions, learning new applications becomes easy. When a new app or AI tool emerges, you will not feel panicked—you will recognize familiar patterns and master it in days.</p>

<blockquote>"You do not need to be an expert in every new tool. You only need the curiosity to try, the confidence to test, and the patience to learn step by step."</blockquote>

<h2>3. Cultivating Critical Thinking in the Age of Information</h2>
<p>True technology literacy is not just about pressing buttons—it is about critical evaluation:</p>
<ol>
  <li><strong>Discerning Fact From Fiction:</strong> Understanding how algorithms curate feeds and learning how to verify facts across independent sources.</li>
  <li><strong>Digital Well-being:</strong> Knowing when to step away from screens, managing notifications, and maintaining a healthy balance between online activities and real-world relationships.</li>
  <li><strong>Data Privacy Awareness:</strong> Understanding what permissions apps request and knowing your rights regarding personal data.</li>
</ol>

<h2>The Shikuran Skills Commitment</h2>
<p>At Shikuran Skills, our mission is to demystify technology for everyone. We believe that when you empower a student, parent, worker, or teacher with digital competence, you uplift their entire community. Browse our tutorials, share our articles with your family, and let us build the future together!</p>
`
  }
];

export const initialTutorials: Tutorial[] = [
  {
    id: 'tut-1',
    title: 'How to Use a Computer for Absolute Beginners',
    slug: 'how-to-use-a-computer',
    icon: 'Monitor',
    short_description: 'Learn the primary parts of a computer, how to turn it on, use the desktop, launch applications, and shut down properly.',
    level: 'Beginner',
    read_time: '10 min',
    status: 'published',
    created_at: '2026-03-10T08:00:00.000Z',
    updated_at: '2026-03-10T08:00:00.000Z',
    steps: [
      {
        stepNumber: 1,
        title: 'Understand the Hardware (Hardware vs Software)',
        content: 'Hardware is the physical machine you can touch: the computer case/tower (or laptop body), the monitor (screen), the keyboard, and the mouse. Software refers to the instructions and programs (like Windows, Chrome, or Word) running inside the machine.',
        keyTip: 'Think of hardware as a musical instrument, and software as the sheet music that tells it what to play.'
      },
      {
        stepNumber: 2,
        title: 'Powering On the Machine',
        content: 'Locate the power button (marked with a universal circle and vertical line icon ⏻). Press it once firmly. Wait 15 to 45 seconds while the operating system loads the login screen.',
        keyTip: 'Never hold down the power button to turn off the computer during normal use; always use the software Shut Down command.'
      },
      {
        stepNumber: 3,
        title: 'Exploring the Desktop and Taskbar',
        content: 'The Desktop is your main workspace. Across the bottom (or side) is the Taskbar. On the left is the Start Menu button where all installed programs live. On the right is the System Tray showing the clock, volume, and Wi-Fi status.',
        keyTip: 'Press the Windows key on your keyboard to instantly open the search bar to find any app.'
      },
      {
        stepNumber: 4,
        title: 'Launching and Closing Applications',
        content: 'Click the Start button, scroll to your desired app (e.g., Google Chrome or Calculator), and click it once. To close an application, click the red "X" button located in the top-right corner of the window.',
        keyTip: 'You can minimize a window by clicking the minus sign (-) in the top-right corner to hide it temporarily without closing it.'
      },
      {
        stepNumber: 5,
        title: 'Proper Shut Down Procedure',
        content: 'When finished, click the Start button, click the Power icon, and select "Shut Down". This gives your computer time to safely close background files and prevent data corruption.',
        keyTip: 'Wait until the screen goes completely dark and the power lights turn off before unplugging or closing the laptop lid.'
      }
    ]
  },
  {
    id: 'tut-2',
    title: 'How to Create and Manage Files and Folders',
    slug: 'how-to-create-and-manage-files',
    icon: 'FolderKanban',
    short_description: 'Master file organization, create custom folders, rename documents, move items, and use search so you never lose a file.',
    level: 'Beginner',
    read_time: '8 min',
    status: 'published',
    created_at: '2026-03-12T09:00:00.000Z',
    updated_at: '2026-03-12T09:00:00.000Z',
    steps: [
      {
        stepNumber: 1,
        title: 'Open File Explorer',
        content: 'Click the yellow folder icon on your taskbar or press the keyboard shortcut Windows Key + E (or Finder on Mac). This opens your computer\'s digital filing cabinet.',
        keyTip: 'Notice the left navigation panel with quick links to Documents, Downloads, Desktop, and Pictures.'
      },
      {
        stepNumber: 2,
        title: 'Creating a New Folder',
        content: 'Navigate into your Documents directory. Right-click on an empty space, hover your mouse over "New", and click "Folder". Type a clear name like "Work Documents 2026" and press Enter.',
        keyTip: 'You can also create a new folder instantly using the shortcut Ctrl + Shift + N.'
      },
      {
        stepNumber: 3,
        title: 'Renaming and Moving Files',
        content: 'To rename an item, right-click it and choose "Rename" (or click it and press F2). To move a file into a folder, click and hold the file with your left mouse button, drag it on top of the folder icon, and let go.',
        keyTip: 'Always name files with descriptive words (e.g., Resume_2026.docx rather than Document1.docx).'
      },
      {
        stepNumber: 4,
        title: 'Finding Lost Files With Search',
        content: 'If you cannot remember where you saved a document, look at the top-right search box in File Explorer. Type a single keyword or part of the file name, and your computer will search all subfolders.',
        keyTip: 'You can also search by file extension, such as typing *.pdf to see all PDF files in that folder.'
      }
    ]
  },
  {
    id: 'tut-3',
    title: 'How to Use Microsoft Word & Google Docs',
    slug: 'how-to-use-microsoft-word',
    icon: 'FileText',
    short_description: 'Learn document formatting, bold/italics, text alignment, inserting bullet lists, and exporting to clean PDF format.',
    level: 'Beginner',
    read_time: '12 min',
    status: 'published',
    created_at: '2026-03-14T10:00:00.000Z',
    updated_at: '2026-03-14T10:00:00.000Z',
    steps: [
      {
        stepNumber: 1,
        title: 'Creating a Blank Document',
        content: 'Open Microsoft Word or visit docs.google.com in your web browser. Click "Blank Document" to open a clean sheet of paper.',
        keyTip: 'Google Docs automatically saves every keystroke to Google Drive in real time so you never lose work!'
      },
      {
        stepNumber: 2,
        title: 'Typing and Basic Text Formatting',
        content: 'Start typing your letter, essay, or notes. Highlight text with your mouse to format it. Use the top toolbar to change the font size (11 or 12 pt for body text), style (Bold B, Italic I, Underline U), and color.',
        keyTip: 'Use standard, readable fonts like Calibri, Arial, or Georgia for professional documents.'
      },
      {
        stepNumber: 3,
        title: 'Structuring With Headings and Bullet Lists',
        content: 'Do not just increase font size for titles—use the "Heading 1" and "Heading 2" styles in the Styles pane. For lists, click the Bullet List or Numbered List buttons on the toolbar.',
        keyTip: 'Using official Heading styles creates an automatic table of contents and ensures screen readers can read your document.'
      },
      {
        stepNumber: 4,
        title: 'Saving and Exporting to PDF',
        content: 'Click File > Save As (or File > Download in Google Docs) and select "PDF Document (*.pdf)". A PDF locks your fonts and margins so it looks identical on any device or printer.',
        keyTip: 'Always send resumes, job applications, and official invoices as PDFs, not Word files.'
      }
    ]
  },
  {
    id: 'tut-4',
    title: 'How to Search the Internet Effectively',
    slug: 'how-to-search-the-internet',
    icon: 'Search',
    short_description: 'Discover the exact search operators and fact-checking techniques that will turn you into an efficient web researcher.',
    level: 'Beginner',
    read_time: '7 min',
    status: 'published',
    created_at: '2026-03-16T11:00:00.000Z',
    updated_at: '2026-03-16T11:00:00.000Z',
    steps: [
      {
        stepNumber: 1,
        title: 'Choosing Keywords Instead of Full Sentences',
        content: 'Search engines do not need conversational greetings. Instead of searching "Could you please tell me where the nearest post office is in Chicago?", type: "Chicago post office locations hours".',
        keyTip: 'Focus on unique nouns and verbs rather than filler words like "the", "an", or "is".'
      },
      {
        stepNumber: 2,
        title: 'Quotation Marks for Exact Quotes',
        content: 'Enclose words in quotation marks like "digital skills curriculum" to force the search engine to return pages containing those words in that precise sequence.',
        keyTip: 'This is the fastest way to track down a specific lyric, book quote, or error message.'
      },
      {
        stepNumber: 3,
        title: 'Restricting by Website or Domain',
        content: 'Use the operator site: followed by a domain. For instance, "python tutorial site:edu" searches exclusively educational institutions, while "site:gov passport renewal" searches official government websites.',
        keyTip: 'Never put a space between the colon and the domain name.'
      },
      {
        stepNumber: 4,
        title: 'Evaluating Credibility',
        content: 'Check who authored the article, look for a publication date, check if the website has an "About" page, and compare claims across multiple independent reputable publications.',
        keyTip: 'If a sensational headline sounds too shocking or too good to be true, double check before sharing.'
      }
    ]
  },
  {
    id: 'tut-5',
    title: 'How to Create and Use an Email Account Safely',
    slug: 'how-to-create-an-email-account',
    icon: 'Mail',
    short_description: 'Step-by-step guide to setting up a free Gmail or Outlook account, composing professional messages, and avoiding spam.',
    level: 'Beginner',
    read_time: '9 min',
    status: 'published',
    created_at: '2026-03-19T13:00:00.000Z',
    updated_at: '2026-03-19T13:00:00.000Z',
    steps: [
      {
        stepNumber: 1,
        title: 'Choosing an Email Provider',
        content: 'Visit gmail.com or outlook.com. Both providers offer free, reliable email with gigabytes of cloud storage, top-tier spam protection, and easy mobile apps.',
        keyTip: 'Gmail also unlocks Google Drive, Google Docs, and YouTube with a single account.'
      },
      {
        stepNumber: 2,
        title: 'Choosing a Professional Email Address',
        content: 'Pick a clean username that combines your first and last name (e.g., john.doe@gmail.com, jdoe.skills@gmail.com). Avoid childish nicknames or numbers like soccerstar99@.',
        keyTip: 'Your email address is often your first impression on resumes and business contacts.'
      },
      {
        stepNumber: 3,
        title: 'Setting a Strong Password and Recovery Phone',
        content: 'Enter a strong passphrase with letters, numbers, and symbols. Enter your real mobile phone number as the recovery method so you can easily reset your account if you ever forget your password.',
        keyTip: 'Write down your password in a private notebook kept in a safe place until you have it memorized.'
      },
      {
        stepNumber: 4,
        title: 'Composing Your First Email',
        content: 'Click "Compose". Fill in the recipient\'s address in the "To" field. Type a clear subject line summarizing the purpose in 3 to 6 words. Write a polite greeting, your message, and a sign-off with your name.',
        keyTip: 'Always attach files by clicking the paperclip icon before hitting Send.'
      }
    ]
  },
  {
    id: 'tut-6',
    title: 'How to Stay Safe Online & Avoid Scams',
    slug: 'how-to-stay-safe-online',
    icon: 'ShieldCheck',
    short_description: 'Practical cybersecurity defenses for everyday internet users: passwords, scam detection, public Wi-Fi safety, and updates.',
    level: 'Beginner',
    read_time: '8 min',
    status: 'published',
    created_at: '2026-03-22T15:00:00.000Z',
    updated_at: '2026-03-22T15:00:00.000Z',
    steps: [
      {
        stepNumber: 1,
        title: 'Look for HTTPS and the Padlock Icon',
        content: 'Before typing any personal information or credit card numbers into a website, check the URL bar. It should begin with "https://" which means your communication with that server is encrypted.',
        keyTip: 'Never enter banking credentials on a website that says "Not Secure".'
      },
      {
        stepNumber: 2,
        title: 'Recognizing Social Engineering and Urgency',
        content: 'Scammers frequently pretend to be government agencies (like the IRS or tax authority) or tech support claiming your computer has viruses. Real government bodies communicate via postal mail, not phone calls demanding gift cards.',
        keyTip: 'If anyone asks you to pay via iTunes gift cards, Bitcoin, or wire transfer for an emergency, it is a scam.'
      },
      {
        stepNumber: 3,
        title: 'Keep Your Software Updated',
        content: 'Software updates contain vital security patches that protect against recently discovered vulnerabilities. Turn on automatic updates for Windows, macOS, your web browser, and your smartphone apps.',
        keyTip: 'Do not postpone system updates for months; install them regularly.'
      },
      {
        stepNumber: 4,
        title: 'Safe Practices on Public Wi-Fi Networks',
        content: 'Public Wi-Fi at coffee shops, airports, and hotels is unencrypted. Anyone on the same network could potentially intercept traffic. Avoid logging into bank accounts on public Wi-Fi, or use your phone\'s cellular hotspot instead.',
        keyTip: 'Turn off "Auto-connect to open networks" in your Wi-Fi settings.'
      }
    ]
  },
  {
    id: 'tut-7',
    title: 'How to Use Digital Productivity & Cloud Tools',
    slug: 'how-to-use-digital-tools',
    icon: 'Cloud',
    short_description: 'Get started with Google Drive, cloud backups, collaborative folders, and calendar scheduling to boost your daily workflow.',
    level: 'Beginner',
    read_time: '10 min',
    status: 'published',
    created_at: '2026-03-25T16:00:00.000Z',
    updated_at: '2026-03-25T16:00:00.000Z',
    steps: [
      {
        stepNumber: 1,
        title: 'What Is "The Cloud"?',
        content: 'The "cloud" simply means storing your files and data on secure remote servers managed by trusted companies (like Google or Microsoft), rather than strictly on your computer\'s local hard drive.',
        keyTip: 'If your computer is lost or breaks, cloud files remain 100% safe and accessible from any phone or other laptop.'
      },
      {
        stepNumber: 2,
        title: 'Navigating Google Drive or OneDrive',
        content: 'Visit drive.google.com. Click the "+ New" button to upload documents, create folders, or start new Docs and Sheets. You can access your files from anywhere with an internet connection.',
        keyTip: 'You get 15 GB of free cloud storage with every free Google account.'
      },
      {
        stepNumber: 3,
        title: 'Sharing Files With Teammates and Classmates',
        content: 'Right-click any file in Google Drive and select "Share". Type the email address of the person you want to collaborate with. Choose whether they can "View" only or "Edit" the document.',
        keyTip: 'You can change or revoke sharing permissions at any time with a single click.'
      },
      {
        stepNumber: 4,
        title: 'Mastering Digital Calendar Scheduling',
        content: 'Use Google Calendar or Outlook Calendar to organize your day. Create color-coded events for classes, meetings, and personal goals. Set reminders 15 minutes before appointments so you are never late.',
        keyTip: 'Add video meeting links (like Google Meet or Zoom) to calendar invitations with one click.'
      }
    ]
  }
];

export const initialPageContent: PageContent = {
  heroHeading: 'Learn Digital Skills. Build Your Future.',
  heroSubtext: 'Welcome to Shikuran Skills, a practical digital-learning platform helping beginners, students, professionals, and everyday technology users develop useful digital skills for school, work, business, and everyday life.',
  welcomeHeading: 'Welcome to Shikuran Skills',
  welcomeText: 'Technology is becoming increasingly important in education, employment, business, communication, and everyday life. At Shikuran Skills, we believe anyone can learn to use digital tools with confidence. Our tutorials, guides, and articles break down complex technology into clear, everyday steps that anyone can follow without technical jargon.',
  aboutStory: 'Shikuran Skills was founded with a clear, inspiring mission: to make practical technology and digital literacy accessible to everyone, everywhere. Too often, technology tutorials are packed with confusing jargon and assume prior computer experience. We built Shikuran Skills to be the warm, welcoming, and empowering classroom you have always wanted. Whether you are a student preparing for college, a worker aiming for promotion, a business owner modernizing operations, or someone using a computer for the first time, you belong here.',
  missionText: 'To empower everyday learners with practical, beginner-friendly digital skills and technological confidence, unlocking greater career opportunities, academic success, and digital independence.',
  visionText: 'A world where no one is left behind by rapid technological change, and where digital literacy is an accessible bridge to personal advancement for everyone.',
  contactEmail: 'contact@shikurandigital.com',
  contactPhonePlaceholder: '+1 (555) 019-2834',
  contactAddressPlaceholder: 'Shikuran Digital Learning Center, Global Online Campus',
  tiktokHandle: '@shikuranskills',
  formspreeId: ''
};

export const initialComments: Comment[] = [
  {
    id: 'comm-1',
    post_id: 'post-1',
    post_title: 'Why Everyone Should Learn Digital Skills',
    name: 'Sarah Mwangi',
    email: 'sarah.m@example.com',
    content: 'This article was so encouraging! I have been terrified of computers for years, but the way you explained that we cannot easily break the machine gave me so much peace of mind. Starting my first tutorial today!',
    status: 'approved',
    created_at: '2026-03-16T14:30:00.000Z'
  },
  {
    id: 'comm-2',
    post_id: 'post-1',
    post_title: 'Why Everyone Should Learn Digital Skills',
    name: 'David Chen',
    email: 'david.chen@example.com',
    content: 'Spot on about the remote work opportunities. Learning basic spreadsheets and email communication allowed me to land my first virtual assistant job last month. Keep up the amazing work Shikuran Skills!',
    status: 'approved',
    created_at: '2026-03-17T18:10:00.000Z'
  }
];

class DatabaseManager {
  private db: DatabaseSchema | null = null;
  private isSaving = false;

  async init(): Promise<DatabaseSchema> {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      const raw = await fs.readFile(DB_FILE, 'utf-8');
      this.db = JSON.parse(raw);
      // Ensure schema completeness
      if (!this.db!.inquiries) this.db!.inquiries = [];
      if (!this.db!.pageContent) this.db!.pageContent = initialPageContent;
      return this.db!;
    } catch {
      // Initialize seed data
      const defaultAdmin: AdminUser = {
        id: 'admin-1',
        username: 'admin',
        passwordHash: DEFAULT_ADMIN_HASH,
        updated_at: new Date().toISOString()
      };

      this.db = {
        admin: defaultAdmin,
        posts: initialPosts,
        categories: initialCategories,
        tutorials: initialTutorials,
        comments: initialComments,
        pageContent: initialPageContent,
        inquiries: []
      };

      await this.save();
      return this.db;
    }
  }

  async getDb(): Promise<DatabaseSchema> {
    if (!this.db) {
      await this.init();
    }
    return this.db!;
  }

  async save(): Promise<void> {
    if (!this.db) return;
    if (this.isSaving) {
      // brief pause to avoid collisions
      await new Promise(r => setTimeout(r, 50));
    }
    this.isSaving = true;
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      const tmpFile = `${DB_FILE}.tmp.${Date.now()}`;
      await fs.writeFile(tmpFile, JSON.stringify(this.db, null, 2), 'utf-8');
      await fs.rename(tmpFile, DB_FILE);
    } finally {
      this.isSaving = false;
    }
  }

  // --- BLOG POSTS ---
  async getPosts(includeDrafts = false): Promise<BlogPost[]> {
    const db = await this.getDb();
    if (includeDrafts) {
      return [...db.posts].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    return db.posts
      .filter(p => p.status === 'published')
      .sort((a, b) => new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime());
  }

  async getPostBySlugOrId(identifier: string): Promise<BlogPost | null> {
    const db = await this.getDb();
    return db.posts.find(p => p.slug === identifier || p.id === identifier) || null;
  }

  async createPost(data: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>): Promise<BlogPost> {
    const db = await this.getDb();
    const id = `post-${Date.now()}`;
    const now = new Date().toISOString();
    const newPost: BlogPost = {
      ...data,
      id,
      created_at: now,
      updated_at: now,
      published_at: data.status === 'published' ? (data.published_at || now) : ''
    };
    db.posts.unshift(newPost);
    await this.save();
    return newPost;
  }

  async updatePost(id: string, updates: Partial<BlogPost>): Promise<BlogPost | null> {
    const db = await this.getDb();
    const index = db.posts.findIndex(p => p.id === id);
    if (index === -1) return null;

    const existing = db.posts[index];
    const now = new Date().toISOString();

    let published_at = existing.published_at;
    if (updates.status === 'published' && (!existing.published_at || existing.status === 'draft')) {
      published_at = updates.published_at || now;
    }

    const updated: BlogPost = {
      ...existing,
      ...updates,
      id: existing.id,
      published_at,
      updated_at: now
    };

    db.posts[index] = updated;
    await this.save();
    return updated;
  }

  async deletePost(id: string): Promise<boolean> {
    const db = await this.getDb();
    const initLen = db.posts.length;
    db.posts = db.posts.filter(p => p.id !== id);
    if (db.posts.length !== initLen) {
      // Also delete associated comments
      db.comments = db.comments.filter(c => c.post_id !== id);
      await this.save();
      return true;
    }
    return false;
  }

  // --- CATEGORIES ---
  async getCategories(): Promise<Category[]> {
    const db = await this.getDb();
    return db.categories;
  }

  async createCategory(name: string, description: string): Promise<Category> {
    const db = await this.getDb();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name,
      slug,
      description
    };
    db.categories.push(newCat);
    await this.save();
    return newCat;
  }

  async updateCategory(id: string, name: string, description: string): Promise<Category | null> {
    const db = await this.getDb();
    const cat = db.categories.find(c => c.id === id);
    if (!cat) return null;
    cat.name = name;
    cat.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    cat.description = description;
    await this.save();
    return cat;
  }

  async deleteCategory(id: string): Promise<boolean> {
    const db = await this.getDb();
    const initialLen = db.categories.length;
    db.categories = db.categories.filter(c => c.id !== id);
    if (db.categories.length !== initialLen) {
      await this.save();
      return true;
    }
    return false;
  }

  // --- TUTORIALS ---
  async getTutorials(includeDrafts = false): Promise<Tutorial[]> {
    const db = await this.getDb();
    if (includeDrafts) {
      return [...db.tutorials].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    return db.tutorials.filter(t => t.status === 'published');
  }

  async getTutorialBySlugOrId(identifier: string): Promise<Tutorial | null> {
    const db = await this.getDb();
    return db.tutorials.find(t => t.slug === identifier || t.id === identifier) || null;
  }

  async createTutorial(data: Omit<Tutorial, 'id' | 'created_at' | 'updated_at'>): Promise<Tutorial> {
    const db = await this.getDb();
    const id = `tut-${Date.now()}`;
    const now = new Date().toISOString();
    const newTutorial: Tutorial = {
      ...data,
      id,
      created_at: now,
      updated_at: now
    };
    db.tutorials.push(newTutorial);
    await this.save();
    return newTutorial;
  }

  async updateTutorial(id: string, updates: Partial<Tutorial>): Promise<Tutorial | null> {
    const db = await this.getDb();
    const index = db.tutorials.findIndex(t => t.id === id);
    if (index === -1) return null;

    const existing = db.tutorials[index];
    const updated: Tutorial = {
      ...existing,
      ...updates,
      id: existing.id,
      updated_at: new Date().toISOString()
    };
    db.tutorials[index] = updated;
    await this.save();
    return updated;
  }

  async deleteTutorial(id: string): Promise<boolean> {
    const db = await this.getDb();
    const initLen = db.tutorials.length;
    db.tutorials = db.tutorials.filter(t => t.id !== id);
    if (db.tutorials.length !== initLen) {
      await this.save();
      return true;
    }
    return false;
  }

  // --- COMMENTS ---
  async getComments(postId?: string, includeUnapproved = false): Promise<Comment[]> {
    const db = await this.getDb();
    let comments = db.comments;
    if (postId) {
      comments = comments.filter(c => c.post_id === postId);
    }
    if (!includeUnapproved) {
      comments = comments.filter(c => c.status === 'approved');
    }
    return [...comments].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  async addComment(data: Omit<Comment, 'id' | 'created_at' | 'status'>): Promise<Comment> {
    const db = await this.getDb();
    const newComment: Comment = {
      ...data,
      id: `comm-${Date.now()}`,
      status: 'approved', // Auto-approved for friendly community participation, admin can hide/delete
      created_at: new Date().toISOString()
    };
    db.comments.push(newComment);
    await this.save();
    return newComment;
  }

  async updateCommentStatus(id: string, status: 'approved' | 'hidden' | 'pending'): Promise<boolean> {
    const db = await this.getDb();
    const comm = db.comments.find(c => c.id === id);
    if (!comm) return false;
    comm.status = status;
    await this.save();
    return true;
  }

  async deleteComment(id: string): Promise<boolean> {
    const db = await this.getDb();
    const initLen = db.comments.length;
    db.comments = db.comments.filter(c => c.id !== id);
    if (db.comments.length !== initLen) {
      await this.save();
      return true;
    }
    return false;
  }

  // --- PAGE CONTENT ---
  async getPageContent(): Promise<PageContent> {
    const db = await this.getDb();
    return db.pageContent || initialPageContent;
  }

  async updatePageContent(content: Partial<PageContent>): Promise<PageContent> {
    const db = await this.getDb();
    db.pageContent = {
      ...(db.pageContent || initialPageContent),
      ...content
    };
    await this.save();
    return db.pageContent;
  }

  // --- CONTACT INQUIRIES ---
  async addInquiry(name: string, email: string, message: string): Promise<ContactInquiry> {
    const db = await this.getDb();
    const newInquiry: ContactInquiry = {
      id: `inq-${Date.now()}`,
      name,
      email,
      message,
      created_at: new Date().toISOString(),
      read: false
    };
    if (!db.inquiries) db.inquiries = [];
    db.inquiries.unshift(newInquiry);
    await this.save();
    return newInquiry;
  }

  async getInquiries(): Promise<ContactInquiry[]> {
    const db = await this.getDb();
    return db.inquiries || [];
  }

  async markInquiryRead(id: string): Promise<boolean> {
    const db = await this.getDb();
    const inq = (db.inquiries || []).find(i => i.id === id);
    if (inq) {
      inq.read = true;
      await this.save();
      return true;
    }
    return false;
  }

  async deleteInquiry(id: string): Promise<boolean> {
    const db = await this.getDb();
    if (!db.inquiries) return false;
    const len = db.inquiries.length;
    db.inquiries = db.inquiries.filter(i => i.id !== id);
    if (db.inquiries.length !== len) {
      await this.save();
      return true;
    }
    return false;
  }

  // --- ADMIN CREDENTIALS ---
  async getAdmin(): Promise<AdminUser> {
    const db = await this.getDb();
    return db.admin;
  }

  async updateAdminCredentials(newUsername?: string, newPassword?: string): Promise<boolean> {
    const db = await this.getDb();
    if (newUsername) {
      db.admin.username = newUsername.trim();
    }
    if (newPassword) {
      db.admin.passwordHash = await bcrypt.hash(newPassword, 10);
    }
    db.admin.updated_at = new Date().toISOString();
    await this.save();
    return true;
  }

  // --- BACKUP & RESTORE ---
  async exportBackup(): Promise<DatabaseSchema> {
    return this.getDb();
  }

  async importBackup(data: DatabaseSchema): Promise<boolean> {
    if (!data.posts || !data.categories || !data.tutorials) {
      throw new Error('Invalid database backup format.');
    }
    this.db = data;
    await this.save();
    return true;
  }
}

export const dbManager = new DatabaseManager();
