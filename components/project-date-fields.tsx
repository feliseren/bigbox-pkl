"use client";

import { useEffect, useRef, useState } from "react";

type ProjectDateFieldsProps = {
  defaultStartLabel?: string;
  defaultTargetLabel?: string;
};

const invalidDateMessage =
  "Target selesai tidak boleh lebih awal dari tanggal mulai.";

export function ProjectDateFields({
  defaultStartLabel = "",
  defaultTargetLabel = "",
}: ProjectDateFieldsProps) {
  const [startLabel, setStartLabel] = useState(defaultStartLabel);
  const [targetLabel, setTargetLabel] = useState(defaultTargetLabel);
  const targetInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const targetInput = targetInputRef.current;
    if (!targetInput) {
      return;
    }

    const isInvalidRange =
      Boolean(startLabel) && Boolean(targetLabel) && targetLabel < startLabel;
    targetInput.setCustomValidity(isInvalidRange ? invalidDateMessage : "");
  }, [startLabel, targetLabel]);

  return (
    <>
      <label>
        Tanggal Mulai
        <input
          name="startLabel"
          type="date"
          value={startLabel}
          onChange={(event) => setStartLabel(event.target.value)}
          required
        />
      </label>
      <label>
        Target Selesai
        <input
          ref={targetInputRef}
          name="targetLabel"
          type="date"
          value={targetLabel}
          min={startLabel || undefined}
          onChange={(event) => setTargetLabel(event.target.value)}
          required
        />
      </label>
    </>
  );
}
