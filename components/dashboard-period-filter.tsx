"use client";

import { useRef, useState } from "react";

type Period = "weekly" | "monthly" | "yearly" | "range";

type DashboardPeriodFilterProps = {
  period: Period;
  from?: string;
  to?: string;
  rangeLabel: string;
  variant?: "panel" | "inline";
  maxDate?: string;
  periodFieldName?: string;
  fromFieldName?: string;
  toFieldName?: string;
  hiddenFields?: Record<string, string | undefined>;
};

export function DashboardPeriodFilter({
  period,
  from,
  to,
  rangeLabel,
  variant = "panel",
  maxDate,
  periodFieldName = "period",
  fromFieldName = "from",
  toFieldName = "to",
  hiddenFields,
}: DashboardPeriodFilterProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>(period);
  const isRange = selectedPeriod === "range";
  const formRef = useRef<HTMLFormElement | null>(null);
  const submitForm = () => {
    if (formRef.current) {
      if (selectedPeriod === "range") {
        const data = new FormData(formRef.current);
        const fromValue = String(data.get("from") ?? "").trim();
        const toValue = String(data.get("to") ?? "").trim();
        if (!fromValue || !toValue) {
          return;
        }
      }
      formRef.current.requestSubmit();
    }
  };

  const content = (
    <form
      ref={formRef}
      className={`flex w-full flex-wrap items-end gap-3 ${
        variant === "inline" ? "justify-start" : ""
      }`}
      method="get"
    >
      {hiddenFields
        ? Object.entries(hiddenFields).map(([name, value]) =>
            value ? <input key={name} type="hidden" name={name} value={value} /> : null,
          )
        : null}
      <label className="flex flex-col gap-1 text-[11px] font-semibold text-[#6b7185]">
        Periode
        <select
          name={periodFieldName}
          value={selectedPeriod}
          onChange={(event) => {
            const next = event.target.value as Period;
            setSelectedPeriod(next);
            if (next !== "range") {
              submitForm();
            }
          }}
          className="rounded-lg border border-slate-200 px-3 py-2 text-xs text-[#2b2f3b] outline-none focus:border-[#5c7cfa] focus:ring-2 focus:ring-[#d6ddff]"
        >
          <option value="weekly">Mingguan</option>
          <option value="monthly">Bulanan</option>
          <option value="yearly">Tahunan</option>
          <option value="range">Pilih Tanggal</option>
        </select>
      </label>
      {isRange ? (
        <>
          <label className="flex flex-col gap-1 text-[11px] font-semibold text-[#6b7185]">
            Mulai
            <input
              type="date"
              name={fromFieldName}
              defaultValue={from ?? ""}
              max={maxDate}
              onChange={submitForm}
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs text-[#2b2f3b] outline-none focus:border-[#5c7cfa] focus:ring-2 focus:ring-[#d6ddff]"
            />
          </label>
          <label className="flex flex-col gap-1 text-[11px] font-semibold text-[#6b7185]">
            Sampai
            <input
              type="date"
              name={toFieldName}
              defaultValue={to ?? ""}
              max={maxDate}
              onChange={submitForm}
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs text-[#2b2f3b] outline-none focus:border-[#5c7cfa] focus:ring-2 focus:ring-[#d6ddff]"
            />
          </label>
        </>
      ) : null}
      <span className="text-[11px] text-[#7a8092]">Menampilkan: {rangeLabel}</span>
    </form>
  );

  if (variant === "inline") {
    return content;
  }

  return <section className="rounded-[20px] bg-white p-4 shadow-lg">{content}</section>;
}
