"use client";

import { useState, useCallback } from "react";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export default function TagInput({ tags, onChange, placeholder = "Type and press Enter" }: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const addTag = useCallback(() => {
    const trimmed = inputValue.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInputValue("");
  }, [inputValue, tags, onChange]);

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    } else if (e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const inputId = `tag-input-${placeholder.replace(/\s/g, "")}`;

  return (
    <div
      className="flex flex-wrap gap-1.5 p-2 rounded-lg min-h-[42px] focus-within:ring-2 cursor-text"
      style={{ backgroundColor: "rgba(11,35,65,0.6)", border: "1px solid rgba(71,184,255,0.15)" }}
      onClick={() => {
        const input = document.getElementById(inputId) as HTMLInputElement;
        input?.focus();
      }}
    >
      {tags.map((tag, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium"
          style={{ backgroundColor: "rgba(71,184,255,0.15)", color: "#47b8ff" }}
        >
          {tag}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); removeTag(i); }}
            className="text-white/40 hover:text-white/80 transition-colors cursor-pointer"
            style={{ lineHeight: 1 }}
          >
            &times;
          </button>
        </span>
      ))}
      <input
        id={inputId}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          if (inputValue.trim()) addTag();
        }}
        placeholder={tags.length === 0 ? placeholder : ""}
        className="flex-1 min-w-[80px] bg-transparent text-white text-sm focus:outline-none placeholder-white/40"
      />
    </div>
  );
}
