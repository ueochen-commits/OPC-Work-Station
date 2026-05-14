"use client";

import { useMemo, useState } from "react";
import { useLocalWorkspace } from "@/lib/local/tasks";
import { SubscriptionPanel } from "@/components/subscription/subscription-panel";

export default function SettingsPage() {
  const { tasks, settings, canWrite, readOnlyReason, setSettings, bulkCancelTasks } = useLocalWorkspace();
  const [cleanupProject, setCleanupProject] = useState("全部");
  const [confirmText, setConfirmText] = useState("");
  const [cleanupMessage, setCleanupMessage] = useState<string | null>(null);
  const activeTasks = useMemo(() => tasks.filter((task) => task.status !== "cancelled"), [tasks]);
  const projectOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const task of activeTasks) {
      const name = task.project || task.category || "未归属任务";
      counts.set(name, (counts.get(name) || 0) + 1);
    }
    return Array.from(counts, ([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
  }, [activeTasks]);
  const selectedCount =
    cleanupProject === "全部"
      ? activeTasks.length
      : projectOptions.find((project) => project.name === cleanupProject)?.count || 0;

  async function handleBulkCleanup() {
    if (!canWrite || confirmText !== "清空" || selectedCount === 0) return;
    const count = await bulkCancelTasks(cleanupProject === "全部" ? {} : { project: cleanupProject });
    setCleanupMessage(`已清理 ${count} 个任务`);
    setConfirmText("");
  }

  return (
    <div>
      <header className="mb-6 border-b border-border-default pb-5">
        <p className="mb-1 text-sm text-text-muted">个人工作偏好</p>
        <h1 className="text-[28px] font-semibold leading-tight">设置</h1>
      </header>

      <section className="max-w-[640px] space-y-4 rounded-lg border border-border-default p-4">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-text-muted">每日产能</span>
          <select
            className="h-9 w-full rounded-md border border-border-default bg-bg-default px-2"
            onChange={(event) =>
              setSettings((current) => ({ ...current, dailyCapacityMinutes: Number(event.target.value) }))
            }
            value={settings.dailyCapacityMinutes}
          >
            <option value={180}>3 小时</option>
            <option value={240}>4 小时</option>
            <option value={360}>6 小时</option>
            <option value={480}>8 小时</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-medium text-text-muted">每日回报时间</span>
          <input
            className="h-9 w-full rounded-md border border-border-default bg-bg-default px-2"
            onChange={(event) => setSettings((current) => ({ ...current, dailyReportTime: event.target.value }))}
            type="time"
            value={settings.dailyReportTime}
          />
        </label>

        <label className="flex items-center justify-between gap-3 rounded-md border border-border-default px-3 py-2">
          <span>
            <span className="block text-sm font-medium">显示 AI 解析过程</span>
            <span className="text-xs text-text-muted">用于调试输入习惯，默认关闭。</span>
          </span>
          <input
            checked={settings.showAiReasoning}
            onChange={(event) =>
              setSettings((current) => ({ ...current, showAiReasoning: event.target.checked }))
            }
            type="checkbox"
          />
        </label>
      </section>

      <section className="mt-6 max-w-[640px] rounded-lg border border-border-default p-4">
        <div className="mb-4">
          <h2 className="text-sm font-medium">任务批量清理</h2>
          <p className="mt-1 text-xs text-text-muted">
            导入整月计划出错时，可以把任务批量移出今日、排期和项目视图。
          </p>
        </div>

        {!canWrite && readOnlyReason ? (
          <div className="mb-3 rounded-md bg-[var(--warning-bg)] px-3 py-2 text-sm text-[var(--warning-fg)]">
            {readOnlyReason}
          </div>
        ) : null}

        <div className="grid gap-3 md:grid-cols-[1fr_120px]">
          <label>
            <span className="mb-1 block text-xs font-medium text-text-muted">清理范围</span>
            <select
              className="h-9 w-full rounded-md border border-border-default bg-bg-default px-2"
              onChange={(event) => {
                setCleanupProject(event.target.value);
                setCleanupMessage(null);
              }}
              value={cleanupProject}
            >
              <option value="全部">全部任务（{activeTasks.length}）</option>
              {projectOptions.map((project) => (
                <option key={project.name} value={project.name}>
                  {project.name}（{project.count}）
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-1 block text-xs font-medium text-text-muted">确认文字</span>
            <input
              className="h-9 w-full rounded-md border border-border-default bg-bg-default px-2"
              onChange={(event) => setConfirmText(event.target.value)}
              placeholder="清空"
              value={confirmText}
            />
          </label>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-xs text-text-muted">
            当前会清理 {selectedCount} 个任务。已完成的历史指标和复盘不会受影响。
          </span>
          <button
            className="h-8 rounded-md border border-[var(--danger-fg)] px-3 text-sm font-medium text-[var(--danger-fg)] hover:bg-[var(--danger-bg)] disabled:opacity-50"
            disabled={!canWrite || confirmText !== "清空" || selectedCount === 0}
            onClick={handleBulkCleanup}
          >
            批量清理
          </button>
        </div>

        {cleanupMessage ? <p className="mt-2 text-xs text-text-muted">{cleanupMessage}</p> : null}
      </section>

      <SubscriptionPanel />
    </div>
  );
}
