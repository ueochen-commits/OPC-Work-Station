import { CalendarCheck, FolderKanban, Plus, Settings, Sparkles } from "lucide-react";

const tasks = [
  {
    time: "09:00",
    title: "整理今天的交付清单",
    meta: "日常运营 · 45 分钟 · 普通"
  },
  {
    time: "10:00",
    title: "写课程销售页大纲",
    meta: "新课程开发 · 120 分钟 · 关键"
  },
  {
    time: "14:30",
    title: "复盘上周内容数据",
    meta: "复盘 · 60 分钟 · 高优"
  }
];

const navItems = [
  { label: "今日", icon: CalendarCheck, active: true },
  { label: "项目", icon: FolderKanban, active: false },
  { label: "复盘", icon: Sparkles, active: false },
  { label: "设置", icon: Settings, active: false }
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-bg-default text-text-default">
      <div className="flex min-h-screen">
        <aside className="hidden w-[232px] shrink-0 border-r border-border-default bg-bg-subtle px-3 py-4 md:block">
          <div className="mb-5 px-2 text-sm font-semibold">OPC Work Station</div>
          <button className="mb-4 flex h-8 w-full items-center justify-center gap-2 rounded-md bg-accent px-3 text-sm font-medium text-text-inverse hover:bg-accent-hover">
            <Plus size={16} />
            快速添加
          </button>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <a
                className={[
                  "flex h-8 items-center gap-2 rounded-md px-2 text-sm",
                  item.active ? "bg-bg-active text-text-default" : "text-text-muted hover:bg-bg-hover"
                ].join(" ")}
                href="#"
                key={item.label}
              >
                <item.icon size={16} />
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        <section className="mx-auto w-full max-w-[1024px] px-4 py-6 md:px-12 md:py-8">
          <header className="mb-6 flex flex-col gap-4 border-b border-border-default pb-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-1 text-sm text-text-muted">5月14日 · 周四</p>
              <h1 className="text-[28px] font-semibold leading-tight">今日工作台</h1>
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <Metric label="产能" value="6h" />
              <Metric label="已排" value="5.5h" />
              <Metric label="负载" value="92%" />
            </div>
          </header>

          <div className="mb-4 rounded-lg border border-border-default bg-[var(--warning-bg)] px-4 py-3 text-sm text-[var(--warning-fg)]">
            今日任务接近排满。新增高优任务时，系统会先给出调整预览。
          </div>

          <div className="space-y-1">
            {tasks.map((task) => (
              <article
                className="grid min-h-[52px] grid-cols-[56px_1fr_auto] gap-3 rounded-md px-3 py-2 hover:bg-bg-subtle"
                key={`${task.time}-${task.title}`}
              >
                <div className="pt-0.5 text-right text-sm text-text-muted">{task.time}</div>
                <div>
                  <h2 className="truncate text-sm font-medium">{task.title}</h2>
                  <p className="mt-0.5 text-xs text-text-muted">{task.meta}</p>
                </div>
                <input aria-label={`完成 ${task.title}`} className="mt-1 size-4" type="checkbox" />
              </article>
            ))}
          </div>

          <div className="fixed bottom-5 right-5 md:hidden">
            <button className="flex size-12 items-center justify-center rounded-full bg-accent text-text-inverse">
              <Plus size={20} />
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border-default px-3 py-2">
      <div className="text-xs text-text-muted">{label}</div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}
