"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type ProjectStatusSelectProps = {
  projectId: string;
  initialStatus: "Process" | "Done";
};

export function ProjectStatusSelect({
  projectId,
  initialStatus,
}: ProjectStatusSelectProps) {
  const [status, setStatus] = useState<"Process" | "Done">(initialStatus);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleChange(nextStatus: "Process" | "Done") {
    setStatus(nextStatus);
    startTransition(async () => {
      await fetch("/api/projects/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, status: nextStatus }),
      });
      router.refresh();
    });
  }

  return (
    <select
      className={`status-select ${status === "Done" ? "done" : "process"}`}
      value={status}
      onChange={(event) => handleChange(event.target.value as "Process" | "Done")}
      disabled={isPending}
      suppressHydrationWarning
    >
      <option value="Process">Process</option>
      <option value="Done">Done</option>
    </select>
  );
}
