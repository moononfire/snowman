"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, ListChecks } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/lists", label: "Listy", icon: ListChecks },
  { href: "/contacts", label: "Kontakty", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-card border-r border-border flex flex-col shrink-0">
      <div className="px-4 py-5 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-xl">⛄</span>
          <span className="font-semibold text-foreground">Snowman</span>
        </div>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              pathname === href
                ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
