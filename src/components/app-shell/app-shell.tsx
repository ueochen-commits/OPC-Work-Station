"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brain, CalendarCheck, CalendarDays, FolderKanban, Plus, Settings, Sparkles } from "lucide-react";
import { SignOutButton } from "@/components/auth/sign-out-button";

const navItems = [
  { href: "/today", label: "今日", icon: CalendarCheck },
  { href: "/plan", label: "计划", icon: Brain },
  { href: "/schedule", label: "排期", icon: CalendarDays },
  { href: "/projects", label: "项目", icon: FolderKanban },
  { href: "/retro", label: "复盘", icon: Sparkles },
  { href: "/settings", label: "设置", icon: Settings }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-bg-default text-text-default">
      <div className="flex min-h-screen">
        <aside className="hidden w-[232px] shrink-0 border-r border-border-default bg-bg-subtle px-3 py-4 md:block">
          <Link className="mb-5 block px-2 text-sm font-semibold" href="/today">
            OPC Work Station
          </Link>
          <Link
            className="mb-4 flex h-8 w-full items-center justify-center gap-2 rounded-md bg-accent px-3 text-sm font-medium text-text-inverse hover:bg-accent-hover"
            href="/today?quickAdd=1"
          >
            <Plus size={16} />
            快速添加
          </Link>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  className={[
                    "flex h-8 items-center gap-2 rounded-md px-2 text-sm",
                    active ? "bg-bg-active text-text-default" : "text-text-muted hover:bg-bg-hover"
                  ].join(" ")}
                  href={item.href}
                  key={item.href}
                >
                  <item.icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-8">
            <SignOutButton />
          </div>
        </aside>

        <div className="w-full pb-16 md:pb-0">
          <div className="mx-auto w-full max-w-[1120px] px-4 py-6 md:px-12 md:py-8">{children}</div>
        </div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 grid h-14 grid-cols-6 border-t border-border-default bg-bg-default md:hidden">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              className={[
                "flex flex-col items-center justify-center gap-0.5 text-xs",
                active ? "text-text-default" : "text-text-muted"
              ].join(" ")}
              href={item.href}
              key={item.href}
            >
              <item.icon size={17} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
