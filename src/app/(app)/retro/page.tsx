"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocalWorkspace } from "@/lib/local/tasks";
import { parseLocalOutcomeReport } from "@/lib/local/outcome-language";

export default function RetroPage() {
  const {
    tasks,
    outcomes,
    weeklyReviews,
    addOutcomeMetric,
    addOutcomeMetrics,
    saveWeeklySelfReview,
    storageMode,
    syncError,
    canWrite,
    readOnlyReason
  } = useLocalWorkspace();
  const weekStartDate = useMemo(() => getWeekStartDate(new Date()), []);
  const [mostSatisfied, setMostSatisfied] = useState("");
  const [mostFrustrated, setMostFrustrated] = useState("");
  const [nextFocus, setNextFocus] = useState("");
  const [reviewMessage, setReviewMessage] = useState<string | null>(null);
  const [metricDate, setMetricDate] = useState(new Date().toISOString().slice(0, 10));
  const [platform, setPlatform] = useState("抖音");
  const [metricKey, setMetricKey] = useState("播放");
  const [metricValue, setMetricValue] = useState("");
  const [rawReport, setRawReport] = useState("");
  const [parseMessage, setParseMessage] = useState<string | null>(null);
  const [weeklyInsights, setWeeklyInsights] = useState<Array<{ title: string; detail: string; action: string }>>([]);
  const [weeklySummary, setWeeklySummary] = useState<string | null>(null);
  const [insightMessage, setInsightMessage] = useState<string | null>(null);
  const [generatingInsights, setGeneratingInsights] = useState(false);

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
  const currentReview = useMemo(
    () => weeklyReviews.find((review) => review.weekStartDate === weekStartDate),
    [weekStartDate, weeklyReviews]
  );

  useEffect(() => {
    if (!currentReview) return;
    setMostSatisfied(currentReview.mostSatisfied || "");
    setMostFrustrated(currentReview.mostFrustrated || "");
    setNextFocus(currentReview.nextWeekFocus || "");
  }, [currentReview]);

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
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-medium">这周你怎么看？</h2>
            <p className="mt-1 text-xs text-text-muted">本周从 {weekStartDate} 开始，自评会参与后续 AI 周报洞察。</p>
          </div>
          {reviewMessage ? <span className="text-xs text-text-muted">{reviewMessage}</span> : null}
        </div>
        {!canWrite && readOnlyReason ? (
          <div className="mb-3 rounded-md border border-border-default bg-[var(--warning-bg)] px-3 py-2 text-sm text-[var(--warning-fg)]">
            {readOnlyReason}
          </div>
        ) : null}
        <form
          className="grid gap-3"
          onSubmit={async (event) => {
            event.preventDefault();
            if (!canWrite) return;
            await saveWeeklySelfReview({
              weekStartDate,
              mostSatisfied,
              mostFrustrated,
              nextWeekFocus: nextFocus
            });
            setReviewMessage("已保存");
          }}
        >
          <ReviewInput disabled={!canWrite} label="最满意的一件事" onChange={setMostSatisfied} value={mostSatisfied} />
          <ReviewInput disabled={!canWrite} label="最受挫的一件事" onChange={setMostFrustrated} value={mostFrustrated} />
          <ReviewInput disabled={!canWrite} label="下周想专注的方向" onChange={setNextFocus} value={nextFocus} />
          <div className="flex justify-end">
            <button
              className="h-9 rounded-md bg-accent px-4 text-sm font-medium text-text-inverse disabled:opacity-50"
              disabled={!canWrite}
            >
              保存自评
            </button>
          </div>
        </form>
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
            <p className="mt-1 text-xs text-text-muted">可以一句话录入，也可以用表单补充单个指标。</p>
          </div>
        </div>

        <form
          className="mb-4 rounded-md border border-border-default bg-bg-subtle p-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (!canWrite) return;
            const parsed = parseLocalOutcomeReport(rawReport);
            if (parsed.metrics.length === 0) {
              setParseMessage("没有识别到明确指标。试试：抖音今天播放 4 万，点赞 1500，涨粉 80");
              return;
            }
            addOutcomeMetrics(
              parsed.metrics.map((metric) => ({
                metricDate: parsed.metricDate,
                platform: metric.platform,
                metricKey: metric.metricKey,
                metricValue: metric.metricValue,
                rawInput: rawReport
              }))
            );
            setParseMessage(parsed.reasoning);
            setRawReport("");
          }}
        >
          <label>
            <span className="mb-1 block text-xs font-medium text-text-muted">自然语言回报</span>
            <textarea
              className="min-h-[72px] w-full resize-none rounded-md border border-border-default bg-bg-default px-3 py-2 text-sm outline-none focus:border-border-focus"
              disabled={!canWrite}
              onChange={(event) => setRawReport(event.target.value)}
              placeholder="例如：抖音今天播放 4.2 万，点赞 1500，涨粉 80"
              value={rawReport}
            />
          </label>
          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="text-xs text-text-muted">{parseMessage || "支持中文数字单位：万、千、w、k。"}</p>
            <button
              className="h-8 rounded-md bg-accent px-3 text-sm font-medium text-text-inverse disabled:opacity-50"
              disabled={!canWrite}
            >
              解析并保存
            </button>
          </div>
        </form>

        <form
          className="grid gap-3 md:grid-cols-[150px_1fr_1fr_140px_auto]"
          onSubmit={(event) => {
            event.preventDefault();
            if (!canWrite) return;
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
              disabled={!canWrite}
              onChange={(event) => setMetricDate(event.target.value)}
              type="date"
              value={metricDate}
            />
          </Field>
          <Field label="平台">
            <input
              className="h-9 w-full rounded-md border border-border-default bg-bg-default px-3"
              disabled={!canWrite}
              onChange={(event) => setPlatform(event.target.value)}
              value={platform}
            />
          </Field>
          <Field label="指标">
            <input
              className="h-9 w-full rounded-md border border-border-default bg-bg-default px-3"
              disabled={!canWrite}
              onChange={(event) => setMetricKey(event.target.value)}
              value={metricKey}
            />
          </Field>
          <Field label="数值">
            <input
              className="h-9 w-full rounded-md border border-border-default bg-bg-default px-3"
              disabled={!canWrite}
              onChange={(event) => setMetricValue(event.target.value)}
              placeholder="42000"
              type="number"
              value={metricValue}
            />
          </Field>
          <div className="flex items-end">
            <button
              className="h-9 rounded-md bg-accent px-4 text-sm font-medium text-text-inverse disabled:opacity-50"
              disabled={!canWrite}
            >
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
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-medium">AI 洞察</h2>
            <p className="mt-1 text-xs text-text-muted">
              结合任务完成、运营数据和你的自评生成 2-3 条行动建议。
            </p>
          </div>
          <button
            className="h-8 rounded-md bg-accent px-3 text-sm font-medium text-text-inverse disabled:opacity-50"
            disabled={generatingInsights}
            onClick={async () => {
              setGeneratingInsights(true);
              setInsightMessage(null);
              try {
                const response = await fetch("/api/reports/weekly", {
                  method: "POST",
                  headers: { "content-type": "application/json" },
                  body: JSON.stringify({ weekStartDate })
                });
                const data = await response.json();
                if (!response.ok) {
                  throw new Error(data?.error?.message || "生成周报失败。");
                }
                setWeeklySummary(data.summary);
                setWeeklyInsights(data.insights || []);
                setInsightMessage(data.source === "deepseek" ? "DeepSeek 已生成" : "已用本地规则生成");
              } catch (error) {
                setInsightMessage(error instanceof Error ? error.message : "生成周报失败。");
              } finally {
                setGeneratingInsights(false);
              }
            }}
          >
            {generatingInsights ? "生成中..." : "生成本周洞察"}
          </button>
        </div>

        {insightMessage ? <p className="mb-3 text-xs text-text-muted">{insightMessage}</p> : null}
        {weeklySummary ? <p className="mb-3 text-sm text-text-default">{weeklySummary}</p> : null}
        <div className="space-y-2">
          {weeklyInsights.length === 0 ? (
            <p className="text-sm text-text-muted">
              已有 {outcomes.length} 条运营指标。填写自评后再生成，洞察会更贴近你的真实体感。
            </p>
          ) : null}
          {weeklyInsights.map((insight) => (
            <article className="rounded-md border border-border-default bg-bg-default p-3" key={insight.title}>
              <h3 className="text-sm font-medium">{insight.title}</h3>
              <p className="mt-1 text-sm text-text-muted">{insight.detail}</p>
              <p className="mt-2 text-sm text-text-default">{insight.action}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function ReviewInput({
  disabled = false,
  label,
  value,
  onChange
}: {
  disabled?: boolean;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className="mb-1 block text-xs font-medium text-text-muted">{label}</span>
      <input
        className="h-9 w-full rounded-md border border-border-default bg-bg-default px-3 outline-none focus:border-border-focus"
        disabled={disabled}
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

function getWeekStartDate(date: Date) {
  const current = new Date(date);
  const day = current.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  current.setDate(current.getDate() + diff);
  return toDateInput(current);
}

function toDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
