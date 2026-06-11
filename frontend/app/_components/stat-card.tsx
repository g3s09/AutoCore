import type { ReactNode } from "react";

type StatTone = "green" | "blue" | "amber" | "rose" | "neutral";

const toneStyles: Record<StatTone, string> = {
  green: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/20",
  blue: "bg-sky-400/10 text-sky-300 ring-sky-400/20",
  amber: "bg-amber-400/10 text-amber-300 ring-amber-400/20",
  rose: "bg-rose-400/10 text-rose-300 ring-rose-400/20",
  neutral: "bg-white/5 text-slate-300 ring-white/10",
};

export function StatCard({
  label,
  value,
  detail,
  tone = "neutral",
  icon,
}: {
  label: string;
  value: string;
  detail: string;
  tone?: StatTone;
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-white/[0.08] bg-[#0d1117]/95 p-4 shadow-[0_18px_48px_rgba(0,0,0,0.22)]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-[#8b95a7]">{label}</p>
        {icon ? (
          <div
            className={`flex size-9 items-center justify-center rounded-md ring-1 ${toneStyles[tone]}`}
          >
            {icon}
          </div>
        ) : null}
      </div>
      <p className="mt-4 text-2xl font-semibold tracking-normal text-[#eef2f7]">
        {value}
      </p>
      <p className="mt-1 text-sm text-[#8b95a7]">{detail}</p>
    </div>
  );
}
