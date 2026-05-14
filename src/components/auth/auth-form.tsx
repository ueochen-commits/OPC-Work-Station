"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { createSupabaseBrowserClient, hasSupabaseBrowserConfig } from "@/lib/supabase/client";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/today";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const configured = hasSupabaseBrowserConfig();

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!configured) {
      setMessage("Supabase 还没配置。现在会进入本地演示工作台。");
      window.setTimeout(() => router.push(nextPath), 500);
      return;
    }

    setLoading(true);
    setMessage(null);

    const supabase = createSupabaseBrowserClient();
    const result =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/today`
            }
          });

    setLoading(false);

    if (result.error) {
      setMessage(result.error.message);
      return;
    }

    if (mode === "signup" && !result.data.session) {
      setMessage("注册成功，请先到邮箱确认账户。");
      return;
    }

    router.push(nextPath);
    router.refresh();
  }

  return (
    <form className="mt-5 space-y-3" onSubmit={submit}>
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-text-muted">邮箱</span>
        <input
          className="h-9 w-full rounded-md border border-border-default bg-bg-default px-3"
          onChange={(event) => setEmail(event.target.value)}
          required
          type="email"
          value={email}
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-text-muted">密码</span>
        <input
          className="h-9 w-full rounded-md border border-border-default bg-bg-default px-3"
          minLength={6}
          onChange={(event) => setPassword(event.target.value)}
          required
          type="password"
          value={password}
        />
      </label>

      {message ? (
        <div className="rounded-md border border-border-default bg-bg-subtle px-3 py-2 text-sm text-text-muted">
          {message}
        </div>
      ) : null}

      <button
        className="flex h-9 w-full items-center justify-center rounded-md bg-accent text-sm font-medium text-text-inverse disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "处理中..." : mode === "login" ? "进入工作台" : "创建账户"}
      </button>

      <p className="text-sm text-text-muted">
        {mode === "login" ? "还没有账户？" : "已有账户？"}{" "}
        <Link className="text-text-default underline" href={mode === "login" ? "/signup" : "/login"}>
          {mode === "login" ? "注册" : "登录"}
        </Link>
      </p>
    </form>
  );
}
