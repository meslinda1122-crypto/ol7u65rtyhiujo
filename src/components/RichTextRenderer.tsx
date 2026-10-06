import React from 'react';

interface RichTextRendererProps {
  content: string;
  className?: string;
}

export const RichTextRenderer: React.FC<RichTextRendererProps> = ({ content, className = '' }) => {
  // If the content is simple text or HTML, render cleanly
  return (
    <div
      className={`prose max-w-none text-slate-700 leading-relaxed 
        [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-slate-900 [&>h2]:mt-10 [&>h2]:mb-4 [&>h2]:tracking-tight
        [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:text-slate-900 [&>h3]:mt-8 [&>h3]:mb-3
        [&>p]:text-base [&>p]:leading-7 [&>p]:mb-5 [&>p]:text-slate-700
        [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul]:space-y-2
        [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6 [&>ol]:space-y-2
        [&>li]:text-slate-700 [&>li]:leading-7
        [&>blockquote]:border-l-4 [&>blockquote]:border-blue-600 [&>blockquote]:pl-4 [&>blockquote]:py-1 [&>blockquote]:my-6 [&>blockquote]:italic [&>blockquote]:text-slate-800 [&>blockquote]:bg-blue-50/50 [&>blockquote]:rounded-r-md
        [&>pre]:bg-slate-900 [&>pre]:text-slate-100 [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>pre]:my-6 [&>pre]:text-sm [&>pre]:font-mono
        [&>code]:bg-slate-100 [&>code]:text-blue-700 [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-sm [&>code]:font-mono
        [&>img]:rounded-xl [&>img]:my-6 [&>img]:w-full [&>img]:object-cover [&>img]:shadow-sm
        [&>a]:text-blue-600 [&>a]:underline [&>a]:underline-offset-2 [&>a]:hover:text-blue-800
        ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};
