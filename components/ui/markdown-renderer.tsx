'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CodeBlock } from './code-block';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  const parseMarkdown = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let currentList: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];
    let codeBlockLanguage = '';

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="list-disc list-inside space-y-1 my-3 ml-4">
            {currentList}
          </ul>
        );
        currentList = [];
      }
    };

    const flushCodeBlock = () => {
      if (codeBlockContent.length > 0) {
        elements.push(
          <CodeBlock
            key={`code-${elements.length}`}
            code={codeBlockContent.join('\n')}
            language={codeBlockLanguage || undefined}
          />
        );
        codeBlockContent = [];
        codeBlockLanguage = '';
      }
    };

    lines.forEach((line, index) => {
      // Handle code blocks
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          flushCodeBlock();
          inCodeBlock = false;
        } else {
          flushList();
          inCodeBlock = true;
          codeBlockLanguage = line.slice(3).trim();
        }
        return;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        return;
      }

      // Handle empty lines
      if (line.trim() === '') {
        flushList();
        if (elements.length > 0) {
          elements.push(<div key={`space-${elements.length}`} className="h-2" />);
        }
        return;
      }

      // Handle headers
      if (line.startsWith('# ')) {
        flushList();
        elements.push(
          <h1 key={`h1-${elements.length}`} className="text-heading-lg font-bold my-4">
            {parseInlineMarkdown(line.slice(2))}
          </h1>
        );
        return;
      }

      if (line.startsWith('## ')) {
        flushList();
        elements.push(
          <h2 key={`h2-${elements.length}`} className="text-heading-md font-semibold my-3">
            {parseInlineMarkdown(line.slice(3))}
          </h2>
        );
        return;
      }

      if (line.startsWith('### ')) {
        flushList();
        elements.push(
          <h3 key={`h3-${elements.length}`} className="text-body-lg font-semibold my-2">
            {parseInlineMarkdown(line.slice(4))}
          </h3>
        );
        return;
      }

      // Handle horizontal rules
      if (line.trim() === '---' || line.trim() === '***') {
        flushList();
        elements.push(<Separator key={`hr-${elements.length}`} className="my-4" />);
        return;
      }

      // Handle list items
      if (line.match(/^[\s]*[•\-\*]\s/)) {
        const content = line.replace(/^[\s]*[•\-\*]\s/, '');
        currentList.push(
          <li key={`li-${elements.length}-${currentList.length}`} className="text-body-md">
            {parseInlineMarkdown(content)}
          </li>
        );
        return;
      }

      // Handle numbered lists
      if (line.match(/^[\s]*\d+\.\s/)) {
        flushList();
        const content = line.replace(/^[\s]*\d+\.\s/, '');
        elements.push(
          <ol key={`ol-${elements.length}`} className="list-decimal list-inside space-y-1 my-3 ml-4">
            <li className="text-body-md">{parseInlineMarkdown(content)}</li>
          </ol>
        );
        return;
      }

      // Handle blockquotes
      if (line.startsWith('> ')) {
        flushList();
        elements.push(
          <blockquote key={`quote-${elements.length}`} className="border-l-4 border-primary pl-4 my-3 italic text-muted-foreground">
            {parseInlineMarkdown(line.slice(2))}
          </blockquote>
        );
        return;
      }

      // Handle regular paragraphs
      flushList();
      elements.push(
        <p key={`p-${elements.length}`} className="text-body-md my-2 leading-relaxed">
          {parseInlineMarkdown(line)}
        </p>
      );
    });

    // Flush any remaining items
    flushList();
    flushCodeBlock();

    return elements;
  };

  const parseInlineMarkdown = (text: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    let currentText = text;
    let key = 0;

    // Handle inline code first
    currentText = currentText.replace(/`([^`]+)`/g, (match, code) => {
      const placeholder = `__INLINE_CODE_${key}__`;
      parts.push(
        <Badge key={`code-${key}`} variant="secondary" className="font-mono text-xs mx-1">
          {code}
        </Badge>
      );
      key++;
      return placeholder;
    });

    // Handle bold text
    currentText = currentText.replace(/\*\*([^*]+)\*\*/g, (match, bold) => {
      const placeholder = `__BOLD_${key}__`;
      parts.push(
        <strong key={`bold-${key}`} className="font-semibold">
          {bold}
        </strong>
      );
      key++;
      return placeholder;
    });

    // Handle italic text
    currentText = currentText.replace(/\*([^*]+)\*/g, (match, italic) => {
      const placeholder = `__ITALIC_${key}__`;
      parts.push(
        <em key={`italic-${key}`} className="italic">
          {italic}
        </em>
      );
      key++;
      return placeholder;
    });

    // Handle links
    currentText = currentText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
      const placeholder = `__LINK_${key}__`;
      parts.push(
        <a
          key={`link-${key}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-primary/80 underline"
        >
          {text}
        </a>
      );
      key++;
      return placeholder;
    });

    // Split by placeholders and reconstruct
    const tokens = currentText.split(/(__[A-Z_]+_\d+__)/);
    const result: React.ReactNode[] = [];

    tokens.forEach((token, index) => {
      if (token.startsWith('__') && token.endsWith('__')) {
        // Find the corresponding component
        const matchingPart = parts.find((part: any) => 
          part.key && token.includes(part.key.split('-')[1])
        );
        if (matchingPart) {
          result.push(matchingPart);
        }
      } else if (token) {
        result.push(token);
      }
    });

    return result.length > 0 ? result : text;
  };

  return (
    <div className={`markdown-content ${className}`}>
      {parseMarkdown(content)}
    </div>
  );
};