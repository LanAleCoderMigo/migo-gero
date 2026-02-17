import Markdown from "react-markdown"
import remarkBreaks from "remark-breaks"
import { cn } from "@/lib/utils"

export function AiText({
  children,
  className,
}: {
  children: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "ai-text text-sm leading-relaxed text-muted-foreground space-y-2",
        className
      )}
    >
      <Markdown
        remarkPlugins={[remarkBreaks]}
        components={{
          h1: ({ children }) => (
            <p className="text-sm font-bold text-card-foreground mt-4 mb-1.5">
              {children}
            </p>
          ),
          h2: ({ children }) => (
            <p className="text-sm font-bold text-card-foreground mt-4 mb-1.5">
              {children}
            </p>
          ),
          h3: ({ children }) => (
            <p className="text-sm font-semibold text-card-foreground mt-3 mb-1">
              {children}
            </p>
          ),
          p: ({ children }) => (
            <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
          ),
          strong: ({ children }) => (
            <span className="font-semibold text-card-foreground">
              {children}
            </span>
          ),
          em: ({ children }) => <span className="italic">{children}</span>,
          ul: ({ children }) => (
            <ul className="mb-3 ml-1 space-y-1.5">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-3 ml-1 space-y-1.5 list-none">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="flex items-start gap-2 pl-1">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
              <span className="leading-relaxed">{children}</span>
            </li>
          ),
          code: ({ children }) => (
            <span className="rounded bg-secondary/80 px-1.5 py-0.5 font-mono text-xs text-card-foreground">
              {children}
            </span>
          ),
          pre: ({ children }) => (
            <div className="my-3 rounded-lg bg-secondary/60 border border-border/40 p-3 text-xs font-mono overflow-x-auto">
              {children}
            </div>
          ),
          hr: () => <hr className="my-3 border-border/40" />,
          a: ({ children }) => (
            <span className="text-primary underline">{children}</span>
          ),
          blockquote: ({ children }) => (
            <div className="border-l-2 border-primary/40 pl-3 my-2 text-muted-foreground italic">
              {children}
            </div>
          ),
        }}
      >
        {children}
      </Markdown>
    </div>
  )
}
