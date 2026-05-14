"use client";

import { useMemo, useState } from "react";
import { useLocalWorkspace } from "@/lib/local/tasks";

export default function RetroPage() {
  const { tasks, outcomes, addOutcomeMetric, storageMode, syncError } = useLocalWorkspace();
  const [mostSatisfied, setMostSatisfied] = useState("");
  const [mostFrustrated, setMostFrustrated] = useState("");
  const [nextFocus, setNextFocus] = useState("");
  const [metricDate, setMetricDate] = useState(new Date().toISOString().slice(0, 10));
  const [platform, setPlatform] = useState("抖音");
  const [metricKey, setMetricKey] = useState("播放");
  const [metricValue, setMetricValue] = useState("");

  const stats = useMemo(() => {
    const completed = tasks.filter((task) => task.status === "completed").length;
    const total = tasks.filter((task) => task.status !== "cancelled").length;
    const minutes = tasks
      .filter((task) => task.status === "completed")
      .reduce((sum, task) => sum + task.estimatedMinutes, 0);
    return { completed, total, minutes, rate: total ? Math.round((completed / total) * 100) : 0 };
  }, [tasks]);
  const outcomesByPlatform = useMemo(() => {
    const map = new Map<string, Array<{ key: string; value: number; date: string }>>();
    for (const metric of outcomes) {
      const list = map.get(metric.platform) || [];
      list.push({ key: metric.metricKey, value: metric.metricValue, date: metric.metricDate });
      map.set(metric.platform, list);
    }
    return Array.from(map, ([name, metrics]) => ({ name, metrics: metrics.slice(0, 6) }));
  }, [outcomes]);

  return (
    <div>
      <header className="mb-6 border-b border-border-default pb-5">
        <p className="mb-1 text-sm text-text-muted">每周一生成</p>
        <h1 className="text-[28px] font-semibold leading-tight">复盘</h1>
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

      <section className="mt-5 rounded-lg border border-border-default p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-medium">每日数据回报</h2>
            <p className="mt-1 text-xs text-text-muted">先手动录入指标，后续会接自然语言数据解析。</p>
          </div>
        </div>
        <form
          className="grid gap-3 md:grid-cols-[150px_1fr_1fr_140px_auto]"
          onSubmit={(event) => {
            event.preventDefault();
            const value = Number(metricValue);
            if (!Number.isFinite(value)) return;
            addOutcomeMetric({
              metricDate,
              platform: platform.trim(),
              metricKey: metricKey.trim(),
              metricValue: value,
              rawInput: `${platform} ${metricKey} ${metricValue}`
            });
            setMetricValue("");
          }}
        >
          <Field label="日期">
            <input
              className="h-9 w-full rounded-md border border-border-default bg-bg-default px-2"
              onChange={(event) => setMetricDate(event.target.value)}
              type="date"
              value={metricDate}
            />
          </Field>
          <Field label="平台">
            <input
              className="h-9 w-full rounded-md border border-border-default bg-bg-default px-3"
              onChange={(event) => setPlatform(event.target.value)}
              value={platform}
            />
          </Field>
          <Field label="指标">
            <input
              className="h-9 w-full rounded-md border border-border-default bg-bg-default px-3"
              onChange={(event) => setMetricKey(event.target.value)}
              value={metricKey}
            />
          </Field>
          <Field label="数值">
            <input
              className="h-9 w-full rounded-md border border-border-default bg-bg-default px-3"
              onChange={(event) => setMetricValue(event.target.value)}
              placeholder="42000"
              type="number"
              value={metricValue}
            />
          </Field>
          <div className="flex items-end">
            <button className="h-9 rounded-md bg-accent px-4 text-sm font-medium text-text-inverse">
              保存
            </button>
          </div>
        </form>
      </section>

      <section className="mt-5 grid gap-3 md:grid-cols-2">
        {outcomesByPlatform.map((platformGroup) => (
          <article className="rounded-lg border border-border-default p-4" key={platformGroup.name}>
            <h2 className="mb-3 text-sm font-medium">{platformGroup.name}</h2>
            <div className="space-y-2">
              {platformGroup.metrics.map((metric) => (
                <div
                  className="flex items-center justify-between rounded-md bg-bg-subtle px-3 py-2 text-sm"
                  key={`${metric.date}-${metric.key}`}
                >
                  <span className="text-text-muted">{metric.date} · {metric.key}</span>
                  <span className="font-medium">{metric.value.toLocaleString("zh-CN")}</span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="mt-5 rounded-lg border border-border-default bg-bg-subtle p-4">
        <h2 className="mb-2 text-sm font-medium">AI 洞察</h2>
        <p className="text-sm text-text-muted">
          已有 {outcomes.length} 条运营指标。DeepSeek 洞察接入后，这里会结合任务完成、运营数据和你的自评生成 2-3 条行动建议。
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label>
      <span className="mb-1 block text-xs font-medium text-text-muted">{label}</span>
      {children}
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
