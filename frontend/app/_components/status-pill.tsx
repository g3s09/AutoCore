type StatusTone = "green" | "blue" | "amber" | "rose" | "neutral";

const statusStyles: Record<StatusTone, string> = {
  green: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  blue: "border-sky-400/20 bg-sky-400/10 text-sky-300",
  amber: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  rose: "border-rose-400/20 bg-rose-400/10 text-rose-300",
  neutral: "border-white/10 bg-white/[0.05] text-slate-300",
};

export function StatusPill({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: StatusTone;
}) {
  return (
    <span
      className={`inline-flex h-6 items-center rounded-full border px-2 text-xs font-medium ${statusStyles[tone]}`}
    >
      {label}
    </span>
  );
}
