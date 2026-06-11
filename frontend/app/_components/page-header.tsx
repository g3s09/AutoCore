import Link from "next/link";
import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
    icon?: ReactNode;
  };
};

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 border-b border-white/[0.08] pb-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7dd3fc]">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-normal text-[#f8fafc] md:text-3xl">
          {title}
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#8b95a7]">{description}</p>
      </div>

      {action ? (
        <Link
          href={action.href}
          className="inline-flex h-10 w-fit items-center gap-2 rounded-md border border-white/[0.12] bg-white/[0.06] px-3 text-sm font-medium text-[#eef2f7] shadow-[0_16px_42px_rgba(0,0,0,0.20)] transition hover:bg-white/[0.10]"
        >
          {action.icon}
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}
