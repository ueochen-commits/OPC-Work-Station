"use client";

import { useMemo, useState } from "react";
import { type LocalTask, useLocalWorkspace } from "@/lib/local/tasks";

const dayMs = 24 * 60 * 60 * 1000;

const statusLabel = {
  pending: "未开始",
  scheduled: "已排程",
  in_progress: "进行中",
  completed: "已完成",
  postponed: "已顺延",
  cancelled: "已取消"
};

const priorityLabel = {
  high: "高优",
  key: "关键",
  normal: "普通",
  low: "可推迟"
};

export default function SchedulePage() {
  const { tasks, storageMode, syncError } = useLocalWorkspace();
  const [projectFilter, setProjectFilter] = useState("全部");
  const today = useMemo(() => toDateInput(new Date()), []);
  const days = useMemo(() => buildDays(today, 30), [today]);
  const weekDays = days.slice(0, 7);

  const activeTasks = useMemo(
    () =>
      tasks
        .filter((task) => task.status !== "cancelled")
        .sort((a, b) => `${a.scheduledDate} ${a.scheduledTime}`.localeCompare(`${b.scheduledDate} ${b.scheduledTime}`)),
    [tasks]
  );
  const projectNames = useMemo(
    () => ["全部", ...Array.from(new Set(activeTasks.map((task) => task.project || "未归属任务")))],
    [activeTasks]
  );
  const visibleTasks = activeTasks.filter((task) => {
    if (projectFilter === "全部") return true;
    return (task.project || "未归属任务") === projectFilter;
  });
  const tasksByDay = useMemo(() => {
    const map = new Map<string, LocalTask[]>();
    for (const task of visibleTasks) {
      const list = map.get(task.scheduledDate) || [];
      list.push(task);
      map.set(task.scheduledDate, list);
    }
    return map;
  }, [visibleTasks]);
  const projectGroups = useMemo(() => {
    const map = new Map<string, LocalTask[]>();
    for (const task of visibleTasks) {
      const name = task.project || "未归属任务";
      const list = map.get(name) || [];
      list.push(task);
      map.set(name, list);
    }
    return Array.from(map, ([name, projectTasks]) => ({
      name,
      tasks: projectTasks,
      start: projectTasks[0]?.scheduledDate,
      end: projectTasks[projectTasks.length - 1]?.scheduledDate,
      completed: projectTasks.filter((task) => task.status === "completed").length
    }));
  }, [visibleTasks]);

  return (
    <div>
      <header className="mb-6 border-b border-border-default pb-5">
        <p className="mb-1 text-sm text-text-muted">未来 30 天</p>
        <h1 className="text-[28px] font-semibold leading-tight">排期</h1>
        <div className="mt-2 flex flex-wrap gap-2 text-xs text-text-muted">
          <span className="rounded-sm bg-bg-muted px-2 py-0.5">
            {storageMode === "supabase" ? "已连接 Supabase" : "本地演示模式"}
          </span>
          {syncError ? (
            <span className="rounded-sm bg-[var(--warning-bg)] px-2 py-0.5 text-[var(--warning-fg)]">
              {syncError}
            </span>
          ) : null}
        </div>
      </header>

      <section className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-sm font-medium">日历视图</h2>
          <p className="mt-1 text-xs text-text-muted">先展示最近 7 天，下面是 30 天项目时间线。</p>
        </div>
        <label>
          <span className="mb-1 block text-xs font-medium text-text-muted">项目筛选</span>
          <select
            className="h-9 min-w-[180px] rounded-md border border-border-default bg-bg-default px-2 text-sm"
            onChange={(event) => setProjectFilter(event.target.value)}
            value={projectFilter}
          >
            {projectNames.map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>
        </label>
      </section>

      <section className="grid gap-2 md:grid-cols-7">
        {weekDays.map((day) => {
          const dayTasks = tasksByDay.get(day.date) || [];
          return (
            <article className="min-h-[180px] rounded-lg border border-border-default p-3" key={day.date}>
              <div className="mb-3">
                <div className="text-xs text-text-muted">{day.weekday}</div>
                <div className="text-sm font-medium">{day.label}</div>
              </div>
              <div className="space-y-2">
                {dayTasks.slice(0, 5).map((task) => (
                  <TaskPill key={task.id} task={task} />
                ))}
                {dayTasks.length > 5 ? (
                  <div className="text-xs text-text-muted">还有 {dayTasks.length - 5} 件</div>
                ) : null}
              </div>
            </article>
          );
        })}
      </section>

      <section className="mt-6 rounded-lg border border-border-default p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-medium">项目时间线</h2>
            <p className="mt-1 text-xs text-text-muted">这是 v1 的轻量甘特视图，用来检查长期项目是否分布在不同日期。</p>
          </div>
          <span className="text-xs text-text-muted">{visibleTasks.length} 件任务</span>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[860px]">
            <div className="grid grid-cols-[160px_repeat(30,minmax(22px,1fr))] border-b border-border-default pb-2 text-xs text-text-muted">
              <div>项目</div>
              {days.map((day) => (
                <div className="text-center" key={day.date}>
                  {day.shortLabel}
                </div>
              ))}
            </div>
            <div className="divide-y divide-border-default">
              {projectGroups.length === 0 ? (
                <div className="py-8 text-center text-sm text-text-muted">还没有未来任务。</div>
              ) : null}
              {projectGroups.map((project) => (
                <div
                  className="grid min-h-[48px] grid-cols-[160px_repeat(30,minmax(22px,1fr))] items-center py-2"
                  key={project.name}
                >
                  <div className="min-w-0 pr-3">
                    <div className="truncate text-sm font-medium">{project.name}</div>
                    <div className="mt-0.5 text-xs text-text-muted">
                      {project.completed}/{project.tasks.length} 完成
                    </div>
                  </div>
                  {days.map((day) => {
                    const dayTasks = project.tasks.filter((task) => task.scheduledDate === day.date);
                    return (
                      <div className="flex h-8 items-center justify-center px-0.5" key={day.date}>
                        {dayTasks.length > 0 ? (
                          <div
                            className="h-5 w-full rounded-sm bg-accent"
                            title={`${day.date} · ${dayTasks.map((task) => task.title).join(" / ")}`}
                          />
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-border-default p-4">
        <h2 className="mb-3 text-sm font-medium">未来任务列表</h2>
        <div className="space-y-1">
          {visibleTasks.map((task) => (
            <article
              className="grid gap-2 rounded-md px-3 py-2 hover:bg-bg-subtle md:grid-cols-[140px_1fr_120px]"
              key={task.id}
            >
              <div className="text-sm text-text-muted">{task.scheduledDate} {task.scheduledTime}</div>
              <div className="min-w-0">
                <h3 className="truncate text-sm font-medium">{task.title}</h3>
                <p className="mt-0.5 truncate text-xs text-text-muted">
                  {task.project || "未归属"} · {task.estimatedMinutes} 分钟 · {priorityLabel[task.priority]}
                </p>
              </div>
              <div className="text-xs text-text-muted">{statusLabel[task.status]}</div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function TaskPill({ task }: { task: LocalTask }) {
  return (
    <div
      className={[
        "rounded-md border px-2 py-1 text-xs",
        task.status === "completed" ? "border-border-default bg-bg-subtle text-text-muted" : "border-border-default bg-bg-default"
      ].join(" ")}
      title={task.title}
    >
      <div className="truncate font-medium">{task.title}</div>
      <div className="mt-0.5 text-text-muted">{task.scheduledTime} · {task.estimatedMinutes}m</div>
    </div>
  );
}

function buildDays(startDate: string, count: number) {
  const start = new Date(`${startDate}T00:00:00`);
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(start.getTime() + index * dayMs);
    const value = toDateInput(date);
    return {
      date: value,
      label: `${date.getMonth() + 1}/${date.getDate()}`,
      shortLabel: String(date.getDate()),
      weekday: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][date.getDay()]
    };
  });
}

function toDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
