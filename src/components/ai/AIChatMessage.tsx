import { Bot, Check, Download, ExternalLink, MessageCircle, Sparkles, User } from "lucide-react";
import type { ChatMessage } from "@/server/ai";
import { cn } from "@/lib/utils";

function renderFormattedText(text: string) {
  // Split into lines for basic markdown rendering (bold, italics, links, lists)
  const lines = text.split("\n");

  return lines.map((line, lineIdx) => {
    // Empty line creates spacing
    if (!line.trim()) {
      return <div key={lineIdx} className="h-2" />;
    }

    // Bullet point
    if (line.trim().startsWith("- ") || line.trim().startsWith("• ")) {
      const content = line.trim().slice(2);
      return (
        <div key={lineIdx} className="flex items-start gap-2 my-1">
          <span className="size-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
          <span className="text-sm leading-relaxed">{formatInline(content)}</span>
        </div>
      );
    }

    // Numbered list (e.g. 1. 2.)
    const numMatch = line.match(/^(\d+)\.\s+(.*)/);
    if (numMatch && numMatch[1] && numMatch[2]) {
      return (
        <div key={lineIdx} className="flex items-start gap-2 my-1">
          <span className="font-mono text-xs font-bold text-primary shrink-0 mt-0.5">
            {numMatch[1]}.
          </span>
          <span className="text-sm leading-relaxed">{formatInline(numMatch[2])}</span>
        </div>
      );
    }

    return (
      <p key={lineIdx} className="text-sm leading-relaxed my-1">
        {formatInline(line)}
      </p>
    );
  });
}

function formatInline(str: string) {
  // Regex parsing for bold **text**, links [text](url), and inline `code`
  const parts: React.ReactNode[] = [];
  let remaining = str;
  let key = 0;

  while (remaining.length > 0) {
    // Check for markdown link [text](url)
    const linkMatch = remaining.match(/\[(.*?)\]\((https?:\/\/[^\s)]+|\/[^\s)]+|mailto:[^\s)]+)\)/);
    // Check for bold **text**
    const boldMatch = remaining.match(/\*\*(.*?)\*\*/);
    // Check for inline `code`
    const codeMatch = remaining.match(/`([^`]+)`/);

    // Find closest match
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
            className="text-primary font-medium hover:underline inline-flex items-center gap-0.5"
          >
            <span>{linkMatch[1]}</span>
            {linkMatch[2]?.startsWith("http") ? (
              <ExternalLink className="size-3 inline-block ml-0.5 opacity-70" />
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
            className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs text-primary font-medium border border-border/60"
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

    // Sort by earliest match in string
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

export function AIChatMessage({
  message,
  onActionClick,
  onSuggestionClick,
}: {
  message: ChatMessage;
  onActionClick?: (action: NonNullable<ChatMessage["actions"]>[number]) => void;
  onSuggestionClick?: (suggestion: string) => void;
}) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 max-w-[92%] sm:max-w-[85%]",
        isUser ? "ml-auto flex-row-reverse" : "mr-auto",
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "size-7 sm:size-8 rounded-lg shrink-0 flex items-center justify-center font-mono text-xs shadow-xs",
          isUser
            ? "bg-secondary text-secondary-foreground border border-border"
            : "bg-primary text-primary-foreground font-bold",
        )}
      >
        {isUser ? <User className="size-3.5" /> : <Bot className="size-4" />}
      </div>

      {/* Message Bubble */}
      <div className="flex flex-col gap-1.5 min-w-0">
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm shadow-xs",
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-xs"
              : "bg-card border border-border text-card-foreground rounded-tl-xs",
          )}
        >
          {isUser ? (
            <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="space-y-1 text-foreground">{renderFormattedText(message.content)}</div>
          )}
        </div>

        {/* Action Buttons if provided */}
        {!isUser && message.actions && message.actions.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {message.actions.map((act, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onActionClick?.(act)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 font-mono text-xs font-medium text-primary transition-all hover:bg-primary/20 active:scale-95 cursor-pointer"
              >
                <span>{act.label}</span>
              </button>
            ))}
          </div>
        ) : null}

        {/* Suggestions chips */}
        {!isUser && message.suggestions && message.suggestions.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {message.suggestions.map((sug, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onSuggestionClick?.(sug)}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/80 px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:bg-secondary hover:text-foreground active:scale-95 cursor-pointer"
              >
                <Sparkles className="size-2.5 text-primary shrink-0" />
                <span>{sug}</span>
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
