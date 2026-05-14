import Link from "next/link";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-subtle px-4">
      <section className="w-full max-w-[420px] rounded-xl border border-border-default bg-bg-default p-6">
        <h1 className="text-xl font-semibold">开始 14 天免费试用</h1>
        <p className="mt-1 text-sm text-text-muted">无需绑卡。试用结束后主动付费继续使用。</p>

        <form className="mt-5 space-y-3">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-text-muted">邮箱</span>
            <input className="h-9 w-full rounded-md border border-border-default bg-bg-default px-3" type="email" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-text-muted">密码</span>
            <input className="h-9 w-full rounded-md border border-border-default bg-bg-default px-3" type="password" />
          </label>
          <Link
            className="flex h-9 items-center justify-center rounded-md bg-accent text-sm font-medium text-text-inverse"
            href="/today"
          >
            创建账户
          </Link>
        </form>

        <p className="mt-4 text-sm text-text-muted">
          已有账户？{" "}
          <Link className="text-text-default underline" href="/login">
            登录
          </Link>
        </p>
      </section>
    </main>
  );
}
