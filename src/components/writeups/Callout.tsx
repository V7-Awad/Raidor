import type { HTMLAttributes, ReactNode } from "react";
export function Callout({ children, type = "note", ...props }: HTMLAttributes<HTMLDivElement> & { children?: ReactNode; type?: "note" | "warning" }) { return <aside className={`callout callout-${type}`} {...props}><strong>{type === "warning" ? "Warning" : "Note"}.</strong> {children}</aside>; }
