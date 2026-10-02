import type { Components, ExtraProps } from "react-markdown";
import Markdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

function withoutNode<Props extends object>(
  props: Props & ExtraProps,
): Omit<Props, "node"> {
  const copy = { ...props } as Record<string, unknown>;
  delete copy.node;
  return copy as Omit<Props, "node">;
}

function hastText(node: unknown): string {
  if (!node || typeof node !== "object") return "";
  const { type, value, children } = node as {
    type?: string;
    value?: string;
    children?: unknown[];
  };
  if (type === "text") return typeof value === "string" ? value : "";
  if (Array.isArray(children)) return children.map(hastText).join("");
  return "";
}

const components: Components = {
  h1: (props) => (
    <h1
      className="text-base font-semibold tracking-tight first:mt-0"
      {...withoutNode(props)}
    />
  ),
  h2: (props) => (
    <h2
      className="text-base font-semibold tracking-tight first:mt-0"
      {...withoutNode(props)}
    />
  ),
  h3: (props) => (
    <h3
      className="text-sm font-semibold tracking-tight first:mt-0"
      {...withoutNode(props)}
    />
  ),
  h4: (props) => (
    <h4
      className="text-sm font-semibold tracking-tight first:mt-0"
      {...withoutNode(props)}
    />
  ),
  p: (props) => (
    <p className="leading-relaxed first:mt-0 last:mb-0" {...withoutNode(props)} />
  ),
  a: (props) => (
    <a
      className="font-medium text-primary underline underline-offset-2 hover:opacity-80"
      target="_blank"
      rel="noopener noreferrer"
      {...withoutNode(props)}
    />
  ),
  strong: (props) => (
    <strong className="font-semibold" {...withoutNode(props)} />
  ),
  em: (props) => <em className="italic" {...withoutNode(props)} />,
  del: (props) => <del className="opacity-70" {...withoutNode(props)} />,
  ul: (props) => (
    <ul
      className="list-disc space-y-1 pl-5 marker:text-primary"
      {...withoutNode(props)}
    />
  ),
  ol: (props) => (
    <ol
      className="list-decimal space-y-1 pl-5 marker:text-primary"
      {...withoutNode(props)}
    />
  ),
  li: (props) => (
    <li className="leading-relaxed" {...withoutNode(props)} />
  ),
  blockquote: (props) => (
    <blockquote
      className="border-l-2 border-primary/40 bg-muted/50 py-1.5 pl-3 pr-2 italic text-muted-foreground [&_p]:my-0"
      {...withoutNode(props)}
    />
  ),
  hr: (props) => (
    <hr
      className="my-3 border-border/70 first:mt-0 last:mb-0"
      {...withoutNode(props)}
    />
  ),
  code: (props) => (
    <code
      className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.85em] break-words"
      {...withoutNode(props)}
    />
  ),
  pre: (props) => (
    <pre
      className="overflow-x-auto rounded-xl border border-border/70 bg-muted p-3 [&>code]:bg-transparent [&>code]:p-0 [&>code]:text-xs"
      {...withoutNode(props)}
    />
  ),
  table: (props) => (
    <div className="-mx-1 overflow-x-auto">
      <table
        className="w-full border-collapse text-xs"
        {...withoutNode(props)}
      />
    </div>
  ),
  thead: (props) => {
    if (props.node && !hastText(props.node).trim()) {
      return <thead className="hidden" {...withoutNode(props)} />;
    }

    return (
      <thead className="bg-muted/60 text-left" {...withoutNode(props)} />
    );
  },
  th: (props) => (
    <th
      className="border-b border-border px-2.5 py-2 font-semibold text-muted-foreground whitespace-nowrap"
      {...withoutNode(props)}
    />
  ),
  tr: (props) => (
    <tr className="border-b border-border/60 last:border-0" {...withoutNode(props)} />
  ),
  td: (props) => (
    <td className="px-2.5 py-2 align-top" {...withoutNode(props)} />
  ),
  input: (props) => (
    <input
      className="mr-1.5 accent-primary align-middle"
      disabled
      {...withoutNode(props)}
    />
  ),
};

interface MarkdownTextProps {
  text: string;
  className?: string;
}

export function MarkdownText({ text, className = "" }: MarkdownTextProps) {
  return (
    <div
      className={`space-y-2 text-sm leading-relaxed ${className}`}
    >
      <Markdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={components}
      >
        {text}
      </Markdown>
    </div>
  );
}
