"use client";

import { Pause, RotateCcw, Trash2 } from "lucide-react";
import { TaskComposer } from "@/components/tasks/task-composer";
import { useLocalWorkspace } from "@/lib/local/tasks";
import type { EnergyMode } from "@/types/domain";

const priorityLabel = {
  high: "高优",
  key: "关键",
  normal: "普通",
  low: "可推迟"
};

const modeLabel: Record<EnergyMode, string> = {
  normal: "正常",
  light: "轻日",
  paused: "暂停"
};

export default function TodayPage() {
  const {
    ready,
    todayTasks,
    settings,
    scheduledMinutes,
    setSettings,
    addTask,
    toggleTask,
    postponeTask,
    cancelTask
  } = useLocalWorkspace();

  const capacity =
    settings.energyMode === "light"
      ? Math.round(settings.dailyCapacityMinutes / 2)
      : settings.energyMode === "paused"
        ? 0
        : settings.dailyCapacityMinutes;
  const load = capacity > 0 ? Math.round((scheduledMinutes / capacity) * 100) : 0;

  return (
    <div>
      <header className="mb-6 flex flex-col gap-4 border-b border-border-default pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-1 text-sm text-text-muted">{new Date().toLocaleDateString("zh-CN")} · 今日</p>
          <h1 className="text-[28px] font-semibold leading-tight">今日工作台</h1>
        </div>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <Metric label="产能" value={capacity > 0 ? `${capacity / 60}h` : "暂停"} />
          <Metric label="已排" value={`${(scheduledMinutes / 60).toFixed(1)}h`} />
          <Metric label="负载" value={capacity > 0 ? `${load}%` : "-"} />
        </div>
      </header>

      <section className="mb-4 flex flex-wrap items-center gap-2">
        {(["normal", "light", "paused"] as EnergyMode[]).map((mode) => (
          <button
            className={[
              "h-8 rounded-md border px-3 text-sm",
              settings.energyMode === mode
                ? "border-border-strong bg-bg-active text-text-default"
                : "border-border-default text-text-muted hover:bg-bg-hover"
            ].join(" ")}
            key={mode}
            onClick={() => setSettings((current) => ({ ...current, energyMode: mode }))}
          >
            {modeLabel[mode]}
          </button>
        ))}
      </section>

      {load >= 90 && settings.energyMode !== "paused" ? (
        <div className="mb-4 rounded-lg border border-border-default bg-[var(--warning-bg)] px-4 py-3 text-sm text-[var(--warning-fg)]">
          今日任务接近排满。新增高优任务时，系统会先给出调整预览。
        </div>
      ) : null}

      {settings.energyMode === "paused" ? (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-border-default bg-bg-subtle px-4 py-3 text-sm text-text-muted">
          <Pause size={16} />
          今天好好休息，明天再来。
        </div>
      ) : null}

      <div className="mb-6">
        <TaskComposer onAdd={addTask} />
      </div>

      <section className="space-y-1">
        {!ready ? <p className="text-sm text-text-muted">正在读取工作台...</p> : null}
        {ready && todayTasks.length === 0 ? (
          <div className="rounded-lg border border-border-default px-4 py-10 text-center">
            <p className="text-sm font-medium">今天还没有任务</p>
            <p className="mt-1 text-sm text-text-muted">加一件真正要推进的事就够了。</p>
          </div>
        ) : null}
        {todayTasks.map((task) => (
          <article
            className="grid min-h-[56px] grid-cols-[56px_1fr_auto] gap-3 rounded-md px-3 py-2 hover:bg-bg-subtle"
            key={task.id}
          >
            <div className="pt-0.5 text-right text-sm text-text-muted">{task.scheduledTime}</div>
            <button className="min-w-0 text-left" onClick={() => toggleTask(task.id)}>
              <h2
                className={[
                  "truncate text-sm font-medium",
                  task.status === "completed" ? "text-text-subtle line-through" : "text-text-default"
                ].join(" ")}
              >
                {task.title}
              </h2>
              <p className="mt-0.5 truncate text-xs text-text-muted">
                {task.category} · {task.estimatedMinutes} 分钟 · {priorityLabel[task.priority]}
                {task.project ? ` · ${task.project}` : ""}
              </p>
            </button>
            <div className="flex items-start gap-1 pt-0.5">
              <input
                aria-label={`完成 ${task.title}`}
                checked={task.status === "completed"}
                className="mt-1 size-4"
                onChange={() => toggleTask(task.id)}
                type="checkbox"
              />
              <button
                aria-label={`顺延 ${task.title}`}
                className="rounded-md p-1 text-text-muted hover:bg-bg-hover"
                onClick={() => postponeTask(task.id)}
              >
                <RotateCcw size={15} />
              </button>
              <button
                aria-label={`取消 ${task.title}`}
                className="rounded-md p-1 text-text-muted hover:bg-bg-hover"
                onClick={() => cancelTask(task.id)}
              >
                <Trash2 size={15} />
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
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
