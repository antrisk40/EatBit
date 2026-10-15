"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ClientLeadBanner from "@/components/ClientLeadBanner";
import { CANONICAL_TOOLS } from "@/lib/tools-catalog";

const MAX_VISIBLE = 6;

export default function OtherToolsSidebar() {
  const pathname = usePathname();

  const otherTools = CANONICAL_TOOLS.filter((tool) => tool.path !== pathname).slice(0, MAX_VISIBLE);

  if (otherTools.length === 0) return null;

  return (
    <aside className="sticky top-28 flex flex-col gap-3 w-full">
      <ClientLeadBanner />
      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Other tools
      </h3>
      <div className="flex flex-col gap-2">
        {otherTools.map((tool) => (
          <Link
            key={tool.id}
            href={tool.path}
            className="group flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all"
          >
            <span className="text-lg shrink-0">{tool.icon}</span>
            <div className="min-w-0">
              <h4 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors leading-tight truncate">
                {tool.title}
              </h4>
              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{tool.desc}</p>
            </div>
          </Link>
        ))}
      </div>
      <Link
        href="/tools"
        className="text-xs text-primary font-semibold hover:underline underline-offset-2 text-center pt-1"
      >
        View all tools →
      </Link>
    </aside>
  );
}
