
import React from 'react';
import DOMPurify from 'dompurify';
import { cn } from '@/lib/utils';

interface SafeHtmlRendererProps {
  html: string;
  className?: string;
}

export const SafeHtmlRenderer: React.FC<SafeHtmlRendererProps> = ({ 
  html, 
  className 
}) => {
  // Configure DOMPurify to allow specific tags and attributes
  const cleanHtml = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'h1', 'h2', 'h3', 
      'ul', 'ol', 'li', 'a', 'div', 'span'
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'style'],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  });

  return (
    <div 
      className={cn(
        "prose prose-invert max-w-none",
        "prose-headings:text-warcrow-gold prose-headings:font-semibold",
        "prose-p:text-warcrow-text prose-p:leading-relaxed prose-p:mb-4",
        "prose-strong:text-warcrow-text prose-strong:font-semibold",
        "prose-em:text-warcrow-text",
        "prose-ul:text-warcrow-text prose-ol:text-warcrow-text",
        "prose-li:text-warcrow-text prose-li:mb-1",
        "prose-a:text-warcrow-gold prose-a:no-underline hover:prose-a:underline",
        "[&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        className
      )}
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
};
