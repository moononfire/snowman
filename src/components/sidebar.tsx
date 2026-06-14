"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, ListChecks, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/lists", label: "Listy", icon: ListChecks },
  { href: "/contacts", label: "Kontakty", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

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
      {session?.user && (
        <div className="px-3 py-3 border-t border-border">
          <div className="flex items-center gap-2 px-2 py-1 mb-1">
            <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-semibold text-blue-600">
              {(session.user.name ?? session.user.email ?? "?")[0].toUpperCase()}
            </div>
            <span className="text-xs text-muted-foreground truncate flex-1">
              {session.user.name ?? session.user.email}
            </span>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/sign-in" })}
            className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            Wyloguj się
          </button>
        </div>
      )}
    </aside>
  );
}
