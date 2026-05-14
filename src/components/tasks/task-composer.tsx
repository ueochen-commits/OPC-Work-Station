"use client";

import { useState } from "react";
import type { Priority } from "@/types/domain";

const today = new Date().toISOString().slice(0, 10);

export function TaskComposer({
  onAdd
}: {
  onAdd: (task: {
    title: string;
    project?: string;
    estimatedMinutes: number;
    priority: Priority;
    scheduledDate: string;
    scheduledTime: string;
  }) => void;
}) {
  const [title, setTitle] = useState("");
  const [project, setProject] = useState("");
  const [estimatedMinutes, setEstimatedMinutes] = useState(60);
  const [priority, setPriority] = useState<Priority>("normal");
  const [scheduledDate, setScheduledDate] = useState(today);
  const [scheduledTime, setScheduledTime] = useState("09:00");

  return (
    <form
      className="rounded-lg border border-border-default bg-bg-default p-4"
      onSubmit={(event) => {
        event.preventDefault();
        if (!title.trim()) return;
        onAdd({
          title: title.trim(),
          project: project.trim() || undefined,
          estimatedMinutes,
          priority,
          scheduledDate,
          scheduledTime
        });
        setTitle("");
        setProject("");
      }}
    >
      <div className="mb-3">
        <label className="mb-1 block text-xs font-medium text-text-muted" htmlFor="task-title">
          任务标题
        </label>
        <input
          className="h-9 w-full rounded-md border border-border-default bg-bg-default px-3 outline-none focus:border-border-focus"
          id="task-title"
          onChange={(event) => setTitle(event.target.value)}
          placeholder="例如：明天上午写个广告脚本"
          value={title}
        />
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_120px_120px_120px_120px]">
        <Field label="项目">
          <input
            className="h-9 w-full rounded-md border border-border-default bg-bg-default px-3 outline-none focus:border-border-focus"
            onChange={(event) => setProject(event.target.value)}
            placeholder="可选"
            value={project}
          />
        </Field>
        <Field label="时长">
          <select
            className="h-9 w-full rounded-md border border-border-default bg-bg-default px-2"
            onChange={(event) => setEstimatedMinutes(Number(event.target.value))}
            value={estimatedMinutes}
          >
            {[30, 45, 60, 90, 120].map((minutes) => (
              <option key={minutes} value={minutes}>
                {minutes} 分钟
              </option>
            ))}
          </select>
        </Field>
        <Field label="优先级">
          <select
            className="h-9 w-full rounded-md border border-border-default bg-bg-default px-2"
            onChange={(event) => setPriority(event.target.value as Priority)}
            value={priority}
          >
            <option value="normal">普通</option>
            <option value="high">高优</option>
            <option value="key">关键</option>
            <option value="low">可推迟</option>
          </select>
        </Field>
        <Field label="日期">
          <input
            className="h-9 w-full rounded-md border border-border-default bg-bg-default px-2"
            onChange={(event) => setScheduledDate(event.target.value)}
            type="date"
            value={scheduledDate}
          />
        </Field>
        <Field label="时间">
          <input
            className="h-9 w-full rounded-md border border-border-default bg-bg-default px-2"
            onChange={(event) => setScheduledTime(event.target.value)}
            type="time"
            value={scheduledTime}
          />
        </Field>
      </div>

      <div className="mt-4 flex justify-end">
        <button className="h-8 rounded-md bg-accent px-4 text-sm font-medium text-text-inverse hover:bg-accent-hover">
          创建任务
        </button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label>
      <span className="mb-1 block text-xs font-medium text-text-muted">{label}</span>
      {children}
    </label>
  );
}
