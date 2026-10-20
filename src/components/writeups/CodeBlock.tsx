"use client";
import { useRef, useState, type HTMLAttributes, type ReactNode } from "react";
export function CodeBlock({ children, ...props }: HTMLAttributes<HTMLPreElement> & { children?: ReactNode }) {
  const pre = useRef<HTMLPreElement>(null); const [copied, setCopied] = useState(false);
  const copy = async () => { const code = pre.current?.innerText ?? ""; try { await navigator.clipboard.writeText(code); setCopied(true); window.setTimeout(() => setCopied(false), 1600); } catch { setCopied(false); } };
  return <div className="code-frame"><div className="code-label"><span><i aria-hidden="true"/>EXHIBIT // SOURCE</span><button type="button" onClick={copy}>{copied ? "Copied" : "Copy"}</button></div><pre ref={pre} {...props}>{children}</pre></div>;
}
