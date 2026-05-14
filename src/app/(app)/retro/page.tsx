"use client";

import { useMemo, useState } from "react";
import { useLocalWorkspace } from "@/lib/local/tasks";

export default function RetroPage() {
  const { tasks } = useLocalWorkspace();
  const [mostSatisfied, setMostSatisfied] = useState("");
  const [mostFrustrated, setMostFrustrated] = useState("");
  const [nextFocus, setNextFocus] = useState("");

  const stats = useMemo(() => {
    const completed = tasks.filter((task) => task.status === "completed").length;
    const total = tasks.filter((task) => task.status !== "cancelled").length;
    const minutes = tasks
      .filter((task) => task.status === "completed")
      .reduce((sum, task) => sum + task.estimatedMinutes, 0);
    return { completed, total, minutes, rate: total ? Math.round((completed / total) * 100) : 0 };
  }, [tasks]);

  return (
    <div>
      <header className="mb-6 border-b border-border-default pb-5">
        <p className="mb-1 text-sm text-text-muted">每周一生成</p>
        <h1 className="text-[28px] font-semibold leading-tight">复盘</h1>
      </header>

      <section className="mb-5 rounded-lg border border-border-default p-4">
        <h2 className="mb-3 text-sm font-medium">这周你怎么看？</h2>
        <div className="grid gap-3">
          <ReviewInput label="最满意的一件事" onChange={setMostSatisfied} value={mostSatisfied} />
          <ReviewInput label="最受挫的一件事" onChange={setMostFrustrated} value={mostFrustrated} />
          <ReviewInput label="下周想专注的方向" onChange={setNextFocus} value={nextFocus} />
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        <Metric label="任务完成" value={`${stats.completed}/${stats.total}`} />
        <Metric label="完成率" value={`${stats.rate}%`} />
        <Metric label="完成投入" value={`${(stats.minutes / 60).toFixed(1)}h`} />
      </section>

      <section className="mt-5 rounded-lg border border-border-default bg-bg-subtle p-4">
        <h2 className="mb-2 text-sm font-medium">AI 洞察</h2>
        <p className="text-sm text-text-muted">
          DeepSeek 接入后，这里会基于任务完成、运营数据和你的自评生成 2-3 条行动建议。
        </p>
      </section>
    </div>
  );
}

function ReviewInput({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className="mb-1 block text-xs font-medium text-text-muted">{label}</span>
      <input
        className="h-9 w-full rounded-md border border-border-default bg-bg-default px-3 outline-none focus:border-border-focus"
        maxLength={100}
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
    </label>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border-default p-4">
      <div className="text-xs text-text-muted">{label}</div>
      <div className="mt-1 text-xl font-semibold">{value}</div>
    </div>
  );
}
