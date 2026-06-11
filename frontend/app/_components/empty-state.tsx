import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon?: ReactNode;
}) {
  return (
    <div className="flex min-h-44 flex-col items-center justify-center rounded-lg border border-dashed border-white/[0.12] bg-white/[0.025] p-6 text-center">
      {icon ? (
        <div className="mb-4 flex size-10 items-center justify-center rounded-md border border-white/[0.10] bg-white/[0.04] text-[#9aa4b5]">
          {icon}
        </div>
      ) : null}
      <h2 className="text-sm font-semibold text-[#eef2f7]">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-[#8b95a7]">
        {description}
      </p>
    </div>
  );
}
