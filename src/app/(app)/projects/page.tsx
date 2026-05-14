"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { type LocalTask, useLocalWorkspace } from "@/lib/local/tasks";
import type { TaskStatus } from "@/types/domain";

const statusGroups: Array<{
  key: TaskStatus;
  title: string;
  accepts: TaskStatus[];
}> = [
  { key: "pending", title: "未开始", accepts: ["pending"] },
  { key: "scheduled", title: "进行中", accepts: ["scheduled", "in_progress", "postponed"] },
  { key: "completed", title: "已完成", accepts: ["completed"] }
];

const priorityLabel = {
  high: "高优",
  key: "关键",
  normal: "普通",
  low: "可推迟"
};

export default function ProjectsPage() {
  const { tasks, updateTaskStatus, canWrite, readOnlyReason } = useLocalWorkspace();
  const [view, setView] = useState<"list" | "board">("list");
  const [projectFilter, setProjectFilter] = useState("全部");
  const projects = useMemo(() => {
    const map = new Map<string, { total: number; completed: number; minutes: number }>();
    for (const task of tasks.filter((task) => task.status !== "cancelled")) {
      const name = task.project || "未归属任务";
      const current = map.get(name) || { total: 0, completed: 0, minutes: 0 };
      current.total += 1;
      current.completed += task.status === "completed" ? 1 : 0;
      current.minutes += task.estimatedMinutes;
      map.set(name, current);
    }
    return Array.from(map, ([name, value]) => ({
      name,
      ...value,
      progress: value.total > 0 ? Math.round((value.completed / value.total) * 100) : 0
    }));
  }, [tasks]);
  const projectNames = ["全部", ...projects.map((project) => project.name)];
  const visibleTasks = tasks.filter((task) => {
    if (task.status === "cancelled") return false;
    if (projectFilter === "全部") return true;
    return (task.project || "未归属任务") === projectFilter;
  });

  return (
    <div>
      <header className="mb-6 flex items-end justify-between border-b border-border-default pb-5">
        <div>
          <p className="mb-1 text-sm text-text-muted">项目视图</p>
          <h1 className="text-[28px] font-semibold leading-tight">项目</h1>
        </div>
        <Link
          className="rounded-md border border-border-default px-3 py-1.5 text-sm hover:bg-bg-hover"
          href="/today"
        >
          添加任务
        </Link>
      </header>

      {!canWrite && readOnlyReason ? (
        <div className="mb-5 rounded-lg border border-border-default bg-[var(--warning-bg)] px-4 py-3 text-sm text-[var(--warning-fg)]">
          {readOnlyReason}
        </div>
      ) : null}

      <div className="mb-5 grid gap-3 md:grid-cols-2">
        {projects.map((project) => (
          <button
            className={[
              "rounded-lg border p-4 text-left hover:bg-bg-subtle",
              projectFilter === project.name ? "border-border-strong bg-bg-subtle" : "border-border-default"
            ].join(" ")}
            key={project.name}
            onClick={() => setProjectFilter(project.name)}
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-medium">{project.name}</h2>
                <p className="mt-1 text-xs text-text-muted">
                  {project.total} 件任务 · {(project.minutes / 60).toFixed(1)}h 计划投入
                </p>
              </div>
              <span className="rounded-sm bg-bg-muted px-2 py-0.5 text-xs text-text-muted">
                {project.progress}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-bg-muted">
              <div className="h-full bg-accent" style={{ width: `${project.progress}%` }} />
            </div>
          </button>
        ))}
      </div>

      {projects.length === 0 ? (
        <div className="rounded-lg border border-border-default px-4 py-10 text-center">
          <p className="text-sm font-medium">还没有项目</p>
          <p className="mt-1 text-sm text-text-muted">在今日页创建任务并填写项目名后，这里会自动聚合。</p>
        </div>
      ) : null}

      <section className="mt-6 border-t border-border-default pt-5">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-sm font-medium">项目任务</h2>
            <p className="mt-1 text-xs text-text-muted">{projectFilter} · {visibleTasks.length} 件任务</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              className="h-8 rounded-md border border-border-default bg-bg-default px-2 text-sm"
              onChange={(event) => setProjectFilter(event.target.value)}
              value={projectFilter}
            >
              {projectNames.map((name) => (
                <option key={name}>{name}</option>
              ))}
            </select>
            <div className="inline-flex rounded-md border border-border-default p-0.5">
              <button
                className={[
                  "h-7 rounded px-3 text-sm",
                  view === "list" ? "bg-bg-active text-text-default" : "text-text-muted hover:bg-bg-hover"
                ].join(" ")}
                onClick={() => setView("list")}
              >
                列表
              </button>
              <button
                className={[
                  "h-7 rounded px-3 text-sm",
                  view === "board" ? "bg-bg-active text-text-default" : "text-text-muted hover:bg-bg-hover"
                ].join(" ")}
                onClick={() => setView("board")}
              >
                看板
              </button>
            </div>
          </div>
        </div>

        {view === "list" ? (
          <TaskList canWrite={canWrite} tasks={visibleTasks} onStatusChange={updateTaskStatus} />
        ) : (
          <TaskBoard canWrite={canWrite} tasks={visibleTasks} onStatusChange={updateTaskStatus} />
        )}
      </section>
    </div>
  );
}

