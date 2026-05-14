"use client";

import { useMemo, useState } from "react";
import { Check, ChevronRight } from "lucide-react";
import { useLocalWorkspace } from "@/lib/local/tasks";
import type { Priority } from "@/types/domain";

type PlanningStep = "goal" | "context" | "constraints" | "review";

interface DraftTask {
  title: string;
  project?: string;
  estimatedMinutes: number;
  priority: Priority;
  scheduledDate: string;
  scheduledTime: string;
}

const steps: Array<{ key: PlanningStep; label: string }> = [
  { key: "goal", label: "目标" },
  { key: "context", label: "现状" },
  { key: "constraints", label: "节奏" },
  { key: "review", label: "确认" }
];

export default function PlanPage() {
  const { addTask, canWrite, readOnlyReason, storageMode, syncError } = useLocalWorkspace();
  const [step, setStep] = useState<PlanningStep>("goal");
  const [goal, setGoal] = useState("一个月更新 4 条视频，带动账号涨粉");
  const [currentState, setCurrentState] = useState("");
  const [deadline, setDeadline] = useState(addDays(new Date().toISOString().slice(0, 10), 30));
  const [weeklyCapacity, setWeeklyCapacity] = useState(6);
  const [cadence, setCadence] = useState<"video" | "course" | "sales" | "custom">("video");
  const [message, setMessage] = useState<string | null>(null);
  const draft = useMemo(
    () =>
      buildPlanDraft({
        goal,
        currentState,
        deadline,
        weeklyCapacity,
        cadence
      }),
    [cadence, currentState, deadline, goal, weeklyCapacity]
  );
  const currentStepIndex = steps.findIndex((item) => item.key === step);

  return (
    <div>
      <header className="mb-6 border-b border-border-default pb-5">
        <p className="mb-1 text-sm text-text-muted">Plan Mode</p>
        <h1 className="text-[28px] font-semibold leading-tight">把目标拆成可以执行的计划</h1>
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

      {!canWrite && readOnlyReason ? (
        <div className="mb-5 rounded-lg border border-border-default bg-[var(--warning-bg)] px-4 py-3 text-sm text-[var(--warning-fg)]">
          {readOnlyReason}
        </div>
      ) : null}

      <section className="mb-5 grid gap-2 md:grid-cols-4">
        {steps.map((item, index) => (
          <button
            className={[
              "flex h-10 items-center justify-between rounded-md border px-3 text-sm",
              item.key === step ? "border-border-strong bg-bg-active" : "border-border-default text-text-muted"
            ].join(" ")}
            key={item.key}
            onClick={() => setStep(item.key)}
          >
            <span>{item.label}</span>
            {index < currentStepIndex ? <Check size={15} /> : null}
          </button>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_420px]">
        <div className="rounded-lg border border-border-default p-4">
          {step === "goal" ? (
            <div>
              <h2 className="text-sm font-medium">你想达成什么？</h2>
              <p className="mt-1 text-xs text-text-muted">先用自然语言写，不需要一开始就很清楚。</p>
              <textarea
                className="mt-3 min-h-[150px] w-full resize-none rounded-md border border-border-default bg-bg-default px-3 py-2 text-sm outline-none focus:border-border-focus"
                onChange={(event) => setGoal(event.target.value)}
                value={goal}
              />
              <div className="mt-4 flex justify-end">
                <NextButton onClick={() => setStep("context")} />
              </div>
            </div>
          ) : null}

          {step === "context" ? (
            <div>
              <h2 className="text-sm font-medium">现在卡在哪里？</h2>
              <p className="mt-1 text-xs text-text-muted">写下现状、资源、阻力、已经做过什么。</p>
              <textarea
                className="mt-3 min-h-[150px] w-full resize-none rounded-md border border-border-default bg-bg-default px-3 py-2 text-sm outline-none focus:border-border-focus"
                onChange={(event) => setCurrentState(event.target.value)}
                placeholder="例如：目前每周只能抽 6 小时，脚本经常拖延，剪辑外包还没稳定。"
                value={currentState}
              />
              <div className="mt-4 flex justify-between">
                <BackButton onClick={() => setStep("goal")} />
                <NextButton onClick={() => setStep("constraints")} />
              </div>
            </div>
          ) : null}

          {step === "constraints" ? (
            <div>
              <h2 className="text-sm font-medium">计划节奏</h2>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <Field label="目标日期">
                  <input
                    className="h-9 w-full rounded-md border border-border-default bg-bg-default px-2 text-sm"
                    onChange={(event) => setDeadline(event.target.value)}
                    type="date"
                    value={deadline}
                  />
                </Field>
                <Field label="每周可投入小时">
                  <input
                    className="h-9 w-full rounded-md border border-border-default bg-bg-default px-2 text-sm"
                    min={1}
                    onChange={(event) => setWeeklyCapacity(Number(event.target.value))}
                    type="number"
                    value={weeklyCapacity}
                  />
                </Field>
                <Field label="目标类型">
                  <select
                    className="h-9 w-full rounded-md border border-border-default bg-bg-default px-2 text-sm"
                    onChange={(event) => setCadence(event.target.value as typeof cadence)}
                    value={cadence}
                  >
                    <option value="video">视频/内容增长</option>
                    <option value="course">课程/产品交付</option>
                    <option value="sales">销售/收入目标</option>
                    <option value="custom">通用目标</option>
                  </select>
                </Field>
              </div>
              <div className="mt-4 flex justify-between">
                <BackButton onClick={() => setStep("context")} />
                <NextButton onClick={() => setStep("review")} />
              </div>
            </div>
          ) : null}

          {step === "review" ? (
            <div>
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-medium">确认任务草案</h2>
                  <p className="mt-1 text-xs text-text-muted">这些任务会写入项目，并出现在排期页。</p>
                </div>
                {message ? <span className="text-xs text-text-muted">{message}</span> : null}
              </div>
              <div className="space-y-2">
                {draft.tasks.map((task) => (
                  <article className="rounded-md border border-border-default px-3 py-2" key={`${task.title}-${task.scheduledDate}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-medium">{task.title}</h3>
                        <p className="mt-0.5 text-xs text-text-muted">
                          {task.scheduledDate} {task.scheduledTime} · {task.estimatedMinutes} 分钟
                        </p>
                      </div>
                      <span className="rounded-sm bg-bg-muted px-2 py-0.5 text-xs text-text-muted">
                        {task.priority}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
              <div className="mt-4 flex justify-between">
                <BackButton onClick={() => setStep("constraints")} />
                <button
                  className="h-9 rounded-md bg-accent px-4 text-sm font-medium text-text-inverse disabled:opacity-50"
                  disabled={!canWrite}
                  onClick={async () => {
                    for (const task of draft.tasks) {
                      await addTask(task);
                    }
                    setMessage(`已创建 ${draft.tasks.length} 个任务`);
                  }}
                >
                  确认创建
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <aside className="rounded-lg border border-border-default bg-bg-subtle p-4">
          <h2 className="text-sm font-medium">计划预览</h2>
          <p className="mt-2 text-sm text-text-muted">{draft.summary}</p>
          <div className="mt-4 space-y-3">
            {draft.phases.map((phase) => (
              <div className="rounded-md border border-border-default bg-bg-default p-3" key={phase.title}>
                <h3 className="text-sm font-medium">{phase.title}</h3>
                <p className="mt-1 text-xs text-text-muted">{phase.detail}</p>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
}

function NextButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="inline-flex h-9 items-center gap-2 rounded-md bg-accent px-4 text-sm font-medium text-text-inverse"
      onClick={onClick}
    >
      继续
      <ChevronRight size={15} />
    </button>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button className="h-9 rounded-md border border-border-default px-4 text-sm hover:bg-bg-hover" onClick={onClick}>
      返回
    </button>
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

function buildPlanDraft(input: {
  goal: string;
  currentState: string;
  deadline: string;
  weeklyCapacity: number;
  cadence: "video" | "course" | "sales" | "custom";
}) {
  const project = deriveProjectName(input.goal, input.cadence);
  const startDate = new Date().toISOString().slice(0, 10);
  const weeklyCapacity = Math.max(1, input.weeklyCapacity || 1);
  const tasks = buildTasksForCadence(project, startDate, input.cadence, weeklyCapacity);

  return {
    summary: `目标「${input.goal || "未命名目标"}」会被拆成 ${tasks.length} 个任务，先覆盖未来 4 周。`,
    phases: [
      {
        title: "第一步：把目标变成项目",
        detail: `项目名：${project}。先建立一个可持续推进的任务容器。`
      },
      {
        title: "第二步：按周建立节奏",
        detail: `每周预留约 ${weeklyCapacity} 小时，避免一次性排满。`
      },
      {
        title: "第三步：进入排期执行",
        detail: `确认后任务会出现在今日、项目和排期页。`
      }
    ],
    tasks
  };
}

function buildTasksForCadence(project: string, startDate: string, cadence: "video" | "course" | "sales" | "custom", weeklyCapacity: number): DraftTask[] {
  if (cadence === "video") {
    return Array.from({ length: 4 }, (_, index) => {
      const base = addDays(startDate, index * 7);
      const label = `第 ${index + 1} 条视频`;
      return [
        task(`${label}：选题与脚本`, project, 120, "key", base, "09:00"),
        task(`${label}：拍摄`, project, 120, "high", addDays(base, 2), "14:00"),
        task(`${label}：剪辑`, project, 180, "high", addDays(base, 4), "09:00"),
        task(`${label}：发布与数据复盘`, project, 45, "normal", addDays(base, 6), "20:00")
      ];
    }).flat();
  }

  if (cadence === "course") {
    return [
      task("确定课程承诺与大纲", project, 120, "key", startDate, "09:00"),
      task("完成第一版课件", project, Math.min(240, weeklyCapacity * 30), "high", addDays(startDate, 3), "09:00"),
      task("招募 5 位内测用户", project, 90, "high", addDays(startDate, 7), "10:00"),
      task("根据内测反馈修订交付", project, 120, "key", addDays(startDate, 14), "09:00")
    ];
  }

  if (cadence === "sales") {
    return [
      task("列出 20 个潜在客户", project, 90, "key", startDate, "09:00"),
      task("写出一版销售私信", project, 60, "high", addDays(startDate, 1), "10:00"),
      task("完成第一轮 10 个触达", project, 120, "high", addDays(startDate, 3), "14:00"),
      task("复盘转化并调整报价", project, 90, "key", addDays(startDate, 7), "09:00")
    ];
  }

  return [
    task("定义成功标准", project, 60, "key", startDate, "09:00"),
    task("拆出第一周任务清单", project, 90, "high", addDays(startDate, 1), "09:00"),
    task("完成第一轮执行", project, 120, "high", addDays(startDate, 3), "14:00"),
    task("复盘并调整下一步", project, 60, "normal", addDays(startDate, 7), "09:00")
  ];
}

function task(title: string, project: string, estimatedMinutes: number, priority: Priority, scheduledDate: string, scheduledTime: string): DraftTask {
  return { title, project, estimatedMinutes, priority, scheduledDate, scheduledTime };
}

function deriveProjectName(goal: string, cadence: string) {
  const trimmed = goal.trim();
  if (trimmed.length > 0) return trimmed.slice(0, 18);
  return cadence === "video" ? "内容增长计划" : "目标推进计划";
}

function addDays(dateInput: string, days: number) {
  const date = new Date(`${dateInput}T00:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}
