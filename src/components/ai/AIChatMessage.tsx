import { useState } from "react";
import {
  ArrowUpRight,
  Bot,
  Check,
  Code2,
  Copy,
  ExternalLink,
  FileText,
  Mail,
  MessageCircle,
  Rocket,
  Sparkles,
  User,
} from "lucide-react";

import type { ChatAction, ChatMessage } from "@/server/ai";
import { cn } from "@/lib/utils";

function CodeBlock({ code, language }: { code: string; language?: string | undefined }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard error
    }
  };

  return (
    <div className="relative my-2.5 overflow-hidden rounded-xl border border-border/80 bg-surface/90 font-mono text-xs shadow-xs">
      <div className="flex items-center justify-between border-b border-border/60 bg-muted/40 px-3 py-1.5 text-[11px] text-muted-foreground">
        <span className="font-medium text-foreground/80 uppercase">{language || "code"}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="size-3 text-emerald-500" />
              <span className="text-emerald-500 text-[10px]">Copied</span>
            </>
          ) : (
            <>
              <Copy className="size-3" />
              <span className="text-[10px]">Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-3 text-xs leading-relaxed text-foreground">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function formatInline(str: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let remaining = str;
  let key = 0;

  while (remaining.length > 0) {
    // Markdown link [text](url)
    const linkMatch = remaining.match(/\[(.*?)\]\((https?:\/\/[^\s)]+|\/[^\s)]+|mailto:[^\s)]+)\)/);
    // Bold **text**
    const boldMatch = remaining.match(/\*\*(.*?)\*\*/);
    // Inline `code`
    const codeMatch = remaining.match(/`([^`]+)`/);

    type MatchInfo = { index: number; length: number; render: () => React.ReactNode };
    const matches: MatchInfo[] = [];

    if (linkMatch && linkMatch.index !== undefined) {
      matches.push({
        index: linkMatch.index,
        length: linkMatch[0].length,
        render: () => (
          <a
            key={key++}
            href={linkMatch[2]}
            target={linkMatch[2]?.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="inline-flex items-center gap-0.5 font-medium text-primary hover:underline underline-offset-2 transition-colors"
          >
            <span>{linkMatch[1]}</span>
            {linkMatch[2]?.startsWith("http") ? (
              <ExternalLink className="size-2.5 inline-block ml-0.5 opacity-70" />
            ) : null}
          </a>
        ),
      });
    }

    if (boldMatch && boldMatch.index !== undefined) {
      matches.push({
        index: boldMatch.index,
        length: boldMatch[0].length,
        render: () => (
          <strong key={key++} className="font-semibold text-foreground">
            {boldMatch[1]}
          </strong>
        ),
      });
    }

    if (codeMatch && codeMatch.index !== undefined) {
      matches.push({
        index: codeMatch.index,
        length: codeMatch[0].length,
        render: () => (
          <code
            key={key++}
            className="rounded-md border border-border/70 bg-muted/70 px-1.5 py-0.5 font-mono text-[11px] font-medium text-primary"
          >
            {codeMatch[1]}
          </code>
        ),
      });
    }

    if (matches.length === 0) {
      parts.push(remaining);
      break;
    }

    matches.sort((a, b) => a.index - b.index);
    const earliest = matches[0]!;

    if (earliest.index > 0) {
      parts.push(remaining.slice(0, earliest.index));
    }

    parts.push(earliest.render());
    remaining = remaining.slice(earliest.index + earliest.length);
  }

  return parts;
}

function renderFormattedMarkdown(text: string, isStreaming?: boolean) {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const segments: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push(renderTextLines(text.slice(lastIndex, match.index)));
    }
    const language = match[1];
    const code = match[2]?.trim() || "";
    segments.push(<CodeBlock key={match.index} code={code} language={language} />);
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    segments.push(renderTextLines(text.slice(lastIndex), isStreaming));
  } else if (isStreaming) {
    segments.push(
      <span
        key="typing-cursor"
        className="inline-block size-2 rounded-full bg-primary animate-ping ml-1 align-middle"
        aria-hidden="true"
      />,
    );
  }

  return segments;
}

function renderTextLines(rawText: string, isStreaming?: boolean) {
  const lines = rawText.split("\n");

  return lines.map((line, lineIdx) => {
    const trimmed = line.trim();
    const isLastLine = lineIdx === lines.length - 1;

    if (!trimmed) {
      return <div key={lineIdx} className="h-1.5" />;
    }

    // Headings (###, ##, #)
    if (trimmed.startsWith("### ")) {
      return (
        <h4
          key={lineIdx}
          className="font-display text-xs sm:text-sm font-bold text-foreground mt-2.5 mb-1 flex items-center gap-1.5"
        >
          <span className="size-1.5 rounded-full bg-primary shrink-0" />
          <span>{formatInline(trimmed.slice(4))}</span>
        </h4>
      );
    }
    if (trimmed.startsWith("## ") || trimmed.startsWith("# ")) {
      const headingText = trimmed.replace(/^#+\s*/, "");
      return (
        <h3
          key={lineIdx}
          className="font-display text-sm font-bold text-foreground mt-2.5 mb-1 border-b border-border/40 pb-1"
        >
          {formatInline(headingText)}
        </h3>
      );
    }

    // Bullet points
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ") || trimmed.startsWith("• ")) {
      const bulletText = trimmed.slice(2);
      return (
        <div
          key={lineIdx}
          className="flex items-start gap-2 my-1 text-xs sm:text-sm leading-relaxed"
        >
          <span className="size-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
          <span className="flex-1">
            {formatInline(bulletText)}
            {isStreaming && isLastLine ? (
              <span className="inline-block w-1.5 h-3.5 bg-primary animate-pulse ml-0.5 align-middle rounded-xs" />
            ) : null}
          </span>
        </div>
      );
    }

    // Numbered list
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (numMatch && numMatch[1] && numMatch[2]) {
      return (
        <div
          key={lineIdx}
          className="flex items-start gap-2 my-1 text-xs sm:text-sm leading-relaxed"
        >
          <span className="font-mono text-[11px] font-bold text-primary shrink-0 mt-0.5 bg-primary/10 size-4 rounded-full flex items-center justify-center">
            {numMatch[1]}
          </span>
          <span className="flex-1">
            {formatInline(numMatch[2])}
            {isStreaming && isLastLine ? (
              <span className="inline-block w-1.5 h-3.5 bg-primary animate-pulse ml-0.5 align-middle rounded-xs" />
            ) : null}
          </span>
        </div>
      );
    }

    return (
      <p key={lineIdx} className="text-xs sm:text-sm leading-relaxed my-1 text-foreground/90">
        {formatInline(line)}
        {isStreaming && isLastLine ? (
          <span className="inline-block w-1.5 h-3.5 bg-primary animate-pulse ml-0.5 align-middle rounded-xs" />
        ) : null}
      </p>
    );
  });
}

function getActionIcon(action?: string) {
  switch (action) {
    case "resume":
      return <FileText className="size-3.5 text-amber-500" />;
    case "projects":
      return <Rocket className="size-3.5 text-sky-500" />;
    case "whatsapp":
      return <MessageCircle className="size-3.5 text-emerald-500" />;
    case "dsa":
      return <Code2 className="size-3.5 text-indigo-500" />;
    case "email":
      return <Mail className="size-3.5 text-rose-500" />;
    default:
      return <ArrowUpRight className="size-3.5 text-primary" />;
  }
}

export function AIChatMessage({
  message,
  isStreaming,
  onActionClick,
  onSuggestionClick,
}: {
  message: ChatMessage;
  isStreaming?: boolean;
  onActionClick?: (action: ChatAction) => void;
  onSuggestionClick?: (suggestion: string) => void;
}) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end w-full animate-in fade-in-50 slide-in-from-bottom-1">
        <div className="max-w-[85%] sm:max-w-[78%] rounded-2xl rounded-tr-xs bg-primary text-primary-foreground px-4 py-2.5 text-xs sm:text-sm font-medium shadow-xs">
          <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-1.5 animate-in fade-in-50 slide-in-from-bottom-1">
      {/* Full-width Assistant Card */}
      <div className="w-full rounded-2xl rounded-tl-xs border border-border/80 bg-card/95 px-4 py-3 text-xs sm:text-sm text-card-foreground backdrop-blur-md shadow-soft">
        {/* Subtle internal header badge */}
        <div className="flex items-center gap-1.5 text-[11px] font-mono font-medium text-primary mb-2 border-b border-border/50 pb-1.5">
          <Bot className="size-3.5" />
          <span>Ask Gopal</span>
        </div>

        {/* Message body with full width available */}
        <div className="space-y-0.5">{renderFormattedMarkdown(message.content, isStreaming)}</div>
      </div>

      {/* Action Buttons (Resume, WhatsApp, Projects) */}
      {message.actions && message.actions.length > 0 && !isStreaming ? (
        <div className="flex flex-wrap gap-1.5 mt-0.5">
          {message.actions.map((act, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onActionClick?.(act)}
              className="group inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-surface/90 px-3 py-1.5 font-mono text-xs font-medium text-foreground shadow-2xs backdrop-blur-sm transition-all duration-200 hover:border-primary/50 hover:bg-primary/10 hover:text-primary active:scale-95 cursor-pointer"
            >
              {getActionIcon(act.action)}
              <span>{act.label}</span>
            </button>
          ))}
        </div>
      ) : null}

      {/* Suggestion Chips */}
      {message.suggestions && message.suggestions.length > 0 && !isStreaming ? (
        <div className="flex flex-wrap gap-1.5 mt-1">
          {message.suggestions.map((sug, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onSuggestionClick?.(sug)}
              className="group inline-flex items-center gap-1 rounded-full border border-border/70 bg-secondary/70 px-2.5 py-1 text-[11px] text-muted-foreground transition-all duration-200 hover:border-primary/40 hover:bg-secondary hover:text-foreground active:scale-95 cursor-pointer text-left"
            >
              <Sparkles className="size-2.5 text-primary shrink-0 transition-transform group-hover:scale-110" />
              <span>{sug}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
