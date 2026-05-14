"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient, hasSupabaseBrowserConfig } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();

  async function signOut() {
    if (hasSupabaseBrowserConfig()) {
      await createSupabaseBrowserClient().auth.signOut();
    }
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      className="mt-auto flex h-8 w-full items-center gap-2 rounded-md px-2 text-sm text-text-muted hover:bg-bg-hover"
      onClick={signOut}
    >
      <LogOut size={16} />
      退出
    </button>
  );
}
