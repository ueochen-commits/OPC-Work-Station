import { AuthForm } from "@/components/auth/auth-form";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-subtle px-4">
      <section className="w-full max-w-[380px] rounded-xl border border-border-default bg-bg-default p-6">
        <h1 className="text-xl font-semibold">登录</h1>
        <p className="mt-1 text-sm text-text-muted">使用邮箱和密码进入你的工作台。</p>
        <Suspense fallback={<div className="mt-5 text-sm text-text-muted">正在加载登录表单...</div>}>
          <AuthForm mode="login" />
        </Suspense>
      </section>
    </main>
  );
}
