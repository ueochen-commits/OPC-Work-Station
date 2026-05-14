import { AuthForm } from "@/components/auth/auth-form";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-subtle px-4">
      <section className="w-full max-w-[420px] rounded-xl border border-border-default bg-bg-default p-6">
        <h1 className="text-xl font-semibold">开始 14 天免费试用</h1>
        <p className="mt-1 text-sm text-text-muted">无需绑卡。试用结束后主动付费继续使用。</p>
        <AuthForm mode="signup" />
      </section>
    </main>
  );
}
