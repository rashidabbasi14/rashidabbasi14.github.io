"use client";

import { useRef, useCallback } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, rows = 6, placeholder }: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertFormatting = useCallback((before: string, after: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);

    onChange(newText);

    // Restore cursor position after React re-render
    requestAnimationFrame(() => {
      textarea.focus();
      if (selectedText) {
        textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
      } else {
        textarea.setSelectionRange(start + before.length, start + before.length);
      }
    });
  }, [value, onChange]);

  const insertLink = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    if (selectedText) {
      insertFormatting('<a href="', `">${selectedText}</a>`);
    } else {
      insertFormatting('<a href="', '">link text</a>');
    }
  }, [insertFormatting]);

  const insertList = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    if (selectedText) {
      const lines = selectedText.split("\n").map((l) => `<li>${l}</li>`).join("\n");
      const newText = value.substring(0, start) + `<ul>\n${lines}\n</ul>` + value.substring(end);
      onChange(newText);
    } else {
      insertFormatting("<ul>\n  <li>", "</li>\n</ul>");
    }
  }, [value, onChange, insertFormatting]);

  const insertImage = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const newText = value.substring(0, start) + '<img src="" alt="" />' + value.substring(textarea.selectionEnd);
    onChange(newText);
  }, [value, onChange]);

  const toolbarButtons = [
    { label: "B", title: "Bold", action: () => insertFormatting("<b>", "</b>"), style: { fontWeight: "bold" } as React.CSSProperties },
    { label: "I", title: "Italic", action: () => insertFormatting("<i>", "</i>"), style: { fontStyle: "italic" } as React.CSSProperties },
    { label: "U", title: "Underline", action: () => insertFormatting("<u>", "</u>"), style: { textDecoration: "underline" } as React.CSSProperties },
    { type: "divider" as const },
    { label: "H3", title: "Heading", action: () => insertFormatting("<h3>", "</h3>"), style: { fontSize: "13px" } as React.CSSProperties },
    { label: "H4", title: "Sub-heading", action: () => insertFormatting("<h4>", "</h4>"), style: { fontSize: "12px" } as React.CSSProperties },
    { type: "divider" as const },
    { label: "• List", title: "Bullet List", action: insertList, style: {} },
    { label: "🔗", title: "Insert Link", action: insertLink, style: {} },
    { label: "🖼", title: "Insert Image", action: insertImage, style: {} },
    { type: "divider" as const },
    { label: "BR", title: "Line Break", action: () => insertFormatting("", "<br />"), style: { fontSize: "11px" } as React.CSSProperties },
    { label: "Clear", title: "Clear formatting (remove all HTML tags)", action: () => onChange(value.replace(/<[^>]*>/g, "")), style: { fontSize: "11px", opacity: 0.7 } as React.CSSProperties },
  ];

  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{ border: "1px solid rgba(71,184,255,0.15)" }}
    >
      {/* Toolbar */}
      <div
        className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b select-none"
        style={{
          backgroundColor: "rgba(11,35,65,0.8)",
          borderBottom: "1px solid rgba(71,184,255,0.1)",
        }}
      >
        {toolbarButtons.map((btn, i) => {
          if ("type" in btn && btn.type === "divider") {
            return (
              <div
                key={i}
                className="w-px h-5 mx-1"
                style={{ backgroundColor: "rgba(71,184,255,0.2)" }}
              />
            );
          }
          return (
            <button
              key={i}
              type="button"
              title={btn.title}
              onClick={btn.action}
              className="px-2 py-1 rounded text-white/80 hover:text-white hover:bg-white/10 transition-all duration-150 cursor-pointer text-sm leading-none"
              style={btn.style}
            >
              {btn.label}
            </button>
          );
        })}
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-white focus:outline-none resize-y"
        style={{
          backgroundColor: "rgba(11,35,65,0.4)",
          minHeight: "100px",
          fontFamily: "monospace",
          fontSize: "13px",
          lineHeight: "1.5",
        }}
      />
    </div>
  );
}
