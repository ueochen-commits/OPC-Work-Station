import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-subtle px-4 text-text-default">
      <section className="w-full max-w-[560px] rounded-xl border border-border-default bg-bg-default p-6">
        <p className="mb-2 text-sm text-text-muted">一人公司任务工作站</p>
        <h1 className="text-[28px] font-semibold leading-tight">把计划变成今天的下一步。</h1>
        <p className="mt-3 text-sm text-text-muted">
          当前版本已经可以本地创建任务、切换轻日模式、查看项目聚合和复盘草稿。Supabase、AI 和 XORPAY 会继续接入。
        </p>
        <div className="mt-6 flex gap-2">
          <Link
            className="flex h-9 items-center rounded-md bg-accent px-4 text-sm font-medium text-text-inverse"
            href="/today"
          >
            进入工作台
          </Link>
          <Link
            className="flex h-9 items-center rounded-md border border-border-default px-4 text-sm hover:bg-bg-hover"
            href="/signup"
          >
            14 天试用
          </Link>
        </div>
      </section>
    </main>
  );
}
