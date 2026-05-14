"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useLocalWorkspace } from "@/lib/local/tasks";

export default function ProjectsPage() {
  const { tasks } = useLocalWorkspace();
  const projects = useMemo(() => {
    const map = new Map<string, { total: number; completed: number; minutes: number }>();
    for (const task of tasks) {
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

      <div className="grid gap-3 md:grid-cols-2">
        {projects.map((project) => (
          <article className="rounded-lg border border-border-default p-4" key={project.name}>
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
          </article>
        ))}
      </div>

      {projects.length === 0 ? (
        <div className="rounded-lg border border-border-default px-4 py-10 text-center">
          <p className="text-sm font-medium">还没有项目</p>
          <p className="mt-1 text-sm text-text-muted">在今日页创建任务并填写项目名后，这里会自动聚合。</p>
        </div>
      ) : null}
    </div>
  );
}
