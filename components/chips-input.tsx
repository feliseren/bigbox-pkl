"use client";

import { useCallback, useRef, useState } from "react";

type ChipsInputProps = {
  name: string;
  placeholder?: string;
};

export default function ChipsInput({ name, placeholder }: ChipsInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [chips, setChips] = useState<string[]>([]);

  const addChip = useCallback((rawValue: string) => {
    const value = rawValue.trim();
    if (!value) return;
    setChips((prev) => {
      if (prev.some((item) => item.toLowerCase() === value.toLowerCase())) {
        return prev;
      }
      return [...prev, value];
    });
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      const current = event.currentTarget.value;
      addChip(current.replace(/,+$/, ""));
      event.currentTarget.value = "";
    } else if (event.key === "Backspace" && !event.currentTarget.value) {
      setChips((prev) => prev.slice(0, -1));
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    addChip(event.currentTarget.value);
    event.currentTarget.value = "";
  };

  const removeChip = (value: string) => {
    setChips((prev) => prev.filter((item) => item !== value));
    inputRef.current?.focus();
  };

  return (
    <div className="chips-field">
      <div className="chips-input">
        {chips.map((chip) => (
          <span key={chip} className="chip">
            {chip}
            <button type="button" onClick={() => removeChip(chip)}>
              ×
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          suppressHydrationWarning
        />
      </div>
      <input type="hidden" name={name} value={chips.join(",")} />
    </div>
  );
}
