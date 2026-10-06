import React, { useState, useRef } from 'react';
import { 
  Bold, Italic, Underline, Heading1, Heading2, Heading3, 
  List, ListOrdered, Quote, Link as LinkIcon, Image as ImageIcon, 
  Video, Eye, Code, Type, Undo, Redo 
} from 'lucide-react';
import { RichTextRenderer } from './RichTextRenderer.tsx';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder = 'Write your article here...' }) => {
  const [activeTab, setActiveTab] = useState<'visual' | 'code' | 'preview'>('visual');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  // Helper to insert formatting tags in code/textarea mode
  const insertTag = (startTag: string, endTag: string = '') => {
    if (activeTab === 'visual' && editorRef.current) {
      document.execCommand('formatBlock', false, startTag.replace(/[<>]/g, ''));
      handleVisualInput();
      return;
    }

    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    const replacement = `${startTag}${selectedText || 'Text'}${endTag}`;
    const newText = text.substring(0, start) + replacement + text.substring(end);

    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + startTag.length, start + replacement.length - endTag.length);
    }, 0);
  };

  const executeCommand = (command: string, value: string | undefined = undefined) => {
    if (activeTab === 'visual') {
      document.execCommand(command, false, value);
      handleVisualInput();
    } else {
      switch (command) {
        case 'bold':
          insertTag('<strong>', '</strong>');
          break;
        case 'italic':
          insertTag('<em>', '</em>');
          break;
        case 'underline':
          insertTag('<u>', '</u>');
          break;
        case 'insertUnorderedList':
          insertTag('\n<ul>\n  <li>', '</li>\n</ul>\n');
          break;
        case 'insertOrderedList':
          insertTag('\n<ol>\n  <li>', '</li>\n</ol>\n');
          break;
        case 'formatBlock':
          insertTag(`<${value}>`, `</${value}>`);
          break;
      }
    }
  };

  const handleVisualInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleAddLink = () => {
    const url = prompt('Enter the destination URL (e.g. https://example.com):', 'https://');
    if (!url) return;
    if (activeTab === 'visual') {
      document.execCommand('createLink', false, url);
      handleVisualInput();
    } else {
      const linkText = prompt('Enter link text:', 'click here') || url;
      insertTag(`<a href="${url}" target="_blank" rel="noopener noreferrer">${linkText}</a>`);
    }
  };

  const handleAddImage = () => {
    const url = prompt('Enter Image URL (Unsplash or direct image link):', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop');
    if (!url) return;
    const alt = prompt('Enter image description (Alt Text):', 'Digital skills guide graphic') || 'Article illustration';
    const imgHtml = `<figure class="my-6"><img src="${url}" alt="${alt}" class="rounded-xl w-full max-h-96 object-cover shadow-sm" /><figcaption class="text-xs text-center text-slate-500 mt-2">${alt}</figcaption></figure>`;

    if (activeTab === 'visual') {
      document.execCommand('insertHTML', false, imgHtml);
      handleVisualInput();
    } else {
      insertTag(imgHtml);
    }
  };

  const handleAddVideo = () => {
    const url = prompt('Enter YouTube or video embed URL (e.g. https://www.youtube.com/embed/dQw4w9WgXcQ):');
    if (!url) return;
    // format youtube embed if standard watch link
    let embedUrl = url;
    if (url.includes('youtube.com/watch?v=')) {
      const vidId = url.split('watch?v=')[1]?.split('&')[0];
      embedUrl = `https://www.youtube.com/embed/${vidId}`;
    } else if (url.includes('youtu.be/')) {
      const vidId = url.split('youtu.be/')[1]?.split('?')[0];
      embedUrl = `https://www.youtube.com/embed/${vidId}`;
    }

    const videoHtml = `
<div class="my-6 aspect-video rounded-xl overflow-hidden shadow-sm bg-slate-900">
  <iframe src="${embedUrl}" class="w-full h-full" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>
`;
    if (activeTab === 'visual') {
      document.execCommand('insertHTML', false, videoHtml);
      handleVisualInput();
    } else {
      insertTag(videoHtml);
    }
  };

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-1 p-2 bg-slate-50 border-b border-slate-200">
        <div className="flex flex-wrap items-center gap-1">
          {/* Headings */}
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => executeCommand('formatBlock', 'p')}
              title="Paragraph"
              className="p-1.5 text-slate-700 hover:bg-slate-100 rounded text-xs font-semibold flex items-center gap-0.5"
            >
              <Type className="w-3.5 h-3.5" /> P
            </button>
            <button
              type="button"
              onClick={() => executeCommand('formatBlock', 'h2')}
              title="Heading 2"
              className="p-1.5 text-slate-700 hover:bg-slate-100 rounded text-xs font-semibold flex items-center gap-0.5"
            >
              <Heading2 className="w-3.5 h-3.5" /> H2
            </button>
            <button
              type="button"
              onClick={() => executeCommand('formatBlock', 'h3')}
              title="Heading 3"
              className="p-1.5 text-slate-700 hover:bg-slate-100 rounded text-xs font-semibold flex items-center gap-0.5"
            >
              <Heading3 className="w-3.5 h-3.5" /> H3
            </button>
          </div>

          {/* Text Style */}
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => executeCommand('bold')}
              title="Bold (Ctrl+B)"
              className="p-1.5 text-slate-700 hover:bg-slate-100 rounded"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('italic')}
              title="Italic (Ctrl+I)"
              className="p-1.5 text-slate-700 hover:bg-slate-100 rounded"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('underline')}
              title="Underline (Ctrl+U)"
              className="p-1.5 text-slate-700 hover:bg-slate-100 rounded"
            >
              <Underline className="w-4 h-4" />
            </button>
          </div>

          {/* Lists & Quotes */}
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => executeCommand('insertUnorderedList')}
              title="Bullet List"
              className="p-1.5 text-slate-700 hover:bg-slate-100 rounded"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('insertOrderedList')}
              title="Numbered List"
              className="p-1.5 text-slate-700 hover:bg-slate-100 rounded"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('formatBlock', 'blockquote')}
              title="Quote block"
              className="p-1.5 text-slate-700 hover:bg-slate-100 rounded"
            >
              <Quote className="w-4 h-4" />
            </button>
          </div>

          {/* Media & Embeds */}
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5">
            <button
              type="button"
              onClick={handleAddLink}
              title="Insert Link"
              className="p-1.5 text-slate-700 hover:bg-slate-100 rounded"
            >
              <LinkIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleAddImage}
              title="Insert Image"
              className="p-1.5 text-slate-700 hover:bg-slate-100 rounded"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleAddVideo}
              title="Embed YouTube Video"
              className="p-1.5 text-slate-700 hover:bg-slate-100 rounded"
            >
              <Video className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* View Modes */}
        <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => setActiveTab('visual')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'visual' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Visual
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('code')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${
              activeTab === 'code' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code className="w-3.5 h-3.5" /> HTML
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${
              activeTab === 'preview' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Preview
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="p-4 min-h-[360px] max-h-[600px] overflow-y-auto">
        {activeTab === 'visual' && (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleVisualInput}
            dangerouslySetInnerHTML={{ __html: value }}
            className="outline-none min-h-[320px] prose max-w-none text-slate-800 leading-relaxed focus:outline-none"
            data-placeholder={placeholder}
          />
        )}

        {activeTab === 'code' && (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Write HTML or raw content here..."
            className="w-full h-80 font-mono text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white resize-y"
          />
        )}

        {activeTab === 'preview' && (
          <div className="bg-slate-50/50 p-6 rounded-xl border border-slate-100">
            <h4 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-4">Live Reader Preview</h4>
            <RichTextRenderer content={value || '<p className="text-slate-400 italic">No content written yet.</p>'} />
          </div>
        )}
      </div>
    </div>
  );
};
