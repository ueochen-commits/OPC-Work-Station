"use client";

import { Keyboard, Loader2, Wand2 } from "lucide-react";
import { useMemo, useState } from "react";
import type { Priority } from "@/types/domain";
import type { ParseResponse, QuickTaskParseResult } from "@/types/parse";

const placeholders = [
  "试试说：明天上午写个广告脚本 2 小时",
  "试试说：下周二前给小米发脚本",
  "试试说：今天下午整理选题库 60 分钟",
  "试试说：后天复盘抖音数据",
  "试试说：周五前完成课程大纲"
];

const chips = [
  { label: "快速任务", value: "明天上午写个" },
  { label: "拆解目标", value: "我想年底前达到" },
  { label: "批量导入", value: "1. " },
  { label: "记数据", value: "抖音今天播放" },
  { label: "改任务", value: "把" }
];

export function SmartInputBox({
  existingTaskCount,
  showReasoning,
  onCreate
}: {
  existingTaskCount: number;
  showReasoning: boolean;
  onCreate: (task: {
    title: string;
    project?: string;
    estimatedMinutes: number;
    priority: Priority;
    scheduledDate: string;
    scheduledTime: string;
  }) => void;
}) {
  const [input, setInput] = useState("");
  const [parsed, setParsed] = useState<QuickTaskParseResult | null>(null);
  const [parseSource, setParseSource] = useState<ParseResponse["source"] | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const placeholder = useMemo(() => placeholders[new Date().getSeconds() % placeholders.length], []);

  async function parse() {
    if (!input.trim()) return;
    setSubmitting(true);
    setWarning(null);

    try {
      const response = await fetch("/api/parse", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ input, existingTaskCount })
      });

      if (!response.ok) {
        throw new Error("解析请求失败");
      }

      const data = (await response.json()) as ParseResponse;
      setParsed(data.result);
      setParseSource(data.source);
      setWarning(data.warning ?? null);
    } catch (error) {
      setWarning(error instanceof Error ? error.message : "解析失败，请使用表单输入兜底。");
    } finally {
      setSubmitting(false);
    }
  }

  function create() {
    if (!parsed) return;
    onCreate(parsed);
    setInput("");
    setParsed(null);
  }

  return (
    <section className="rounded-lg border border-border-default bg-bg-default">
      <div className="flex items-center gap-2 px-4 pt-3 text-xs text-text-muted">
        <Wand2 size={15} />
        智能输入
        <span className="ml-auto inline-flex items-center gap-1">
          <Keyboard size={14} />
          Enter
        </span>
      </div>

      <div className="p-4">
        <textarea
          className="min-h-[72px] w-full resize-none rounded-md border border-border-default bg-bg-default px-3 py-2 text-base outline-none focus:border-border-focus"
          onChange={(event) => {
            setInput(event.target.value);
            setParsed(null);
            setWarning(null);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              parsed ? create() : parse();
            }
          }}
          placeholder={placeholder}
          value={input}
        />

        {!input ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {chips.map((chip) => (
              <button
                className="h-7 rounded-md bg-bg-muted px-2.5 text-xs text-text-muted hover:bg-bg-hover"
                key={chip.label}
                onClick={() => setInput(chip.value)}
              >
                {chip.label}
              </button>
            ))}
          </div>
        ) : null}

        {parsed ? (
          <div className="mt-3 rounded-md border border-border-default bg-bg-subtle p-3">
            <div className="mb-2 flex items-center justify-between gap-3">
              <div className="text-sm font-medium">我会这样创建：</div>
              <span className="rounded-sm bg-bg-muted px-2 py-0.5 text-xs text-text-muted">
                {parseSource === "deepseek" ? "DeepSeek" : "本地兜底"}
              </span>
            </div>
            <dl className="grid gap-2 text-sm md:grid-cols-2">
              <PreviewItem label="标题" value={parsed.title} />
              <PreviewItem label="项目" value={parsed.project || "未归属"} />
              <PreviewItem label="时间" value={`${parsed.scheduledDate} ${parsed.scheduledTime}`} />
              <PreviewItem label="时长" value={`${parsed.estimatedMinutes} 分钟`} />
            </dl>
            {showReasoning ? <p className="mt-2 text-xs text-text-muted">{parsed.reasoning}</p> : null}
            {warning ? <p className="mt-2 text-xs text-[var(--warning-fg)]">{warning}</p> : null}
            <div className="mt-3 flex justify-end gap-2">
              <button
                className="h-8 rounded-md border border-border-default px-3 text-sm hover:bg-bg-hover"
                onClick={() => setParsed(null)}
              >
                重新理解
              </button>
              <button
                className="h-8 rounded-md bg-accent px-3 text-sm font-medium text-text-inverse hover:bg-accent-hover"
                onClick={create}
              >
                确认创建
              </button>
            </div>
          </div>
        ) : null}

        {!parsed && warning ? (
          <div className="mt-3 rounded-md border border-border-default bg-[var(--warning-bg)] px-3 py-2 text-sm text-[var(--warning-fg)]">
            {warning}
          </div>
        ) : null}

        <div className="mt-3 flex justify-end">
          <button
            className="flex h-8 items-center gap-2 rounded-md bg-accent px-3 text-sm font-medium text-text-inverse hover:bg-accent-hover disabled:opacity-50"
            disabled={!input.trim() || submitting}
            onClick={parse}
          >
            {submitting ? <Loader2 className="animate-spin" size={15} /> : <Wand2 size={15} />}
            理解输入
          </button>
        </div>
      </div>
    </section>
  );
}

function PreviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-text-muted">{label}</dt>
      <dd className="truncate text-sm text-text-default">{value}</dd>
    </div>
  );
}
