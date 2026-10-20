"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";

const helpText = [
  "help       show available commands",
  "whoami     about Raider",
  "writeups   open the write-up archive",
  "projects   open project files",
  "contact    open contact details",
  "clear      clear this session",
  "exit       close the terminal",
].join("\n");

export function Terminal() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [history, setHistory] = useState(["RAIDER FIELD TERMINAL", "Type help to see the available commands."]);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (event.key === "Escape" && open) {
        setOpen(false);
        return;
      }
      if (event.key !== "`" || event.ctrlKey || event.metaKey || event.altKey || target?.isContentEditable) return;
      if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) return;
      event.preventDefault();
      setOpen((value) => !value);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, [history]);

  const runCommand = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const entered = draft.trim();
    if (!entered) return;
    const command = entered.toLowerCase();
    setDraft("");
    setHistory((lines) => [...lines, `raider@site:~$ ${entered}`]);

    if (command === "clear") {
      setHistory(["RAIDER FIELD TERMINAL", "Screen cleared. Type help for commands."]);
    } else if (command === "exit") {
      setOpen(false);
    } else if (["writeups", "projects", "contact"].includes(command)) {
      router.push(`/${command}`);
      setOpen(false);
    } else {
      const response = command === "help" || command === "ls"
        ? helpText
        : command === "whoami" || command === "about"
          ? "Raider\nSecurity research, CTF write-ups, and notes from the edge.\nThis is a site terminal; it does not run system commands."
          : `command not found: ${entered}\nType help to see available commands.`;
      setHistory((lines) => [...lines, response]);
    }
  };

  return <>
    <button className="terminal-launcher" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={open}>
      <span className="terminal-led"/>TERMINAL <kbd>`</kbd>
    </button>
    {open && <div className="terminal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
      <section className="terminal-window" role="dialog" aria-modal="true" aria-label="Raider site terminal">
        <header className="terminal-header"><span><i/>RAIDER FIELD TERMINAL</span><button onClick={() => setOpen(false)} aria-label="Close terminal">×</button></header>
        <div className="terminal-output" ref={outputRef} aria-live="polite">
          {history.map((entry, index) => <pre key={`${index}-${entry.slice(0, 18)}`}>{entry}</pre>)}
        </div>
        <form className="terminal-form" onSubmit={runCommand}>
          <label htmlFor="terminal-input">raider@site:~$</label>
          <input ref={inputRef} id="terminal-input" autoComplete="off" autoCapitalize="off" spellCheck={false} value={draft} onChange={(event) => setDraft(event.target.value)} aria-label="Terminal command"/>
        </form>
        <p className="terminal-hint">SITE SHORTCUTS ONLY · ESC TO CLOSE</p>
      </section>
    </div>}
  </>;
}