function TaskList({
  tasks,
  canWrite = true,
  onStatusChange
}: {
  tasks: LocalTask[];
  canWrite?: boolean;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
}) {
  return (
    <div className="space-y-4">
      {statusGroups.map((group) => {
        const groupTasks = tasks.filter((task) => group.accepts.includes(task.status));
        return (
          <section key={group.key}>
            <h3 className="mb-2 text-xs font-medium text-text-muted">
              {group.title} ({groupTasks.length})
            </h3>
            <div className="space-y-1">
              {groupTasks.map((task) => (
                <TaskRow canWrite={canWrite} key={task.id} onStatusChange={onStatusChange} task={task} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function TaskBoard({
  tasks,
  canWrite,
  onStatusChange
}: {
  tasks: LocalTask[];
  canWrite: boolean;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {statusGroups.map((group) => {
        const groupTasks = tasks.filter((task) => group.accepts.includes(task.status));
        return (
          <section className="min-h-[280px] rounded-lg border border-border-default bg-bg-subtle p-3" key={group.key}>
            <h3 className="mb-3 text-sm font-medium">
              {group.title} <span className="text-text-muted">({groupTasks.length})</span>
            </h3>
            <div className="space-y-2">
              {groupTasks.map((task) => (
                <TaskCard canWrite={canWrite} key={task.id} onStatusChange={onStatusChange} task={task} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function TaskRow({
  task,
  canWrite,
  onStatusChange
}: {
  task: LocalTask;
  canWrite: boolean;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
}) {
  return (
    <article className="grid gap-2 rounded-md border border-border-default px-3 py-2 md:grid-cols-[1fr_140px_120px] md:items-center">
      <div className="min-w-0">
        <h4 className="truncate text-sm font-medium">{task.title}</h4>
        <p className="mt-0.5 truncate text-xs text-text-muted">
          {task.project || "未归属"} · {task.estimatedMinutes} 分钟 · {priorityLabel[task.priority]}
        </p>
      </div>
      <div className="text-xs text-text-muted">{task.scheduledDate} {task.scheduledTime}</div>
      <StatusSelect disabled={!canWrite} onChange={(status) => onStatusChange(task.id, status)} value={normalizeStatus(task.status)} />
    </article>
  );
}

function TaskCard({
  task,
  canWrite,
  onStatusChange
}: {
  task: LocalTask;
  canWrite: boolean;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
}) {
  return (
    <article className="rounded-md border border-border-default bg-bg-default p-3">
      <div className="mb-2 h-1 w-10 rounded-full bg-accent" />
      <h4 className="line-clamp-2 text-sm font-medium">{task.title}</h4>
      <p className="mt-1 text-xs text-text-muted">
        {task.estimatedMinutes} 分钟 · {priorityLabel[task.priority]}
      </p>
      <p className="mt-1 text-xs text-text-muted">{task.scheduledDate} {task.scheduledTime}</p>
      <div className="mt-3">
        <StatusSelect disabled={!canWrite} onChange={(status) => onStatusChange(task.id, status)} value={normalizeStatus(task.status)} />
      </div>
    </article>
  );
}

function StatusSelect({
  value,
  disabled = false,
  onChange
}: {
  value: TaskStatus;
  disabled?: boolean;
  onChange: (status: TaskStatus) => void;
}) {
  return (
    <select
      className="h-8 w-full rounded-md border border-border-default bg-bg-default px-2 text-sm"
      disabled={disabled}
      onChange={(event) => onChange(event.target.value as TaskStatus)}
      value={value}
    >
      <option value="pending">未开始</option>
      <option value="scheduled">进行中</option>
      <option value="completed">已完成</option>
    </select>
  );
}

function normalizeStatus(status: TaskStatus): TaskStatus {
  if (status === "completed") return "completed";
  if (status === "pending") return "pending";
  return "scheduled";
}
